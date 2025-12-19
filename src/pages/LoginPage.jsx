import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { loginWithCode, loginWithCredentials } = useAuth();
    const { currentLang } = useLanguage();

    const [activeTab, setActiveTab] = useState('teacher'); // teacher | admin
    const [code, setCode] = useState('');
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const isAr = currentLang.code === 'ar';

    const handleTeacherLogin = (e) => {
        e.preventDefault();
        const result = loginWithCode(code);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        const result = loginWithCredentials(creds.username, creds.password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="login-page-premium">
            <div className="login-visual-bg"></div>

            <div className="login-card-container glass">
                <div className="login-card-header">
                    <span className="login-brand-icon">🔑</span>
                    <h1>{isAr ? 'مرحباً بعودتك' : 'Welcome Back'}</h1>
                    <p>{isAr ? 'سجل الدخول للوصول إلى لوحة التحكم' : 'Login to access your dashboard'}</p>
                </div>

                <div className="login-tabs-premium">
                    <button
                        className={activeTab === 'teacher' ? 'active' : ''}
                        onClick={() => { setActiveTab('teacher'); setError(''); }}
                    >
                        {isAr ? 'أستاذ' : 'Teacher'}
                    </button>
                    <button
                        className={activeTab === 'admin' ? 'active' : ''}
                        onClick={() => { setActiveTab('admin'); setError(''); }}
                    >
                        {isAr ? 'إدارة' : 'Admin'}
                    </button>
                </div>

                <div className="login-form-wrapper">
                    {activeTab === 'teacher' ? (
                        <form onSubmit={handleTeacherLogin} className="premium-form">
                            <div className="input-field">
                                <input
                                    type="text"
                                    required
                                    value={code}
                                    onChange={e => setCode(e.target.value)}
                                    placeholder=" "
                                    id="teacher-code"
                                />
                                <label htmlFor="teacher-code">{isAr ? 'كود التفعيل' : 'Activation Code'}</label>
                                <div className="input-focus-line"></div>
                            </div>
                            <button type="submit" className="login-submit-btn">
                                <span>{isAr ? 'دخول سريع' : 'Quick Access'}</span>
                                <i className="btn-icon">→</i>
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminLogin} className="premium-form">
                            <div className="input-field">
                                <input
                                    type="text"
                                    required
                                    value={creds.username}
                                    onChange={e => setCreds({ ...creds, username: e.target.value })}
                                    placeholder=" "
                                    id="admin-user"
                                />
                                <label htmlFor="admin-user">{isAr ? 'اسم المستخدم' : 'Username'}</label>
                                <div className="input-focus-line"></div>
                            </div>
                            <div className="input-field">
                                <input
                                    type="password"
                                    required
                                    value={creds.password}
                                    onChange={e => setCreds({ ...creds, password: e.target.value })}
                                    placeholder=" "
                                    id="admin-pass"
                                />
                                <label htmlFor="admin-pass">{isAr ? 'كلمة المرور' : 'Password'}</label>
                                <div className="input-focus-line"></div>
                            </div>
                            <button type="submit" className="login-submit-btn">
                                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                                <i className="btn-icon">→</i>
                            </button>
                        </form>
                    )}
                </div>

                {error && (
                    <div className="login-error-badge">
                        <span className="error-icon">⚠️</span>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
