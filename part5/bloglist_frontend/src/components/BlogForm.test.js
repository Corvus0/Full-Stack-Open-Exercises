import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  test("displays title and author only", async () => {
    const createBlog = jest.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    const titleInput = screen.getByPlaceholderText("write blog title here");
    const authorInput = screen.getByPlaceholderText("write blog author here");
    const urlInput = screen.getByPlaceholderText("write blog url here");
    const sendButton = screen.getByText("create");

    await user.type(titleInput, "testing a title...");
    await user.type(authorInput, "testing an author...");
    await user.type(urlInput, "testing a url...");
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("testing a title...");
    expect(createBlog.mock.calls[0][0].author).toBe("testing an author...");
    expect(createBlog.mock.calls[0][0].url).toBe("testing a url...");
  });
});
