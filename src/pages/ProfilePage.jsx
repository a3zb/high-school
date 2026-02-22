import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../context/UserStatsContext';
import { useLanguage } from '../context/LanguageContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const { stats } = useUserStats();
    const { isAr } = useLanguage();

    const [name, setName] = useState(user?.name || '');
    const [isEditing, setIsEditing] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid), { name });
            setMsg({ type: 'success', text: isAr ? 'تم تحديث الاسم بنجاح' : 'Name updated successfully' });
            setIsEditing(false);
            // Ideally update local user context too, but AuthContext fetches on refresh
            // We can force reload or update context methods
        } catch (error) {
            console.error("Error updating profile:", error);
            setMsg({ type: 'error', text: isAr ? 'حدث خطأ' : 'Error occured' });
        }
    };

    if (!user) return <div className="container" style={{ padding: '2rem' }}>Please log in.</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', color: 'white', fontWeight: 'bold'
                    }}>
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        {isEditing ? (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}
                                />
                                <button onClick={handleSave} className="btn-save" style={{ background: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none' }}>✓</button>
                                <button onClick={() => setIsEditing(false)} style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none' }}>✗</button>
                            </div>
                        ) : (
                            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {name}
                                <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }}>✎</button>
                            </h2>
                        )}
                        <p style={{ opacity: 0.7 }}>{user.email}</p>
                        <span className={`badge badge-${user.role}`} style={{ marginTop: '0.5rem', display: 'inline-block', padding: '0.2rem 0.6rem', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', borderRadius: '1rem', fontSize: '0.8rem' }}>
                            {user.role}
                        </span>
                    </div>
                </div>

                {msg && <div style={{ marginBottom: '1rem', color: msg.type === 'success' ? '#10b981' : '#ef4444' }}>{msg.text}</div>}

                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="stat-card glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.xp}</div>
                        <div style={{ opacity: 0.7 }}>XP</div>
                    </div>
                    <div className="stat-card glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.level}</div>
                        <div style={{ opacity: 0.7 }}>Level</div>
                    </div>
                    <div className="stat-card glass" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.quizzesCompleted}</div>
                        <div style={{ opacity: 0.7 }}>Quizzes</div>
                    </div>
                </div>

                <h3>{isAr ? 'سجل النشاط' : 'Activity History'}</h3>
                <div className="history-list" style={{ marginTop: '1rem' }}>
                    {stats.history?.length > 0 ? (
                        stats.history.map((item, i) => (
                            <div key={i} style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.title}</span>
                                <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>+{item.xp} XP • {new Date(item.date).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p style={{ opacity: 0.5 }}>No activity yet.</p>
                    )}
                </div>

                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                    <button onClick={logout} style={{ background: '#ef4444', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', fontWeight: 'bold', width: '100%' }}>
                        {isAr ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                </div>
            </div>
        </div>
    );
}
