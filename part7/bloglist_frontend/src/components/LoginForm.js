import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../reducers/userReducer";
import { TextField, Button } from "@mui/material";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login(username, password));

    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          id="username"
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          id="password"
        />
      </div>
      <Button type="submit" id="login-button">
        login
      </Button>
    </form>
  );
};

export default LoginForm;
