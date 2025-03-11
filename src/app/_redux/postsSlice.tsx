import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Post } from "../interfaces";
import { create } from "domain";
import { jwtDecode } from "jwt-decode";

let initialState = {
  loading: false as Boolean,
  posts: [] as Post[],
  post: null as Post | null,
  error: null as any,
  isShowMoreLoading: false as Boolean
};

export let getPosts = createAsyncThunk(
  "posts/getPosts",
  async (limit:number, showMore) => {

    let response = await fetch(
      `https://linked-posts.routemisr.com/posts?limit=${limit}`,
      {
        method: "GET",
        headers: {
          token: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );

    let data = await response.json();
    if(showMore){
      data.isShowMore = true
    }

    return data.posts;
  }
);

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

export let getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async (userId: string) => {
    let response = await fetch(
      `https://linked-posts.routemisr.com/users/${userId}/posts`,
      {
        method: "GET",
        headers: {
          token: localStorage.getItem("token") || "",
          "Content-Type": "application/json",
        },
      }
    );
    let data = await response.json();
    return data.posts;
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId: string) => {
    let response = await fetch(
      `https://linked-posts.routemisr.com/posts/${postId}`,
      {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token") || "",
        },
      }
    );
    let data = await response.json();

    return data.post;
  }
);

export const popstsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setShowMoreLoading: (state, action) => {
      state.isShowMoreLoading = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        const newPosts = action.payload.filter(
          (newPost: Post) => !state.posts.some((existingPost) => existingPost._id === newPost._id)
        );
        state.posts = [...state.posts, ...newPosts];
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
      });
    builder.addCase(getUserPosts.pending, (state) => {
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
    builder.addCase(deletePost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload._id
        );
      });
  },
});
export const {setShowMoreLoading} = popstsSlice.actions;
export let postsReducer = popstsSlice.reducer;
