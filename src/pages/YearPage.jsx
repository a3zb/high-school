import { useParams, Link } from 'react-router-dom';
import StreamList from '../components/Home/StreamList';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import { useLanguage } from '../context/LanguageContext';

export default function YearPage() {
    const { yearId } = useParams();
    const { currentLang } = useLanguage();
    const isAr = currentLang.code === 'ar';

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <StreamList selectedYearId={yearId} />

            </div>
        </div>
    );
}
