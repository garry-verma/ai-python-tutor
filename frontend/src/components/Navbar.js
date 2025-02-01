import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Track menu state

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth");
    setMenuOpen(false); // Close menu after logout
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev); // Toggle state
    // console.log(menuOpen)
  };

  const closeMenu = () => {
    setMenuOpen(false); // Close menu when clicking a link
  };
  // console.log(menuOpen)
  return (
    <nav className="navbar">
      <h2>Python Tutor</h2>

      {/* Hamburger Menu */}
      <button className="hamburger" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Menu List */}
      <ul className={`nav-list ${menuOpen ? "show" : "hidden"}`}>
        <li><Link to="/" className="nav-link" onClick={closeMenu}>🏠 Home</Link></li>
        <li><Link to="/lessons" className="nav-link" onClick={closeMenu}>📚 Lessons</Link></li>
        <li><Link to="/homework" className="nav-link" onClick={closeMenu}>📝 Challenges</Link></li>
        <li><Link to="/tutor" className="nav-link" onClick={closeMenu}>🤖 AI Tutor</Link></li>

        {!isAuthenticated ? (
          <li><Link to="/auth" className="nav-link" onClick={closeMenu}>🔑 Login/Register</Link></li>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
