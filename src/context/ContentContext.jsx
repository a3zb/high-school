import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const [activeYear, setActiveYear] = useState(null);
    // Mock initial files
    const [files, setFiles] = useState([
        {
            id: "demo-1",
            title: "نهايات الدوال (شرح مفصل)",
            yearId: "3as",
            streamId: "science",
            subjectId: "math",
            type: "lessons",
            url: "demo.pdf",
            uploaderName: "الأستاذ أحمد",
            date: "2023-10-01"
        },
        {
            id: "demo-2",
            title: "اختبار الفصل الأول - نموذج 1",
            yearId: "3as",
            streamId: "science",
            subjectId: "math",
            type: "exams",
            term: "1",
            url: "exam1.pdf",
            uploaderName: "إدارة الموقع",
            date: "2023-11-15"
        },
        {
            id: "demo-3",
            title: "حل اختبار الفصل الأول - نموذج 1",
            yearId: "3as",
            streamId: "science",
            subjectId: "math",
            type: "solutions",
            url: "sol1.pdf",
            uploaderName: "الأستاذ أحمد",
            date: "2023-11-20"
        },
        {
            id: "demo-4",
            title: "قوانين الفيزياء النووية",
            yearId: "3as",
            streamId: "science",
            subjectId: "physics",
            type: "summaries",
            url: "physics.pdf",
            uploaderName: "الأستاذ كمال",
            date: "2023-12-05"
        },
        {
            id: "demo-5",
            title: "اختبار الفصل الثاني - مقترح 2024",
            yearId: "3as",
            streamId: "science",
            subjectId: "math",
            type: "exams",
            term: "2",
            url: "exam2.pdf",
            uploaderName: "الأستاذة سارة",
            date: "2024-01-10"
        }
    ]);

    // Actions
    const addFile = (fileData) => {
        const newFile = {
            ...fileData,
            id: `file-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };
        setFiles((prev) => [newFile, ...prev]);
        return newFile;
    };

    const deleteFile = (fileId) => {
        setFiles((prev) => prev.filter(f => f.id !== fileId));
    };

    const getFilesBySubject = (subjectId, type = null) => {
        return files.filter(f =>
            f.subjectId === subjectId &&
            (!type || f.type === type)
        );
    };

    const getFilesByUploader = (uploaderId) => {
        return files.filter(f => f.uploaderId === uploaderId);
    };

    return (
        <ContentContext.Provider value={{ activeYear, setActiveYear, files, addFile, getFilesBySubject, getFilesByUploader, deleteFile }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
