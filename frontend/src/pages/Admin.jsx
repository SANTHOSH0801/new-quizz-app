import { useState } from "react";
import axios from "axios";
import "../styles/Admin.css";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error

        try {
            console.log("Attempting login...");
            const response = await axios.post("https://new-quizz-rbe1zaia6-santhosh0801s-projects.vercel.app/api/admin/login", {
                username,
                password
            });

            console.log("✅ Login Success:", response.data);
            navigate("/scoreboard"); // Redirect on successful login
        } catch (error) {
            if (error.response) {
                console.error("❌ Error Response:", error.response);
                setError(error.response.data.message || "Something went wrong!");
            } else {
                setError("Network error. Please check your connection.");
            }
        }
    };

    return (
        <div className="admin-container">
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login Admin</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    );
};

export default Admin;
