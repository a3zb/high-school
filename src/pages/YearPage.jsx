import { useParams } from 'react-router-dom';
import StreamList from '../components/Home/StreamList';
import Breadcrumbs from '../components/UI/Breadcrumbs';

export default function YearPage() {
    const { yearId } = useParams();

    return (
        <div className="page-container">
            <Breadcrumbs />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <StreamList selectedYearId={yearId} />
            </div>
        </div>
    );
}
