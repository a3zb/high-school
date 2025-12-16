import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
    const { currentLang, switchLanguage, languages } = useLanguage();

    return (
        <div className="language-switcher">
            <select
                value={currentLang.code}
                onChange={(e) => switchLanguage(e.target.value)}
                aria-label="Select Language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
