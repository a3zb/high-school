import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import educationData from '../data/educational_structure.json';
import './StreamPage.css';

export default function StreamPage() {
    const { yearId, streamId } = useParams();
    const { currentLang } = useLanguage();

    // Find data
    const year = educationData.years.find(y => y.id === yearId);
    const stream = year?.streams.find(s => s.id === streamId);

    if (!stream) return <div className="container">Stream not found</div>;

    return (
        <div className="page-container stream-page">
            <Breadcrumbs />
            <div className="container">
                <h1 className="page-title">{stream.title[currentLang.code] || stream.title.en}</h1>
                <p className="page-subtitle">
                    {currentLang.code === 'ar' ? 'المواد الدراسية' : 'Subjects'}
                </p>

                <div className="subjects-grid">
                    {stream.subjects?.map((subject) => (
                        <Link
                            to={`/year/${yearId}/stream/${streamId}/subject/${subject.id}`}
                            key={subject.id}
                            className="subject-card"
                        >
                            <div className="subject-icon">📚</div>
                            <h3 className="subject-title">
                                {subject.title[currentLang.code] || subject.title.en}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
