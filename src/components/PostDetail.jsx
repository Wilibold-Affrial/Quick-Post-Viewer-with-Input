// components/PostDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addComment } from '../store/slices/postSlice';

const PostDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(null);
  const currentPost = useSelector(state => 
    state.posts.posts.find(post => post.id === id)
  );

  if (!currentPost) return <div className="error">Post not found</div>;

  const handleAddComment = (parentId = null) => {
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentText,
      timestamp: new Date().toISOString(),
      parentId,
      user: {
        name: "Guest User", // In a real app, this would come from auth
        avatar: "https://via.placeholder.com/50"
      }
    };
    
    dispatch(addComment({ postId: id, comment }));
    setCommentText('');
  };

  const renderComments = (comments = []) => {
    return comments.map(comment => (
      <div key={comment.id} className="comment">
        <div className="comment-content">
          <div className="comment-author">
            <img src={comment.user.avatar} alt="User" className="avatar" />
            <span>{comment.user.name}</span>
          </div>
          <p>{comment.text}</p>
          <div className="comment-meta">
            <span>{new Date(comment.timestamp).toLocaleTimeString()}</span>
            <button 
              className="reply-btn" 
              onClick={() => setShowReplyInput(comment.id)}
            >
              Reply
            </button>
          </div>
        </div>
        
        {comment.children && comment.children.length > 0 && (
          <div className="nested-comments">
            {renderComments(comment.children)}
          </div>
        )}
        
        {showReplyInput === comment.id && (
          <div className="reply-form">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your reply..."
              rows="3"
            />
            <button 
              className="submit-reply-btn"
              onClick={() => handleAddComment(comment.id)}
            >
              Post Reply
            </button>
            <button 
              className="cancel-btn"
              onClick={() => setShowReplyInput(null)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="post-detail">
      <h1>{currentPost.title}</h1>
      <div className="post-meta">
        <span>Posted on {new Date(currentPost.timestamp).toLocaleDateString()}</span>
      </div>
      <div className="post-content">
        <p>{currentPost.description}</p>
      </div>
      
      <div className="comments-section">
        <h2>Comments ({currentPost.comments?.length || 0})</h2>
        
        <div className="add-comment">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows="3"
          />
          <button 
            className="submit-comment-btn"
            onClick={handleAddComment}
            disabled={!commentText.trim()}
          >
            Post Comment
          </button>
        </div>
        
        {currentPost.comments && currentPost.comments.length > 0 ? (
          <div className="comments-list">
            {renderComments(currentPost.comments)}
          </div>
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default PostDetail;