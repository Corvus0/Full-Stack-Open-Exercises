import { logout } from "../reducers/userReducer";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";

const LoggedIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  if (!user) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      {user.name} Logged In
      <Button color="inherit" onClick={handleLogout} id="logout">
        Logout
      </Button>
    </>
  );
};

const NavigationBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        <LoggedIn />
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
