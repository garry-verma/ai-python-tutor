import React, { useState } from 'react';
import { askTutor } from '../api';
import './styles.css';

function Tutor() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError("Please enter a question!");
            return;
        }
        setError('');
        setLoading(true);
        
        try {
            const data = await askTutor(question);
            setAnswer(data.answer);
        } catch (err) {
            setError("Oops! Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tutor-container">
            <h1>🤖 Ask Your AI Tutor</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a Python question..."
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Thinking..." : "Ask"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
            {answer && (
                <div className="answer-box">
                    <strong>Answer:</strong>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}

export default Tutor;
