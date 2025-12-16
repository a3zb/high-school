import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import educationData from '../../data/educational_structure.json';
import './Breadcrumbs.css';

export default function Breadcrumbs() {
    const location = useLocation();
    const { currentLang } = useLanguage();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbNameMap = {
        'year': currentLang.code === 'ar' ? 'السنة' : 'Year',
        'stream': currentLang.code === 'ar' ? 'الشعبة' : 'Stream',
        'subject': currentLang.code === 'ar' ? 'المادة' : 'Subject',
    };

    // Helper to find title by ID from data would be complex recursively, 
    // so for simplicity we will rely on route params or mapped lookups if we had flat data.
    // For this v1, we will try to make it smart enough to look up names.

    const getName = (type, id) => {
        if (type === 'year') {
            const y = educationData.years.find(y => y.id === id);
            return y ? (y.title[currentLang.code] || y.title.en) : id;
        }
        // Deep lookup is expensive here without flat map, returning ID if complex
        // In a real app we'd use a memoized flat map or query hook
        return id;
    };

    return (
        <nav className="breadcrumbs" aria-label="breadcrumb">
            <div className="container">
                <ul className="breadcrumb-list">
                    <li>
                        <Link to="/">{currentLang.code === 'ar' ? 'الرئيسية' : 'Home'}</Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        // Basic logic to skip "year" keyword if url is /year/1as
                        // Actually, our routes are /year/:id etc.
                        // Let's just standard breadcrumbs for now

                        const isLast = index === pathnames.length - 1;

                        // Improving display: if value is 'year' or 'stream', maybe skip or translate
                        if (['year', 'stream', 'subject'].includes(value)) return null;

                        return (
                            <li key={to} className={isLast ? 'active' : ''}>
                                <span className="separator">/</span>
                                {isLast ? (
                                    <span>{getName(pathnames[index - 1], value)}</span>
                                ) : (
                                    <Link to={to}>{getName(pathnames[index - 1], value)}</Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
