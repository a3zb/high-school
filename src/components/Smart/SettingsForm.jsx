import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import './SmartComponents.css';

export default function SettingsForm() {
    const { settings, updateSocials, updateBacDate } = useSettings();
    const { currentLang } = useLanguage();

    // Local state for form
    const [socials, setSocials] = useState(settings.socials);
    const [bacDate, setBacDate] = useState(settings.bacDate);
    const [msg, setMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSocials(socials);
        updateBacDate(bacDate);
        setMsg('Settings Updated Successfully!');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="settings-form-container">
            <h3>{currentLang.code === 'ar' ? 'إعدادات الموقع' : 'Site Settings'}</h3>
            <form onSubmit={handleSubmit} className="settings-form">

                <div className="form-group">
                    <label>BAC Date (YYYY-MM-DDTHH:MM:SS)</label>
                    <input
                        type="datetime-local"
                        value={bacDate}
                        onChange={e => setBacDate(e.target.value)}
                    />
                </div>

                <h4>Social Media Links</h4>
                <div className="form-group">
                    <label>Instagram</label>
                    <input
                        type="url"
                        value={socials.instagram}
                        onChange={e => setSocials({ ...socials, instagram: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>TikTok</label>
                    <input
                        type="url"
                        value={socials.tiktok}
                        onChange={e => setSocials({ ...socials, tiktok: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Telegram</label>
                    <input
                        type="url"
                        value={socials.telegram}
                        onChange={e => setSocials({ ...socials, telegram: e.target.value })}
                    />
                </div>

                <button type="submit" className="save-btn">Save Settings</button>
                {msg && <p className="success-msg">{msg}</p>}
            </form>
        </div>
    );
}
