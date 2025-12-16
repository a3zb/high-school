import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComments } from '../../context/CommentContext';
import { useLanguage } from '../../context/LanguageContext';
import { ROLES, canManageUsers, canEditContent } from '../../utils/permissions';
import './Comments.css';

export default function CommentSection({ contentId, subjectId }) {
    const { user } = useAuth();
    const { getCommentsForcontent, addComment, deleteComment } = useComments();
    const { currentLang } = useLanguage();
    const [newComment, setNewComment] = useState('');

    const comments = getCommentsForcontent(contentId);
    const rootComments = comments.filter(c => !c.parentId);

    const handlePost = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Permission check: Students can always post. Teachers can always post? 
        // Usually Students ask, Teachers answer. But let's allow all logged in users.
        if (!user) {
            alert("Please login first");
            return;
        }

        addComment(contentId, newComment, user);
        setNewComment('');
    };

    return (
        <div className="comments-section">
            <h4>{currentLang.code === 'ar' ? 'التعليقات' : 'Comments'}</h4>

            {/* Post Form */}
            {user && (
                <form onSubmit={handlePost} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={currentLang.code === 'ar' ? 'أضف تعليقًا...' : 'Add a comment...'}
                        className="comment-input"
                    />
                    <button type="submit" className="comment-submit-btn">
                        {currentLang.code === 'ar' ? 'نشر' : 'Post'}
                    </button>
                </form>
            )}

            {/* List */}
            <div className="comments-list">
                {rootComments.map(c => (
                    <CommentItem
                        key={c.id}
                        comment={c}
                        replies={comments.filter(r => r.parentId === c.id)}
                        user={user}
                        subjectId={subjectId}
                        onDelete={deleteComment}
                        onReply={addComment}
                        contentId={contentId}
                    />
                ))}
            </div>
        </div>
    );
}

function CommentItem({ comment, replies, user, subjectId, onDelete, onReply, contentId }) {
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { currentLang } = useLanguage();

    const isMod = canManageUsers(user);
    const isTeacherForSubject = user?.role === ROLES.TEACHER && canEditContent(user, subjectId);

    // Who can delete? Mod only.
    const canDelete = isMod;

    // Who can reply? 
    // Teachers (only if own subject), Mods, Students (maybe to clarify?).
    // Requirement: "Teachers - Reply related to their subject only."
    // Implies random teachers cannot reply.
    const canReply = user && (user.role === ROLES.STUDENT || isTeacherForSubject || isMod);

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        onReply(contentId, replyText, user, comment.id);
        setReplyText('');
        setShowReplyForm(false);
    };

    return (
        <div className="comment-item">
            <div className="comment-header">
                <span className="comment-author">{comment.author.name}</span>
                <span className={`comment-role role-${comment.author.role}`}>{comment.author.role}</span>
                <span className="comment-date">{comment.createdAt}</span>
                {canDelete && (
                    <button onClick={() => onDelete(comment.id)} className="delete-comment-btn" title="Delete">×</button>
                )}
            </div>
            <p className="comment-text">{comment.text}</p>

            <div className="comment-actions">
                {canReply && (
                    <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-toggle">
                        {currentLang.code === 'ar' ? 'رد' : 'Reply'}
                    </button>
                )}
            </div>

            {showReplyForm && (
                <form onSubmit={handleReply} className="reply-form">
                    <input
                        type="text"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button type="submit">↵</button>
                </form>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="replies-list">
                    {replies.map(r => (
                        <CommentItem
                            key={r.id}
                            comment={r}
                            replies={[]} // Max depth 1 for simplicity
                            user={user}
                            subjectId={subjectId}
                            onDelete={onDelete}
                            onReply={onReply}
                            contentId={contentId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
