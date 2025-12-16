import { useSettings } from '../../context/SettingsContext';
import BacCountdown from '../Smart/BacCountdown';
import './Footer.css';

export default function Footer() {
    const { settings } = useSettings();

    return (
        <footer className="site-footer">
            <BacCountdown />

            <div className="container footer-content">
                <div className="social-links">
                    {settings.socials.instagram && <a href={settings.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                    {settings.socials.tiktok && <a href={settings.socials.tiktok} target="_blank" rel="noreferrer">TikTok</a>}
                    {settings.socials.telegram && <a href={settings.socials.telegram} target="_blank" rel="noreferrer">Telegram</a>}
                </div>

                <p>&copy; {new Date().getFullYear()} Educational Platform. All rights reserved.</p>
                <p className="footer-links">
                    Built for Algerian Students (BAC)
                </p>
            </div>
        </footer>
    );
}
