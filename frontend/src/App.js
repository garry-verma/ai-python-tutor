import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard"; // Now acts as Home Page
import Lesson from "./components/Lesson";
import Homework from "./components/Homework";
import Profile from "./components/Profile";
import Tutor from "./components/Tutor";
import Auth from "./components/Auth";
import NotFound from "./components/NotFound";  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkAuth); // Listen for auth changes

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Dashboard />} />  {/* Home Page - Public */}
          <Route path="/lessons" element={isAuthenticated ? <Lesson /> : <Navigate to="/auth" />} />
          <Route path="/homework" element={isAuthenticated ? <Homework /> : <Navigate to="/auth" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
          <Route path="/tutor" element={isAuthenticated ? <Tutor /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={<Auth setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<NotFound />} /> {/* 404 Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
