import { useLanguage } from '../context/LanguageContext';
import './AboutPage.css';

export default function AboutPage() {
    const { currentLang } = useLanguage();
    const lang = currentLang.code;

    const t = (ar, fr, en) => {
        if (lang === 'ar') return ar;
        if (lang === 'fr') return fr;
        return en;
    };

    const features = [
        {
            title: t('محتوى شامل', 'Contenu Exhaustif', 'Comprehensive Content'),
            desc: t('آلاف الدروس والملخصات المنظمة حسب المنهاج الوزاري.', 'Des milliers de cours et résumés organisés selon le programme ministériel.', 'Thousands of lessons and summaries organized by ministerial curriculum.'),
            icon: '📚',
            color: '#3b82f6'
        },
        {
            title: t('اختبارات تفاعلية', 'Quiz Interactifs', 'Interactive Quizzes'),
            desc: t('قيم مستواك فوراً مع نظام اختبارات ذكي وتصحيح تلقائي.', 'Évaluez votre niveau immédiatement avec un système de quiz intelligent.', 'Assess your level immediately with a smart quiz system and auto-grading.'),
            icon: '📝',
            color: '#10b981'
        },
        {
            title: t('نظام التحفيز', 'Système de Motivation', 'Gamification System'),
            desc: t('احصل على XP وارفع مستواك مع كل درس تدرسه أو اختبار تخوضه.', 'Gagnez des XP et montez en niveau avec chaque leçon ou quiz.', 'Get XP and level up with every lesson you study or quiz you take.'),
            icon: '🏆',
            color: '#f59e0b'
        },
        {
            title: t('مخطط الدراسة', 'Planificateur d\'Études', 'Study Planner'),
            desc: t('نظم وقتك وحدد أولوياتك لتصل إلى أهدافك الدراسية.', 'Organisez votre temps et fixez vos priorités pour réussir.', 'Organize your time and set your priorities to reach your study goals.'),
            icon: '📅',
            color: '#8b5cf6'
        }
    ];

    return (
        <div className="about-page">
            <header className="about-hero">
                <div className="container">
                    <h1 className="about-title glass-text">
                        {t('عن منصة أثــر', 'À propos d\'Athar', 'About Athar Platform')}
                    </h1>
                    <p className="about-subtitle">
                        {t('رفيقك الدائم في رحلة التفوق والنجاح الدراسي', 'Votre compagnon constant dans le voyage de l\'excellence académique', 'Your constant companion on the journey of academic excellence')}
                    </p>
                </div>
            </header>

            <section className="about-content container">
                <div className="about-grid">
                    <div className="main-info-card glass-card">
                        <h2>{t('رسالتنا', 'Notre Mission', 'Our Mission')}</h2>
                        <p>
                            {t(
                                'هذه المنصة هي جهد متواضع وعمل أُسس "في سبيل الله" لتعم الفائدة ويجد كل طالب جزائري ما يحتاجه للتفوق مجاناً وبأعلى جودة ممكنة.',
                                'Cette plateforme est un effort humble établi "pour l\'amour d\'Allah" afin que chaque étudiant algérien trouve gratuitement ce dont il a besoin pour exceller.',
                                'This platform is a humble effort established "for the sake of Allah" so that every Algerian student finds what they need for excellence for free.'
                            )}
                        </p>
                    </div>

                    <div className="special-link-card glass-card">
                        <div className="special-link-content">
                            <span className="special-icon">✨</span>
                            <div className="text">
                                <h3>{t('موقع أثــر الديني', 'Plateforme Religieuse Athar', 'Athar Religious Platform')}</h3>
                                <p>{t('نُـورٌ يَهـدِي وأثَـرٌ يَبقَـى.', 'Une lumière qui guide et une trace qui reste.', 'A light that guides and a trace that remains.')}</p>
                            </div>
                            <a href="https://athar-tau.vercel.app/" target="_blank" rel="noopener noreferrer" className="visit-btn">
                                {t('زيارة الموقع', 'Visiter le site', 'Visit Website')}
                            </a>
                        </div>
                    </div>

                    <div className="features-section">
                        <h2>{t('ماذا نقدم؟', 'Ce que nous offrons', 'What We Offer?')}</h2>
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
