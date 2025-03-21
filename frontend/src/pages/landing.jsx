import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css"; // Import the external CSS file

const LandingPage = () => {
    const navigate = useNavigate(); // ✅ Use the navigate function

    const handleStartQuiz = () => {
        navigate("/login"); // ✅ Navigate to the login page
    };

    return (
        <div className="landing-container">
            <h1>Welcome to the Ultimate Quiz!</h1>
            <p>Test your knowledge and challenge your friends.</p>
            <button className="start-btn" onClick={handleStartQuiz}>
                Start Quiz
            </button>
        </div>
    );
};

export default LandingPage;
