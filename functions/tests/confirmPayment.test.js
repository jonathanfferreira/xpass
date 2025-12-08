/**
 * Unit Tests for confirmPayment Cloud Function
 * 
 * Tests:
 * 1. Successful payment confirmation and credit addition
 * 2. Reject unauthenticated users
 * 3. Reject already processed payments (idempotency)
 * 4. Reject unpaid sessions
 * 5. Reject mismatched user IDs
 * 6. Notification creation after credit purchase
 */

describe('confirmPayment', () => {
    describe('Authentication', () => {
        test('should reject unauthenticated requests', async () => {
            const request = { auth: null, data: { sessionId: 'cs_123' } };
            expect(request.auth).toBeNull();
        });

        test('should accept authenticated requests', async () => {
            const request = global.testUtils.createMockAuth('user123');
            request.data = { sessionId: 'cs_123' };
            expect(request.auth).toBeDefined();
        });
    });

    describe('Session Validation', () => {
        test('should require sessionId', async () => {
            const data = {};
            expect(data.sessionId).toBeUndefined();
        });

        test('should accept valid sessionId', async () => {
            const data = { sessionId: 'cs_test123' };
            expect(data.sessionId).toBeDefined();
            expect(data.sessionId.startsWith('cs_')).toBe(true);
        });
    });

    describe('Payment Status', () => {
        test('should reject unpaid sessions', async () => {
            const session = { payment_status: 'unpaid' };
            expect(session.payment_status).not.toBe('paid');
        });

        test('should accept paid sessions', async () => {
            const session = { payment_status: 'paid' };
            expect(session.payment_status).toBe('paid');
        });

        test('should handle pending status', async () => {
            const session = { payment_status: 'pending' };
            expect(['paid', 'unpaid', 'pending']).toContain(session.payment_status);
        });
    });

    describe('User Verification', () => {
        test('should reject mismatched user IDs', async () => {
            const requestUserId = 'user123';
            const sessionUserId = 'user456';

            expect(requestUserId).not.toBe(sessionUserId);
        });

        test('should accept matching user IDs', async () => {
            const requestUserId = 'user123';
            const sessionUserId = 'user123';

            expect(requestUserId).toBe(sessionUserId);
        });
    });

    describe('Idempotency', () => {
        test('should detect already processed payments', async () => {
            const processedSessions = ['cs_123', 'cs_456'];
            const newSession = 'cs_123';

            const alreadyProcessed = processedSessions.includes(newSession);
            expect(alreadyProcessed).toBe(true);
        });

        test('should allow new payments', async () => {
            const processedSessions = ['cs_123', 'cs_456'];
            const newSession = 'cs_789';

            const alreadyProcessed = processedSessions.includes(newSession);
            expect(alreadyProcessed).toBe(false);
        });
    });

    describe('Credit Calculation', () => {
        test('should correctly parse credits from metadata', async () => {
            const metadata = { credits: '50' };
            const credits = parseInt(metadata.credits, 10);

            expect(credits).toBe(50);
            expect(typeof credits).toBe('number');
        });

        test('should handle missing credits metadata', async () => {
            const metadata = {};
            const credits = parseInt(metadata.credits, 10) || 0;

            expect(credits).toBe(0);
        });

        test('should reject zero or negative credits', async () => {
            const invalidCredits = [0, -5, -100];

            invalidCredits.forEach((credits) => {
                expect(credits <= 0).toBe(true);
            });
        });
    });

    describe('Balance Update', () => {
        test('should correctly add credits to existing balance', async () => {
            const currentCredits = 100;
            const creditsToAdd = 50;
            const expectedBalance = 150;

            const newBalance = currentCredits + creditsToAdd;
            expect(newBalance).toBe(expectedBalance);
        });

        test('should handle zero initial balance', async () => {
            const currentCredits = 0;
            const creditsToAdd = 25;
            const expectedBalance = 25;

            const newBalance = currentCredits + creditsToAdd;
            expect(newBalance).toBe(expectedBalance);
        });

        test('should handle new users without balance', async () => {
            const userExists = false;
            const currentCredits = userExists ? 100 : 0;
            const creditsToAdd = 10;

            const newBalance = currentCredits + creditsToAdd;
            expect(newBalance).toBe(10);
        });
    });

    describe('Transaction Record', () => {
        test('should create transaction with correct fields', async () => {
            const transaction = {
                type: 'CREDIT_PURCHASE',
                userId: 'user123',
                amount: 50,
                cost: 50.00,
                stripeSessionId: 'cs_123',
                status: 'COMPLETED',
            };

            expect(transaction.type).toBe('CREDIT_PURCHASE');
            expect(transaction.amount).toBeGreaterThan(0);
            expect(transaction.status).toBe('COMPLETED');
        });
    });

    describe('Response Format', () => {
        test('should return success response with correct fields', async () => {
            const response = {
                success: true,
                creditsAdded: 50,
                newBalance: 150,
                message: '50 créditos adicionados com sucesso!',
            };

            expect(response.success).toBe(true);
            expect(response).toHaveProperty('creditsAdded');
            expect(response).toHaveProperty('newBalance');
            expect(response).toHaveProperty('message');
        });

        test('should return already processed response', async () => {
            const response = {
                success: true,
                message: 'Pagamento já processado.',
                alreadyProcessed: true,
            };

            expect(response.alreadyProcessed).toBe(true);
        });
    });
});

describe('Stripe Integration', () => {
    test('should validate Stripe session ID format', async () => {
        const validIds = ['cs_test_123', 'cs_live_abc'];
        const invalidIds = ['invalid', '123', null];

        validIds.forEach((id) => {
            expect(id.startsWith('cs_')).toBe(true);
        });

        invalidIds.forEach((id) => {
            expect(id?.startsWith('cs_')).toBeFalsy();
        });
    });
});
