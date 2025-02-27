"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useDispatch, useSelector } from "react-redux";
import { State, storeDispatch } from "./_redux/store";
import { getPosts } from "./_redux/postsSlice";
import PostDetails from "./_postdetails/page";

export default function Home() {
  let {loading, posts} = useSelector((state:State) => state.postsReducer)
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<storeDispatch>();
  
  

  const router = useRouter();
  useEffect(() => {
    if(!localStorage.getItem('token')){
      router.push('/login');
    } else{
      
      setIsLoading(false);
      dispatch(getPosts())
    }
  }, [])

  return <>
  {isLoading || loading ?  <Loading /> :  posts.map((post) => <PostDetails key={post.id} post={post}/>) }
    
    
  </>
  
}
