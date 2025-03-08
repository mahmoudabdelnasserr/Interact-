"use client"
import { jwtDecode } from "jwt-decode";
import { getUserPosts } from '../_redux/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { State, storeDispatch } from '../_redux/store';

import { useEffect } from "react";
import PostDetails from "../_postdetails/page";
import Loading from "../loading";

export default function Profile() {
  let {user} = jwtDecode(`${localStorage.getItem('token')}`);
  const dispatch = useDispatch<storeDispatch>();
  const {loading, posts} = useSelector((state:State) => state.postsReducer);
  
  useEffect(() =>{
    dispatch(getUserPosts(user));
  }, [])
  return <>
  
  {loading ? <Loading /> : posts.map((post) => <PostDetails key={post.id} post={post} isComments={true}/>)}
  
  </>
}
