import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/permissions';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import ThemeToggle from '../UI/ThemeToggle';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
    const { currentLang } = useLanguage();
    const { user } = useAuth();
    const location = useLocation();
    const isAr = currentLang.code === 'ar';

    const menuItems = [
        { path: '/', label: isAr ? 'الرئيسية' : 'Home', icon: '🏠' },
        { path: '/planner', label: isAr ? 'مخطط الدراسة' : 'Study Planner', icon: '📅' },
        { path: '/favorites', label: isAr ? 'المفضلة' : 'Favorites', icon: '⭐' },
        { path: '/calculator', label: isAr ? 'حساب المعدل' : 'Calculator', icon: '🧮' },
        { path: '/analytics', label: isAr ? 'إحصائياتي' : 'Analytics', icon: '📊' },
    ];

    // Only show dashboard for teachers and moderators
    if (user && (user.role === ROLES.TEACHER || user.role === ROLES.MODERATOR)) {
        menuItems.push({ path: '/dashboard', label: isAr ? 'لوحة المعلم' : 'Teacher Dashboard', icon: '👨‍🏫' });
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`sidebar-backdrop ${isOpen ? 'show' : ''}`}
                onClick={onClose}
            ></div>

            {/* Side Drawer */}
            <aside className={`app-sidebar glass ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <span className="sidebar-title">{isAr ? 'القائمة' : 'Menu'}</span>
                    <button className="close-sidebar" onClick={onClose}>×</button>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={onClose}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span className="sidebar-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <div className="sidebar-settings hide-desktop">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                    <p>{isAr ? 'منصة النجاح' : 'Success Platform'}</p>
                </div>
            </aside>
        </>
    );
}
