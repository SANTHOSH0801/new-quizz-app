import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Login.css";


function ParticipantForm() {
    const location = useLocation();
    const navigate = useNavigate();


    const initialUsername = location.state?.username || "";
    
    const [username, setUsername] = useState(initialUsername);
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting:", { username, password });
        try {
            const response = await fetch("http://localhost:5000/api/participant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
    
            const data = await response.json();
            console.log("Response Status:", response.status);
            console.log("Response Data:", data);
            console.log("respo",response)
            if (response) {
                console.log("✅ API call successful, navigating to Home...");
                navigate("/home", { state: { username } });
            } else {
                console.log("❌ API call failed:", data.message);
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    

    return (
        <div className="admin-container">
            <form onSubmit={handleSubmit} className="form">
                <h1>Register</h1>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    readOnly={initialUsername !== ""}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ParticipantForm;
