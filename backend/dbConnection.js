require("dotenv").config();
const mysql = require("mysql2/promise");

// Read database URL from environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    throw new Error("DATABASE_URL is not set in environment variables!");
}

// Manually parsing the DB URL
const url = new URL(dbUrl);

const pool = mysql.createPool({
    host: url.hostname,
    user: url.username,
    password: decodeURIComponent(url.password),  // Fix: Decoding password
    database: url.pathname.replace("/", ""), // Remove leading "/"
    port: url.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL!");
        connection.release(); // Release connection back to the pool
    } catch (err) {
        console.error("❌ MySQL connection error:", err);
    }
})();

module.exports = pool;
