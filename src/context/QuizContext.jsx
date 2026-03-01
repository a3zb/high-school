import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    // Mock Quizzes: { id, title, subjectId, yearId, streamId, questions: [{ id, text, options: [], correctOptionIndex }] }
    const [quizzes, setQuizzes] = useState([]);

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
