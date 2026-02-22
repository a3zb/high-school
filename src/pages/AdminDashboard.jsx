import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import eduStructure from '../data/educational_structure.json';

export default function AdminDashboard() {
    const { user } = useAuth();
    const { t, isAr } = useLanguage();

    const [formData, setFormData] = useState({
        yearId: '3as',
        streamId: 'science',
        subjectId: 'math',
        termId: '1',
        title: '',
        type: 'lesson', // lesson, exercise, exam
        url: '', // Changed from link to url
        isFree: true
    });

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);

    // Dynamic Lists based on selection
    const years = eduStructure.years;
    const selectedYear = years.find(y => y.id === formData.yearId);
    const streams = selectedYear ? selectedYear.streams : [];
    const selectedStream = streams.find(s => s.id === formData.streamId);
    const subjects = selectedStream ? selectedStream.subjects : [];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            await addDoc(collection(db, 'resources'), {
                ...formData,
                createdAt: serverTimestamp(),
                createdBy: user.uid
            });
            setMsg({ type: 'success', text: 'Resource added successfully!' });
            setFormData(prev => ({ ...prev, title: '', url: '' })); // Reset fields
        } catch (error) {
            console.error("Error adding resource: ", error);
            setMsg({ type: 'error', text: 'Failed to add resource. Check console.' });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
        return <div className="container" style={{ padding: '2rem' }}>Access Denied</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                    🎛️ Admin Dashboard - Add Resource
                </h2>

                {msg && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '0.5rem',
                        background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: msg.type === 'success' ? '#10b981' : '#ef4444',
                        border: `1px solid ${msg.type === 'success' ? '#10b981' : '#ef4444'}`
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Year</label>
                            <select
                                name="yearId"
                                value={formData.yearId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            >
                                {years.map(y => <option key={y.id} value={y.id}>{isAr ? y.title.ar : y.title.en}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Stream</label>
                            <select
                                name="streamId"
                                value={formData.streamId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            >
                                {streams.map(s => <option key={s.id} value={s.id}>{isAr ? s.title.ar : s.title.en}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subject</label>
                            <select
                                name="subjectId"
                                value={formData.subjectId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            >
                                {subjects.map(s => <option key={s.id} value={s.id}>{isAr ? s.title.ar : s.title.en}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Term</label>
                            <select
                                name="termId"
                                value={formData.termId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                            >
                                <option value="1">Term 1</option>
                                <option value="2">Term 2</option>
                                <option value="3">Term 3</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Ex: Calculus Chapter sheet..."
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Resource Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                        >
                            <option value="lesson">Lessons (الدروس)</option>
                            <option value="exercise">Exercises (التمارين)</option>
                            <option value="exam">Exams (الامتحانات)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Download URL / File Link</label>
                        <input
                            type="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            placeholder="https://..."
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                        />
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'var(--color-secondary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontWeight: 'bold',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Saving...' : 'Add Resource'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
