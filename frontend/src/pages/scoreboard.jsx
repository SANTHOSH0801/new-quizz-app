import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Scoreboard.css";

const Scoreboard = () => {
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/leaderboard");

                if (!response.data || !response.data.data) {
                    throw new Error("Invalid response from server.");
                }

                const rawData = response.data.data;

                // ✅ Use a Map to efficiently merge duplicate participant IDs
                const mergedDataMap = new Map();

                rawData.forEach(({ participant_id, total_score, quizzes_attempted }) => {
                    if (mergedDataMap.has(participant_id)) {
                        const existing = mergedDataMap.get(participant_id);
                        existing.total_score += total_score;
                        existing.quizzes_attempted += quizzes_attempted;
                    } else {
                        mergedDataMap.set(participant_id, { participant_id, total_score, quizzes_attempted });
                    }
                });

                // ✅ Convert Map to sorted array (descending order by total_score)
                const mergedData = Array.from(mergedDataMap.values()).sort(
                    (a, b) => b.total_score - a.total_score
                );

                setParticipants(mergedData);
            } catch (error) {
                console.error("❌ Error fetching scores:", error);
                setError("Failed to fetch scores. Try again later.");
            }
        };

        fetchScores();
    }, []);

    return (
        <div className="scoreboard-container">
            <h1>Overall Quiz Scoreboard</h1>
            {error && <p className="error-message">{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Participant ID</th>
                        <th>Total Score</th>
                        <th>Quizzes Attempted</th>
                    </tr>
                </thead>
                <tbody>
                    {participants.map((participant, index) => (
                        <tr key={participant.participant_id}>
                            <td>{index + 1}</td>
                            <td>{participant.participant_id}</td>
                            <td>{participant.total_score}</td>
                            <td>{participant.quizzes_attempted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Scoreboard;
