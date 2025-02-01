import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles.css"; 

const Auth = ({ setIsAuthenticated }) => {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const endpoint = isLogin ? "/login" : "/register";
    const payload = isLogin ? { email, password } : { username, email, password };

    try {
      const response = await fetch(`http://127.0.0.1:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        if (isLogin) {
          localStorage.setItem("token", data.token);  // Store token
          setIsAuthenticated(true); // Update auth state
          navigate("/"); // Redirect to dashboard
        } else {
          setMessage("Registration successful! You can now log in.");
          setIsLogin(true); // Switch to login form
        }
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br></br>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      <p className="auth-toggle">
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)}>Register</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </>
        )}
      </p>
    </div>
  );
};

export default Auth;
