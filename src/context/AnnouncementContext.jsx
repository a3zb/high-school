import { createContext, useContext, useState, useEffect } from 'react';

const AnnouncementContext = createContext();

export const AnnouncementProvider = ({ children }) => {
    const [announcements, setAnnouncements] = useState([]);

    // Optimize: Load from LocalStorage if we want persistence across reloads for Admin changes
    useEffect(() => {
        const saved = localStorage.getItem('site_announcements');
        if (saved) {
            setAnnouncements(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('site_announcements', JSON.stringify(announcements));
    }, [announcements]);

    const addAnnouncement = (textAr, textEn, type = 'info') => {
        const newAnn = {
            id: `ann-${Date.now()}`,
            text: { ar: textAr, en: textEn },
            type,
            active: true,
            date: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnn, ...prev]);
    };

    const deleteAnnouncement = (id) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    const toggleAvailability = (id) => {
        setAnnouncements(prev => prev.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
        ));
    };

    return (
        <AnnouncementContext.Provider value={{ announcements, addAnnouncement, deleteAnnouncement, toggleAvailability }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncements = () => useContext(AnnouncementContext);
