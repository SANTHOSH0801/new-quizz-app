const express = require("express");
const scoreRouter = express.Router();
const connection = require("../dbConnection");

// ✅ Add Score Route
scoreRouter.post("/", async (req, res) => {
    const { participant_id, quiz_title, score, total_questions } = req.body;
    console.log({ participant_id, quiz_title, score, total_questions });

    // 🔹 Ensure all required fields are present
    if (!participant_id || !quiz_title || score === undefined || total_questions === undefined) {
        return res.status(400).json({ error: "Missing participant_id, quiz_title, score, or total_questions" });
    }

    try {
        // 🔹 Insert all values into the database
        const query = "INSERT INTO scores (participant_id, quiz_title, score, total_questions) VALUES (?, ?, ?, ?)";
        await connection.execute(query, [participant_id, quiz_title, score, total_questions]);
        res.status(201).json({ message: "✅ Score added successfully!" });
    } catch (err) {
        console.error("❌ Error adding score:", err);
        res.status(500).json({ error: "Database error while adding score." });
    }
});

module.exports = scoreRouter;
