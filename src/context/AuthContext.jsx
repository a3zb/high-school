import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ROLES } from '../utils/permissions';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [configError, setConfigError] = useState(false);

    // Initial Configuration Check
    useEffect(() => {
        if (auth.configMissing) {
            console.error("Firebase Config Missing", auth.initError);
            setConfigError(auth.initError || "Unknown Error");
            setLoading(false);
        }
    }, []);

    // Monitor Auth State
    useEffect(() => {
        if (configError) return;

        let mounted = true;
        // Safety timeout to prevent infinite loading if firebase hangs
        const timeoutId = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth check timed out");
                setLoading(false);
            }
        }, 5000);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeoutId);
            if (!mounted) return;

            if (configError) {
                // If config missing, check LocalStorage for a simulated session
                const savedUser = localStorage.getItem('local_user_session');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } else if (firebaseUser) {
                try {
                    // Fetch User Role from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: userData.role || ROLES.STUDENT,
                            name: userData.name || 'Student',
                            ...userData
                        });
                    } else {
                        // Fallback/Default user data
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            role: ROLES.STUDENT,
                            name: 'New Student'
                        });
                    }
                } catch (err) {
                    console.error("Error fetching user role:", err);
                    // Minimal fallback
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: ROLES.STUDENT
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Auth Error:", error);
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(timeoutId);
            unsubscribe();
        };
    }, [configError]);

    // Registration
    const register = async (email, password, name, role = ROLES.STUDENT) => {
        if (configError) return { success: false, error: 'Configuration Missing' };
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                role,
                createdAt: new Date()
            });

            return { success: true };
        } catch (error) {
            console.error("Registration Error:", error);
            return { success: false, error: error.message };
        }
    };

    const login = async (email, password) => {
        if (configError) return { success: false, error: 'Configuration Missing' };
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, error: error.message };
        }
    };

    const loginAsGuest = async () => {
        if (configError) return { success: false, error: 'Configuration Missing' };
        try {
            await signInAnonymously(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    const loginWithCode = async (code) => {
        if (configError) return { success: false, error: 'Configuration Missing' };

        // Import dynamically to avoid circular dependencies if any, or just use the imported one
        // We need validateActivationCode from utils
        const { validateActivationCode } = await import('../utils/permissions');

        const validation = validateActivationCode(code);
        if (!validation) {
            return { success: false, error: 'Invalid Activation Code' };
        }

        if (configError) {
            // Local Login simulation
            const localUser = {
                uid: `local-${Date.now()}`,
                role: validation.role,
                allowedSubjects: validation.allowedSubjects || [],
                name: validation.role === 'moderator' ? 'Admin' : 'Teacher',
                isLocalSession: true
            };
            setUser(localUser);
            localStorage.setItem('local_user_session', JSON.stringify(localUser));
            return { success: true };
        }

        try {
            // Sign in anonymously first to get a uid
            const { user: firebaseUser } = await signInAnonymously(auth);

            await setDoc(doc(db, 'users', firebaseUser.uid), {
                role: validation.role,
                allowedSubjects: validation.allowedSubjects || [],
                name: validation.role === 'moderator' ? 'Admin' : 'Teacher',
                createdAt: new Date(),
                isAnonymousCodeLogin: true
            });

            return { success: true };
        } catch (error) {
            console.error("Login Code Error:", error);
            return { success: false, error: error.message };
        }
    };

    const loginAsAdmin = async (username, password) => {
        // Hardcoded Credentials - Change these later!
        const ADMIN_USERNAME = 'admin';
        const ADMIN_PASSWORD = 'admin123';

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            if (configError) {
                const localAdmin = {
                    uid: 'local-admin',
                    role: ROLES.MODERATOR,
                    name: 'Admin',
                    email: 'admin@local',
                    isLocalSession: true
                };
                setUser(localAdmin);
                localStorage.setItem('local_user_session', JSON.stringify(localAdmin));
                return { success: true };
            }

            try {
                // Sign in anonymously first to get a uid
                const { user: firebaseUser } = await signInAnonymously(auth);

                // Set role as moderator (admin)
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    role: ROLES.MODERATOR,
                    name: 'Admin',
                    email: 'admin@local',
                    createdAt: new Date(),
                    isHardcodedAdmin: true
                });

                return { success: true };
            } catch (error) {
                console.error("Admin Login Error:", error);
                return { success: false, error: error.message };
            }
        } else {
            return { success: false, error: 'Invalid Admin Credentials' };
        }
    };

    const logout = async () => {
        try {
            if (configError) {
                setUser(null);
                localStorage.removeItem('local_user_session');
            } else {
                await signOut(auth);
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    // Render Loading Screen
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2>Connecting to BAC Success...</h2>
                </div>
            </div>
        );
    }

    // Render Missing Config Screen
    if (configError) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#0f172a',
                color: 'white',
                padding: '1rem',
                fontFamily: 'system-ui, sans-serif'
            }}>
                <div style={{
                    maxWidth: '500px',
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                    <h1 style={{ marginBottom: '1rem', color: '#f87171', fontSize: '1.5rem' }}>إعدادات الربط مفقودة أو خاطئة</h1>
                    <p style={{ marginBottom: '1.5rem', lineHeight: '1.6', color: '#9ca3af' }}>
                        السبب: <span style={{ fontFamily: 'monospace', color: '#fca5a5' }}>{typeof configError === 'string' ? configError : 'مفاتيح غير صحيحة'}</span>
                    </p>

                    <div style={{
                        textAlign: 'left',
                        background: '#1e293b',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: '#bae6fd'
                    }}>
                        1. Create Project on Firebase Console<br />
                        2. Copy Config to .env.local<br />
                        3. Restart Server
                    </div>

                    <a href="#" style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}>
                        Check README_FIREBASE.md
                    </a>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            logout,
            loginAsStudent: loginAsGuest,
            loginWithCredentials: login,
            loginWithCode,
            loginAsAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
