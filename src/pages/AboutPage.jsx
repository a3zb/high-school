import { useLanguage } from '../context/LanguageContext';
import './AboutPage.css';

export default function AboutPage() {
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    const features = [
        {
            title: isAr ? 'محتوى شامل' : 'Comprehensive Content',
            desc: isAr ? 'آلاف الدروس والملخصات المنظمة حسب المنهاج الوزاري.' : 'Thousands of lessons and summaries organized by ministerial curriculum.',
            icon: '📚',
            color: '#3b82f6'
        },
        {
            title: isAr ? 'اختبارات تفاعلية' : 'Interactive Quizzes',
            desc: isAr ? 'قيم مستواك فوراً مع نظام اختبارات ذكي وتصحيح تلقائي.' : 'Assess your level immediately with a smart quiz system and auto-grading.',
            icon: '📝',
            color: '#10b981'
        },
        {
            title: isAr ? 'نظام التحفيز' : 'Gamification System',
            desc: isAr ? 'احصل على XP وارفع مستواك مع كل درس تدرسه أو اختبار تخوضه.' : 'Get XP and level up with every lesson you study or quiz you take.',
            icon: '🏆',
            color: '#f59e0b'
        },
        {
            title: isAr ? 'مخطط الدراسة' : 'Study Planner',
            desc: isAr ? 'نظم وقتك وحدد أولوياتك لتصل إلى أهدافك الدراسية.' : 'Organize your time and set your priorities to reach your study goals.',
            icon: '📅',
            color: '#8b5cf6'
        }
    ];

    return (
        <div className="about-page">
            <header className="about-hero">
                <div className="container">
                    <h1 className="about-title glass-text">
                        {isAr ? 'عن منصة نجاح' : 'About Success Platform'}
                    </h1>
                    <p className="about-subtitle">
                        {isAr ? 'رفيقك الدائم في رحلة التفوق والنجاح الدراسي' : 'Your constant companion on the journey of excellence and academic success'}
                    </p>
                </div>
            </header>

            <section className="about-content container">
                <div className="about-grid">
                    <div className="main-info-card glass-card">
                        <h2>{isAr ? 'رسالتنا' : 'Our Mission'}</h2>
                        <p>
                            {isAr
                                ? 'نهدف إلى تبسيط العملية التعليمية وتوفير موارد عالية الجودة لكل طالب جزائري، من خلال تجربة رقمية فريدة ومحفزة تساعدك على تحقيق أفضل النتائج في البكالوريا وما قبلها.'
                                : 'We aim to simplify the educational process and provide high-quality resources to every Algerian student, through a unique and stimulating digital experience that helps you achieve the best results in the Baccalaureate and beyond.'}
                        </p>
                    </div>

                    <div className="features-section">
                        <h2>{isAr ? 'ماذا نقدم؟' : 'What We Offer?'}</h2>
                        <div className="features-grid">
                            {features.map((f, i) => (
                                <div key={i} className="feature-card-premium glass-card" style={{ '--accent-color': f.color }}>
                                    <span className="feature-icon-large">{f.icon}</span>
                                    <h3>{f.title}</h3>
                                    <p>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
