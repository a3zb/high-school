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
import SearchResultsPage from './pages/SearchResultsPage';
import { AuthProvider } from './context/AuthContext';
import { ContentProvider } from './context/ContentContext';
import { CommentProvider } from './context/CommentContext';
import { QuizProvider } from './context/QuizContext';
import { SettingsProvider } from './context/SettingsContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { UserStatsProvider } from './context/UserStatsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import FavoritesPage from './pages/FavoritesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ROLES } from './utils/permissions';
import Sidebar from './components/Layout/Sidebar';
import StickyBacCountdown from './components/Smart/StickyBacCountdown';
import { useContent } from './context/ContentContext';
import './index.css';

// Home Component that combines Hero + Selector
function HomePage() {
    // Note: On the homepage, maybe we just show the selector?
    const { activeYear, setActiveYear } = useContent();
    const navigate = useNavigate();

    const handleYearSelect = (id) => {
        setActiveYear(id);
        // Optionally navigate to the year page immediately
        // navigate(`/year/${id}`);
    };

    return (
        <>
            <Hero />
            <YearSelector selectedYear={activeYear} onSelectYear={handleYearSelect} />
            {activeYear && (
                <div className="container" style={{ paddingBottom: '4rem' }}>
                    <StreamList selectedYearId={activeYear} />
                </div>
            )}
        </>
    );
}

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <AuthProvider>
            <ContentProvider>
                <CommentProvider>
                    <QuizProvider>
                        <SettingsProvider>
                            <UserStatsProvider>
                                <FavoritesProvider>
                                    <AnnouncementProvider>
                                        <LanguageProvider>
                                            <ThemeProvider>
                                                <div className="app-wrapper">
                                                    <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                                                    <AnnouncementBar />
                                                    <div className="layout-content-wrapper">
                                                        <Sidebar
                                                            isOpen={isSidebarOpen}
                                                            onClose={() => setIsSidebarOpen(false)}
                                                        />
                                                        <main className="main-content">
                                                            <Routes>
                                                                <Route path="/" element={<HomePage />} />
                                                                <Route path="/year/:yearId" element={<YearPage />} />
                                                                <Route path="/year/:yearId/stream/:streamId" element={<StreamPage />} />
                                                                <Route path="/year/:yearId/stream/:streamId/subject/:subjectId" element={<SubjectPage />} />
                                                                <Route path="/search" element={<SearchResultsPage />} />
                                                                <Route path="/calculator" element={<CalculatorPage />} />
                                                                <Route path="/login" element={<LoginPage />} />
                                                                <Route path="/planner" element={<StudyPlannerPage />} />
                                                                <Route path="/favorites" element={<FavoritesPage />} />
                                                                <Route path="/analytics" element={<AnalyticsPage />} />
                                                                <Route
                                                                    path="/dashboard"
                                                                    element={
                                                                        <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.MODERATOR]}>
                                                                            <TeacherDashboard />
                                                                        </ProtectedRoute>
                                                                    }
                                                                />
                                                            </Routes>
                                                            <StickyBacCountdown />
                                                        </main>
                                                    </div>
                                                    <Footer />
                                                </div>
                                            </ThemeProvider>
                                        </LanguageProvider>
                                    </AnnouncementProvider>
                                </FavoritesProvider>
                            </UserStatsProvider>
                        </SettingsProvider>
                    </QuizProvider>
                </CommentProvider>
            </ContentProvider>
        </AuthProvider>
    );
}

export default App;
