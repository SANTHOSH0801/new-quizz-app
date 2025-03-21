const express = require("express");
const { getLeaderboard } = require("../models/leaderboardModel");

const router = express.Router();

router.get("/leaderboard", async (req, res) => {
    try {
        const data = await getLeaderboard();
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No leaderboard data available." });
        }
        res.json({ data }); // ✅ Ensure response follows the same structure
    } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        res.status(500).json({ error: "Internal server error. Please try again later." });
    }
});

module.exports = router;
