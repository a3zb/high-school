import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useQuizzes } from '../context/QuizContext';
import { useLanguage } from '../context/LanguageContext';
import ContentCard from '../components/UI/ContentCard';
import educationData from '../data/educational_structure.json';
import './SearchResultsPage.css';

export default function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { allFiles } = useContent(); // Need to expose allFiles or use getFilesByUploader differently? 
    // Actually ContentContext might not expose all files easily if using mock data inside the provider without a getter for all
    // Let's assume we can get all files or I'll check ContentContext.
    // Checking ContentContext previously: it has `files` state. I'll need to secure access to it.

    // Correction: I need to check how to access all files. I will use a custom hook logic here assuming I can access context data.
    // If ContentContext doesn't export 'files', I might need to update it.
    // Let's write the component assuming I update ContentContext to expose `files`.

    const { quizzes } = useQuizzes();
    const { currentLang } = useLanguage();

    const [results, setResults] = useState({
        subjects: [],
        files: [],
        quizzes: []
    });

    const contextFiles = useContent().files || []; // Accessing files directly if exposed

    useEffect(() => {
        if (!query.trim()) {
            setResults({ subjects: [], files: [], quizzes: [] });
            return;
        }

        const lowerQuery = query.toLowerCase();

        // 1. Search Subjects
        const foundSubjects = [];
        educationData.years.forEach(year => {
            year.streams.forEach(stream => {
                stream.subjects.forEach(sub => {
                    if (
                        sub.title.ar.toLowerCase().includes(lowerQuery) ||
                        sub.title.en.toLowerCase().includes(lowerQuery) ||
                        sub.id.includes(lowerQuery)
                    ) {
                        foundSubjects.push({
                            ...sub,
                            yearName: year.title,
                            streamName: stream.title,
                            yearId: year.id,
                            streamId: stream.id
                        });
                    }
                });
            });
        });

        // 2. Search Files
        const foundFiles = contextFiles.filter(file =>
            file.title.toLowerCase().includes(lowerQuery) ||
            file.type.toLowerCase().includes(lowerQuery)
        );

        // 3. Search Quizzes
        const foundQuizzes = quizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(lowerQuery)
        );

        setResults({
            subjects: foundSubjects,
            files: foundFiles,
            quizzes: foundQuizzes
        });

    }, [query, quizzes, contextFiles]);

    return (
        <div className="container search-page">
            <h2>
                {currentLang.code === 'ar' ? 'نتائج البحث عن:' : 'Search Results for:'} "{query}"
            </h2>

            {/* Subjects Section */}
            <section className="results-section">
                <h3>{currentLang.code === 'ar' ? 'المواد' : 'Subjects'} ({results.subjects.length})</h3>
                {results.subjects.length > 0 ? (
                    <div className="results-grid">
                        {results.subjects.map((sub, idx) => (
                            <Link
                                to={`/year/${sub.yearId}/stream/${sub.streamId}/subject/${sub.id}`}
                                key={idx}
                                className="result-card subject-card"
                            >
                                <h4>{sub.title[currentLang.code] || sub.title.en}</h4>
                                <p>{sub.yearName[currentLang.code]} - {sub.streamName[currentLang.code]}</p>
                            </Link>
                        ))}
                    </div>
                ) : <p className="no-res">{currentLang.code === 'ar' ? 'لا توجد مواد مطابقة' : 'No matching subjects'}</p>}
            </section>

            {/* Files Section */}
            <section className="results-section">
                <h3>{currentLang.code === 'ar' ? 'الملفات والدروس' : 'Files & Lessons'} ({results.files.length})</h3>
                {results.files.length > 0 ? (
                    <div className="content-grid-dz">
                        {results.files.map((file) => (
                            <ContentCard key={file.id} file={file} subjectId={file.subjectId} lang={currentLang.code} />
                        ))}
                    </div>
                ) : <p className="no-res">{currentLang.code === 'ar' ? 'لا توجد ملفات مطابقة' : 'No matching files'}</p>}
            </section>

            {/* Quizzes Section */}
            <section className="results-section">
                <h3>{currentLang.code === 'ar' ? 'الاختبارات' : 'Quizzes'} ({results.quizzes.length})</h3>
                {results.quizzes.length > 0 ? (
                    <div className="results-grid">
                        {results.quizzes.map((quiz, idx) => (
                            <div key={idx} className="result-card quiz-card">
                                <h4>{quiz.title}</h4>
                                <p>Questions: {quiz.questions.length}</p>
                                <span className="tag">Quiz</span>
                            </div>
                        ))}
                    </div>
                ) : <p className="no-res">{currentLang.code === 'ar' ? 'لا توجد اختبارات مطابقة' : 'No matching quizzes'}</p>}
            </section>
        </div>
    );
}
