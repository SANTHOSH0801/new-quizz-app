import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-logo">
                <Link to="/">Quiz App</Link>
            </div>
            <div className="nav-links">
                <Link to="/admin">Admin</Link>
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
