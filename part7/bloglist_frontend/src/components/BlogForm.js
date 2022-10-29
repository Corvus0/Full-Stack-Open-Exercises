import { useState } from "react";
import { setNotification } from "../reducers/notificationReducer";
import { createBlog } from "../reducers/blogReducer";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button } from "@mui/material";

const BlogForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(createBlog({ title, author, url }, user));
    dispatch(
      setNotification(`a new blog ${title} by ${author} added`, 5, false)
    );

    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={addBlog}>
        <div>
          <TextField
            label="Title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder="Write blog title here"
            id="blog-title-input"
          ></TextField>
        </div>
        <div>
          <TextField
            label="Author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder="Write blog author here"
            id="blog-author-input"
          ></TextField>
        </div>
        <div>
          <TextField
            label="URL"
            type="text"
            value={url}
            name="URL"
            onChange={({ target }) => setUrl(target.value)}
            placeholder="Write blog URL here"
            id="blog-url-input"
          ></TextField>
        </div>
        <Button type="submit" id="save-blog">
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
