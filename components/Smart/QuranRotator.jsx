import { useState, useEffect } from 'react';
import verses from '../../data/quran_verses.json';
import './SmartComponents.css';

export default function QuranRotator() {
    const [currentVerse, setCurrentVerse] = useState(null);

    useEffect(() => {
        const chapters = Object.keys(verses);

        const pickRandom = () => {
            const randomChapterKey = chapters[Math.floor(Math.random() * chapters.length)];
            const chapterVerses = verses[randomChapterKey];
            const verse = chapterVerses[Math.floor(Math.random() * chapterVerses.length)];
            setCurrentVerse(verse);
        };

        if (chapters.length > 0) {
            pickRandom();
        }

        const interval = setInterval(pickRandom, 2 * 60 * 1000); // 2 minutes
        return () => clearInterval(interval);
    }, []);

    if (!currentVerse) return null;

    return (
        <div className="quran-rotator">
            <span className="quran-icon">☪</span>
            <p className="quran-text">"{currentVerse.text}"</p>
            <span className="quran-ref">[{currentVerse.chapter}: {currentVerse.verse}]</span>
        </div>
    );
}
