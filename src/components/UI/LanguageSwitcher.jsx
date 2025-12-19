import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
    const { currentLang, switchLanguage, languages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="language-dropdown" ref={dropdownRef}>
            <button
                className={`lang-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="lang-flag">{currentLang.code === 'ar' ? '🇩🇿' : currentLang.code === 'fr' ? '🇫🇷' : '🇺🇸'}</span>
                <span className="lang-name">{currentLang.name}</span>
                <span className={`chevron ${isOpen ? 'up' : 'down'}`}>▼</span>
            </button>

            {isOpen && (
                <div className="lang-menu glass">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`lang-option ${currentLang.code === lang.code ? 'selected' : ''}`}
                            onClick={() => {
                                switchLanguage(lang.code);
                                setIsOpen(false);
                            }}
                        >
                            <span className="lang-flag-mini">{lang.code === 'ar' ? '🇩🇿' : lang.code === 'fr' ? '🇫🇷' : '🇺🇸'}</span>
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
