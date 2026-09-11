import { describe, expect, it } from "vitest";
import { isAllowedSourceLink } from "./commonFunctions";

describe("isAllowedSourceLink", () => {
  it("accepts optional and normal source links", () => {
    expect(isAllowedSourceLink("")).toBe(true);
    expect(isAllowedSourceLink("https://example.com/books/1")).toBe(true);
    expect(isAllowedSourceLink("http://example.com/books/1")).toBe(true);
  });

  it("rejects relative, unsafe, malformed, and direct download links", () => {
    for (const value of [
      "/books/1",
      "javascript:alert(1)",
      "data:text/plain,book",
      "https://example.com/book.pdf",
      "https://example.com/book.epub",
      "https://example.com/book.mobi",
      "https://example.com/book.azw",
      "https://example.com/book.azw3",
      "https://example.com/book.cbz",
      "https://example.com/book.cbr",
      "https://example.com/download/book",
      "not a URL",
    ]) {
      expect(isAllowedSourceLink(value)).toBe(false);
    }
  });
});
