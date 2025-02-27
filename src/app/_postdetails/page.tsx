'use client'
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatIcon from "@mui/icons-material/Chat";
import { Comment, Post } from "../interfaces";
import Image from "next/image";
import Link from "next/link";
import { Button, TextField } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function PostDetails({
  post,
  isComments = false,
}: {
  post: Post;
  isComments?: Boolean;
}) {
  const [comments, setComments] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function handleAddComment(e:React.FormEvent) {
    e.preventDefault();
    let form = e.target as HTMLFormElement;

    let values = {
      content: form.comment.value,
      post: post.id,
    
    }
    let response = await fetch(`https://linked-posts.routemisr.com/comments`,{
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'token': `${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
        
      }
    });

    let data = await response.json();
    console.log(data);
    setComments(data.comments);
    form.comment.content = null;
    
  }

  return (
    <Card sx={{ m: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            <Image
              src={post.user.photo}
              alt={post.user.name}
              style={{ width: "100%", height: "auto" }}
              width={60}
              height={60}
            />
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={post.user.name}
        subheader={post.createdAt.split("T", 1)}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {post.body}
        </Typography>
      </CardContent>
      {post.image && (
        <Image
          src={post.image}
          alt={`${post.body}`}
          width={400}
          height={400}
          style={{ width: "100%", objectFit: "contain" }}
        />
      )}

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <ThumbUpIcon sx={{ color: "#7E5CAD" }} />
        </IconButton>
        <IconButton aria-label="share"></IconButton>
        <ExpandMore
          sx={{ color: "grey" }}
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
        {post.comments.length > 0 && !isComments ? (
          <CardContent sx={{ backgroundColor: "#eee" }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {!post.comments[0].commentCreator.photo.includes(
                    "undefined"
                  ) ? (
                    <Image
                      src={post.comments[0].commentCreator.photo}
                      alt={post.comments[0].commentCreator.name}
                      style={{ width: "100%", height: "auto" }}
                      width={60}
                      height={60}
                    />
                  ) : (
                    post.comments[0].commentCreator.name.slice(0, 1)
                  )}
                </Avatar>
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={post.comments[0].commentCreator.name}
              subheader={post.comments[0].createdAt.split("T", 1)}
            />
            <Typography sx={{ marginBottom: 2, width: "95%", mx: "auto" }}>
              {post.comments[0].content}
            </Typography>
            <Link
              href={`singlepost/${post.id}`}
              style={{ textAlign: "right", display: "block", width: "100%" }}
            >
              View all comments
            </Link>
          </CardContent>
        ) : (
          post.comments.length > comments.length &&
          isComments ?
          
          post.comments.map((comment: Comment) => (
            <CardContent
           
              sx={{
                backgroundColor: "#eee",
                marginBottom: "8px",
                borderRadius: "10px",
              }}
            >
              <CardHeader
               
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {comment.commentCreator.photo.includes("undefined") ? (
                      <Image
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.name}
                        style={{ width: "100%", height: "auto" }}
                        width={60}
                        height={60}
                      />
                    ) : (
                      comment.commentCreator.name.slice(0, 1)
                    )}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={comment.commentCreator.name}
                subheader={comment.createdAt.split("T", 1)}
              />
              <Typography sx={{ marginBottom: 2, width: "95%", mx: "auto" }}>
                {comment.content}
              </Typography>
            </CardContent>)) :  comments.map((comment: Comment) => (
            <CardContent key={comment._id}
              sx={{
                backgroundColor: "#eee",
                marginBottom: "8px",
                borderRadius: "10px",
              }}
            >
              <CardHeader
                key={comment._id}
                avatar={
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {comment.commentCreator.photo.includes("undefined") ? (
                      <Image
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.name}
                        style={{ width: "100%", height: "auto" }}
                        width={60}
                        height={60}
                      />
                    ) : (
                      comment.commentCreator.name.slice(0, 1)
                    )}
                  </Avatar>
                }
                action={
                  <IconButton aria-label="settings">
                    <MoreVertIcon />
                  </IconButton>
                }
                title={comment.commentCreator.name}
                subheader={comment.createdAt.split("T", 1)}
              />
              <Typography sx={{ marginBottom: 2, width: "95%", mx: "auto" }}>
                {comment.content}
              </Typography>
            </CardContent>))
        )}
      <form onSubmit={(e) => handleAddComment(e)} style={{display:'flex', justifyContent: 'space-between', padding: '1rem', gap: '1rem'}}>
      <TextField name="comment" id="comment" label="comment" type="text" variant="outlined" sx={{flexGrow: 1}}/>
      <Button type="submit" variant="contained">Add Comment</Button>
      </form>
      </Collapse>
    </Card>
  );
}
