import { useSettings } from '../../context/SettingsContext';
import './Footer.css';

export default function Footer() {
    const { settings } = useSettings();

    return (
        <footer className="site-footer">

            <div className="container footer-content">
                <div className="social-links">
                    {settings.socials.instagram && (
                        <a href={settings.socials.instagram} target="_blank" rel="noreferrer" title="Instagram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    )}
                    {settings.socials.tiktok && (
                        <a href={settings.socials.tiktok} target="_blank" rel="noreferrer" title="TikTok">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
                        </a>
                    )}
                    {settings.socials.telegram && (
                        <a href={settings.socials.telegram} target="_blank" rel="noreferrer" title="Telegram">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </a>
                    )}
                </div>

                <p>&copy; {new Date().getFullYear()} PathToSuccess. All rights reserved.</p>
                <p className="footer-links">
                    منصة تعليمية شاملة للطلاب الجزائريين
                </p>
            </div>
        </footer>
    );
}
