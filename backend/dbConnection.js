const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
    host: "localhost",
    user: "root", // replace with your SQL username
    password: "Sai.2003$", // replace with your SQL password
    database: "QUIZ-APP", // replace with your database name
    waitForConnections: true,
    connectionLimit: 10, // Limit the number of connections
    queueLimit: 0
});
// Export the connection pool
module.exports = pool;
