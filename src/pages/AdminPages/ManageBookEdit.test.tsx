import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ManageBookEdit from "./ManageBookEdit";

const getDoc = vi.fn();
const updateDoc = vi.fn().mockResolvedValue(undefined);
const deleteDoc = vi.fn().mockResolvedValue(undefined);
const bookRecord = vi.hoisted(() => ({ title: "Book", volumes: 3, info_link: "https://example.com", cover_link: "cover", cover_shade: "#000" }));
vi.mock("../../hooks/useGetDoc", () => ({ default: () => [getDoc, bookRecord, false] }));
vi.mock("../../hooks/useUpdateDoc", () => ({ default: () => [updateDoc, false] }));
vi.mock("../../hooks/useDeleteDoc", () => ({ default: () => [deleteDoc, false] }));
vi.mock("../../components/ErrorToast", () => ({ default: () => null }));
vi.mock("../../components/SuccessToast", () => ({ default: () => null }));

describe("ManageBookEdit", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.spyOn(window, "setTimeout").mockImplementation((callback) => {
      callback();
      return 0 as unknown as ReturnType<typeof window.setTimeout>;
    });
    vi.spyOn(window, "clearTimeout").mockImplementation(() => undefined);
  });

  it("loads books and exposes only volume editing for counts", () => {
    render(<MemoryRouter initialEntries={["/edit===book1"]}><Routes><Route path="/:id" element={<ManageBookEdit />} /></Routes></MemoryRouter>);
    expect(screen.getByText("Book")).toBeInTheDocument();
    expect(getDoc).toHaveBeenCalledWith("books", "book1");
    expect(screen.queryByText("Edit Download Info")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/EPUB|PDF/i)).not.toBeInTheDocument();
  });

  it("updates only books.volumes", () => {
    render(<MemoryRouter initialEntries={["/edit===book1"]}><Routes><Route path="/:id" element={<ManageBookEdit />} /></Routes></MemoryRouter>);
    expect(screen.getByText("Book")).toBeInTheDocument();
    fireEvent.change(screen.getAllByRole("spinbutton")[0], { target: { value: "6" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Update" })[2]);
    expect(updateDoc).toHaveBeenCalledWith("books", "book1", { volumes: 6 });
    expect(deleteDoc).not.toHaveBeenCalledWith("bookDownloads", expect.anything());
  });
});
