import { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import CommentSection from '../Comments/CommentSection';
import './ContentCard.css';

export default function ContentCard({ file, subjectId, lang }) {
    const [showComments, setShowComments] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();

    const isPdf = file.url.endsWith('.pdf') || true;

    return (
        <div className={`dz-card ${showComments ? 'expanded' : ''}`}>
            <div className="dz-card-main">
                <div className="dz-card-icon" style={{ background: isPdf ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
                    {isPdf ? '📕' : '📄'}
                </div>
                <div className="dz-card-info">
                    <h4 className="dz-card-title">{file.title}</h4>
                    <div className="dz-card-meta">
                        <span>📅 {file.date}</span>
                        {file.uploaderName && <span className="uploader-tag">👤 {file.uploaderName}</span>}
                        {file.size && <span className="size-tag">💾 {file.size}</span>}
                    </div>
                </div>
                <div className="dz-card-actions">
                    <button
                        className={`dz-fav-btn ${isFavorite(file.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite({
                            id: file.id,
                            title: file.title,
                            type: file.type || 'Lesson',
                            path: window.location.pathname
                        })}
                        title="Add to Favorites"
                    >
                        {isFavorite(file.id) ? '⭐' : '☆'}
                    </button>
                    <a
                        href={file.url}
                        className="dz-download-btn"
                        title="Download"
                        target="_blank"
                        rel="noopener noreferrer"
                        download={`${file.title}.pdf`}
                    >
                        <span className="btn-text">{lang === 'ar' ? 'تحميل' : 'Download'}</span>
                        <span className="btn-icon">⬇</span>
                    </a>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`dz-comment-btn ${showComments ? 'active' : ''}`}
                        title="Show Comments"
                    >
                        💬
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="dz-card-comments glass">
                    <CommentSection contentId={file.id} subjectId={subjectId} />
                </div>
            )}
        </div>
    );
}
