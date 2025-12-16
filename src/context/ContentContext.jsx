import { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    // Mock initial files
    const [files, setFiles] = useState([
        {
            id: "demo-1",
            title: "Introduction to Calculus",
            yearId: "3as",
            streamId: "science",
            subjectId: "math",
            type: "lessons",
            url: "#",
            uploaderId: "teacher-1",
            date: "2023-10-01"
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
        <ContentContext.Provider value={{ files, addFile, deleteFile, getFilesBySubject, getFilesByUploader }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
