/**
 * Jest Configuration for XPASS Cloud Functions Tests
 */

module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/*.test.js'],
    collectCoverageFrom: [
        'index.js',
        '!node_modules/**',
    ],
    // Coverage thresholds disabled for now - tests are logic-based, not integration tests
    // coverageThreshold: {
    //   global: {
    //     branches: 50,
    //     functions: 50,
    //     lines: 50,
    //     statements: 50,
    //   },
    // },
    setupFilesAfterEnv: ['./tests/setup.js'],
    testTimeout: 10000,
};
