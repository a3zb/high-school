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
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import StudyPlannerPage from './pages/StudyPlannerPage';
import FavoritesPage from './pages/FavoritesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
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
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">Starting...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to unauthorized or home if role doesn't match
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

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
                                                    {!isLoginPage && <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
                                                    {!isLoginPage && <AnnouncementBar />}
                                                    <div className="layout-content-wrapper">
                                                        {!isLoginPage && <Sidebar
                                                            isOpen={isSidebarOpen}
                                                            onClose={() => setIsSidebarOpen(false)}
                                                        />}
                                                        <main className={`main-content ${isLoginPage ? 'login-layout' : ''}`}>
                                                            <Routes>
                                                                <Route path="/login" element={<LoginPage />} />

                                                                {/* Protected Routes */}
                                                                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                                                                <Route path="/year/:yearId" element={<ProtectedRoute><YearPage /></ProtectedRoute>} />
                                                                <Route path="/year/:yearId/stream/:streamId" element={<ProtectedRoute><StreamPage /></ProtectedRoute>} />
                                                                <Route path="/year/:yearId/stream/:streamId/subject/:subjectId" element={<ProtectedRoute><SubjectPage /></ProtectedRoute>} />
                                                                <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />
                                                                <Route path="/calculator" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
                                                                <Route path="/planner" element={<ProtectedRoute><StudyPlannerPage /></ProtectedRoute>} />
                                                                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                                                                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                                                                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                                                <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />

                                                                <Route
                                                                    path="/dashboard"
                                                                    element={
                                                                        <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.MODERATOR]}>
                                                                            <TeacherDashboard />
                                                                        </ProtectedRoute>
                                                                    }
                                                                />
                                                                <Route
                                                                    path="/admin"
                                                                    element={
                                                                        <ProtectedRoute allowedRoles={[ROLES.MODERATOR]}>
                                                                            <AdminDashboard />
                                                                        </ProtectedRoute>
                                                                    }
                                                                />
                                                            </Routes>
                                                            {!isLoginPage && <StickyBacCountdown />}
                                                        </main>
                                                    </div>
                                                    {!isLoginPage && <Footer />}
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
