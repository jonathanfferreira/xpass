const functions = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

const cors = require("cors")({ origin: true });
const jwt = require('jsonwebtoken');

admin.initializeApp();

const db = admin.firestore();

// CONFIGURAÇÃO DO STRIPE
// ⚠️ COPIE este arquivo para index.js e substitua as chaves abaixo
const STRIPE_SECRET = "YOUR_STRIPE_SECRET_KEY_HERE";
const stripe = require('stripe')(STRIPE_SECRET);

const JWT_SECRET = "YOUR_JWT_SECRET_HERE";

// ============================================================================
// 2. BOOKING SYSTEM (AGENDAMENTO DE AULAS) 📅
// ============================================================================

exports.bookClass = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Você precisa estar logado para agendar.');
    }

    const { classId } = request.data;
    const userId = request.auth.uid;

    return db.runTransaction(async (transaction) => {
        // 1. Referências
        const classRef = db.collection('classes').doc(classId);
        const userRef = db.collection('users').doc(userId);
        const bookingRef = db.collection('bookings').doc(`${classId}_${userId}`);

        // 2. Leituras
        const classDoc = await transaction.get(classRef);
        const userDoc = await transaction.get(userRef);
        const bookingDoc = await transaction.get(bookingRef);

        // 3. Validações
        if (!classDoc.exists) throw new HttpsError('not-found', 'Aula não encontrada.');
        if (!userDoc.exists) throw new HttpsError('not-found', 'Perfil de usuário não encontrado.');
        if (bookingDoc.exists) throw new HttpsError('already-exists', 'Você já está agendado nesta aula.');

        const classData = classDoc.data();
        const userData = userDoc.data();
        const cost = classData.cost || 1;
        const capacity = classData.capacity || 10;
        const currentBooked = classData.bookedCount || 0;

        if (currentBooked >= capacity) throw new HttpsError('resource-exhausted', 'Aula lotada.');
        if ((userData.credits || 0) < cost) throw new HttpsError('failed-precondition', `Saldo insuficiente.`);

        // 4. Escritas
        transaction.update(userRef, { credits: (userData.credits || 0) - cost });
        transaction.update(classRef, { bookedCount: currentBooked + 1 });
        transaction.set(bookingRef, {
            classId: classId,
            userId: userId,
            userName: userData.name || 'Aluno',
            userPhoto: userData.photoURL || null,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'CONFIRMED',
            cost: cost
        });

        // Audit log
        transaction.set(db.collection('transactions').doc(), {
            type: 'booking',
            userId: userId,
            classId: classId,
            amount: cost,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, message: "Agendamento realizado com sucesso!" };
    });
});

// ============================================================================
// 1. PAGAMENTOS (STRIPE VIA EXTENSION)
// ============================================================================

// 1. PAGAMENTOS (STRIPE WEBHOOK HANDLER VIA FIRESTORE TRIGGER)
// O Extension "Run Payments with Stripe" escreve em customers/{uid}/payments/{paymentId}
// Nós escutamos essa escrita para liberar os créditos.

exports.syncStripePayment = onDocumentWritten("customers/{uid}/payments/{paymentId}", async (event) => {
    // Handling logs and data retrieval safely
    const snapshot = event.data?.after;
    if (!snapshot) return; // Document deleted

    const payment = snapshot.data();
    const userId = event.params.uid;
    const paymentId = event.params.paymentId;

    console.log(`🔔 Payment Update detected: ${paymentId} for user ${userId}`);
    console.log(`📊 Status: ${payment?.status}`);
    console.log(`📦 Metadata:`, payment?.metadata);

    // Only process if status is 'succeeded'
    if (payment?.status !== 'succeeded') {
        console.log("⏳ Payment not successful yet. Status:", payment?.status);
        return;
    }

    // Idempotency: Check if we already credited this payment ID
    // We check our 'transactions' collection for a record with this stripePaymentId
    const alreadyProcessed = await db.collection('transactions').where('stripePaymentId', '==', paymentId).get();
    if (!alreadyProcessed.empty) {
        console.log("⚠️ Transaction already processed. Skipping credit addition.");
        return;
    }

    try {
        await db.runTransaction(async (transaction) => {
            // 1. Fetch User
            const userRef = db.collection('users').doc(userId);
            const userDoc = await transaction.get(userRef);

            let userData = {};
            let currentCredits = 0;

            if (userDoc.exists) {
                userData = userDoc.data();
                currentCredits = userData.credits || 0;
            } else {
                console.log("ℹ️ User document missing in Firestore. Creating new one.");
            }

            // 2. Determine Credit Amount
            let creditsToAdd = 0;
            if (payment.metadata && payment.metadata.credits) {
                creditsToAdd = parseInt(payment.metadata.credits, 10);
            } else {
                // Fallback logic
                const amount = payment.amount || payment.amount_received || 0;
                creditsToAdd = Math.floor(amount / 100);
            }

            if (creditsToAdd <= 0) {
                console.warn("⚠️ Invalid credit amount:", creditsToAdd);
                return;
            }

            // 3. Update Credits
            const newBalance = currentCredits + creditsToAdd;

            // Use set with merge to handle both existing and new documents safely
            transaction.set(userRef, {
                credits: newBalance,
                email: userData.email || payment.customer_email || null
            }, { merge: true });

            // 4. Create Transaction Record (Idempotency Key)
            const txRef = db.collection('transactions').doc();
            transaction.set(txRef, {
                type: 'CREDIT_PURCHASE',
                userId: userId,
                amount: creditsToAdd,
                cost: (payment.amount / 100),
                stripePaymentId: paymentId,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                status: 'COMPLETED',
                metadata_dump: payment.metadata || {}
            });

            console.log(`✅ SUCCESS: Added ${creditsToAdd} credits to ${userId}. New Balance: ${newBalance}`);
        });
    } catch (error) {
        console.error("❌ Error processing credit addition:", error);
    }
});

exports.createStripeCheckout = onCall({ cors: true }, async (request) => {
    // Logs de Debug
    console.log("🔍 [createStripeCheckout] Iniciando...");
    console.log("👤 Auth Data:", request.auth);

    if (!request.auth) {
        console.error("❌ Usuário não autenticado.");
        throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
    }

    const { amount, currency = 'brl', successUrl, cancelUrl } = request.data;
    const userId = request.auth.uid;
    const userEmail = request.auth.token.email;

    console.log(`✅ Usuário autenticado: ${userId} (${userEmail})`);
    console.log(`💰 Valor: ${amount} ${currency}`);

    if (!amount || amount <= 0) {
        throw new HttpsError('invalid-argument', 'Valor inválido.');
    }

    try {
        // Criar ou buscar cliente no Stripe
        const userDoc = await db.collection('customers').doc(userId).get();
        let customerId;

        if (userDoc.exists && userDoc.data().stripeId) {
            customerId = userDoc.data().stripeId;
            console.log(`ℹ️ Cliente Stripe existente: ${customerId}`);
        } else {
            // Criar novo cliente no Stripe
            console.log("🆕 Criando novo cliente no Stripe...");
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    firebaseUID: userId
                }
            });
            customerId = customer.id;

            // Salvar no Firestore
            await db.collection('customers').doc(userId).set({
                stripeId: customerId,
                email: userEmail
            }, { merge: true });
            console.log(`✅ Novo cliente criado: ${customerId}`);
        }

        // Criar sessão de checkout
        console.log("🛒 Criando sessão de checkout...");
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Créditos XPASS',
                        description: `${amount} créditos para usar em aulas`,
                    },
                    unit_amount: amount * 100, // Stripe usa centavos
                },
                quantity: 1,
            }],
            mode: 'payment',

            success_url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${cancelUrl}${cancelUrl.includes('?') ? '&' : '?'}canceled=true`,
            payment_intent_data: {
                metadata: {
                    firebaseUID: userId,
                    credits: amount.toString()
                }
            },
            metadata: {
                firebaseUID: userId,
                credits: amount.toString()
            }
        });

        console.log(`✅ Sessão criada: ${session.id}`);
        return {
            sessionId: session.id,
            url: session.url
        };

    } catch (error) {
        console.error('❌ Erro ao criar checkout:', error);
        throw new HttpsError('internal', 'Erro ao criar sessão de pagamento: ' + error.message);
    }
});

// ============================================================================
// 3. SECURITY & ACCESS CONTROL (ANTI-FRAUD)
// ============================================================================

exports.generateAccessCode = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário.');
    }

    const userId = request.auth.uid;

    const payload = {
        uid: userId,
        type: 'access_qr',
        iss: 'xpass-auth'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2m' });

    return { token };
});

exports.validateAccessCode = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário para validar acesso.');
    }

    const { token } = request.data;
    const partnerId = request.auth.uid;

    try {
        // 1. Validar e Decodificar Token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.uid;

        // 2. Buscar Dados do Usuário
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) throw new HttpsError('not-found', 'Usuário não encontrado.');

        const userData = userDoc.data();

        // 3. Registrar Check-in
        await db.collection('checkins').add({
            userId: userId,
            partnerId: partnerId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED',
            amount: 25.00, // Valor fixo de repasse por enquanto
            type: 'qr_scan'
        });

        // 4. Retornar Perfil para o Parceiro
        return {
            success: true,
            user: {
                name: userData.name || 'Aluno',
                photo: userData.photoURL || null,
                credits: userData.credits || 0,
                plan: 'XPASS PRO' // Simulação
            }
        };

    } catch (error) {
        console.error("Erro na validação:", error);
        if (error.name === 'TokenExpiredError') {
            throw new HttpsError('failed-precondition', 'QRCode Expirado. Gere um novo.');
        }
        throw new HttpsError('invalid-argument', 'Código Inválido.');
    }
});

// ============================================================================
// 4. NOTIFICATIONS (PUSH)
// ============================================================================

exports.sendBookingNotification = onDocumentCreated("bookings/{bookingId}", async (event) => {
    const booking = event.data.data();
    if (!booking) return; // Se deletado
    const userId = booking.userId;

    try {
        // Buscar tokens do usuário
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) return;

        const userData = userDoc.data();
        const tokens = userData.fcmTokens || [];

        if (tokens.length === 0) {
            console.log("Usuário sem tokens FCM registrados.");
            return;
        }

        const message = {
            notification: {
                title: 'Reserva Confirmada! 🚀',
                body: 'Sua aula foi agendada com sucesso. Prepare-se para treinar!'
            },
            tokens: tokens
        };

        const response = await admin.messaging().sendMulticast(message);
        console.log('Notificações enviadas:', response.successCount);

        // Limpar tokens inválidos
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });

            if (failedTokens.length > 0) {
                await db.collection('users').doc(userId).update({
                    fcmTokens: admin.firestore.FieldValue.arrayRemove(...failedTokens)
                });
            }
        }

    } catch (error) {
        console.error("Erro ao enviar push:", error);
    }
});

// ============================================================================
// 5. FUNCIONALIDADES DA LOJA (SHOP) 🛍️
// ============================================================================

exports.buyProduct = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Você precisa estar logado para comprar.');
    }

    const { productId } = request.data;
    const uid = request.auth.uid;

    return db.runTransaction(async (transaction) => {
        // 1. Ler dados do Usuário (Firestore) e do Produto
        const userDocRef = db.collection('users').doc(uid);
        const productRef = db.collection('products').doc(productId);

        const userDoc = await transaction.get(userDocRef);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists) throw new HttpsError('not-found', 'Produto não encontrado.');
        if (!userDoc.exists) throw new HttpsError('not-found', 'Perfil de usuário não encontrado.');

        const product = productDoc.data();
        const userData = userDoc.data();
        const currentCredits = userData.credits || 0;

        // 2. Validações
        if (product.stock <= 0) throw new HttpsError('failed-precondition', 'Produto esgotado.');
        if (currentCredits < product.price) throw new HttpsError('failed-precondition', `Saldo insuficiente. Você precisa de ${product.price} créditos.`);

        // 3. Executar Ações
        const newCredits = currentCredits - product.price;
        const newStock = product.stock - 1;

        transaction.update(userDocRef, { credits: newCredits });
        transaction.update(productRef, { stock: newStock });

        // 4. Registrar Transação (Audit Trail)
        const transactionRef = db.collection('transactions').doc();
        transaction.set(transactionRef, {
            type: 'PURCHASE',
            userId: uid,
            productId: productId,
            productName: product.name,
            amount: product.price,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, newCredits, message: `Compra de ${product.name} realizada com sucesso!` };
    });
});

exports.seedProducts = onCall({ cors: true }, async (request) => {
    const PRODUCTS = [
        {
            id: 'whey-iso',
            name: "Whey Protein Isolate",
            category: "Supplements",
            price: 45,
            image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&q=80&w=500",
            stock: 100,
            description: "High quality isolate protein for maximum recovery."
        },
        {
            id: 'smart-bottle',
            name: "XPASS Smart Bottle",
            category: "Gear",
            price: 25,
            image: "https://images.unsplash.com/photo-1602143407151-11115cd4e69b?auto=format&fit=crop&q=80&w=500",
            stock: 50,
            description: "Keeps your water cold for 24h. Temperature display included."
        },
        {
            id: 'pre-workout',
            name: "Pre-Workout Energy",
            category: "Supplements",
            price: 35,
            image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=500",
            stock: 200,
            description: "Explosive energy for your hardest workouts."
        },
        {
            id: 'lifting-straps',
            name: "Lifting Straps",
            category: "Gear",
            price: 15,
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=500",
            stock: 75,
            description: "Improve your grip and lift heavier."
        }
    ];

    const batch = db.batch();
    for (const product of PRODUCTS) {
        const ref = db.collection('products').doc(product.id);
        batch.set(ref, product);
    }

    await batch.commit();
    return { success: true, message: "Produtos populados com sucesso!" };
});

// ============================================================================
// 6. AI COACH (GEMINI API) 🤖
// ============================================================================

const { GoogleGenerativeAI } = require("@google/generative-ai");

// TO DO: Mover para variável de ambiente real (functions config)
const GEMINI_API_KEY = "AIzaSyDzZnPaob33o1V5A3I1PIqbO5x35WzIkwc";

exports.askAICoach = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário para falar com o Coach.');
    }

    const { message, context = {} } = request.data;
    const userId = request.auth.uid;

    try {
        // 1. Verificar se temos API Key (Simulação vs Real)
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
            // MODO DEMO (Sem Key)
            console.warn("⚠️ GEMINI_API_KEY não configurada. Usando resposta mockada.");

            let mockResponse = "Estou calibrando meus sensores. Configure minha API Key para eu te ajudar de verdade! 🤖";
            const msgLower = message.toLowerCase();

            if (msgLower.includes("treino") || msgLower.includes("sugerir")) {
                mockResponse = "Baseado no seu perfil, sugiro um treino HIIT de 20 minutos hoje. Que tal agendar uma aula de Cross Training?";
            } else if (msgLower.includes("dieta") || msgLower.includes("comer")) {
                mockResponse = "Lembre-se de manter a proteína alta! O Whey Protein da nossa loja está em promoção.";
            } else if (msgLower.includes("oi") || msgLower.includes("olá")) {
                mockResponse = `Olá, Atleta! Sou seu XPASS AI Coach. Como posso ajudar sua performance hoje?`;
            }

            return {
                response: mockResponse,
                isMock: true
            };
        }

        // 2. MODO REAL (Com Gemini)
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const userContextString = `
            Contexto do Usuário:
            - Nome: ${context.userName || 'Atleta'}
            - Créditos: ${context.userCredits || 0}
            - Último Treino: ${context.lastWorkout || 'Nenhum recente'}
            - Objetivo: Melhorar performance e saúde.
            
            Você é o "XPASS AI Coach", um assistente virtual futurista, motivador e especialista em fitness dentro do ecossistema XPASS.
            Seu tom é enérgico, direto e levemente "cyberpunk" (use emojis tech como 🤖, 🚀, ⚡).
            Responda de forma concisa (máximo 3 frases).
        `;

        const fullPrompt = `${userContextString}\n\nUsuário: ${message}\nAI Coach:`;

        const result = await model.generateContent(fullPrompt);
        const aiResponse = result.response.text();

        return {
            response: aiResponse,
            isMock: false
        };

    } catch (error) {
        console.error("Erro no AI Coach:", error);
        throw new HttpsError('internal', 'Falha ao conectar com o cérebro digital.');
    }
});
