import { createContext, useContext, useState, useEffect } from 'react';
import languages from '../data/languages.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState(languages[0]); // Default to Arabic

    useEffect(() => {
        // Update document direction and lang attribute
        document.documentElement.setAttribute('lang', currentLang.code);
        document.documentElement.setAttribute('dir', currentLang.dir);
    }, [currentLang]);

    const switchLanguage = (code) => {
        const lang = languages.find((l) => l.code === code);
        if (lang) {
            setCurrentLang(lang);
        }
    };

    return (
        <LanguageContext.Provider value={{ currentLang, switchLanguage, languages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
