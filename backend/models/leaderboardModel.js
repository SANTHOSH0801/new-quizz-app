const pool = require("../dbConnection");

const getLeaderboard = async () => {
    try {
        console.log("🚀 Running getLeaderboard...");

        // ✅ Step 1: Check database connection
        await pool.execute("SELECT 1");

        // ✅ Step 2: Ensure leaderboard is updated correctly
        const updateQuery = `
            INSERT INTO leaderboard (participant_id, total_score, quizzes_attempted)
            SELECT participant_id, 
                SUM(score) AS total_score, 
                COUNT(DISTINCT quiz_title) AS quizzes_attempted
            FROM scores 
            GROUP BY participant_id
            ON DUPLICATE KEY UPDATE 
                total_score = VALUES(total_score), 
                quizzes_attempted = VALUES(quizzes_attempted);
        `;
        console.log("updated the leaderboard");

        await pool.execute(updateQuery);
        console.log("✅ Leaderboard updated successfully.");

        // ✅ Step 3: Fetch updated leaderboard (ensure total_score is sorted correctly)
        const query = `
            SELECT participant_id, 
                CAST(total_score AS UNSIGNED) AS total_score,
                CAST(quizzes_attempted AS UNSIGNED) AS quizzes_attempted
            FROM leaderboard
            ORDER BY total_score DESC;
        `;

        const [rows] = await pool.execute(query);
        console.log("✅ Query Result:", JSON.stringify(rows, null, 2));

        return rows.length > 0 ? rows : [];
    } catch (err) {
        console.error("❌ Error fetching leaderboard:", err);
        throw new Error("Database error while fetching leaderboard.");
    }
};

module.exports = { getLeaderboard };
