import React, { useEffect, useState } from 'react';
import { fetchLesson } from '../api';
import { Link } from 'react-router-dom';
import "./styles.css"; 

const Lesson = () => {
    const [lesson, setLesson] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [quizAnswer, setQuizAnswer] = useState('');
    const [quizResult, setQuizResult] = useState(null);

    useEffect(() => {
        async function getLesson() {
            try {
                const data = await fetchLesson(1); 
                if (data.lesson) {
                    setLesson(data.lesson);
                } else {
                    setError("Lesson not found.");
                }
            } catch (err) {
                setError("Error fetching lesson. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        getLesson();
    }, []);

    // Function to check quiz answer
    const handleQuizSubmit = () => {
        const correctAnswer = "True"; 
        if (quizAnswer === correctAnswer) {
            setQuizResult("Correct! Well done! 🎉");
        } else {
            setQuizResult("Oops, that's not right. Try again! 💡 (Case Sensitive)");
        }
    };

    return (
        <div className='lesson-box'>
            <div className="lesson-container">
                <h2>📖 Python Lesson</h2>

                {loading && <p className="loading-text">Loading lesson...</p>}
                {error && <p className="error">{error}</p>}

                {!loading && !error && (
                    <div className='lesson-box'>
                        <div className="lesson-content">
                            {lesson}
                            <p>Welcome to your first Python lesson! Here, you’ll learn some basic concepts of Python programming.</p>
                            
                            <h3>Lesson: Introduction to Python</h3>
                            <p>Python is a powerful and easy-to-learn programming language. Below are some key features of Python:</p>
                            <ul>
                                <li><strong>Simple Syntax:</strong> Python has a clean and easy-to-read syntax.</li>
                                <li><strong>Interpreted Language:</strong> Python code is executed line by line by an interpreter, making it easier to test and debug.</li>
                                <li><strong>Versatile:</strong> You can use Python for a variety of applications, including web development, data science, and artificial intelligence.</li>
                                <li><strong>Readable:</strong> Python is designed to be easy to read, and it encourages good programming practices.</li>
                            </ul>

                            {/* New Content: Variables in Python */}
                            <h3>📌 Understanding Variables in Python</h3>
                            <p>
                                A **variable** is used to store information that can be referenced and manipulated in a program. 
                                In Python, you can create a variable just by assigning a value to a name:
                            </p>

                            <pre className="code-block">
                                <code>
                                    {`# Creating a variable
age = 10
name = "Alice"

# Printing the variables
print(age)   # Output: 10
print(name)  # Output: Alice`}
                                </code>
                            </pre>

                            <h4>✨ Rules for Naming Variables</h4>
                            <ul>
                                <li>Variable names can only contain letters, numbers, and underscores (_).</li>
                                <li>They **cannot** start with a number.</li>
                                <li>They are **case-sensitive** (`Age` and `age` are different variables).</li>
                            </ul>

                            <h4>🔹 Different Data Types in Variables</h4>
                            <p>Variables can store different types of data, such as:</p>
                            <ul>
                                <li>📌 **Numbers** (Integers & Floats) → `age = 10`, `height = 5.8`</li>
                                <li>📌 **Text (Strings)** → `name = "Alice"`</li>
                                <li>📌 **Boolean Values** (True/False) → `is_student = True`</li>
                            </ul>

                            <h4>🎯 Your Task:</h4>
                            <p>
                                Try creating a variable called `favorite_color`, assign it a color of your choice, and print it to the screen!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Quiz Section */}
            <div className='quiz-box'>
                <div className="quiz-section">
                    <h3>Quick Quiz! ❓</h3>
                    <p>Python is an interpreted language. True or False?</p>
                    <input
                        type="text"
                        value={quizAnswer}
                        onChange={(e) => setQuizAnswer(e.target.value)}
                        placeholder="Type your answer here"
                        className="quiz-input"
                    />
                    <button onClick={handleQuizSubmit} className="quiz-button">Submit Answer</button>
                    {quizResult && <p className="quiz-result">{quizResult}</p>}

                    {/* Take Challenge Button */}
                    <p>If you're ready, let's</p>
                    <Link to="/homework">
                        <button className="take-challenge-button">
                            Take Challenge
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Lesson;
