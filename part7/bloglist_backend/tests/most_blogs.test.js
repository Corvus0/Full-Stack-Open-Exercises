const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

describe("most blogs", () => {
  test("of empty list is none", () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toEqual({});
  });

  test("when list has one blog is that", () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      blogs: 1,
    });
  });

  test("of a bigger list is determined correctly", () => {
    const result = listHelper.mostBlogs(helper.listWithManyBlogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
