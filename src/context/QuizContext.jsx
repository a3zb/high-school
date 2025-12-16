import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    // Mock Quizzes: { id, title, subjectId, yearId, streamId, questions: [{ id, text, options: [], correctOptionIndex }] }
    const [quizzes, setQuizzes] = useState([
        {
            id: "q1",
            title: "Math Fundamentals Quiz",
            subjectId: "math",
            yearId: "3as",
            streamId: "science",
            questions: [
                {
                    id: "q1_1",
                    text: "What is the derivative of x^2?",
                    options: ["x", "2x", "x^2", "0"],
                    correctOptionIndex: 1
                },
                {
                    id: "q1_2",
                    text: "Is Pi a rational number?",
                    options: ["True", "False"],
                    correctOptionIndex: 1
                }
            ]
        }
    ]);

    // Results: { studentId, quizId, score, answers: { questionId: selectedIndex } }
    const [results, setResults] = useState([]);

    const addQuiz = (quizData) => {
        const newQuiz = {
            ...quizData,
            id: `quiz-${Date.now()}`
        };
        setQuizzes(prev => [...prev, newQuiz]);
    };

    const submitResult = (resultData) => {
        setResults(prev => [...prev, resultData]);
    };

    const getQuizzesBySubject = (subjectId) => {
        return quizzes.filter(q => q.subjectId === subjectId);
    };

    return (
        <QuizContext.Provider value={{ quizzes, results, addQuiz, submitResult, getQuizzesBySubject }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuizzes = () => useContext(QuizContext);
