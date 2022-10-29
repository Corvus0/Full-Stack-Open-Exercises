import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";

const Blog = ({ blog }) => {
  return (
    <>
      <Divider />
      <ListItem className="blog">
        <ListItemButton component={Link} to={`/blogs/${blog.id}`}>
          <ListItemText primary={`${blog.title} ${blog.author}`} />
        </ListItemButton>
      </ListItem>
    </>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
