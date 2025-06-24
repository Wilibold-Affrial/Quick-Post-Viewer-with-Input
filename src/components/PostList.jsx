// components/PostList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../store/slices/postSlice';

const PostList = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(state => state.posts);

  useEffect(() => {
    if (!posts.length) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts.length]);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error loading posts: {error}</div>;

  return (
    <div className="post-list">
      <h1>Latest Posts</h1>
      <Link to="/create" className="create-post-btn">Create New Post</Link>
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <h2>{post.title}</h2>
            <p className="post-excerpt">{post.description.substring(0, 150)}...</p>
            <Link to={`/post/${post.id}`} className="read-more">
              Read more
            </Link>
            <div className="post-meta">
              <span>Comments: {post.comments?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;