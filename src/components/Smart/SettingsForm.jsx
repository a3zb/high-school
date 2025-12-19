import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import './SmartComponents.css';

export default function SettingsForm() {
    const { settings, updateSocials, updateBacDate } = useSettings();
    const isAr = currentLang.code === 'ar';

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSocials(socials);
        updateBacDate(bacDate);
        setMsg(isAr ? 'تم تحديث الإعدادات بنجاح!' : 'Settings Updated Successfully!');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="settings-premium-container">
            <div className="section-header">
                <h2>{isAr ? 'إعدادات المنصة' : 'Site Settings'}</h2>
                <p>{isAr ? 'تحكم في المواعيد الهامة وروابط التواصل' : 'Manage key dates and social connections'}</p>
            </div>

            <form onSubmit={handleSubmit} className="premium-compact-form">
                <div className="db-ann-form-card glass">
                    <h3>{isAr ? 'موعد البكالوريا' : 'BAC Countdown'}</h3>
                    <div className="input-field-db">
                        <input
                            type="datetime-local"
                            required
                            value={bacDate}
                            onChange={e => setBacDate(e.target.value)}
                            id="bac-date"
                        />
                        <div className="db-input-line"></div>
                    </div>
                </div>

                <div className="db-ann-form-card glass">
                    <h3>{isAr ? 'روابط التواصل الاجتماعي' : 'Social Media Links'}</h3>
                    <div className="ann-grid-form">
                        <div className="input-field-db">
                            <input
                                type="url"
                                required
                                value={socials.instagram}
                                onChange={e => setSocials({ ...socials, instagram: e.target.value })}
                                placeholder=" "
                                id="ig-link"
                            />
                            <label htmlFor="ig-link">Instagram</label>
                            <div className="db-input-line"></div>
                        </div>
                        <div className="input-field-db">
                            <input
                                type="url"
                                required
                                value={socials.tiktok}
                                onChange={e => setSocials({ ...socials, tiktok: e.target.value })}
                                placeholder=" "
                                id="tk-link"
                            />
                            <label htmlFor="tk-link">TikTok</label>
                            <div className="db-input-line"></div>
                        </div>
                        <div className="input-field-db">
                            <input
                                type="url"
                                required
                                value={socials.telegram}
                                onChange={e => setSocials({ ...socials, telegram: e.target.value })}
                                placeholder=" "
                                id="tg-link"
                            />
                            <label htmlFor="tg-link">Telegram</label>
                            <div className="db-input-line"></div>
                        </div>

                        <button type="submit" className="db-primary-btn">
                            {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                {msg && <div className="db-success-toast">{msg}</div>}
            </form>
        </div>
    );
}
