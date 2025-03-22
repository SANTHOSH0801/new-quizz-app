const pool = require("./dbConnection"); // Import the pool

// Function to create a table
async function createUsersTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL
        );
    `;
    try {
        const connection = await pool.getConnection();
        await connection.query(query);
        connection.release(); // Release the connection
        console.log("✅ Users table created successfully!");
    } catch (error) {
        console.error("❌ Error creating table:", error);
    }
}

// Function to insert a user
async function insertUser(name, email) {
    const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(query, [name, email]);
        connection.release();
        return result;
    } catch (error) {
        console.error("❌ Error inserting user:", error);
    }
}

// Function to fetch all users
async function getAllUsers() {
    const query = `SELECT * FROM users`;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(query);
        connection.release();
        return rows;
    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
}

module.exports = { createUsersTable, insertUser, getAllUsers };
