import { createContext, useContext, useState, useEffect } from 'react';
import { ROLES, validateActivationCode } from '../utils/permissions';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // User object: { id, name, role, allowedSubjects? }
    const [user, setUser] = useState(null);

    // Initialize from storage if needed (Skipping persistence for now for simplicity, or we can add it)
    useEffect(() => {
        const saved = localStorage.getItem('user_session');
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

    const loginAsStudent = () => {
        const studentUser = { id: 'guest-student', name: 'Student', role: ROLES.STUDENT };
        setUser(studentUser);
        localStorage.setItem('user_session', JSON.stringify(studentUser));
    };

    const loginWithCode = (code) => {
        const result = validateActivationCode(code);
        if (result) {
            const newUser = {
                id: `user-${Date.now()}`,
                name: result.role.charAt(0).toUpperCase() + result.role.slice(1),
                role: result.role,
                allowedSubjects: result.allowedSubjects
            };
            setUser(newUser);
            localStorage.setItem('user_session', JSON.stringify(newUser));
            return { success: true, role: result.role };
        }
        return { success: false, error: 'Invalid activation code' };
        return { success: false, error: 'Invalid activation code' };
    };

    const loginWithCredentials = (username, password) => {
        // Hardcoded generic admin for now
        if (username === 'admin' && password === '123456') {
            const adminUser = {
                id: 'admin-01',
                name: 'Administrator',
                role: ROLES.MODERATOR
            };
            setUser(adminUser);
            localStorage.setItem('user_session', JSON.stringify(adminUser));
            return { success: true };
        }
        return { success: false, error: 'Invalid Credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_session');
    };

    return (
        <AuthContext.Provider value={{ user, loginAsStudent, loginWithCode, loginWithCredentials, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
