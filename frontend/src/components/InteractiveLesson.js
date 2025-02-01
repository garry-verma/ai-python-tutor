import React, { useState } from "react";
import "./styles.css";  

const InteractivePythonLesson = () => {
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");

  const handleCodeExecution = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: userCode }),
      });

      const data = await response.json();
      setOutput(data.output || data.error);
    } catch (error) {
      setOutput("Error: " + error.message);
    }
  };

  return (
    <div className="lesson-container">
      <p>Try the following interactive challenges and run your code below:</p>

      <div className="challenge-section">
        <h3>Challenge: Create a variable `age` and print it</h3>
        <p>Tip: You can write any python code.</p>
        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Write your Python code here"
          className="code-input"
        />
        <button onClick={handleCodeExecution} className="run-button">
          Run Code
        </button>
      </div>

      <div className="output-section">
        <h4>Output:</h4>
        <pre className="output-display">{output}</pre>
      </div>
    </div>
  );
};

export default InteractivePythonLesson;
