import { useUserStats } from '../context/UserStatsContext';
import { useLanguage } from '../context/LanguageContext';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
    const { stats } = useUserStats();
    const { currentLang } = useLanguage();

    const isAr = currentLang.code === 'ar';

    // Calculate daily progress (simplified)
    const today = new Date().toDateString();
    const actionsToday = stats.history.filter(h => new Date(h.date).toDateString() === today).length;

    // Group by category for charts
    const quizCount = stats.history.filter(h => h.type === 'Quiz').length;
    const lessonCount = stats.history.filter(h => h.type === 'Lesson').length;


    return (
        <div className="container analytics-page">
            <header className="analytics-hero">
                <h1>{isAr ? 'مركز التحليلات الذكي' : 'Smart Analytics Center'}</h1>
                <div className="overall-stats-premium">
                    <div className="stat-pill-premium">
                        <span className="label">{isAr ? 'المستوى الحلي' : 'Current Level'}</span>
                        <span className="value">{stats.level}</span>
                    </div>
                    <div className="stat-pill-premium">
                        <span className="label">{isAr ? 'إجمالي الخبرة' : 'Total XP'}</span>
                        <span className="value">{stats.xp}</span>
                    </div>
                </div>
            </header>

            <div className="analytics-grid">
                {/* Daily Goal Card */}
                <div className="analytics-card-premium glass-card">
                    <h3><span>🎯</span> {isAr ? 'هدف اليوم' : 'Daily Goal'}</h3>
                    <div className="goal-viz-container">
                        <div className="circular-prog-premium" style={{ '--progress': `${Math.min((actionsToday / 5) * 100, 100)}%` }}>
                            <div className="prog-center-text">
                                <span className="prog-current">{actionsToday}</span>
                                <span className="prog-target">/ 5</span>
                            </div>
                        </div>
                        <p>{isAr ? 'حافظ على استمرارية تعلمك اليومية!' : 'Keep your daily learning streak alive!'}</p>
                    </div>
                </div>

                {/* Distribution Card */}
                <div className="analytics-card-premium glass-card">
                    <h3><span>📊</span> {isAr ? 'توزيع المجهود' : 'Effort Distribution'}</h3>
                    <div className="premium-bar-grid">
                        <div className="effort-row">
                            <div className="effort-row-meta">
                                <span>{isAr ? 'الدروس' : 'Lessons'}</span>
                                <span>{lessonCount}</span>
                            </div>
                            <div className="effort-bar-bg">
                                <div className="effort-bar-fill" style={{ width: `${(lessonCount / (stats.history.length || 1)) * 100}%` }}></div>
                            </div>
                        </div>
                        <div className="effort-row">
                            <div className="effort-row-meta">
                                <span>{isAr ? 'الاختبارات' : 'Quizzes'}</span>
                                <span>{quizCount}</span>
                            </div>
                            <div className="effort-bar-bg">
                                <div className="effort-bar-fill" style={{ width: `${(quizCount / (stats.history.length || 1)) * 100}%`, background: 'var(--color-secondary)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="analytics-card-premium glass-card">
                    <h3><span>⏳</span> {isAr ? 'آخر النشاطات' : 'Recent Activity'}</h3>
                    <div className="activity-list-premium">
                        {stats.history.length > 0 ? stats.history.slice(0, 5).map((h, i) => (
                            <div key={i} className="activity-card-mini">
                                <span className={`type-indicator ${h.type.toLowerCase()}`}></span>
                                <div className="act-info">
                                    <strong>{h.title}</strong>
                                    <span>{new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span className="act-xp-badge">+{h.xp} XP</span>
                            </div>
                        )) : <p className="empty-msg">{isAr ? 'ابدأ رحلتك الآن' : 'Start your journey now'}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
