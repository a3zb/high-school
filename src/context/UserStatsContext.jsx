import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const UserStatsContext = createContext();

export const UserStatsProvider = ({ children }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        xp: 0,
        level: 1,
        badges: [],
        quizzesCompleted: 0,
        history: [] // [{ date, type, id, title, xp }]
    });

    // Load Stats from Firestore
    useEffect(() => {
        const loadStats = async () => {
            if (user?.uid && !db.configMissing) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists() && docSnap.data().stats) {
                        setStats(docSnap.data().stats);
                    } else {
                        // Initialize stats if missing
                        const initialStats = {
                            xp: 0,
                            level: 1,
                            badges: [],
                            quizzesCompleted: 0,
                            history: []
                        };
                        setStats(initialStats);
                    }
                } catch (error) {
                    console.error("Error loading stats:", error);
                }
            } else {
                // Reset stats for guest/logged out
                setStats({
                    xp: 0,
                    level: 1,
                    badges: [],
                    quizzesCompleted: 0,
                    history: []
                });
            }
        };
        loadStats();
    }, [user]);

    const syncStatsToFirestore = async (newStats) => {
        if (!user?.uid || db.configMissing) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, { stats: newStats }, { merge: true });
        } catch (error) {
            console.error("Error syncing stats:", error);
        }
    };

    const addXP = (amount, activity = null) => {
        setStats(prev => {
            const newXP = prev.xp + amount;
            const newLevel = Math.floor(newXP / 100) + 1;

            const newHistory = activity
                ? [{ ...activity, date: new Date().toISOString(), xp: amount }, ...prev.history].slice(0, 50)
                : prev.history;

            const newStats = {
                ...prev,
                xp: newXP,
                level: newLevel,
                history: newHistory
            };

            // Fire and forget sync
            syncStatsToFirestore(newStats);
            return newStats;
        });
    };

    const recordQuizCompletion = (score, total, title) => {
        const points = score * 10;
        setStats(prev => {
            const newXP = prev.xp + points;
            const newLevel = Math.floor(newXP / 100) + 1;
            const newHistory = [{ type: 'Quiz', title, date: new Date().toISOString(), xp: points }, ...prev.history].slice(0, 50);

            const newStats = {
                ...prev,
                xp: newXP,
                level: newLevel,
                history: newHistory,
                quizzesCompleted: prev.quizzesCompleted + 1
            };

            syncStatsToFirestore(newStats);
            return newStats;
        });
    };

    const recordLessonView = (id, title) => {
        // Prevent spamming XP? Assuming naive implementation for now
        addXP(5, { type: 'Lesson', id, title });
    };

    return (
        <UserStatsContext.Provider value={{ stats, addXP, recordQuizCompletion, recordLessonView }}>
            {children}
        </UserStatsContext.Provider>
    );
};

export const useUserStats = () => useContext(UserStatsContext);
