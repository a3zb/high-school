import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('user_favorites');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('user_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (item) => {
        // item: { id, title, type, path }
        setFavorites(prev => {
            const exists = prev.find(fav => fav.id === item.id);
            if (exists) {
                return prev.filter(fav => fav.id !== item.id);
            }
            return [...prev, item];
        });
    };

    const isFavorite = (id) => favorites.some(fav => fav.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
