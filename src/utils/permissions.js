/**
 * roles.js - Constants for roles
 */
export const ROLES = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    MODERATOR: 'moderator'
};

/**
 * permissions.js - Logic for access control
 */
import codesData from '../data/activation_codes.json';

// Simulate backend validation
export const validateActivationCode = (code) => {
    const data = codesData.codes[code];
    if (!data) return null;

    return {
        role: data.role,
        allowedSubjects: data.subjectIds || [] // Only for teachers
    };
};

export const canEditContent = (user, subjectId) => {
    if (!user) return false;
    if (user.role === ROLES.MODERATOR) return true;
    if (user.role === ROLES.TEACHER && user.allowedSubjects?.includes(subjectId)) return true;
    return false;
};

export const canManageUsers = (user) => {
    return user?.role === ROLES.MODERATOR;
};
