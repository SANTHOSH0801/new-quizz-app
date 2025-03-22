const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");

const adminRoutes = require("./routes/adminRoutes");
const participantRoutes = require("./routes/participantRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const connection = require("./dbConnection");
const { createUsersTable } = require("./dbserver");
const leaderboardRouter = require("./routes/leaderboardRouter"); // Update path as needed

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);
// 🔹 CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,  // Allow frontend to access the API
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// 🔹 Security & Performance Enhancements
app.use(helmet());         // Adds security headers
app.use(compression());    // Compresses responses
app.use(morgan("dev"));    // Logs API requests

// 🔹 Middleware
app.use(bodyParser.json());  // To parse JSON request bodies

// 🔹 Routes for leaderboard
// This will route all leaderboard related requests

// 🔹 Other Routes
app.use("/api", adminRoutes);           // Admin routes
app.use("/api", participantRoutes);     // Participant routes
app.use("/api/scores", scoreRoutes);    // Score routes
app.use("/api", leaderboardRouter);


// Database connection and server startup
(async () => {
    try {
        const conn = await connection.getConnection(); // ✅ Correct way for mysql2/promise
        console.log("✅ Connected to MySQL Database");
        conn.release(); // Release the connection back to the pool
        await createUsersTable();

        // Start the server only if the DB is connected
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Stop the server if DB connection fails
    }
})();


// 🔹 404 Error Handling (This handles unknown routes)
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// 🔹 Global Error Handling Middleware (Handles internal errors)
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
