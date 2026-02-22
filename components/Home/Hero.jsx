import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero() {
    const { currentLang } = useLanguage();

    const content = {
        ar: {
            title: 'بوابتك نحو النجاح',
            subtitle: 'جميع دروس وملخصات وامتحانات التعليم الثانوي في الجزائر',
            cta: 'ابدأ الآن'
        },
        fr: {
            title: 'Votre passerelle vers le succès',
            subtitle: 'Tous les cours, résumés et examens de l\'enseignement secondaire en Algérie',
            cta: 'Commencer'
        },
        en: {
            title: 'Your Gateway to Success',
            subtitle: 'All lessons, summaries, and exams for secondary education in Algeria',
            cta: 'Start Now'
        }
    };

    const text = content[currentLang.code] || content.en;

    const scrollToContent = () => {
        const target = document.querySelector('.content-spacer');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero">
            <div className="container hero-container">
                <h1 className="hero-title">{text.title}</h1>
                <p className="hero-subtitle">{text.subtitle}</p>
                <button className="hero-cta" onClick={scrollToContent}>{text.cta}</button>
            </div>
        </section>
    );
}
