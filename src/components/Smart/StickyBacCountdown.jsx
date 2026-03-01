import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import BacCountdown from './BacCountdown';
import './StickyBacCountdown.css';

export default function StickyBacCountdown() {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);

    const { activeYear } = useContent();
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    // Check if user has already dismissed it this session
    useEffect(() => {
        const isDismissed = sessionStorage.getItem('bac_countdown_dismissed');
        if (isDismissed) {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('bac_countdown_dismissed', 'true');
    };

    // Check if the URL contains '3as' (3rd Year Secondary) or if 3as is selected on home
    const searchParams = new URLSearchParams(location.search);
    const is3AS = location.pathname.includes('/year/3as') ||
        searchParams.get('year') === '3as' ||
        (location.pathname === '/' && activeYear === '3as');

    if (!is3AS || !isVisible) return null;

    return (
        <div className="sticky-bac-wrapper glass animated-slide-up">
            <button
                className="close-sticky-btn"
                onClick={handleDismiss}
                title={isAr ? 'إغلاق' : 'Close'}
            >
                ✕
            </button>
            <div className="sticky-bac-content">
                <BacCountdown />
                <div className="sticky-bac-actions">
                    <span className="bac-badge">BAC 2026</span>
                    <Link to="/calculator?year=3as" className="sticky-calc-btn glass">
                        🧮 {isAr ? 'حساب المعدل' : 'Calculate Average'}
                    </Link>
                </div>
            </div>
        </div>
    );
}

