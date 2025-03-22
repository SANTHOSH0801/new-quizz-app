import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Quiz.css";
import ProgressBar from "../components/ProgressBar";

const Home = () => {
  const location = useLocation();
  const participantId = location.state?.username || "Guest";

  const quizzes = [
    {
      title: "General Knowledge",
      questions: [
        { type: "single", question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: ["Paris"] },
        { type: "multiple", question: "Which of the following are colors in the French flag?", options: ["Blue", "Green", "Red", "White"], answer: ["Blue", "Red", "White"] },
        { type: "truefalse", question: "France is in Europe.", answer: true },
      ],
    },
    {
      title: "Science",
      questions: [
        { type: "single", question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: ["Mars"] },
        { type: "multiple", question: "Which are gas giants?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: ["Jupiter", "Saturn"] },
        { type: "truefalse", question: "Water boils at 100°C.", answer: true },
      ],
    },
  ];

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (showPopup) {
      sendScoreToBackend(score);
    }
  }, [showPopup]);

  const handleQuizSelection = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setScore(0);
    setFeedback("");
    setShowPopup(false);
  };

  const handleOptionChange = (option) => {
    setSelectedAnswers((prev) =>
      selectedQuiz.questions[currentQuestionIndex].type === "multiple"
        ? prev.includes(option)
          ? prev.filter((ans) => ans !== option)
          : [...prev, option]
        : [option]
    );
  };

  const handleSubmit = () => {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    const isCorrect =
      currentQuestion.type === "truefalse"
        ? selectedAnswers[0] === currentQuestion.answer
        : JSON.stringify(selectedAnswers.sort()) === JSON.stringify(currentQuestion.answer.sort());

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Incorrect!");
    }

    setTimeout(() => {
      setFeedback("");
      setSelectedAnswers([]);
      if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setShowPopup(true);
      }
    }, 1000);
  };

  const sendScoreToBackend = async () => {
    try {
      const response = await fetch("http://new-quizz-app-production.up.railway.app/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participant_id: participantId,
          quiz_title: selectedQuiz.title,
          score,
          total_questions: selectedQuiz.questions.length,
        }),
      });
      if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);
      console.log("✅ Score submitted successfully");
    } catch (error) {
      console.error("❌ Error submitting score:", error);
    }
  };

  return (
    <div className="quiz-container">
      {selectedQuiz ? (
        <>
          <h2>{selectedQuiz.title} Quiz</h2>
          <ProgressBar progress={((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100} />
          <p>{currentQuestionIndex + 1}. {selectedQuiz.questions[currentQuestionIndex].question}</p>
          <div className="options-container">
            {selectedQuiz.questions[currentQuestionIndex].type === "truefalse" ? (
              <>
                <label><input type="radio" name="tf" value="true" checked={selectedAnswers.includes(true)} onChange={() => setSelectedAnswers([true])} /> True</label>
                <label><input type="radio" name="tf" value="false" checked={selectedAnswers.includes(false)} onChange={() => setSelectedAnswers([false])} /> False</label>
              </>
            ) : (
              selectedQuiz.questions[currentQuestionIndex].options.map((option, i) => (
                <label key={i}>
                  <input
                    type={selectedQuiz.questions[currentQuestionIndex].type === "multiple" ? "checkbox" : "radio"}
                    name="option"
                    value={option}
                    checked={selectedAnswers.includes(option)}
                    onChange={() => handleOptionChange(option)}
                  />
                  {option}
                </label>
              ))
            )}
          </div>
          <button onClick={handleSubmit}>{currentQuestionIndex < selectedQuiz.questions.length - 1 ? "Next Question" : "Submit"}</button>
          {feedback && <p>{feedback}</p>}
          {showPopup && (
            <div className="popup">
              <h2>🎉 Quiz Completed!</h2>
              <p>Your final score is {score} / {selectedQuiz.questions.length}</p>
              <button onClick={() => setSelectedQuiz(null)}>Okay</button>
            </div>
          )}
        </>
      ) : (
        <>
          <h2>Select a Quiz</h2>
          <ul>
            {quizzes.map((quiz, index) => (
              <li key={index} onClick={() => handleQuizSelection(quiz)}>{quiz.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Home;
