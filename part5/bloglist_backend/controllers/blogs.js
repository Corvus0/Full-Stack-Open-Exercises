const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const userExtractor = require("../utils/middleware").userExtractor;

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const blog = new Blog(request.body);
  const user = request.user;
  blog.user = user._id;

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  const user = request.user;
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: "unauthorized user" });
  }
  const removedBlog = await Blog.findByIdAndRemove(request.params.id);
  user.blogs = user.blogs.filter((blog) => blog.id !== removedBlog._id);
  await user.save();

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user.id,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;

[
  {
    author: "Joel Spolsky",
    id: "5a43fde2cbd20b12a2c34e91",
    likes: 1,
    title: "The Joel Test: 12 Steps to Better Code",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/",
    user: "634f355f60ee18888d3a4823",
  },
  {
    author: "Joel Spolsky",
    id: "5a43fde2cbd20b12a2c34e91",
    likes: 0,
    title: "The Joel Test: 12 Steps to Better Code",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/",
    user: "634f355f60ee18888d3a4823",
  },
];
