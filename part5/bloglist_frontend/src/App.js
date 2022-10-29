import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState({
    message: null,
    error: false,
  });
  const [user, setUser] = useState(null);

  const blogSort = (b1, b2) => b2.likes - b1.likes;

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort(blogSort);
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginUser = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setMessage({ message: "wrong username or password", error: true });
      setTimeout(() => {
        setMessage({ message: null, error: false });
      }, 5000);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    returnedBlog.user = { username: user.username, name: user.name };
    const newBlogs = blogs.concat(returnedBlog);
    newBlogs.sort(blogSort);
    setBlogs(newBlogs);
    setMessage({
      message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
      error: false,
    });
    setTimeout(() => {
      setMessage({ message: null, error: false });
    }, 5000);
  };

  const updateBlog = (blog) => {
    blogService.update(blog);
    const sortedBlogs = [...blogs.sort(blogSort)];
    setBlogs(sortedBlogs);
  };

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id);
      const updatedBlogs = blogs.filter((b) => b.id !== blog.id);
      updatedBlogs.sort(blogSort);
      setBlogs(updatedBlogs);
    }
  };

  const blogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message.message} error={message.error} />
        <LoginForm loginUser={loginUser} />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.message} error={message.error} />
      <p>
        {user.name} logged in
        <button onClick={logout} id="logout">
          logout
        </button>
      </p>
      {blogForm()}
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          username={user.username}
          removeBlog={removeBlog}
          updateBlog={updateBlog}
        />
      ))}
    </div>
  );
};

export default App;
