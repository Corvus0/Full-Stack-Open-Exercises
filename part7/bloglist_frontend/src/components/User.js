import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { List, ListItem, ListItemText, Divider } from "@mui/material";

const User = () => {
  const users = useSelector((state) => state.users);
  const id = useParams().id;
  if (!users.length) {
    return null;
  }
  const currUser = users.find((u) => u.id === id);
  return (
    <div>
      <Divider />
      <h2>{currUser.name}</h2>
      <Divider />
      <h2>Added Blogs</h2>
      <List>
        {currUser.blogs.map((b) => (
          <>
            <Divider />
            <ListItem key={b.id}>
              <ListItemText primary={b.title} />
            </ListItem>
          </>
        ))}
      </List>
    </div>
  );
};

export default User;
