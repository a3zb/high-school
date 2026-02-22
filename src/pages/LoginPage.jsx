import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import './LoginPage.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const { loginWithCode, loginWithCredentials, login, register, loginAsAdmin } = useAuth();
    const { currentLang } = useLanguage();

    const [activeTab, setActiveTab] = useState('student'); // student | teacher | admin
    const [isRegistering, setIsRegistering] = useState(false);
    const [studentCreds, setStudentCreds] = useState({ name: '', email: '', password: '' });

    const [code, setCode] = useState('');
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const isAr = currentLang.code === 'ar';

    const handleStudentAuth = async (e) => {
        e.preventDefault();
        setError('');

        let result;
        if (isRegistering) {
            result = await register(studentCreds.email, studentCreds.password, studentCreds.name);
        } else {
            result = await login(studentCreds.email, studentCreds.password);
        }

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    const handleTeacherLogin = async (e) => {
        e.preventDefault();
        const result = await loginWithCode(code);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        const result = await loginAsAdmin(creds.username, creds.password);
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
                    <h1>{isAr ? 'مرحباً، تفوق معنا!' : 'Welcome, Excel with us!'}</h1>
                    <p>{isAr ? 'سجل الدخول لبدء رحلة النجاح' : 'Login to start your success journey'}</p>
                </div>

                <div className="login-tabs-premium">
                    <button
                        className={activeTab === 'student' ? 'active' : ''}
                        onClick={() => { setActiveTab('student'); setError(''); }}
                    >
                        {isAr ? 'طالب' : 'Student'}
                    </button>
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
                    {activeTab === 'student' ? (
                        <div className="student-auth-section">
                            <form onSubmit={handleStudentAuth} className="premium-form">
                                {isRegistering && (
                                    <div className="input-field">
                                        <input
                                            type="text"
                                            required
                                            value={studentCreds.name}
                                            onChange={e => setStudentCreds({ ...studentCreds, name: e.target.value })}
                                            placeholder=" "
                                            id="student-name"
                                        />
                                        <label htmlFor="student-name">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                                        <div className="input-focus-line"></div>
                                    </div>
                                )}
                                <div className="input-field">
                                    <input
                                        type="email"
                                        required
                                        value={studentCreds.email}
                                        onChange={e => setStudentCreds({ ...studentCreds, email: e.target.value })}
                                        placeholder=" "
                                        id="student-email"
                                    />
                                    <label htmlFor="student-email">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                                    <div className="input-focus-line"></div>
                                </div>
                                <div className="input-field">
                                    <input
                                        type="password"
                                        required
                                        value={studentCreds.password}
                                        onChange={e => setStudentCreds({ ...studentCreds, password: e.target.value })}
                                        placeholder=" "
                                        id="student-pass"
                                        minLength="6"
                                    />
                                    <label htmlFor="student-pass">{isAr ? 'كلمة المرور' : 'Password'}</label>
                                    <div className="input-focus-line"></div>
                                </div>
                                <button type="submit" className="login-submit-btn">
                                    <span>{isRegistering ? (isAr ? 'إنشاء حساب' : 'Create Account') : (isAr ? 'تسجيل الدخول' : 'Login')}</span>
                                    <i className="btn-icon">→</i>
                                </button>
                            </form>

                            <div className="auth-switch-text" style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                {isRegistering ? (
                                    <span>
                                        {isAr ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
                                        <button
                                            onClick={() => setIsRegistering(false)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {isAr ? 'سجل دخولك' : 'Login here'}
                                        </button>
                                    </span>
                                ) : (
                                    <span>
                                        {isAr ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
                                        <button
                                            onClick={() => setIsRegistering(true)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            {isAr ? 'أنشئ حساباً' : 'Register now'}
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    ) : activeTab === 'teacher' ? (
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
