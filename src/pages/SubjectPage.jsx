import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { useQuizzes } from '../context/QuizContext';
import Breadcrumbs from '../components/UI/Breadcrumbs';
import CommentSection from '../components/Comments/CommentSection';
import QuizTaker from '../components/Quiz/QuizTaker';
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
    const [activeTab, setActiveTab] = useState('lessons');

    // Resolve Data
    const year = educationData.years.find(y => y.id === yearId);
    const stream = year?.streams.find(s => s.id === streamId);
    const subject = stream?.subjects?.find(s => s.id === subjectId);

    if (!subject) return <div className="container">Subject not found</div>;

    const renderContent = () => {
        if (activeTab === 'quizzes') {
            const quizzes = getQuizzesBySubject(subjectId);
            if (quizzes.length === 0) return <p className="empty-content-msg">{currentLang.code === 'ar' ? 'لا توجد اختبارات' : 'No quizzes available'}</p>;

            return (
                <div className="quiz-list-container">
                    {quizzes.map(quiz => (
                        <div key={quiz.id} className="quiz-wrapper" style={{ marginBottom: '2rem' }}>
                            <QuizTaker quiz={quiz} />
                        </div>
                    ))}
                </div>
            );
        }

        // Default File Content
        const files = getFilesBySubject(subjectId, activeTab);
        if (files.length === 0) return <p className="empty-content-msg">{currentLang.code === 'ar' ? 'لا يوجد محتوى' : 'No content available'}</p>;

        return (
            <ul className="content-list">
                {files.map(file => (
                    <ContentItem key={file.id} file={file} subjectId={subjectId} lang={currentLang.code} />
                ))}
            </ul>
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

function ContentItem({ file, subjectId, lang }) {
    const [showComments, setShowComments] = useState(false);

    return (
        <li className="content-item-wrapper">
            <div className="content-main-row">
                <div className="content-info">
                    <span className="file-icon">📄</span>
                    <span className="file-title">{file.title}</span>
                    <span className="file-date">{file.date}</span>
                </div>
                <div className="content-actions">
                    <a href={file.url} className="download-btn" title="Download">⬇</a>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`toggle-comments-btn ${showComments ? 'active' : ''}`}
                        title="Comments"
                    >
                        💬
                    </button>
                </div>
            </div>

            {showComments && (
                <CommentSection contentId={file.id} subjectId={subjectId} />
            )}
        </li>
    );
}
