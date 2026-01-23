import { Link } from 'react-router-dom';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import ThemeToggle from '../UI/ThemeToggle';
import QuranRotator from '../Smart/QuranRotator';
import SearchBar from '../Smart/SearchBar';
import { useLanguage } from '../../context/LanguageContext';
import { useUserStats } from '../../context/UserStatsContext';
import './Header.css';

export default function Header({ onToggleSidebar }) {
    const { currentLang } = useLanguage();
    const { stats } = useUserStats();
    return (
        <header className="site-header">
            <div className="container header-container">
                <div className="logo-area">
                    <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Menu">
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                        <span className="hamburger-line"></span>
                    </button>
                    <Link to="/" className="logo">
                        <span className="logo-icon">🚀</span>
                        <span className="logo-text">PathToSuccess</span>
                    </Link>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        <li><Link to="/" className="nav-link">{currentLang.code === 'ar' ? 'الرئيسية' : 'Home'}</Link></li>
                        <li><Link to="/about" className="nav-link">{currentLang.code === 'ar' ? 'عن المنصة' : 'About'}</Link></li>
                    </ul>
                </nav>

                <SearchBar />

                <div className="header-actions">
                    <Link to="/login" className="login-link-btn" style={{ marginRight: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                        🔑 <span className="login-text">{currentLang.code === 'ar' ? 'دخول' : 'Login'}</span>
                    </Link>
                    <Link to="/analytics" className="user-level-badge" title={currentLang.code === 'ar' ? `اضغط لعرض الإحصائيات - XP: ${stats.xp % 100}/100` : `Click for stats - XP: ${stats.xp % 100}/100`} style={{ textDecoration: 'none' }}>
                        <span className="level-num">Lvl {stats.level}</span>
                        <div className="xp-bar-mini">
                            <div className="xp-progress" style={{ width: `${stats.xp % 100}%` }}></div>
                        </div>
                    </Link>
                    <div className="hide-mobile">
                        <LanguageSwitcher />
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="container" style={{ marginTop: '0.5rem' }}>
                <QuranRotator />
            </div>
        </header>
    );
}
