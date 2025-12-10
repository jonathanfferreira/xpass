const { Pool } = require('pg');

// Ensure we have the connection string from environment variables
// In production (Firebase Functions), this is set via `firebase functions:config:set` or `.env`
const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
    console.warn("⚠️ POSTGRES_URL environment variable is not set. Database connections will fail.");
}

const pool = new Pool({
    connectionString,
    // SSL is usually required for Cloud SQL/Neon/Supabase interactions from outside
    // Adjust based on your specific provider's requirements
    ssl: {
        rejectUnauthorized: false // Often needed for serverless environments
    },
    max: 10, // Limit connection pool size for serverless
    idleTimeoutMillis: 30000
});

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect()
};
