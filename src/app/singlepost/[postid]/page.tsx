"use client"
import { State, storeDispatch } from '@/app/_redux/store'
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSinglePost } from '@/app/_redux/postsSlice'
import Loading from '@/app/loading';
import PostDetails from '@/app/_postdetails/page';

export default function page() {
  let {loading, post} = useSelector((state:State) => state.postsReducer);
  const dispatch = useDispatch<storeDispatch>();
  let {postid} = useParams();

  useEffect(() => {
    dispatch(getSinglePost(`${postid}`))
  }, [])
  return <>
  {loading ? <Loading /> : post &&  <PostDetails post={post} isComments={true}/>}
  </>
}
