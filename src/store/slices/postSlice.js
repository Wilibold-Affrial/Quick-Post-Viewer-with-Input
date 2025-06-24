// slices/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fs from 'fs';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const data = await fs.promises.readFile('./posts.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [] };
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (post) => {
  try {
    const data = await fs.promises.readFile('./posts.json', 'utf8');
    const posts = JSON.parse(data).posts;
    
    const newPost = { 
      id: Date.now().toString(), 
      ...post,
      timestamp: new Date().toISOString(),
      comments: []
    };
    
    posts.unshift(newPost);
    
    await fs.promises.writeFile('./posts.json', JSON.stringify({ posts }, null, 2));
    
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
});

export const addComment = createAsyncThunk('posts/addComment', async ({ postId, comment }) => {
  try {
    const data = await fs.promises.readFile('./posts.json', 'utf8');
    const posts = JSON.parse(data).posts;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        post.comments.push({
          id: Date.now().toString(),
          text: comment,
          timestamp: new Date().toISOString(),
          user: {
            name: "Guest User",
            avatar: "https://via.placeholder.com/50"
          }
        });
        return post;
      }
      return post;
    });
    
    await fs.promises.writeFile('./posts.json', JSON.stringify({ posts: updatedPosts }, null, 2));
    
    return { postId, comment };
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.posts = state.posts.map(post => 
          post.id === action.payload.postId 
            ? { ...post, comments: [...post.comments, action.payload.comment] }
            : post
        );
      });
  },
});

export default postSlice.reducer;