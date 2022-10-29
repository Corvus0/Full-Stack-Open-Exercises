import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const blog = {
    title: "test title",
    author: "test author",
    url: "test.url",
    likes: 0,
    user: {
      id: 0,
      username: "tester",
      name: "tester testest",
    },
  };

  const mockRemove = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        username={blog.user.username}
        removeBlog={mockRemove}
        updateBlog={mockUpdate}
      />
    ).container;
  });

  test("displays title and author only", () => {
    const div = container.querySelector(".blogInfo");
    expect(div).toHaveStyle("display: none");
  });

  test("displays all information after clicking button", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".blogInfo");
    expect(div).not.toHaveStyle("display: none");
  });

  test("calls event handler twice when like button is clicked twice", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("like");
    await user.click(button);
    await user.click(button);
    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});
