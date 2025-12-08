/**
 * Test Setup for Firebase Functions
 * Mocks Firebase Admin SDK and Firestore
 */

const admin = require('firebase-admin');

// Mock Firebase Admin
jest.mock('firebase-admin', () => {
    const firestoreMock = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn(),
        set: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        add: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        runTransaction: jest.fn(),
    };

    return {
        initializeApp: jest.fn(),
        firestore: jest.fn(() => firestoreMock),
        auth: jest.fn(() => ({
            getUser: jest.fn(),
            createUser: jest.fn(),
        })),
    };
});

// Mock Stripe
jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        customers: {
            create: jest.fn().mockResolvedValue({ id: 'cus_mock123' }),
        },
        checkout: {
            sessions: {
                create: jest.fn().mockResolvedValue({
                    id: 'cs_mock123',
                    url: 'https://checkout.stripe.com/mock',
                }),
                retrieve: jest.fn().mockResolvedValue({
                    id: 'cs_mock123',
                    payment_status: 'paid',
                    amount_total: 5000,
                    metadata: {
                        firebaseUID: 'user123',
                        credits: '50',
                    },
                }),
            },
        },
    }));
});

// Global test utilities
global.testUtils = {
    createMockAuth: (uid, email = 'test@example.com') => ({
        auth: {
            uid,
            token: { email },
        },
    }),

    createMockUser: (credits = 100) => ({
        exists: true,
        data: () => ({
            credits,
            name: 'Test User',
            email: 'test@example.com',
        }),
    }),

    createMockEmptySnapshot: () => ({
        empty: true,
        docs: [],
    }),

    createMockFilledSnapshot: (docs = []) => ({
        empty: false,
        docs: docs.map((d, i) => ({
            id: `doc-${i}`,
            data: () => d,
        })),
    }),
};

// Cleanup after each test
afterEach(() => {
    jest.clearAllMocks();
});
