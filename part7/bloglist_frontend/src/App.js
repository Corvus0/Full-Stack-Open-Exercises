import { useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import Users from "./components/Users";
import User from "./components/User";
import BlogInfo from "./components/BlogInfo";
import NavigationBar from "./components/NavigationBar";
import { initializeBlogs } from "./reducers/blogReducer";
import { loginToken } from "./reducers/userReducer";
import { initializeUsers } from "./reducers/usersReducer";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, List } from "@mui/material";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loginToken());
  }, [dispatch]);

  const TogglableBlogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm />
    </Togglable>
  );

  const Home = () => {
    return (
      <div>
        {user && <TogglableBlogForm />}
        <List>
          {user && blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
        </List>
      </div>
    );
  };

  return (
    <Container>
      <Router>
        <NavigationBar />
        <h2>{user ? "Blogs" : "Log in to Application"}</h2>
        <Notification />
        {!user && <LoginForm />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={blogs.length && <BlogInfo />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
