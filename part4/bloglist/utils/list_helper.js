const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const favorite = {};
  for (let blog of blogs) {
    if (!favorite.likes || blog.likes > favorite.likes) {
      favorite.title = blog.title;
      favorite.author = blog.author;
      favorite.likes = blog.likes;
    }
  }
  return favorite;
};

const mostBlogs = (blogs) => {
  const blog_counts = _.countBy(blogs, "author");
  const author_count = _.maxBy(_.entries(blog_counts), (entry) => entry[1]);
  return author_count
    ? { author: author_count[0], blogs: author_count[1] }
    : {};
};

const mostLikes = (blogs) => {
  const author_likes = blogs.map((blog) => ({
    author: blog.author,
    likes: blog.likes,
  }));
  const author_total_likes = _.map(
    _.entries(_.groupBy(author_likes, "author")),
    (entry) => ({
      author: entry[0],
      likes: entry[1].reduce((total, blog) => total + blog.likes, 0),
    })
  );
  return author_total_likes.length ? _.maxBy(author_total_likes, "likes") : {};
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
