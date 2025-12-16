import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import AnnouncementBar from './components/Smart/AnnouncementBar';
import Hero from './components/Home/Hero';
import YearSelector from './components/Home/YearSelector';
import StreamList from './components/Home/StreamList'; // We might only use this inside YearPage now if we refactor, but kept for Home
import YearPage from './pages/YearPage';
import StreamPage from './pages/StreamPage';
import SubjectPage from './pages/SubjectPage';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { CommentProvider } from './context/CommentContext';
import { QuizProvider } from './context/QuizContext';
import { SettingsProvider } from './context/SettingsContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import CalculatorPage from './pages/CalculatorPage';
import LoginPage from './pages/LoginPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import './index.css';

// Home Component that combines Hero + Selector
function HomePage() {
    const [selectedYear, setSelectedYear] = useState(null);

    // Note: On the homepage, maybe we just show the selector?
    // Or we keep the behavior: click year -> show streams underneath.
    // BUT the user request asked for separate pages for "1st Year", "2nd Year".
    // So the homepage Year Selector should probably NAVIGATE to /year/:id.

    // Let's wrapping the navigation logic in the YearSelector or pass a handler that navigates.
    // Actually, let's update YearSelector to use Links or handle navigation.
    // To keep it clean, I'll update YearSelector to accept a 'onSelect' that navigates, 
    // OR I will just refactor YearSelector in place. 
    // Since I shouldn't change the interface too much, I'll make a small wrapper here.

    // Actually, better UX: The HomePage has the Years. Clicking one goes to /year/1as.
    // The StreamList component below it on Home is redundant if we have a YearPage.
    // I will Keep the HomePage simple: Hero + Year Grid.

    // Wait, I need to pass a navigation handler to YearSelector?
    // No, I can make YearSelector use Links if I edit it.
    // But strictly I should pass the logic down.
    // For now, let's just make the HomePage Render the YearSelector, and we'll refactor YearSelector to Link.

    return (
        <>
            <Hero />
            <div className="content-spacer">
                <YearWrapper />
            </div>
        </>
    );
}

// Helper to use useNavigate inside the component used by home
import { useNavigate } from 'react-router-dom';

function YearWrapper() {
    const navigate = useNavigate();
    return (
        <YearSelector
            selectedYear={null}
            onSelectYear={(id) => navigate(`/year/${id}`)}
        />
    );
}

function App() {
    return (
        <AuthProvider>
            <ContentProvider>
                <CommentProvider>
                    <QuizProvider>
                        <SettingsProvider>
                            <AnnouncementProvider>
                                <LanguageProvider>
                                    <ThemeProvider>
                                        <div className="app-wrapper">
                                            <Header />
                                            <AnnouncementBar />
                                            <main className="main-content">
                                                <Routes>
                                                    <Route path="/" element={<HomePage />} />
                                                    <Route path="/year/:yearId" element={<YearPage />} />
                                                    <Route path="/year/:yearId/stream/:streamId" element={<StreamPage />} />
                                                    <Route path="/year/:yearId/stream/:streamId/subject/:subjectId" element={<SubjectPage />} />
                                                    <Route path="/calculator" element={<CalculatorPage />} />
                                                    <Route path="/login" element={<LoginPage />} />
                                                    <Route path="/planner" element={<StudyPlannerPage />} />
                                                    <Route path="/dashboard" element={<TeacherDashboard />} />
                                                </Routes>
                                            </main>
                                            <Footer />
                                        </div>
                                    </ThemeProvider>
                                </LanguageProvider>
                            </AnnouncementProvider>
                        </SettingsProvider>
                    </QuizProvider>
                </CommentProvider>
            </ContentProvider>
        </AuthProvider>
    );
}

export default App;
