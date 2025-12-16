import { Link } from 'react-router-dom';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import ThemeToggle from '../UI/ThemeToggle';
import QuranRotator from '../Smart/QuranRotator';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

export default function Header() {
    const { currentLang } = useLanguage();
    return (
        <header className="site-header">
            <div className="container header-container">
                <div className="logo-area">
                    <Link to="/" className="logo">
                        <span className="logo-icon">📚</span>
                        <span className="logo-text">DzExams Copy</span>
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        <li><Link to="/" className="nav-link">Home</Link></li>
                        <li><Link to="/planner" className="nav-link">Planner</Link></li>
                        <li><Link to="/calculator" className="nav-link">Calculator</Link></li>
                        <li><Link to="#" className="nav-link">About</Link></li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <Link to="/login" className="login-link-btn" style={{ marginRight: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                        🔑 {currentLang.code === 'ar' ? 'دخول' : 'Login'}
                    </Link>
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </div>

            <div className="container" style={{ marginTop: '0.5rem' }}>
                <QuranRotator />
            </div>
        </header>
    );
}
