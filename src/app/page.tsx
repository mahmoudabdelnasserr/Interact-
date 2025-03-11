"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { useDispatch, useSelector } from "react-redux";
import { State, storeDispatch } from "./_redux/store";
import { getPosts } from "./_redux/postsSlice";
import PostDetails from "./_postdetails/page";
import { Button } from "@mui/material";
import { setShowMoreLoading } from "./_redux/postsSlice";

export default function Home() {
  let { loading, posts, isShowMoreLoading } = useSelector((state: State) => state.postsReducer);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<storeDispatch>();
  const [limit, setLimit] = useState(10);

  function handleShowMore() {
    const newLimit = limit + 10;
    setLimit(newLimit);
    dispatch(setShowMoreLoading(true));
    dispatch(getPosts(newLimit)).unwrap().then(() => dispatch(setShowMoreLoading(false)));
  }

  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setIsLoading(false);
      dispatch(getPosts(limit));
    }
  }, [limit]);

  return (
    <>
      {(isLoading || loading ) && !isShowMoreLoading ? (
        <Loading />
      ) : (
        posts.map((post) => <PostDetails key={post._id} post={post} />)
      )}
      <Button disabled={isShowMoreLoading === true} onClick={handleShowMore}>{isShowMoreLoading ? 'Loading...' : 'Show More'}</Button>
    </>
  );
}
