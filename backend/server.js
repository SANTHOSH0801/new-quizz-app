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
const leaderboardRouter = require("./routes/leaderboardRouter");

const connection = require("./dbConnection");
const { createUsersTable } = require("./dbserver");

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL;

// 🔹 Debug: Print allowed frontend URL
console.log("✅ Allowed Frontend URL:", FRONTEND_URL);

app.use((req, res, next) => {
    console.log(`🛠️ Incoming request: ${req.method} ${req.url}`);
    console.log(`Headers: `, req.headers);
    next();
});

// 🔹 CORS Configuration

app.use(
  cors({
    origin:FRONTEND_URL,
    credentials: true, // Required for authentication
    methods: "GET, POST, PUT, DELETE, OPTIONS",
  })
);
app.options("*", cors()); // Handle preflight requests



// 🔹 Preflight Requests Handling
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", FRONTEND_URL);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

// 🔹 Security & Performance Middleware
app.use(helmet());         // Security headers
app.use(compression());    // Compress responses
app.use(morgan("dev"));    // Log API requests

// 🔹 Middleware to Parse JSON Request Bodies
app.use(bodyParser.json());

// 🔹 Register API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api", leaderboardRouter);

// 🔹 404 Error Handling (Handles Unknown Routes)
app.use((req, res, next) => {
    console.warn("⚠️ 404 - Route Not Found:", req.originalUrl);
    res.status(404).json({ error: "Route not found" });
});

// 🔹 Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("🔥 Internal Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// 🔹 Database Connection and Server Start
(async () => {
    try {
        const conn = await connection.getConnection(); // ✅ Proper MySQL2/promise usage
        console.log("✅ Connected to MySQL Database");
        conn.release(); // Release connection back to the pool
        await createUsersTable();

        // Start the server only if DB is connected
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Stop server if DB connection fails
    }
})();
