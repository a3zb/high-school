import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import './SmartComponents.css';

export default function BacCountdown() {
    const { settings } = useSettings();
    const { currentLang } = useLanguage();
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(settings.bacDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [settings.bacDate]);

    const labels = {
        days: { ar: 'يوم', fr: 'Jours', en: 'Days' },
        hours: { ar: 'ساعة', fr: 'Heures', en: 'Hours' },
        minutes: { ar: 'دقيقة', fr: 'Minutes', en: 'Mins' },
        seconds: { ar: 'ثانية', fr: 'Secondes', en: 'Secs' }
    };

    if (Object.keys(timeLeft).length === 0) {
        return <div className="bac-countdown finished">BAC Exam Started!</div>;
    }

    return (
        <div className="bac-countdown">
            <h4>{currentLang.code === 'ar' ? 'الوقت المتبقي للبكالوريا' : 'Time until BAC'}</h4>
            <div className="countdown-timer">
                <div className="time-unit">
                    <span className="number">{timeLeft.days}</span>
                    <span className="label">{labels.days[currentLang.code]}</span>
                </div>
                <div className="time-unit">
                    <span className="number">{timeLeft.hours}</span>
                    <span className="label">{labels.hours[currentLang.code]}</span>
                </div>
                <div className="time-unit">
                    <span className="number">{timeLeft.minutes}</span>
                    <span className="label">{labels.minutes[currentLang.code]}</span>
                </div>
                <div className="time-unit">
                    <span className="number">{timeLeft.seconds}</span>
                    <span className="label">{labels.seconds[currentLang.code]}</span>
                </div>
            </div>
        </div>
    );
}
