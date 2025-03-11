"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Comment, Post } from "../interfaces";
import Image from "next/image";
import Link from "next/link";
import { Box, Button, TextField } from "@mui/material";
import Menu from "../menu/menu";
import { useDispatch, useSelector } from "react-redux";
import { State, storeDispatch } from "../_redux/store";
import { deletePost } from "../_redux/postsSlice";
import { jwtDecode } from "jwt-decode";

interface ExpandMoreProps {
  expand: boolean;
}

const ExpandMore = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "expand",
})<ExpandMoreProps>(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  transform: expand ? "rotate(180deg)" : "rotate(0deg)",
}));

interface PostDetailsProps {
  post: Post;
  isComments?: boolean;
}

const PostDetails: React.FC<PostDetailsProps> = ({ post, isComments = false }) => {
  const [comments, setComments] = React.useState<Comment[]>(post.comments || []);
  const [expanded, setExpanded] = React.useState(false);
  const [editingComment, setEditingComment] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState<string>("");
  const dispatch = useDispatch<storeDispatch>();
  let {user} = jwtDecode(`${localStorage.getItem('token')}`);
  const { posts } = useSelector((state: State) => state.postsReducer);
  

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function handleAddComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const values = {
      content: form.comment.value,
      post: post.id,
    };
    const response = await fetch(`https://linked-posts.routemisr.com/comments`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        token: `${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setComments(data.comments || []);
    form.reset();
  }

  async function handleEditComment(id: string) {
    const response = await fetch(`https://linked-posts.routemisr.com/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ content: editContent }),
      headers: {
        token: `${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === id ? { ...comment, content: editContent } : comment
      )
    );
  
    setEditingComment(null);
  }
  
  return (
    <Card sx={{ m: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user-avatar">
            <Image src={post.user.photo} alt={post.user.name} fill />
          </Avatar>
        }
        action={user === post.user._id ? (
          <Typography onClick={() => dispatch(deletePost(post._id))} sx={{ color: 'red', cursor: 'pointer' }}>
            Delete
          </Typography>
        ) : null}        title={post.user.name}
        subheader={post.createdAt.split("T", 1)}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>{post.body}</Typography>
      </CardContent>
      {post.image && (
        <Image src={post.image} alt={post.body} width={400} height={400} style={{ width: "100%" }} />
      )}
      <CardActions disableSpacing>
        <IconButton aria-label="like">
          <ThumbUpIcon sx={{ color: "#7E5CAD" }} />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ChatIcon sx={{ color: "grey" }} />
        </ExpandMore>
        <ShareIcon sx={{ color: "grey" }} />
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ backgroundColor: "#eee" }}>
          {comments?.map((comment) => (
            <CardContent key={comment._id} sx={{ backgroundColor: "#eee", mb: 2, borderBottom: 1 ,borderColor: '#c1c1c1' }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }}>
                    <Image src={comment.commentCreator.photo} alt={comment.commentCreator.name} width={60} height={60} />
                  </Avatar>
                }
                title={comment.commentCreator.name}
                subheader={comment.createdAt.split("T", 1)}
                action={<Menu />}
              />
              {editingComment === comment._id ? (
                <TextField
                  fullWidth
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              ) : (
                <Typography>{comment.content}</Typography>
              )}
              {editingComment === comment._id ? (
                <Button onClick={() => handleEditComment(comment._id)}>Save</Button>
              ) : (
                <Button onClick={() => { setEditingComment(comment._id); setEditContent(comment.content); }}>Edit</Button>
              )}
            </CardContent>
          ))}
        </CardContent>
        <form onSubmit={handleAddComment} style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <TextField name="comment" label="Add a comment" variant="outlined" fullWidth />
          <Button type="submit" variant="contained">Add</Button>
        </form>
      </Collapse>
    </Card>
  );
};

export default PostDetails;