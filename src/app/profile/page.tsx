"use client"
import { jwtDecode } from "jwt-decode";
import { getUserPosts } from '../_redux/postsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { State, storeDispatch } from '../_redux/store';
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

import ShareIcon from "@mui/icons-material/Share";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import { Comment, Post } from "../interfaces";
import Image from "next/image";
import Link from "next/link";
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
  
  {loading ? <Loading /> : posts.map((post) => <PostDetails post={post} isComments={true}/>)}
  
  </>
}
