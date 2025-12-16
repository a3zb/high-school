import { createContext, useContext, useState } from 'react';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    // Mock comments: { id, contentId, text, author: { name, role, id }, createdAt, parentId? }
    const [comments, setComments] = useState([
        {
            id: "c1",
            contentId: "demo-1",
            text: "Could you explain the last part again?",
            author: { name: "Student A", role: "student", id: "s1" },
            createdAt: "2023-10-02"
        },
        {
            id: "c2",
            contentId: "demo-1",
            text: "Sure, check usage of derivatives.",
            author: { name: "Math Teacher", role: "teacher", id: "t1" },
            createdAt: "2023-10-02",
            parentId: "c1" // Reply
        }
    ]);

    const addComment = (contentId, text, author, parentId = null) => {
        const newComment = {
            id: `c-${Date.now()}`,
            contentId,
            text,
            author: { name: author.name, role: author.role, id: author.id },
            createdAt: new Date().toISOString().split('T')[0],
            parentId
        };
        setComments(prev => [...prev, newComment]);
    };

    const deleteComment = (commentId) => {
        // Cascade delete replies? For now just delete the item.
        setComments(prev => prev.filter(c => c.id !== commentId && c.parentId !== commentId));
    };

    const getCommentsForcontent = (contentId) => {
        return comments.filter(c => c.contentId === contentId);
    };

    return (
        <CommentContext.Provider value={{ comments, addComment, deleteComment, getCommentsForcontent }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = () => useContext(CommentContext);
