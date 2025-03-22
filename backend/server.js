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
const leaderboardRouter = require("./routes/leaderboardRouter"); // Update path as needed

const connection = require("./dbConnection");
const { createUsersTable } = require("./dbserver");

// Load environment variables
dotenv.config();
const app = express();
const PORT = 8080;

// 🔹 Debug: Print the frontend URL
console.log("Allowed Frontend URL:", process.env.FRONTEND_URL);


app.use(cors({ 
    origin: "https://new-quiz-942m21vab-santhosh0801s-projects.vercel.app/login", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));

// app.options("*", cors()); // Enable preflight requests

// 🔹 Handle CORS Preflight Requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200); // Respond to preflight request
});

// 🔹 Security & Performance Enhancements
app.use(helmet());         // Security headers
app.use(compression());    // Compress responses
app.use(morgan("dev"));    // Log API requests

// 🔹 Middleware
app.use(bodyParser.json());  // Parse JSON request bodies

// 🔹 API Routes
app.use("/api", adminRoutes);           // Admin routes
app.use("/api", participantRoutes);     // Participant routes
app.use("/api/scores", scoreRoutes);    // Score routes
app.use("/api", leaderboardRouter);     // Leaderboard routes

// 🔹 Database Connection and Server Start
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

// 🔹 404 Error Handling (Handles unknown routes)
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// 🔹 Global Error Handling Middleware (Handles internal errors)
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
