const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");
const _ = require("lodash");

describe("most likes", () => {
  test("of empty list is none", () => {
    const result = listHelper.mostLikes([]);
    expect(result).toEqual({});
  });

  test("when list has one blog is that", () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 5,
    });
  });

  test("of a bigger list is determined correctly", () => {
    const result = listHelper.mostLikes(helper.listWithManyBlogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
