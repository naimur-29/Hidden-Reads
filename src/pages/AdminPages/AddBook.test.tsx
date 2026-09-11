import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AddBook from "./AddBook";

const setDoc = vi.fn().mockResolvedValue(undefined);
const updateDoc = vi.fn().mockResolvedValue(undefined);
vi.mock("../../hooks/useSetDoc", () => ({ default: () => [setDoc, false, "", vi.fn()] }));
vi.mock("../../hooks/useUpdateDoc", () => ({ default: () => [updateDoc, false] }));
vi.mock("../../components/ErrorToast", () => ({ default: () => null }));
vi.mock("../../components/SuccessToast", () => ({ default: () => null }));

describe("AddBook", () => {
  afterEach(cleanup);
  beforeEach(() => { setDoc.mockClear(); updateDoc.mockClear(); });

  it("uses an independent volume count and has no download fields", () => {
    render(<AddBook />);
    expect(screen.getByLabelText("Volumes/Chapters")).toHaveAttribute("type", "number");
    expect(screen.queryByLabelText(/EPUB|PDF/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download Links/i)).not.toBeInTheDocument();
  });

  it("writes books and stats without creating bookDownloads", async () => {
    render(<AddBook />);
    const values: Record<string, string> = { "Title*": "Book", "Author*": "Author", "Synopsis*": "Summary", "Published*": "2024", "Status*": "Complete" };
    for (const [label, value] of Object.entries(values)) fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fireEvent.change(screen.getByLabelText("Volumes/Chapters"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Submit Book" }));
    expect(setDoc).toHaveBeenCalledWith("books", expect.any(String), expect.objectContaining({ volumes: 5 }));
    expect(setDoc).not.toHaveBeenCalledWith("bookDownloads", expect.anything(), expect.anything());
  });
});
