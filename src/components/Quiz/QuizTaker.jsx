import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './QuizStyles.css';

export default function QuizTaker({ quiz }) {
    const { user } = useAuth();
    const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleSelect = (qId, optionIdx) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < quiz.questions.length) {
            if (!confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        let calculatedScore = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctOptionIndex) {
                calculatedScore++;
            }
        });
        setScore(calculatedScore);
        setSubmitted(true);
    };

    return (
        <div className="quiz-taker">
            <h2>{quiz.title}</h2>

            {submitted && (
                <div className="quiz-score-card">
                    <p>Final Score</p>
                    <div className="score-display">{score} / {quiz.questions.length}</div>
                </div>
            )}

            {quiz.questions.map((q, idx) => {
                const myAnswer = answers[q.id];
                const isCorrect = myAnswer === q.correctOptionIndex;

                return (
                    <div key={q.id} className="quiz-question-card">
                        <h4>{idx + 1}. {q.text}</h4>
                        <div className="options-list">
                            {q.options.map((opt, optIdx) => {
                                let className = "quiz-option";
                                if (submitted) {
                                    if (optIdx === q.correctOptionIndex) className += " correct";
                                    else if (optIdx === myAnswer) className += " incorrect";
                                } else {
                                    if (optIdx === myAnswer) className += " selected";
                                }

                                return (
                                    <label key={optIdx} className={className}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            checked={myAnswer === optIdx}
                                            onChange={() => handleSelect(q.id, optIdx)}
                                            style={{ display: 'none' }}
                                        />
                                        {opt}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            {!submitted && (
                <button onClick={handleSubmit} className="submit-quiz-btn" style={{ width: '100%' }}>
                    Submit Quiz
                </button>
            )}
        </div>
    );
}
