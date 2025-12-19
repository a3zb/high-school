import { useUserStats } from '../context/UserStatsContext';
import { useLanguage } from '../context/LanguageContext';
import './LeaderboardPage.css';

export default function LeaderboardPage() {
    const { stats } = useUserStats();
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    // Mock Top Users
    const mockUsers = [
        { name: isAr ? 'أنت' : 'You', xp: stats.xp, level: stats.level, isMe: true, icon: '👑' },
        { name: 'Ahmed', xp: 2450, level: 25, icon: '🥇' },
        { name: 'Sarah', xp: 1820, level: 19, icon: '🥈' },
        { name: 'Amine', xp: 1540, level: 16, icon: '🥉' },
        { name: 'Mustapha', xp: 1200, level: 12, icon: '👤' },
        { name: 'Lyna', xp: 950, level: 10, icon: '👤' },
        { name: 'Yacine', xp: 820, level: 9, icon: '👤' },
        { name: 'Meriem', xp: 750, level: 8, icon: '👤' },
        { name: 'Karim', xp: 600, level: 7, icon: '👤' },
        { name: 'Fatima', xp: 550, level: 6, icon: '👤' },
    ].sort((a, b) => b.xp - a.xp);

    const topThree = [mockUsers[1], mockUsers[0], mockUsers[2]]; // Mocking positions: 2nd, 1st, 3rd

    return (
        <div className="container leaderboard-page">
            <header className="leaderboard-hero">
                <h1>{isAr ? 'لوحة الشرف العالمية' : 'Global Wall of Fame'}</h1>
                <p>{isAr ? 'الطلاب الأكثر تميزاً ونشاطاً في المنصة' : 'The most distinguished and active students on the platform'}</p>
            </header>

            <div className="podium-container">
                <div className="podium-item second">
                    <div className="podium-avatar">🥈</div>
                    <div className="podium-pillar rank-2">
                        <span>{topThree[0].name}</span>
                        <span>{topThree[0].xp}</span>
                    </div>
                </div>
                <div className="podium-item first">
                    <div className="podium-avatar">🥇</div>
                    <div className="podium-pillar rank-1">
                        <span>{topThree[1].name}</span>
                        <span>{topThree[1].xp}</span>
                    </div>
                </div>
                <div className="podium-item third">
                    <div className="podium-avatar">🥉</div>
                    <div className="podium-pillar rank-3">
                        <span>{topThree[2].name}</span>
                        <span>{topThree[2].xp}</span>
                    </div>
                </div>
            </div>

            <div className="leaderboard-list-premium">
                {mockUsers.map((user, idx) => (
                    <div key={idx} className={`leaderboard-row-premium ${user.isMe ? 'is-me' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                        <span className="rank-num">#{idx + 1}</span>
                        <div className="user-info-wrap">
                            <span className="user-name">{user.name}</span>
                        </div>
                        <span className="user-level">Lvl {user.level}</span>
                        <span className="user-xp">{user.xp} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
