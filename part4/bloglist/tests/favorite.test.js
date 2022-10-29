const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

describe("favorite blog", () => {
  test("of empty list is none", () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toEqual({});
  });

  test("when list has one blog is that", () => {
    const result = listHelper.favoriteBlog(helper.listWithOneBlog);
    expect(result).toEqual({
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("of a bigger list is determined correctly", () => {
    const result = listHelper.favoriteBlog(helper.listWithManyBlogs);
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
