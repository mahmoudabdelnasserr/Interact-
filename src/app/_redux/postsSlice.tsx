import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from "../interfaces";
import { create } from "domain";
import { jwtDecode } from "jwt-decode";

let initialState = {
  loading: false as Boolean,
  posts: [] as Post[],
  post: null as Post|null,
  error: null as any,
};

export let getPosts = createAsyncThunk("posts/getPosts", async () => {
  let response = await fetch(
    `https://linked-posts.routemisr.com/posts?limit=50`,
    {
      method: "GET",
      headers: {
        token: `${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );

  let data = await response.json();
  return data.posts;
});

export let getSinglePost = createAsyncThunk(
  "post/getSinglePost",
  async (postId: string) => {
    let response = await fetch(
      `https://linked-posts.routemisr.com/posts/${postId}`,
      {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    return data.post;
  }
);

export let getUserPosts = createAsyncThunk('posts/getUserPosts', async (userId: string) => {  
  let response = await fetch(`https://linked-posts.routemisr.com/users/${userId}/posts`,{
    method: 'GET',
    headers:{
      token: localStorage.getItem('token') || '',
      'Content-Type': 'application/json',
    }
  });
  let data = await response.json();
  return data.posts

});

export const popstsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      }),
      builder.addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(getSinglePost.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(getSinglePost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      }),
      builder.addCase(getSinglePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });    builder.addCase(getUserPosts.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      }),
      builder.addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export let postsReducer = popstsSlice.reducer;
