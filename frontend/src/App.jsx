import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Scoreboard from "./pages/scoreboard"; // Import the Scoreboard component
import Landing from "./pages/landing";
import Navbar from "./components/Navbar"; // Ensure correct import

import "./styles/App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/scoreboard" element={<Scoreboard />} /> {/* Added Scoreboard Route */}
      </Routes>
    </Router>
  );
}

export default App;
