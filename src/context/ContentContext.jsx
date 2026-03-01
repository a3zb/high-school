import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

// --- IndexedDB Helper for Large Files ---
const DB_NAME = 'AtharEduDB';
const STORE_NAME = 'local_files';

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

const saveLocally = async (file) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(file);
    return new Promise((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
    });
};

const getLocalFiles = async () => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((res, rej) => {
        request.onsuccess = () => res(request.result);
        request.onerror = () => rej(request.error);
    });
};

const deleteLocally = async (id) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    return new Promise((res) => {
        tx.oncomplete = () => res();
    });
};
// ----------------------------------------

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
    const [activeYear, setActiveYear] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    const isFirebaseValid = !db.configMissing;

    // Fetch files
    useEffect(() => {
        if (isFirebaseValid) {
            try {
                const q = query(collection(db, 'resources'), orderBy('date', 'desc'));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedFiles = [];
                    snapshot.forEach((doc) => {
                        fetchedFiles.push({ id: doc.id, ...doc.data() });
                    });
                    setFiles(fetchedFiles);
                    setLoading(false);
                }, (error) => {
                    console.error("ContentContext: Error fetching files:", error);
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("ContentContext error:", error);
                setLoading(false);
            }
        } else {
            // Load from IndexedDB
            getLocalFiles().then(localFiles => {
                setFiles(localFiles);
                setLoading(false);
            }).catch(err => {
                console.error("IndexedDB load error:", err);
                setLoading(false);
            });
        }
    }, [isFirebaseValid]);

    // Actions
    const addFile = async (fileData) => {
        const newFile = {
            ...fileData,
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date(),
            uploaderName: fileData.uploaderName || "أستاذ المنصة"
        };

        if (isFirebaseValid) {
            try {
                const docRef = await addDoc(collection(db, 'resources'), newFile);
                return { id: docRef.id, ...newFile };
            } catch (error) {
                console.error("Error adding file to Firestore:", error);
                throw error;
            }
        } else {
            // Large File Storage
            const localFile = { ...newFile, id: `local-${Date.now()}` };
            await saveLocally(localFile);
            setFiles(prev => [localFile, ...prev]);
            return localFile;
        }
    };

    const deleteFile = async (fileId) => {
        if (isFirebaseValid) {
            try {
                await deleteDoc(doc(db, 'resources', fileId));
                return true;
            } catch (error) {
                console.error("Error deleting file from Firestore:", error);
                throw error;
            }
        } else {
            await deleteLocally(fileId);
            setFiles(prev => prev.filter(f => f.id !== fileId));
            return true;
        }
    };

    const getFilesBySubject = (subjectId, type = null) => {
        return files.filter(f =>
            f.subjectId === subjectId &&
            (!type || f.type === type)
        );
    };

    const getFilesByUploader = (uploaderId) => {
        if (!uploaderId) return [];
        return files.filter(f => f.uploaderId === uploaderId);
    };

    return (
        <ContentContext.Provider value={{
            activeYear,
            setActiveYear,
            files,
            loading,
            addFile,
            getFilesBySubject,
            getFilesByUploader,
            deleteFile
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => useContext(ContentContext);
