const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token;

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.listWithManyBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }

  await User.deleteMany({});
  const user = {
    username: "hellas",
    name: "Arto Hellas",
    password: "salainen",
  };
  await api.post("/api/users").send(user).expect(201);
  const login = { username: user.username, password: user.password };
  const login_user = await api.post("/api/login").send(login).expect(200);
  token = login_user.body.token;
});

test("blogs are returned as json and are correct amount", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(response.body).toHaveLength(helper.listWithManyBlogs.length);
});

test("blogs are returned with appropriate id", async () => {
  const blogsAtStart = await helper.blogsInDb();
  for (blog of blogsAtStart) {
    expect(blog.id).toBeDefined();
  }
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    likes: 0,
  };

  const result = await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  newBlog.id = result.body.id;
  newBlog.user = result.body.user.toString();

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

  blogsAtEnd.forEach((blog) => {
    if (blog.user) {
      blog.user = blog.user.toString();
    }
  });
  expect(blogsAtEnd).toContainEqual(newBlog);
});

test("a blog added with no likes has zero likes", async () => {
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
  };

  const result = await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  newBlog.id = result.body.id;
  newBlog.user = result.body.user.toString();
  newBlog.likes = 0;

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

  blogsAtEnd.forEach((blog) => {
    if (blog.user) {
      blog.user = blog.user.toString();
    }
  });
  expect(blogsAtEnd).toContainEqual(newBlog);
});

test("blogs require a title", async () => {
  const newBlog = {
    author: "test",
    url: "",
  };

  await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length);
});

test("blogs require a url", async () => {
  const newBlog = {
    title: "test",
    author: "test",
  };

  await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(400);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length);
});

test("blogs can be deleted", async () => {
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    likes: 0,
  };

  const result = await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  newBlog.id = result.body.id;
  newBlog.user = result.body.user.toString();

  await api
    .delete(`/api/blogs/${newBlog.id}`)
    .auth(token, { type: "bearer" })
    .expect(204);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length);

  blogsAtEnd.forEach((blog) => {
    if (blog.user) {
      blog.user = blog.user.toString();
    }
  });
  expect(blogsAtEnd).not.toContainEqual(newBlog);
});

test("blogs can be updated", async () => {
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    likes: 0,
  };

  const result = await api
    .post("/api/blogs")
    .auth(token, { type: "bearer" })
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  newBlog.id = result.body.id;
  newBlog.user = result.body.user.toString();
  newBlog.likes = 1;

  await api.put(`/api/blogs/${newBlog.id}`).send(newBlog);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length + 1);

  blogsAtEnd.forEach((blog) => {
    if (blog.user) {
      blog.user = blog.user.toString();
    }
  });
  expect(blogsAtEnd).toContainEqual(newBlog);
});

test("a valid token must be provided", async () => {
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    likes: 0,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.listWithManyBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
