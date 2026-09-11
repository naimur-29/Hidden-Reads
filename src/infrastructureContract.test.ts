import type { books } from "../infrastructure/db_structure";
import { describe, it } from "vitest";

type BookRecord = books[number];

// @ts-expect-error downloads is retired from the books schema.
export type RetiredDownloadsField = BookRecord["downloads"];

export {};

describe("infrastructure schema", () => {
  it("keeps the books record contract checked by TypeScript", () => {});
});
