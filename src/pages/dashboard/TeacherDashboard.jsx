import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAnnouncements } from '../../context/AnnouncementContext';
import educationData from '../../data/educational_structure.json';
import { ROLES, canEditContent } from '../../utils/permissions';
import QuizCreationForm from '../../components/Quiz/QuizCreationForm';
import SettingsForm from '../../components/Smart/SettingsForm';
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

    return (
        <div className="dashboard-container container">
            <h1 className="dashboard-title">
                {currentLang.code === 'ar' ? 'لوحة تحكم الأستاذ' : 'Teacher Dashboard'}
            </h1>

            <div className="dashboard-tabs">
                {isModerator && <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>}
                <button className={activeTab === 'upload' ? 'active' : ''} onClick={() => setActiveTab('upload')}>Upload Content</button>
                <button className={activeTab === 'quiz' ? 'active' : ''} onClick={() => setActiveTab('quiz')}>Create Quiz</button>
                <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>My Files</button>
                <button className={activeTab === 'files' ? 'active' : ''} onClick={() => setActiveTab('files')}>My Files</button>
                {isModerator && (
                    <>
                        <button className={activeTab === 'announcements' ? 'active' : ''} onClick={() => setActiveTab('announcements')}>Announcements</button>
                        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Site Settings</button>
                    </>
                )}
            </div>

            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="overview-grid">
                        <div className="dashboard-card action-card" onClick={() => setActiveTab('announcements')}>
                            <div className="card-icon">📢</div>
                            <h3>Announcements</h3>
                            <p>Publish news and alerts to all students.</p>
                        </div>
                        <div className="dashboard-card action-card" onClick={() => setActiveTab('settings')}>
                            <div className="card-icon">⚙️</div>
                            <h3>Site Settings</h3>
                            <p>Manage countdown, social links, and more.</p>
                        </div>
                        <div className="dashboard-card action-card" onClick={() => setActiveTab('upload')}>
                            <div className="card-icon">📚</div>
                            <h3>Upload Content</h3>
                            <p>Add lessons, summaries, and exams.</p>
                        </div>
                        <div className="dashboard-card action-card" onClick={() => setActiveTab('quiz')}>
                            <div className="card-icon">📝</div>
                            <h3>Create Quiz</h3>
                            <p>Build and publish new quizzes.</p>
                        </div>
                        <div className="dashboard-card action-card" onClick={() => setActiveTab('files')}>
                            <div className="card-icon">📂</div>
                            <h3>Manage Files</h3>
                            <p>View and delete your uploaded content.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    /* Upload Section */
                    <section className="dashboard-card upload-section">
                        <h2>{currentLang.code === 'ar' ? 'رفع محتوى جديد' : 'Upload New Content'}</h2>
                        <form onSubmit={handleUpload} className="upload-form">
                            <div className="form-group">
                                <label>Year</label>
                                <select
                                    value={formData.yearId}
                                    onChange={e => setFormData({ ...formData, yearId: e.target.value, streamId: '', subjectId: '' })}
                                >
                                    <option value="">Select Year</option>
                                    {educationData.years.map(y => (
                                        <option key={y.id} value={y.id}>{y.title[currentLang.code] || y.title.en}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Stream</label>
                                <select
                                    value={formData.streamId}
                                    disabled={!formData.yearId}
                                    onChange={e => setFormData({ ...formData, streamId: e.target.value, subjectId: '' })}
                                >
                                    <option value="">Select Stream</option>
                                    {selectedYear?.streams.map(s => (
                                        <option key={s.id} value={s.id}>{s.title[currentLang.code] || s.title.en}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <select
                                    value={formData.subjectId}
                                    disabled={!formData.streamId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="">Select Subject</option>
                                    {availableSubjects.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.title[currentLang.code] || sub.title.en}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="lessons">Lessons</option>
                                    <option value="summaries">Summaries</option>
                                    <option value="exams">Exams</option>
                                    <option value="solutions">Solutions</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Algebra Chapter 1"
                                />
                            </div>

                            <div className="form-group">
                                <label>File (PDF)</label>
                                <input type="file" accept=".pdf" />
                            </div>

                            <button type="submit" className="upload-btn">Upload</button>
                            {message && <p className="success-msg">{message}</p>}
                        </form>
                    </section>
                )}

                {activeTab === 'quiz' && (
                    <QuizCreationForm />
                )}

                {activeTab === 'files' && (
                    /* My Files Section */
                    <section className="dashboard-card files-section">
                        <h2>{currentLang.code === 'ar' ? 'ملفاتي' : 'My Uploads'}</h2>
                        <div className="files-list">
                            {myFiles.length === 0 ? <p className="empty-msg">No files uploaded yet</p> :
                                myFiles.map(file => (
                                    <div key={file.id} className="file-item-row">
                                        <div className="file-info">
                                            <strong>{file.title}</strong>
                                            <span className="file-meta">{file.subjectId} • {file.yearId} • {file.type}</span>
                                        </div>
                                        <button onClick={() => deleteFile(file.id)} className="delete-btn">🗑️</button>
                                    </div>
                                ))
                            }
                        </div>
                    </section>
                )}

                {activeTab === 'announcements' && (
                    <section className="dashboard-card ann-section">
                        <h2>Manage Announcements</h2>

                        <div className="ann-form-container" style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--color-background)', borderRadius: '8px' }}>
                            <h4>Add New Announcement</h4>
                            <div className="form-group">
                                <label>Arabic Text</label>
                                <input
                                    type="text"
                                    value={annForm.ar}
                                    onChange={e => setAnnForm({ ...annForm, ar: e.target.value })}
                                    placeholder="النص بالعربية"
                                />
                            </div>
                            <div className="form-group">
                                <label>English Text</label>
                                <input
                                    type="text"
                                    value={annForm.en}
                                    onChange={e => setAnnForm({ ...annForm, en: e.target.value })}
                                    placeholder="Text in English"
                                />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select value={annForm.type} onChange={e => setAnnForm({ ...annForm, type: e.target.value })}>
                                    <option value="info">Info (Blue)</option>
                                    <option value="warning">Warning (Yellow)</option>
                                    <option value="success">Success (Green)</option>
                                </select>
                            </div>
                            <button
                                className="upload-btn"
                                onClick={() => {
                                    if (!annForm.ar || !annForm.en) return;
                                    addAnnouncement(annForm.ar, annForm.en, annForm.type);
                                    setAnnForm({ ar: '', en: '', type: 'info' });
                                }}
                            >
                                Publish Announcement
                            </button>
                        </div>

                        <div className="ann-list">
                            {announcements.map(ann => (
                                <div key={ann.id} className="file-item-row" style={{ borderLeft: `4px solid ${ann.type === 'info' ? '#3b82f6' : ann.type === 'warning' ? '#f59e0b' : '#10b981'}` }}>
                                    <div className="file-info">
                                        <strong>{ann.text.ar}</strong>
                                        <div style={{ fontSize: '0.85rem', color: 'gray' }}>{ann.text.en}</div>
                                        <div style={{ fontSize: '0.8rem' }}>Status: {ann.active ? 'Active' : 'Hidden'}</div>
                                    </div>
                                    <div className="actions">
                                        <button onClick={() => toggleAvailability(ann.id)} className="toggle-btn" style={{ marginRight: '5px' }}>
                                            {ann.active ? 'Hide' : 'Show'}
                                        </button>
                                        <button onClick={() => deleteAnnouncement(ann.id)} className="delete-btn">🗑️</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'settings' && (
                    <SettingsForm />
                )}
            </div>
        </div>
    );
}
