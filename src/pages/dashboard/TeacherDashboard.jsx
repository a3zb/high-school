import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import educationData from '../../data/educational_structure.json';
import { ROLES, canEditContent } from '../../utils/permissions';
import QuizCreationForm from '../../components/Quiz/QuizCreationForm';
import SettingsForm from '../../components/Smart/SettingsForm';
import CustomSelect from '../../components/UI/CustomSelect';
import './TeacherDashboard.css';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const { addFile, getFilesByUploader, deleteFile } = useContent();
    const { announcements, addAnnouncement, deleteAnnouncement, toggleAvailability } = useAnnouncements();
    const { currentLang } = useLanguage();

    // Announcement Form State
    const [annForm, setAnnForm] = useState({ ar: '', en: '', type: 'info' });

    // Check permissions
    const isModerator = user?.role === ROLES.MODERATOR;

    const [activeTab, setActiveTab] = useState(isModerator ? 'overview' : 'upload');

    if (!user || user.role === ROLES.STUDENT) {
        return <div className="container" style={{ padding: '2rem' }}>Access Denied</div>;
    }

    // ... existing state ...

    // State for upload form
    const [formData, setFormData] = useState({
        title: '',
        yearId: '',
        streamId: '',
        subjectId: '',
        type: 'lessons'
    });
    const [message, setMessage] = useState('');

    // Derived options based on selection
    const selectedYear = educationData.years.find(y => y.id === formData.yearId);
    const selectedStream = selectedYear?.streams.find(s => s.id === formData.streamId);

    // Filter subjects based on permissions
    const availableSubjects = selectedStream?.subjects?.filter(sub =>
        canEditContent(user, sub.id)
    ) || [];

    const handleUpload = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.subjectId || !formData.yearId) {
            setMessage('Please fill all fields');
            return;
        }

        addFile({
            ...formData,
            uploaderId: user.id,
            url: '#' // Mock URL
        });

        setMessage('File uploaded successfully!');
        setFormData(prev => ({ ...prev, title: '' })); // Reset title only
        setTimeout(() => setMessage(''), 3000);
    };

    const myFiles = getFilesByUploader(user.id);
    const totalAnnouncements = announcements.length;
    const isAr = currentLang.code === 'ar';

    const navItems = [
        { id: 'overview', label: isAr ? 'نظرة عامة' : 'Overview', icon: '📊', modOnly: true },
        { id: 'upload', label: isAr ? 'رفع محتوى' : 'Upload', icon: '📤', modOnly: false },
        { id: 'quiz', label: isAr ? 'إنشاء اختبار' : 'Create Quiz', icon: '📝', modOnly: false },
        { id: 'files', label: isAr ? 'ملفاتي' : 'My Files', icon: '📂', modOnly: false },
        { id: 'announcements', label: isAr ? 'الإعلانات' : 'Announcements', icon: '📢', modOnly: true },
        { id: 'settings', label: isAr ? 'الإعدادات' : 'Settings', icon: '⚙️', modOnly: true },
    ];

    const filteredNav = navItems.filter(item => !item.modOnly || isModerator);

    return (
        <div className="dashboard-premium-wrapper">
            {/* Dashboard Sidebar */}
            <aside className="db-sidebar glass">
                <div className="db-user-profile">
                    <div className="db-avatar">{user.role.charAt(0).toUpperCase()}</div>
                    <div className="db-user-info">
                        <h3>{user.name}</h3>
                        <span className="db-role-badge">{user.role}</span>
                    </div>
                </div>
                <nav className="db-nav">
                    {filteredNav.map(item => (
                        <button
                            key={item.id}
                            className={`db-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="db-nav-icon">{item.icon}</span>
                            <span className="db-nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="db-main">
                {/* Stats Header */}
                <header className="db-stats-header">
                    <div className="stat-card-mini glass">
                        <span className="s-icon">📁</span>
                        <div className="s-data">
                            <span className="s-value">{myFiles.length}</span>
                            <span className="s-label">{isAr ? 'ملفات مرفوعة' : 'Uploads'}</span>
                        </div>
                    </div>
                    <div className="stat-card-mini glass">
                        <span className="s-icon">📢</span>
                        <div className="s-data">
                            <span className="s-value">{totalAnnouncements}</span>
                            <span className="s-label">{isAr ? 'إعلانات' : 'Announcements'}</span>
                        </div>
                    </div>
                    <div className="stat-card-mini glass">
                        <span className="s-icon">👤</span>
                        <div className="s-data">
                            <span className="s-value">Admin</span>
                            <span className="s-label">{isAr ? 'نوع الحساب' : 'Account'}</span>
                        </div>
                    </div>
                </header>

                <div className="db-content-frame glass">
                    {activeTab === 'overview' && (
                        <div className="overview-premium">
                            <h2>{isAr ? 'مرحبا بك في لوحة القوة' : 'Welcome to Power Panel'}</h2>
                            <div className="overview-cards-grid">
                                {filteredNav.filter(n => n.id !== 'overview').map(n => (
                                    <div key={n.id} className="quick-action-card glass-card" onClick={() => setActiveTab(n.id)}>
                                        <span className="qa-icon">{n.icon}</span>
                                        <h3>{n.label}</h3>
                                        <p>{isAr ? 'انتقل لإدارة هذا القسم' : `Quick access to ${n.label.toLowerCase()} section`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'upload' && (
                        <section className="upload-premium-section">
                            <div className="section-header">
                                <h2>{isAr ? 'رفع محتوى جديد' : 'Upload New Content'}</h2>
                                <p>{isAr ? 'أضف دروساً أو ملخصات أو اختبارات للمنصة' : 'Add lessons, summaries, or exams to the platform'}</p>
                            </div>
                            <form onSubmit={handleUpload} className="premium-compact-form">
                                <div className="form-row-three">
                                    <CustomSelect
                                        label={isAr ? 'السنة الدراسية' : 'Year'}
                                        options={educationData.years.map(y => ({ value: y.id, label: y.title[currentLang.code] }))}
                                        value={formData.yearId}
                                        onChange={val => setFormData({ ...formData, yearId: val, streamId: '', subjectId: '' })}
                                    />
                                    <CustomSelect
                                        label={isAr ? 'الشعبة' : 'Stream'}
                                        options={selectedYear?.streams.map(s => ({ value: s.id, label: s.title[currentLang.code] })) || []}
                                        value={formData.streamId}
                                        onChange={val => setFormData({ ...formData, streamId: val, subjectId: '' })}
                                    />
                                    <CustomSelect
                                        label={isAr ? 'المادة' : 'Subject'}
                                        options={availableSubjects.map(sub => ({ value: sub.id, label: sub.title[currentLang.code] }))}
                                        value={formData.subjectId}
                                        onChange={val => setFormData({ ...formData, subjectId: val })}
                                    />
                                </div>

                                <div className="form-row-two">
                                    <CustomSelect
                                        label={isAr ? 'التصنيف' : 'Category'}
                                        options={[
                                            { value: 'lessons', label: isAr ? 'دروس' : 'Lessons' },
                                            { value: 'summaries', label: isAr ? 'ملخصات' : 'Summaries' },
                                            { value: 'exams', label: isAr ? 'امتحانات' : 'Exams' }
                                        ]}
                                        value={formData.type}
                                        onChange={val => setFormData({ ...formData, type: val })}
                                    />
                                    <div className="input-field-db">
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder=" "
                                            id="file-title"
                                        />
                                        <label htmlFor="file-title">{isAr ? 'عنوان الملف' : 'File Title'}</label>
                                        <div className="db-input-line"></div>
                                    </div>
                                </div>

                                <div className="file-upload-zone glass">
                                    <input type="file" accept=".pdf" id="pdf-input" className="hidden-file-input" />
                                    <label htmlFor="pdf-input" className="file-label-premium">
                                        <span className="upload-big-icon">📄</span>
                                        <span>{isAr ? 'انقر أو اسحب ملف PDF هنا' : 'Click or drag PDF file here'}</span>
                                    </label>
                                </div>

                                <button type="submit" className="db-primary-btn">
                                    <span>{isAr ? 'نشر المحتوى' : 'Publish Content'}</span>
                                    <i className="btn-glow"></i>
                                </button>
                                {message && <div className="db-success-toast">{message}</div>}
                            </form>
                        </section>
                    )}

                    {activeTab === 'quiz' && <QuizCreationForm />}

                    {activeTab === 'files' && (
                        <section className="files-premium-section">
                            <div className="section-header">
                                <h2>{isAr ? 'إدارة ملفاتي' : 'Manage My Files'}</h2>
                            </div>
                            <div className="db-items-list">
                                {myFiles.length === 0 ? (
                                    <div className="db-empty-state">
                                        <span>📂</span>
                                        <p>{isAr ? 'لم تقم برفع أي ملفات بعد' : 'No files uploaded yet'}</p>
                                    </div>
                                ) : (
                                    myFiles.map(file => (
                                        <div key={file.id} className="db-item-row glass">
                                            <div className="item-main-info">
                                                <div className="item-icon-circle">📄</div>
                                                <div className="item-text">
                                                    <strong>{file.title}</strong>
                                                    <span className="item-sub">{file.subjectId} • {file.type}</span>
                                                </div>
                                            </div>
                                            <div className="item-actions">
                                                <button onClick={() => deleteFile(file.id)} className="db-delete-btn" title="Delete">🗑️</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'announcements' && (
                        <section className="ann-premium-section">
                            <div className="section-header">
                                <h2>{isAr ? 'إدارة الإعلانات' : 'Announcements Management'}</h2>
                            </div>

                            <div className="db-ann-form-card glass">
                                <h3>{isAr ? 'إضافة إعلان جديد' : 'New Announcement'}</h3>
                                <div className="ann-grid-form">
                                    <div className="input-field-db">
                                        <input
                                            type="text"
                                            required
                                            value={annForm.ar}
                                            onChange={e => setAnnForm({ ...annForm, ar: e.target.value })}
                                            placeholder=" "
                                            id="ann-ar"
                                        />
                                        <label htmlFor="ann-ar">{isAr ? 'النص بالعربية' : 'Arabic Text'}</label>
                                        <div className="db-input-line"></div>
                                    </div>
                                    <div className="input-field-db">
                                        <input
                                            type="text"
                                            required
                                            value={annForm.en}
                                            onChange={e => setAnnForm({ ...annForm, en: e.target.value })}
                                            placeholder=" "
                                            id="ann-en"
                                        />
                                        <label htmlFor="ann-en">{isAr ? 'النص بالإنجليزية' : 'English Text'}</label>
                                        <div className="db-input-line"></div>
                                    </div>
                                    <CustomSelect
                                        label={isAr ? 'نوع الإعلان' : 'Type'}
                                        options={[
                                            { value: 'info', label: 'Info (Blue)' },
                                            { value: 'warning', label: 'Warning (Yellow)' },
                                            { value: 'success', label: 'Success (Green)' }
                                        ]}
                                        value={annForm.type}
                                        onChange={val => setAnnForm({ ...annForm, type: val })}
                                    />
                                    <button
                                        className="db-primary-btn"
                                        onClick={() => {
                                            if (!annForm.ar || !annForm.en) return;
                                            addAnnouncement(annForm.ar, annForm.en, annForm.type);
                                            setAnnForm({ ar: '', en: '', type: 'info' });
                                        }}
                                    >
                                        {isAr ? 'نشر الآن' : 'Publish Now'}
                                    </button>
                                </div>
                            </div>

                            <div className="db-items-list mt-2">
                                {announcements.map(ann => (
                                    <div key={ann.id} className={`db-item-row ann-border-${ann.type} glass`}>
                                        <div className="item-main-info">
                                            <div className="item-icon-circle">📢</div>
                                            <div className="item-text">
                                                <strong>{ann.text.ar}</strong>
                                                <span className="item-sub">{ann.text.en}</span>
                                            </div>
                                        </div>
                                        <div className="item-actions">
                                            <button onClick={() => toggleAvailability(ann.id)} className="db-icon-btn">
                                                {ann.active ? '👁️' : '🕶️'}
                                            </button>
                                            <button onClick={() => deleteAnnouncement(ann.id)} className="db-delete-btn">🗑️</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {activeTab === 'settings' && <SettingsForm />}
                </div>
            </main>
        </div>
    );
}
