import { useLanguage } from '../../context/LanguageContext';
import educationData from '../../data/educational_structure.json';
import './YearSelector.css';

export default function YearSelector({ selectedYear, onSelectYear }) {
    const { currentLang } = useLanguage();

    return (
        <section className="year-selector">
            <div className="container">
                <h2 className="section-title">
                    {currentLang.code === 'ar' ? 'اختر السنة الدراسية' :
                        currentLang.code === 'fr' ? 'Choisissez l\'année scolaire' :
                            'Choose Academic Year'}
                </h2>
                <div className="years-grid">
                    {educationData.years.map((year) => (
                        <button
                            key={year.id}
                            className={`year-card ${selectedYear === year.id ? 'active' : ''}`}
                            onClick={() => onSelectYear(year.id)}
                        >
                            <span className="year-title">
                                {year.title[currentLang.code] || year.title.en}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
