// ============================================================================
// 🔥 SUBSCRIPTION SYSTEM (XPASS PRO) - V2.0
// ============================================================================

const { onCall } = require('firebase-functions/v2/https');
const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const db = admin.firestore();

// Stripe initialization (key from environment)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Helper function to create notifications (reusing from index.js)
async function createNotification(userId, type, title, message) {
    try {
        await db.collection('notifications').add({
            userId,
            type,
            title,
            message,
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}


/**
 * Create Stripe Subscription Checkout Session
 * Creates a Stripe subscription checkout for XPASS PRO
 */
exports.createSubscriptionCheckout = onCall({ cors: true }, async (request) => {
    console.log("🔍 [createSubscriptionCheckout] Iniciando...");

    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
    }

    const { priceId, successUrl, cancelUrl } = request.data;
    const userId = request.auth.uid;
    const userEmail = request.auth.token.email;

    console.log(`✅ Usuário: ${userId} (${userEmail})`);
    console.log(`💎 Price ID: ${priceId}`);

    if (!priceId) {
        throw new HttpsError('invalid-argument', 'Price ID é obrigatório.');
    }

    try {
        // 1. Get or Create Stripe Customer
        const userDoc = await db.collection('customers').doc(userId).get();
        let customerId;

        if (userDoc.exists && userDoc.data().stripeId) {
            customerId = userDoc.data().stripeId;
            console.log(`ℹ️ Cliente Stripe existente: ${customerId}`);
        } else {
            console.log("🆕 Criando novo cliente no Stripe...");
            const customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    firebaseUID: userId
                }
            });
            customerId = customer.id;

            await db.collection('customers').doc(userId).set({
                stripeId: customerId,
                email: userEmail
            }, { merge: true });
            console.log(`✅ Novo cliente criado: ${customerId}`);
        }

        // 2. Create Subscription Checkout Session
        console.log("🛒 Criando sessão de assinatura...");
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
                price: priceId, // Price ID from Stripe Product
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}subscription=success`,
            cancel_url: `${cancelUrl}${cancelUrl.includes('?') ? '&' : '?'}subscription=canceled`,
            subscription_data: {
                metadata: {
                    firebaseUID: userId
                }
            },
            metadata: {
                firebaseUID: userId
            }
        });

        console.log(`✅ Sessão de assinatura criada: ${session.id}`);
        return {
            sessionId: session.id,
            url: session.url
        };

    } catch (error) {
        console.error('❌ Erro ao criar checkout de assinatura:', error);
        throw new HttpsError('internal', 'Erro ao criar sessão de assinatura: ' + error.message);
    }
});

/**
 * Sync Stripe Subscription (Webhook Handler)
 * Listens to Stripe subscription events from firestore-stripe-payments extension
 */
exports.syncSubscription = onDocumentWritten("customers/{uid}/subscriptions/{subscriptionId}", async (event) => {
    const snapshot = event.data?.after;
    if (!snapshot || !snapshot.exists) return; // Document deleted

    const subscription = snapshot.data();
    const userId = event.params.uid;
    const subscriptionId = event.params.subscriptionId;

    console.log(`🔔 Subscription Update: ${subscriptionId} for user ${userId}`);
    console.log(`📊 Status: ${subscription?.status}`);

    const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
    const cancelled = subscription?.status === 'canceled' || subscription?.cancel_at_period_end;

    try {
        const userRef = db.collection('users').doc(userId);
        const updateData = {
            isPro: isActive,
            subscriptionStatus: subscription?.status || 'none',
            subscriptionId: subscriptionId
        };

        // Set expiration date if active
        if (isActive && subscription?.current_period_end) {
            updateData.proExpiresAt = admin.firestore.Timestamp.fromMillis(subscription.current_period_end.seconds * 1000);
        }

        // Clear expiration if cancelled
        if (cancelled) {
            updateData.proExpiresAt = null;
            updateData.isPro = false;

            // Notify user about cancellation
            await createNotification(
                userId,
                'subscription',
                'Assinatura PRO Cancelada',
                'Sua assinatura PRO foi cancelada. Você perderá acesso às features exclusivas.'
            );
        }

        await userRef.set(updateData, { merge: true });

        // Notify user about subscription activation
        if (isActive) {
            await createNotification(
                userId,
                'subscription',
                'Bem-vindo ao XPASS PRO! 🚀',
                'Sua assinatura PRO está ativa. Aproveite todas as funcionalidades exclusivas!'
            );
        }

        console.log(`✅ User ${userId} isPro status updated: ${isActive}`);

    } catch (error) {
        console.error(`❌ Error updating pro status for ${userId}:`, error);
    }
});

/**
 * Create Customer Portal Session
 * Allows users to manage their subscription (cancel, update card, etc)
 */
exports.createCustomerPortalSession = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
    }

    const { returnUrl } = request.data;
    const userId = request.auth.uid;

    if (!returnUrl) {
        throw new HttpsError('invalid-argument', 'Return URL é obrigatório.');
    }

    try {
        // Get Stripe Customer ID
        const userDoc = await db.collection('customers').doc(userId).get();

        if (!userDoc.exists || !userDoc.data().stripeId) {
            throw new HttpsError('not-found', 'Nenhuma assinatura ativa encontrada.');
        }

        const customerId = userDoc.data().stripeId;

        // Create Portal Session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        console.log(`✅ Portal session created for ${userId}`);
        return {
            url: session.url
        };

    } catch (error) {
        console.error('❌ Erro ao criar portal session:', error);
        throw new HttpsError('internal', 'Erro ao acessar portal: ' + error.message);
    }
});

/**
 * Check Pro Status
 * Returns current PRO status for a user
 */
exports.checkProStatus = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Usuário deve estar logado.');
    }

    const userId = request.auth.uid;

    try {
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return {
                isPro: false,
                status: 'none'
            };
        }

        const userData = userDoc.data();

        return {
            isPro: userData.isPro || false,
            status: userData.subscriptionStatus || 'none',
            expiresAt: userData.proExpiresAt || null
        };

    } catch (error) {
        console.error('❌ Erro ao verificar status PRO:', error);
        throw new HttpsError('internal', 'Erro ao verificar status.');
    }
});
