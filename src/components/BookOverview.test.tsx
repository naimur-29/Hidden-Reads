import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BookOverview from "./BookOverview";

const getBookInfo = vi.fn();
const updateBookInfo = vi.fn();

vi.mock("../hooks/useGetDoc", () => ({ default: () => [getBookInfo, {
  title: "A book", author: "An author", synopsis: "A synopsis", published: "2024",
  status: "Complete", volumes: 4, views: 2, genres: "Fantasy", info_link: "https://example.com/book",
  cover_link: "", cover_shade: "#000",
}, false] }));
vi.mock("../hooks/useUpdateDoc", () => ({ default: () => [updateBookInfo] }));

const renderOverview = (infoLink = "https://example.com/book") => {
  vi.doMock("../hooks/useGetDoc", () => ({ default: () => [getBookInfo, {
    title: "A book", author: "An author", synopsis: "A synopsis", published: "2024",
    status: "Complete", volumes: 4, views: 2, genres: "Fantasy", info_link: infoLink,
    cover_link: "", cover_shade: "#000",
  }, false] }));
  return render(<MemoryRouter initialEntries={["/book_1"]}><Routes><Route path="/:info" element={<BookOverview />} /></Routes></MemoryRouter>);
};

describe("BookOverview", () => {
  afterEach(cleanup);
  beforeEach(() => { getBookInfo.mockClear(); updateBookInfo.mockClear(); });

  it("shows metadata policy without download controls or counter", () => {
    renderOverview();
    expect(screen.getByText("Hidden Reads provides book information only. It does not host or distribute book files.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /download/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/downloads:/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See more" })).toHaveAttribute("href", "https://example.com/book");
    expect(getBookInfo).toHaveBeenCalledWith("books", "1");
    expect(updateBookInfo).toHaveBeenCalledWith("books", "1", { views: expect.anything() });
  });
});
