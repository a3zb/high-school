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
        <div className="login-page-container">
            <div className="login-card">
                <h2>{currentLang.code === 'ar' ? 'تسجيل الدخول' : 'Login'}</h2>

                <div className="login-tabs">
                    <button
                        className={activeTab === 'teacher' ? 'active' : ''}
                        onClick={() => { setActiveTab('teacher'); setError(''); }}
                    >
                        {currentLang.code === 'ar' ? 'أستاذ' : 'Teacher'}
                    </button>
                    <button
                        className={activeTab === 'admin' ? 'active' : ''}
                        onClick={() => { setActiveTab('admin'); setError(''); }}
                    >
                        {currentLang.code === 'ar' ? 'إدارة' : 'Admin'}
                    </button>
                </div>

                {activeTab === 'teacher' ? (
                    <form onSubmit={handleTeacherLogin}>
                        <div className="form-group">
                            <label>{currentLang.code === 'ar' ? 'كود التفعيل' : 'Activation Code'}</label>
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="e.g. math-teacher-code"
                            />
                        </div>
                        <button type="submit" className="login-btn">
                            {currentLang.code === 'ar' ? 'دخول' : 'Enter'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAdminLogin}>
                        <div className="form-group">
                            <label>{currentLang.code === 'ar' ? 'اسم المستخدم' : 'Username'}</label>
                            <input
                                type="text"
                                value={creds.username}
                                onChange={e => setCreds({ ...creds, username: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>{currentLang.code === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                            <input
                                type="password"
                                value={creds.password}
                                onChange={e => setCreds({ ...creds, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="login-btn">
                            {currentLang.code === 'ar' ? 'دخول' : 'Login'}
                        </button>
                    </form>
                )}

                {error && <p className="error-msg">{error}</p>}
            </div>
        </div>
    );
}
