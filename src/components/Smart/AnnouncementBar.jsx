import { useState, useEffect } from 'react';
import { useAnnouncements } from '../../context/AnnouncementContext';
import { useLanguage } from '../../context/LanguageContext';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
    const { announcements } = useAnnouncements();
    const { currentLang } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeAnnouncements = announcements.filter(a => a.active);

    useEffect(() => {
        if (activeAnnouncements.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % activeAnnouncements.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(interval);
    }, [activeAnnouncements.length]);

    if (activeAnnouncements.length === 0) return null;

    const currentAnn = activeAnnouncements[currentIndex];

    return (
        <div className={`announcement-bar type-${currentAnn.type}`}>
            <div className="container announcement-content">
                <span className="announcement-icon">📢</span>
                <span className="announcement-text">
                    {currentAnn.text[currentLang.code] || currentAnn.text.en}
                </span>
            </div>
        </div>
    );
}
