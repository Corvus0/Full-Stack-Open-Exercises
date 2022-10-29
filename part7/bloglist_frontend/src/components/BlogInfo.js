import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog, removeBlog } from "../reducers/blogReducer";
import { useParams, useNavigate } from "react-router-dom";
import blogService from "../services/blogs";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const BlogInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const id = useParams().id;

  const blog = blogs.find((b) => b.id === id);
  const [likes, setLikes] = useState(blog.likes);
  const [comments, setComments] = useState(blog.comments);
  const [comment, setComment] = useState("");

  const deleteBlog = (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      dispatch(removeBlog(blog.id));
    }
    navigate("/");
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const newComment = { content: comment, blog: blog.id };
    const returnedComment = await blogService.comment(newComment);
    setComments(comments.concat(returnedComment.data));
    setComment("");
  };

  return (
    <div>
      <Divider />
      <h2>{blog.title}</h2>
      <Divider />
      <p>{blog.url}</p>
      <p>
        {likes} likes
        <Button
          onClick={() => {
            setLikes(likes + 1);
            dispatch(updateBlog({ ...blog, likes: blog.likes + 1 }));
          }}
          id="like-button"
        >
          like
        </Button>
      </p>

      <p>added by {blog.user.name}</p>
      {user && blog.user && blog.user.username === user.username && (
        <Button onClick={() => deleteBlog(blog)} id="remove-button">
          remove
        </Button>
      )}
      <Divider />
      <h3>Comments</h3>
      <form onSubmit={handleComment}>
        <TextField
          label="Comment"
          type="text"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Write your comment here"
        ></TextField>
        <br />
        <Button>add comment</Button>
      </form>
      <List>
        {comments.map((c) => (
          <>
            <Divider />
            <ListItem key={c.id}>
              <ListItemText primary={c.content} />
            </ListItem>
          </>
        ))}
      </List>
    </div>
  );
};

export default BlogInfo;
