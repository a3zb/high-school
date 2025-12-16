import { createContext, useContext, useState, useEffect } from 'react';
import defaultSettings from '../data/site_settings.json';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    // Load from localStorage or default
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('site_settings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });

    const updateSocials = (newSocials) => {
        setSettings(prev => {
            const updated = { ...prev, socials: { ...prev.socials, ...newSocials } };
            localStorage.setItem('site_settings', JSON.stringify(updated));
            return updated;
        });
    };

    const updateBacDate = (dateString) => {
        setSettings(prev => {
            const updated = { ...prev, bacDate: dateString };
            localStorage.setItem('site_settings', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSocials, updateBacDate }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
