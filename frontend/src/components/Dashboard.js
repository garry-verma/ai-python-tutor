import React from "react";
import "./styles.css"; // Ensure styles are properly linked

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the AI-Powered Python Tutor! 🐍🤖</h1>
      
      {/* Brief Description */}
      <p>
        This interactive learning platform is designed to help children learn Python in a fun and engaging way.  
        With AI-driven guidance, interactive coding challenges, and a progress-tracking system, kids can master Python  
        step by step while staying motivated with badges and rewards.
      </p>
      <p>
        Our unique AI tutor provides real-time feedback, explanations for incorrect answers, and adaptive learning  
        paths tailored to each student's progress. Parents can track learning milestones, and children can explore  
        lessons at their own pace!
      </p>

      {/* Features Section */}
      <h2>✨ Key Features:</h2>
      <ul>
        <li>📚 **Interactive Python Lessons** – Learn concepts with step-by-step guidance.</li>
        <li>🤖 **AI Tutor Assistance** – Get instant explanations and feedback.</li>
        <li>📝 **Fun Challenges & Quizzes** – Apply your knowledge with coding tasks.</li>
        
      </ul>

      {/* Call to Action */}
      <h2>🚀 Get Started</h2>
      <p>Sign up or log in to begin your Python learning journey today!</p>
    </div>
  );
};

export default Home;
