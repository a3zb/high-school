import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import './FavoritesPage.css';

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites();
    const { currentLang } = useLanguage();

    return (
        <div className="container favorites-page">
            <header className="page-header">
                <h1>{currentLang.code === 'ar' ? 'المفضلة' : 'Favorites'}</h1>
                <p>{currentLang.code === 'ar' ? 'دروسك واختباراتك المحفوظة' : 'Your saved lessons and quizzes'}</p>
            </header>

            {favorites.length === 0 ? (
                <div className="empty-state">
                    <span className="icon">⭐</span>
                    <p>{currentLang.code === 'ar' ? 'قائمتك فارغة حالياً' : 'Your list is currently empty'}</p>
                    <Link to="/" className="btn-primary">{currentLang.code === 'ar' ? 'تصفح المواد' : 'Browse Subjects'}</Link>
                </div>
            ) : (
                <div className="favorites-grid">
                    {favorites.map(item => (
                        <div key={item.id} className="fav-card">
                            <div className="fav-info">
                                <span className={`type-badge ${item.type}`}>{item.type}</span>
                                <h3>{item.title}</h3>
                            </div>
                            <div className="fav-actions">
                                <Link to={item.path} className="view-link">
                                    {currentLang.code === 'ar' ? 'فتح' : 'Open'}
                                </Link>
                                <button onClick={() => toggleFavorite(item)} className="remove-btn">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
