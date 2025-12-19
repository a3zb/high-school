import { createContext, useContext, useState, useEffect } from 'react';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const [stats, setStats] = useState({
        xp: 0,
        level: 1,
        badges: [],
        quizzesCompleted: 0,
        history: [] // [{ date, type, id, title, xp }]
    });

    useEffect(() => {
        const savedStats = localStorage.getItem('user_stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user_stats', JSON.stringify(stats));
    }, [stats]);

    const addXP = (amount, activity = null) => {
        setStats(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / 100) + 1;

            const newHistory = activity
                ? [{ ...activity, date: new Date().toISOString(), xp: amount }, ...prev.history].slice(0, 50)
                : prev.history;

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                history: newHistory
            };
        });
    };

    const recordQuizCompletion = (score, total, title) => {
        const points = score * 10;
        setStats(prev => {
            const newXP = prev.xp + points;
            const newLevel = Math.floor(newXP / 100) + 1;
            const newHistory = [{ type: 'Quiz', title, date: new Date().toISOString(), xp: points }, ...prev.history].slice(0, 50);

            return {
                ...prev,
                xp: newXP,
                level: newLevel,
                history: newHistory,
                quizzesCompleted: prev.quizzesCompleted + 1
            };
        });
    };

    const recordLessonView = (id, title) => {
        addXP(5, { type: 'Lesson', id, title });
    };

    return (
        <UserStatsContext.Provider value={{ stats, addXP, recordQuizCompletion, recordLessonView }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);
