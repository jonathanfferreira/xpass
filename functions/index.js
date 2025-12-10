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
const STRIPE_SECRET = "sk_test_51SaeXiLVT62G24LDPxpeSYNLSfMahSHl2QhLA41OzMY9yDOkkSmaUVQpIDS4s2Z30Y3NS8t8XS2gQpME4PpZClFU00pQdxOM12";
const stripe = require('stripe')(STRIPE_SECRET);

const JWT_SECRET = "XPASS_SUPER_SECRET_KEY_2025";

// ============================================================================
// HELPER: Criar Notificação
// ============================================================================

async function createNotification(userId, type, title, message) {
    try {
        await db.collection('users').doc(userId).collection('notifications').add({
            type: type,
            title: title,
            message: message,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Notification created for ${userId}: ${title}`);
    } catch (error) {
        console.error("Error creating notification:", error);
    }
}

// ============================================================================
// 2. BOOKING SYSTEM - STUDIO (SIMPLIFICADO PARA MVP)
// ============================================================================

exports.bookStudio = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Você precisa estar logado para agendar.');
    }

    const { studioId, studioName, studioImage, creditCost = 1, selectedDate, selectedTime } = request.data;
    const userId = request.auth.uid;

    if (!studioId || !studioName) {
        throw new HttpsError('invalid-argument', 'Dados do estúdio são obrigatórios.');
    }

    // Default time/date if not provided (Backward Compatibility)
    const dateToBook = selectedDate || new Date().toISOString().split('T')[0];
    const timeToBook = selectedTime || '08:00';

    try {
        // 1. Buscar usuário
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new HttpsError('not-found', 'Perfil de usuário não encontrado.');
        }

        const userData = userDoc.data();
        const currentCredits = userData.credits || 0;

        // 2. Verificar saldo
        if (currentCredits < creditCost) {
            throw new HttpsError('failed-precondition', 'Saldo insuficiente.');
        }

        // 3. Criar reserva
        const bookingRef = await db.collection('bookings').add({
            studioId: studioId,
            studioName: studioName,
            studioImage: studioImage || null,
            userId: userId,
            userName: userData.name || 'Aluno',
            userEmail: userData.email || null,
            date: dateToBook,
            time: timeToBook,
            status: 'confirmed',
            creditCost: creditCost,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. Debitar créditos
        await userRef.update({
            credits: currentCredits - creditCost
        });

        // 5. Registrar transação
        await db.collection('transactions').add({
            type: 'BOOKING',
            userId: userId,
            studioId: studioId,
            studioName: studioName,
            bookingId: bookingRef.id,
            amount: -creditCost,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED',
            metadata: { date: dateToBook, time: timeToBook }
        });

        // 6. Criar notificação
        await createNotification(
            userId,
            'booking',
            'Reserva Confirmada',
            `Sua reserva em ${studioName} para ${dateToBook} às ${timeToBook} foi confirmada!`
        );

        console.log(`Booking created: ${bookingRef.id} for user ${userId} at ${timeToBook}`);

        return {
            success: true,
            bookingId: bookingRef.id,
            message: 'Reserva realizada com sucesso!'
        };

    } catch (error) {
        console.error("Error booking studio:", error);
        throw new HttpsError('internal', error.message || 'Erro ao fazer reserva.');
    }
});

exports.checkInWithoutBooking = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário.');
    }

    const { studioId, studioName, creditCost = 1 } = request.data;
    const userId = request.auth.uid;

    if (!studioId) {
        throw new HttpsError('invalid-argument', 'Studio ID obrigatório.');
    }

    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) throw new HttpsError('not-found', 'Usuário não encontrado.');

        const userData = userDoc.data();
        const currentCredits = userData.credits || 0;

        if (currentCredits < creditCost) {
            throw new HttpsError('failed-precondition', 'Saldo insuficiente.');
        }

        // Deduct
        await userRef.update({
            credits: currentCredits - creditCost
        });

        // Record Transaction (Type: CHECKIN)
        const txRef = await db.collection('transactions').add({
            type: 'CHECKIN',
            userId: userId,
            studioId: studioId,
            studioName: studioName || 'Studio',
            amount: -creditCost,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED',
            method: 'JUST_GO'
        });

        // Notification
        await createNotification(
            userId,
            'checkin',
            'Check-in Realizado! 💪',
            `Bom treino em ${studioName}!`
        );

        return { success: true, message: 'Check-in realizado!', transactionId: txRef.id };

    } catch (error) {
        console.error("Check-in Error:", error);
        throw new HttpsError('internal', error.message);
    }
});

exports.cancelBooking = onCall({ cors: true }, async (request) => {
    // Import PostgreSQL connection pool
    const pgDB = require('./db');
    const crypto = require('crypto');

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login required.');
    }

    const { bookingId } = request.data;
    const userId = request.auth.uid;

    if (!bookingId) {
        throw new HttpsError('invalid-argument', 'Booking ID required.');
    }

    let client;
    try {
        client = await pgDB.getClient();
        await client.query('BEGIN');

        // 1. Fetch Booking (Locking)
        const bookingRes = await client.query(
            `SELECT "id", "userId", "classId", "status", "cost" 
             FROM "Booking" 
             WHERE "id" = $1 
             FOR UPDATE`,
            [bookingId]
        );

        if (bookingRes.rows.length === 0) {
            throw new HttpsError('not-found', 'Booking not found.');
        }

        const booking = bookingRes.rows[0];

        if (booking.userId !== userId) {
            throw new HttpsError('permission-denied', 'You can only cancel your own bookings.');
        }

        if (booking.status === 'CANCELED') {
            throw new HttpsError('failed-precondition', 'Booking already cancelled.');
        }

        // 2. Update Booking Status
        // Use 'CANCELED' (uppercase) to match typical SQL enum style or whatever schema uses.
        // The original code used 'cancelled' (lowercase). Schema says status: String!
        // I will use 'CANCELED' to be consistent with my bookClass 'CONFIRMED'.
        await client.query(
            `UPDATE "Booking" SET "status" = 'CANCELED' WHERE "id" = $1`,
            [bookingId]
        );

        // 3. Refund Credits
        const refundAmount = booking.cost || 0;
        await client.query(
            `UPDATE "User" SET "credits" = "credits" + $1 WHERE "id" = $2`,
            [refundAmount, userId]
        );

        // 4. Update Class Capacity (Release spot)
        await client.query(
            `UPDATE "Class" SET "bookedCount" = "bookedCount" - 1 WHERE "id" = $1`,
            [booking.classId]
        );

        // 5. Transaction Record
        await client.query(
            `INSERT INTO "Transaction" ("id", "userId", "type", "amount", "relatedBookingId", "timestamp")
             VALUES ($1, $2, 'REFUND', $3, $4, NOW())`,
            [crypto.randomUUID(), userId, refundAmount, bookingId]
        );

        await client.query('COMMIT');

        // 6. Notification
        createNotification(
            userId,
            'cancellation',
            'Reserva Cancelada',
            'Sua reserva foi cancelada e os créditos foram estornados.'
        ).catch(console.error);

        return { success: true, message: 'Reserva cancelada com sucesso.' };

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Cancellation Transaction Failed:", error);
        if (error.code && error.code.startsWith('auth')) throw error;
        if (error instanceof HttpsError) throw error;
        throw new HttpsError('internal', 'Erro ao cancelar reserva.');
    } finally {
        if (client) client.release();
    }
});

// ============================================================================
// 2.1 BOOKING SYSTEM (AULAS ESPECÍFICAS) 📅
// ============================================================================

exports.bookClass = onCall({ cors: true }, async (request) => {
    // Import PostgreSQL connection pool
    const pgDB = require('./db');
    const crypto = require('crypto'); // Ensure crypto is available

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Você precisa estar logado para agendar.');
    }

    const { classId } = request.data;
    const userId = request.auth.uid;

    let client;
    try {
        client = await pgDB.getClient();
        await client.query('BEGIN'); // Start Transaction

        // 1. Lock and Fetch Class (Pessimistic Locking to prevent overbooking)
        const classRes = await client.query(
            `SELECT "id", "cost", "capacity", "bookedCount", "startTime" 
             FROM "Class" 
             WHERE "id" = $1 
             FOR UPDATE`,
            [classId]
        );

        if (classRes.rows.length === 0) {
            throw new HttpsError('not-found', 'Aula não encontrada.');
        }

        const classData = classRes.rows[0];
        const cost = classData.cost || 1;
        const capacity = classData.capacity;
        const bookedCount = classData.bookedCount;

        // 2. Fetch User (also lock)
        const userRes = await client.query(
            `SELECT "id", "credits", "email", "name" 
             FROM "User" 
             WHERE "id" = $1 
             FOR UPDATE`,
            [userId]
        );

        if (userRes.rows.length === 0) {
            throw new HttpsError('not-found', 'Usuário não encontrado.');
        }

        const userData = userRes.rows[0];
        const userCredits = userData.credits || 0;

        // 3. Validations
        if (bookedCount >= capacity) {
            throw new HttpsError('resource-exhausted', 'Aula lotada.');
        }

        if (userCredits < cost) {
            throw new HttpsError('failed-precondition', `Saldo insuficiente. Custo: ${cost}, Seus créditos: ${userCredits}`);
        }

        // Duplicate Booking Check
        const bookingCheck = await client.query(
            `SELECT "id" FROM "Booking" WHERE "classId" = $1 AND "userId" = $2`,
            [classId, userId]
        );
        if (bookingCheck.rows.length > 0) {
            throw new HttpsError('already-exists', 'Você já está agendado nesta aula.');
        }

        // 4. Updates
        const bookingId = crypto.randomUUID();

        // A. Insert Booking
        await client.query(
            `INSERT INTO "Booking" ("id", "userId", "classId", "status", "cost", "createdAt")
             VALUES ($1, $2, $3, 'CONFIRMED', $4, NOW())`,
            [bookingId, userId, classId, cost]
        );

        // B. Update Class Capacity
        await client.query(
            `UPDATE "Class" SET "bookedCount" = "bookedCount" + 1 WHERE "id" = $1`,
            [classId]
        );

        // C. Deduct Credits
        await client.query(
            `UPDATE "User" SET "credits" = "credits" - $1 WHERE "id" = $2`,
            [cost, userId]
        );

        // D. Transaction Log
        await client.query(
            `INSERT INTO "Transaction" ("id", "userId", "type", "amount", "relatedBookingId", "timestamp")
             VALUES ($1, $2, 'booking', $3, $4, NOW())`,
            [crypto.randomUUID(), userId, -cost, bookingId]
        );

        await client.query('COMMIT');

        createNotification(
            userId,
            'booking',
            'Reserva Confirmada! 🚀',
            'Sua aula foi agendada com sucesso. Prepare-se para treinar!'
        ).catch(err => console.error("Failed to send notification:", err));

        return {
            success: true,
            message: "Agendamento realizado com sucesso!",
            bookingId: bookingId
        };

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error("Booking Transaction Failed:", error);

        if (error.code && error.code.startsWith('auth')) throw error;
        if (error instanceof HttpsError) throw error;

        throw new HttpsError('internal', 'Erro ao processar agendamento: ' + error.message);
    } finally {
        if (client) client.release();
    }
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
// 2.5 CONFIRMAR PAGAMENTO (Chamado pelo frontend após retorno do Stripe)
// ============================================================================

exports.confirmPayment = onCall({ cors: true }, async (request) => {
    console.log("🔍 [confirmPayment] Verificando pagamento...");

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
    }

    const { sessionId } = request.data;
    const userId = request.auth.uid;

    if (!sessionId) {
        throw new HttpsError('invalid-argument', 'Session ID é obrigatório.');
    }

    console.log(`👤 User: ${userId}, Session: ${sessionId}`);

    try {
        // 1. Verificar sessão no Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log(`📊 Session Status: ${session.payment_status}`);
        console.log(`📦 Session Metadata:`, session.metadata);

        // 2. Verificar se já foi processado
        const existingTx = await db.collection('transactions')
            .where('stripeSessionId', '==', sessionId)
            .get();

        if (!existingTx.empty) {
            console.log("⚠️ Sessão já processada.");
            return { success: true, message: 'Pagamento já processado.', alreadyProcessed: true };
        }

        // 3. Verificar se pagamento foi bem sucedido
        if (session.payment_status !== 'paid') {
            console.log("⏳ Pagamento ainda não confirmado.");
            return { success: false, message: 'Pagamento ainda não confirmado.' };
        }

        // 4. Verificar se o userId confere
        if (session.metadata.firebaseUID !== userId) {
            console.error("❌ User ID não confere!");
            throw new HttpsError('permission-denied', 'Usuário não autorizado.');
        }

        // 5. Calcular créditos
        const creditsToAdd = parseInt(session.metadata.credits, 10) || 0;

        if (creditsToAdd <= 0) {
            throw new HttpsError('invalid-argument', 'Quantidade de créditos inválida.');
        }

        // 6. Atualizar créditos do usuário
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        const currentCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0;
        const newBalance = currentCredits + creditsToAdd;

        await userRef.set({
            credits: newBalance
        }, { merge: true });

        // 7. Criar registro de transação
        await db.collection('transactions').add({
            type: 'CREDIT_PURCHASE',
            userId: userId,
            amount: creditsToAdd,
            cost: session.amount_total / 100,
            stripeSessionId: sessionId,
            stripePaymentIntent: session.payment_intent,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED'
        });

        // 8. Criar notificação
        await createNotification(
            userId,
            'credits',
            'Créditos Adicionados',
            `Você recebeu ${creditsToAdd} créditos na sua carteira!`
        );

        console.log(`SUCCESS: Added ${creditsToAdd} credits to ${userId}. New Balance: ${newBalance}`);

        return {
            success: true,
            creditsAdded: creditsToAdd,
            newBalance: newBalance,
            message: `${creditsToAdd} créditos adicionados com sucesso!`
        };

    } catch (error) {
        console.error("❌ Erro ao confirmar pagamento:", error);
        throw new HttpsError('internal', 'Erro ao confirmar pagamento: ' + error.message);
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

    const { token, latitude, longitude } = request.data;
    const partnerId = request.auth.uid;

    // Validação de geolocalização ativada?
    const GEOFENCE_ENABLED = true;
    const GEOFENCE_RADIUS_METERS = 150; // Raio de 150 metros

    try {
        // 1. Validar e Decodificar Token
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.uid;

        // 2. Buscar Dados do Usuário
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) throw new HttpsError('not-found', 'Usuário não encontrado.');

        const userData = userDoc.data();

        // 3. [GEOFENCING] Validar localização do scanner (parceiro)
        if (GEOFENCE_ENABLED && latitude && longitude) {
            const partnerDoc = await db.collection('partners').doc(partnerId).get();

            if (partnerDoc.exists) {
                const partnerData = partnerDoc.data();

                if (partnerData.location && partnerData.location.latitude && partnerData.location.longitude) {
                    const distance = calculateDistance(
                        latitude,
                        longitude,
                        partnerData.location.latitude,
                        partnerData.location.longitude
                    );

                    console.log(`📍 Geofence check: Device at ${distance.toFixed(0)}m from partner location`);

                    if (distance > GEOFENCE_RADIUS_METERS) {
                        throw new HttpsError(
                            'failed-precondition',
                            `Check-in deve ser feito na academia. Você está a ${distance.toFixed(0)}m do local.`
                        );
                    }
                }
            }
        }

        // 4. Registrar Check-in
        await db.collection('checkins').add({
            userId: userId,
            partnerId: partnerId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            status: 'COMPLETED',
            amount: 25.00, // Valor fixo de repasse por enquanto
            type: 'qr_scan',
            deviceLocation: (latitude && longitude) ? { latitude, longitude } : null
        });

        // 5. Criar notificação para o aluno
        await createNotification(
            userId,
            'checkin',
            'Check-in Realizado',
            'Seu check-in foi confirmado. Bom treino!'
        );

        // 6. Retornar Perfil para o Parceiro
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
        if (error.code) {
            throw error; // Re-throw Firebase errors (like geofence error)
        }
        throw new HttpsError('invalid-argument', 'Código Inválido.');
    }
});

/**
 * Calcula a distância entre duas coordenadas usando a fórmula Haversine
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em metros
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distância em metros
}

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

// [REMOVED DUPLICATE askAICoach - See implementation below]

exports.analyzeFood = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário.');
    }

    const { imageBase64 } = request.data;
    if (!imageBase64) {
        throw new HttpsError('invalid-argument', 'Imagem não fornecida.');
    }

    try {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
            // Mock fallback if no key
            console.warn("⚠️ GEMINI_API_KEY missing. Using mock vision.");
            return {
                name: 'Mock Salmon Bowl',
                calories: 450,
                macros: { p: 30, c: 50, f: 15 },
                isMock: true
            };
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        // Use flash for speed/vision
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Analyze this food image. Identify the main dish.
            Estimate the calories and macros (Protein, Carbs, Fats) for the visible portion.
            Return STRICT JSON format ONLY, no markdown, no code blocks.
            Format:
            {
                "name": "Short Dish Name",
                "calories": 123,
                "macros": { "p": 10, "c": 20, "f": 5 }
            }
        `;

        // Clean base64 header if present (data:image/jpeg;base64,)
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if AI adds them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return {
            ...data,
            isMock: false
        };

    } catch (error) {
        console.error("Error in analyzeFood:", error);
        throw new HttpsError('internal', 'Falha na análise visual.');
    }
});

// ============================================================================
// 7. SOCIAL FEED TRIGGER (Gymrats) 👯‍♂️
// ============================================================================

exports.onBookingCreated = onDocumentCreated("bookings/{bookingId}", async (event) => {
    const booking = event.data.data();
    if (!booking) return;

    try {
        const feedRef = db.collection('feed_events').doc();
        await feedRef.set({
            type: 'booking_confirmed',
            userId: booking.userId,
            userName: booking.userName,
            userPhoto: booking.userPhoto || null,
            studioName: booking.studioName || 'um estúdio',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            comments: 0
        });
        console.log(`Feed event created for booking ${event.params.bookingId}`);
    } catch (err) {
        console.error("Error creating feed event:", err);
    }
});

// ============================================================================
// 8. PARTNER AI ASSISTANT (Magic Fill) 🪄
// ============================================================================

exports.generateClassContent = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login necessário.');
    }

    const { keywords } = request.data;
    if (!keywords) throw new HttpsError('invalid-argument', 'Palavras-chave necessárias.');

    try {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
            return {
                title: `Aula de ${keywords} (Mock)`,
                description: "Descrição gerada automaticamente (zueira, falta a API Key).",
                isMock: true
            };
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Act as a fitness marketing expert. Create a catchy Title and a short, engaging Description for a gym class based on these keywords: "${keywords}".
            Target audience: motivated gym-goers.
            Language: Portuguese (Brazil).
            Return STRICT JSON format:
            {
                "title": "Exciting Title",
                "description": "2-3 sentences description."
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return { ...data, isMock: false };

    } catch (error) {
        console.error("Error generating class content:", error);
        throw new HttpsError('internal', 'Falha na geração de conteúdo.');
    }
});

// ============================================================================
// AI COACH (GEMINI INTEGRATION) 🧠
// ============================================================================

exports.askAICoach = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Você precisa estar logado para usar o AI Coach.');
    }

    const { message, context } = request.data;
    const userId = request.auth.uid;

    if (!message || message.trim().length === 0) {
        throw new HttpsError('invalid-argument', 'Message cannot be empty.');
    }

    console.log(`🤖 AI Coach Request from ${userId}: "${message}"`);

    // Import Gemini AI
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    // Verify PRO Status
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    if (!userData.isPro) {
        console.log(`⛔ User ${userId} blocked from AI Coach (Not PRO)`);
        throw new HttpsError('permission-denied', 'Only PRO users can access the AI Coach.');
    }

    // Access your API key as an environment variable
    // Note: In production use functions.config().gemini.key or process.env.GEMINI_API_KEY if set
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDzZnPaob33o1V5A3I1PIqbO5x35WzIkwc";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build contextual prompt
        const systemPrompt = `You are XPASS Coach, a fitness AI assistant specialized in helping users find gyms, create workout plans, and give health advice.
        
User Context:
- Name: ${context.userName || 'User'}
- Credits: ${context.userCredits || 0}
- Last Workout: ${context.lastWorkout || 'Not recorded'}

Keep responses SHORT (max 100 words), motivational, and actionable. Use emojis.`;

        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        console.log(`✅ Gemini Response: ${text.substring(0, 100)}...`);

        return {
            response: text
        };

    } catch (error) {
        console.error('❌ Gemini API Error:', error);
        throw new HttpsError('internal', 'Erro ao processar mensagem com IA: ' + error.message);
    }
});

// ============================================================================
// 🔥 SUBSCRIPTION FUNCTIONS (Imported from subscriptions.js)
// ============================================================================

const subscriptions = require('./subscriptions');

exports.createSubscriptionCheckout = subscriptions.createSubscriptionCheckout;
exports.syncSubscription = subscriptions.syncSubscription;
exports.createCustomerPortalSession = subscriptions.createCustomerPortalSession;
exports.checkProStatus = subscriptions.checkProStatus;

// ============================================================================
// 📅 CLASS MANAGEMENT (POSTGRES)
// ============================================================================

exports.createClass = onCall({ cors: true }, async (request) => {
    const pgDB = require('./db');

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Login required.');
    }

    const { name, date, time, duration, capacity, cost } = request.data;
    const partnerId = request.auth.uid; // Partner creates their own class

    // Combine date and time to timestamp
    // Assuming date is 'YYYY-MM-DD' and time is 'HH:MM'
    const startDateTimeString = `${date}T${time}:00`;

    let client;
    try {
        client = await pgDB.getClient();
        await client.query(
            `INSERT INTO "Class" ("id", "partnerId", "name", "startTime", "capacity", "cost", "bookedCount", "status", "duration")
             VALUES (gen_random_uuid(), $1, $2, $3::timestamp, $4, $5, 0, 'ACTIVE', $6)`,
            [partnerId, name, startDateTimeString, capacity, cost, duration]
        );
        return { success: true, message: 'Class created successfully' };
    } catch (error) {
        console.error("Error creating class:", error);
        throw new HttpsError('internal', 'Error creating class: ' + error.message);
    } finally {
        if (client) client.release();
    }
});

exports.getPartnerClasses = onCall({ cors: true }, async (request) => {
    const pgDB = require('./db');
    if (!request.auth) throw new HttpsError('unauthenticated', 'Login required.');

    const partnerId = request.auth.uid;
    let client;
    try {
        client = await pgDB.getClient();
        // Assuming we want future classes or recent ones
        const res = await client.query(
            `SELECT * FROM "Class" WHERE "partnerId" = $1 ORDER BY "startTime" ASC`,
            [partnerId]
        );
        return { classes: res.rows };
    } catch (error) {
        console.error("Error fetching classes:", error);
        throw new HttpsError('internal', 'Error fetching classes');
    } finally {
        if (client) client.release();
    }
});

exports.getClassesForPartner = onCall({ cors: true }, async (request) => {
    const pgDB = require('./db');
    // Publicly accessible to see classes? Or at least Authenticated users.
    if (!request.auth) throw new HttpsError('unauthenticated', 'Login required.');

    const { partnerId } = request.data;
    if (!partnerId) throw new HttpsError('invalid-argument', 'Partner ID required');

    let client;
    try {
        client = await pgDB.getClient();
        // Fetch future active classes
        const res = await client.query(
            `SELECT * FROM "Class" 
             WHERE "partnerId" = $1 AND "status" = 'ACTIVE' 
             ORDER BY "startTime" ASC`,
            [partnerId]
        );
        return { classes: res.rows };
    } catch (error) {
        console.error("Error fetching classes for partner:", error);
        throw new HttpsError('internal', 'Error fetching classes');
    } finally {
        if (client) client.release();
    }
});
