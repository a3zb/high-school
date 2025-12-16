import { useState, useEffect } from 'react';
import verses from '../../data/quran_verses.json';
import './SmartComponents.css';

export default function QuranRotator() {
    const [currentVerse, setCurrentVerse] = useState(verses[0]);

    useEffect(() => {
        // Change verse every 10 minutes (600000 ms)
        // For demo purposes, let's do randomly on mount, then interval
        const pickRandom = () => {
            const idx = Math.floor(Math.random() * verses.length);
            setCurrentVerse(verses[idx]);
        };

        pickRandom(); // Pick one on load

        const interval = setInterval(pickRandom, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="quran-rotator">
            <span className="quran-icon">☪</span>
            <p className="quran-text">"{currentVerse.text}"</p>
            <span className="quran-ref">[{currentVerse.surah}: {currentVerse.ayah}]</span>
        </div>
    );
}
