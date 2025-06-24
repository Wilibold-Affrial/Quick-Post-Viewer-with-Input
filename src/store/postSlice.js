import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch posts (e.g., from an API)
export const fetchPosts = createAsyncThunk("post/fetchPosts", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
});

const postSlice = createSlice({
  name: "post",
  initialState: {
    fetchedPosts: [],
    localPosts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addPost: (state, action) => {
      state.localPosts.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.fetchedPosts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addPost } = postSlice.actions;
export default postSlice.reducer;
