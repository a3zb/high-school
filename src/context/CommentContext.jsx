import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // We can't fetch ALL comments at once for the whole app, it's too much.
    // Instead, we should probably fetch comments per contentId when needed.
    // However, to keep the API compatible with 'getCommentsForcontent' which was synchronous,
    // we might need to refactor.
    // BETTER APPROACH: Expose a hook or function to subscribe to comments for a specific content.

    // BUT, given the current simple structure, let's keep a global 'comments' state 
    // populated by the currently active content view? No, that breaks 'getCommentsForcontent'.

    // Let's refactor: separate state isn't needed here if we fetch inside the component.
    // BUT providing CRUD methods is good.

    // Let's change the strategy: The Context provides the ACTIONS (add, delete), 
    // but the Fetching should happen in the Component (CommentSection) via a custom hook or just querying there.
    // OR we provide a function `useContentComments(contentId)` that sets up the listener.

    const addComment = async (contentId, text, author, parentId = null) => {
        if (db.configMissing) {
            console.warn("Firestore not configured");
            return; // Or mock it
        }

        try {
            await addDoc(collection(db, 'comments'), {
                contentId,
                text,
                author: {
                    name: author.name,
                    role: author.role,
                    id: author.uid || author.id
                },
                createdAt: serverTimestamp(), // Use server timestamp
                parentId
            });
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const deleteComment = async (commentId) => {
        if (db.configMissing) return;
        try {
            await deleteDoc(doc(db, 'comments', commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // This function will now be a "Subscriber" helper
    // Instead of returning an array immediately, it should probably return a query?
    // Doing it inside Context is tricky for real-time.
    // Let's keep the context simple: Just Actions.
    // And I will update CommentSection.jsx to handle the data fetching.

    return (
        <CommentContext.Provider value={{ addComment, deleteComment }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useComments = () => useContext(CommentContext);

// Custom hook for components to use
export const useContentComments = (contentId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!contentId || db.configMissing) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'comments'),
            where('contentId', '==', contentId),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedComments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to readable string
                createdAt: doc.data().createdAt?.toDate().toLocaleDateString('en-GB') || 'Just now'
            }));
            setComments(fetchedComments);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching comments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [contentId]);

    return { comments, loading };
};
