import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useQuizzes } from '../context/QuizContext';
import { useFavorites } from '../context/FavoritesContext';
import { useUserStats } from '../context/UserStatsContext';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import CommentSection from '../components/Comments/CommentSection';
import QuizTaker from '../components/Quiz/QuizTaker';
import ContentCard from '../components/UI/ContentCard';
import educationData from '../data/educational_structure.json';
import './SubjectPage.css';

const TABS = [
    { id: 'lessons', ar: 'الدروس', fr: 'Cours', en: 'Lessons' },
    { id: 'summaries', ar: 'ملخصات', fr: 'Résumés', en: 'Summaries' },
    { id: 'exams', ar: 'امتحانات', fr: 'Examens', en: 'Exams' },
    { id: 'solutions', ar: 'حلول', fr: 'Solutions', en: 'Solutions' },
    { id: 'quizzes', ar: 'اختبارات', fr: 'Quiz', en: 'Quizzes' }
];

export default function SubjectPage() {
    const { yearId, streamId, subjectId } = useParams();
    const { currentLang } = useLanguage();
    const { getFilesBySubject } = useContent();
    const { getQuizzesBySubject } = useQuizzes();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [activeTab, setActiveTab] = useState('lessons');

    // Resolve Data
    const year = educationData.years.find(y => y.id === yearId);
    const stream = year?.streams.find(s => s.id === streamId);
    const subject = stream?.subjects?.find(s => s.id === subjectId);

    const { recordLessonView } = useUserStats();

    useEffect(() => {
        if (subject && activeTab !== 'quizzes') {
            recordLessonView(subject.id, `${subject.title[currentLang.code] || subject.title.en} (${activeTab})`);
        }
    }, [activeTab]);

    if (!subject) return <div className="container">Subject not found</div>;

    const renderContent = () => {
        if (activeTab === 'quizzes') {
            const subjectQuizzes = getQuizzesBySubject(subjectId);
            if (subjectQuizzes.length === 0) return <p className="empty-content-msg">{currentLang.code === 'ar' ? 'لا توجد اختبارات' : 'No quizzes available'}</p>;

            return (
                <div className="quiz-list-container">
                    {subjectQuizzes.map(quiz => (
                        <div key={quiz.id} className="content-item quiz-item">
                            <div className="item-meta">
                                <h4>{quiz.title}</h4>
                                <button
                                    className={`fav-btn ${isFavorite(quiz.id) ? 'active' : ''}`}
                                    onClick={() => toggleFavorite({
                                        id: quiz.id,
                                        title: quiz.title,
                                        type: 'Quiz',
                                        path: window.location.pathname
                                    })}
                                >
                                    {isFavorite(quiz.id) ? '⭐' : '☆'}
                                </button>
                            </div>
                            <QuizTaker quiz={quiz} />
                        </div>
                    ))}
                </div>
            );
        }

        // Default File Content
        const files = getFilesBySubject(subjectId, activeTab);
        if (files.length === 0) return <p className="empty-content-msg">{currentLang.code === 'ar' ? 'لا يوجد محتوى' : 'No content available'}</p>;

        const groupedFiles = {};
        if (activeTab === 'exams') {
            files.forEach(f => {
                const term = f.term || 'general';
                if (!groupedFiles[term]) groupedFiles[term] = [];
                groupedFiles[term].push(f);
            });
        }

        const getTermName = (term) => {
            if (term === '1') return currentLang.code === 'ar' ? 'الفصل الأول' : 'First Term';
            if (term === '2') return currentLang.code === 'ar' ? 'الفصل الثاني' : 'Second Term';
            if (term === '3') return currentLang.code === 'ar' ? 'الفصل الثالث' : 'Third Term';
            return currentLang.code === 'ar' ? 'عام' : 'General';
        };

        if (activeTab === 'exams') {
            return (
                <div className="terms-container">
                    {Object.keys(groupedFiles).sort().map(term => (
                        <div key={term} className="term-section">
                            <h3 className="term-title">{getTermName(term)}</h3>
                            <div className="content-grid-dz">
                                {groupedFiles[term].map(file => (
                                    <ContentCard key={file.id} file={file} subjectId={subjectId} lang={currentLang.code} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="content-grid-dz">
                {files.map(file => (
                    <ContentCard key={file.id} file={file} subjectId={subjectId} lang={currentLang.code} />
                ))}
            </div>
        );
    };

    return (
        <div className="page-container subject-page">
            <Breadcrumbs />
            <div className="container">

                <header className="subject-header">
                    <div className="subject-icon-large">📚</div>
                    <div>
                        <h1 className="subject-title-large">{subject.title[currentLang.code] || subject.title.en}</h1>
                        <p className="subject-meta">
                            {stream.title[currentLang.code] || stream.title.en} - {year.title[currentLang.code] || year.title.en}
                        </p>
                    </div>
                </header>

                <div className="tabs-container">
                    <div className="tabs-list">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab[currentLang.code] || tab.en}
                            </button>
                        ))}
                    </div>

                    <div className="tab-content">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
}
