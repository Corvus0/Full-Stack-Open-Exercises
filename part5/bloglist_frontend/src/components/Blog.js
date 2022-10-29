import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, username, removeBlog, updateBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const showWhenVisible = { display: visible ? "" : "none" };
  const buttonName = visible ? "hide" : "view";

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}{" "}
      <button onClick={toggleVisibility}>{buttonName}</button>
      <div style={showWhenVisible} className="blogInfo">
        {blog.url}
        <br />
        likes {likes}
        <button
          onClick={() => {
            setLikes(likes + 1);
            blog.likes = likes + 1;
            updateBlog(blog);
          }}
          id="like-button"
        >
          like
        </button>
        <br />
        {blog.user && blog.user.name}
        <br />
        {blog.user && blog.user.username === username && (
          <button onClick={() => removeBlog(blog)} id="remove-button">
            remove
          </button>
        )}
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  removeBlog: PropTypes.func.isRequired,
  updateBlog: PropTypes.func.isRequired,
};

export default Blog;
