import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 Not Found</h1>
      <p style={styles.message}>The page you are looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go back to Home</Link>
    </div>
  );
}

// Inline styles for better styling
const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
  },
  title: {
    fontSize: "48px",
    color: "#e74c3c"
  },
  message: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#7f8c8d"
  },
  link: {
    fontSize: "16px",
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default NotFound;
