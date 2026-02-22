import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import educationData from '../../data/educational_structure.json';
import './StreamList.css';

export default function StreamList({ selectedYearId }) {
    const { currentLang } = useLanguage();

    if (!selectedYearId) return null;

    const selectedYear = educationData.years.find(y => y.id === selectedYearId);
    if (!selectedYear) return null;

    return (
        <section className="stream-list">
            <div className="container">
                <h3 className="section-subtitle">
                    {currentLang.code === 'ar' ? 'الشعب المتاحة' :
                        currentLang.code === 'fr' ? 'Filières disponibles' :
                            'Available Streams'}
                </h3>
                <div className="streams-grid">
                    {selectedYear.streams.map((stream) => (
                        <Link
                            to={`/year/${selectedYearId}/stream/${stream.id}`}
                            key={stream.id}
                            className="stream-card"
                        >
                            <span className="stream-icon">🎓</span>
                            <span className="stream-title">
                                {stream.title[currentLang.code] || stream.title.en}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
