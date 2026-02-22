import { useLocation, Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import BacCountdown from './BacCountdown';
import './StickyBacCountdown.css';

export default function StickyBacCountdown() {
    const location = useLocation();

    const { activeYear } = useContent();
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    // Check if the URL contains '3as' (3rd Year Secondary) or if 3as is selected on home
    const searchParams = new URLSearchParams(location.search);
    const is3AS = location.pathname.includes('/year/3as') ||
        searchParams.get('year') === '3as' ||
        (location.pathname === '/' && activeYear === '3as');

    if (!is3AS) return null;

    return (
        <div className="sticky-bac-wrapper glass">
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
