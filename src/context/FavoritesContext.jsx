import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);

    // Load favorites from Firestore when user logs in
    useEffect(() => {
        const loadFavorites = async () => {
            if (user?.uid && !db.configMissing) {
                try {
                    const userRef = doc(db, 'users', user.uid);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists() && docSnap.data().favorites) {
                        setFavorites(docSnap.data().favorites);
                    } else {
                        setFavorites([]);
                    }
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            } else {
                setFavorites([]); // Clear on logout
            }
        };

        loadFavorites();
    }, [user]);

    const toggleFavorite = async (item) => {
        if (!user?.uid) {
            alert("يرجى تسجيل الدخول أولاً لحفظ المفضلة!"); // Or better, open login modal
            return;
        }

        if (db.configMissing) {
            alert("لا يمكن حفظ المفضلة لأن الاتصال بقاعدة البيانات غير مهيأ.");
            return;
        }

        const exists = favorites.some(fav => fav.id === item.id);
        const userRef = doc(db, 'users', user.uid);

        try {
            if (exists) {
                // Remove from local state immediately for UI response
                setFavorites(prev => prev.filter(fav => fav.id !== item.id));
                // Sync with Firestore
                await updateDoc(userRef, {
                    favorites: arrayRemove(item)
                });
            } else {
                // Add to local state
                setFavorites(prev => [...prev, item]);
                // Sync with Firestore (create doc if not exists, but AuthContext creates user doc usually)
                await setDoc(userRef, {
                    favorites: arrayUnion(item)
                }, { merge: true });
            }
        } catch (error) {
            console.error("Error updating favorites:", error);
            // Revert on error? For simplicity, we assume success or user retries.
        }
    };

    const isFavorite = (id) => favorites.some(fav => fav.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
