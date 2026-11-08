/* =========================================================
   THE SLAYLIST SUITE
   Goodreads Mapper

   Converts raw Goodreads CSV rows into Slaylist Suite data.

   RAW GOODREADS
        ↓
   normalize / translate
        ↓
   Book + ReadingRecord + Review
   ========================================================= */

import type {
  Book,
  BookFormat,
  LibraryStatus,
} from "@/types/book";

import type {
  ReadingRecord,
  ReadingRecordStatus,
} from "@/types/reading";

import type { Review } from "@/types/review";

import type { GoodreadsRow } from "./types";


/* =========================================================
   HELPERS
   ========================================================= */

function cleanText(
  value?: string
): string | undefined {
  const cleaned = value?.trim();

  return cleaned
    ? cleaned
    : undefined;
}


function cleanGoodreadsIdentifier(
  value?: string
): string | undefined {
  if (!value) {
    return undefined;
  }

  const cleaned = value
    .replace(/^="?/, "")
    .replace(/"?$/, "")
    .trim();

  return cleaned || undefined;
}


function parseNumber(
  value?: string
): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : undefined;
}


function parsePositiveNumber(
  value?: string
): number | undefined {
  const parsed = parseNumber(value);

  if (
    parsed === undefined ||
    parsed <= 0
  ) {
    return undefined;
  }

  return parsed;
}


function parseAuthors(
  primaryAuthor: string,
  additionalAuthors: string
): string[] {
  const authors = [
    primaryAuthor,
    ...additionalAuthors.split(","),
  ]
    .map((author) => author.trim())
    .filter(Boolean);

  return Array.from(
    new Set(authors)
  );
}


function parseShelves(
  shelves: string
): string[] {
  return shelves
    .split(",")
    .map((shelf) => shelf.trim())
    .filter(Boolean);
}


function parseGoodreadsBoolean(
  value?: string
): boolean {
  const normalized =
    value
      ?.trim()
      .toLowerCase();

  return (
    normalized === "true" ||
    normalized === "yes" ||
    normalized === "1"
  );
}


/* =========================================================
   GOODREADS → SLAYLIST STATUS
   ========================================================= */

function mapLibraryStatus(
  shelf: string
): LibraryStatus {
  const normalizedShelf =
    shelf.trim().toLowerCase();

  switch (normalizedShelf) {
    case "read":
      return "read";

    case "currently-reading":
      return "currently-reading";

    case "did-not-finish":
    case "dnf":
      return "dnf";

    case "paused":
      return "paused";

    case "to-read":
    default:
      return "tbr";
  }
}


function mapReadingStatus(
  shelf: string
): ReadingRecordStatus {
  const normalizedShelf =
    shelf.trim().toLowerCase();

  switch (normalizedShelf) {
    case "read":
      return "completed";

    case "currently-reading":
      return "currently-reading";

    case "did-not-finish":
    case "dnf":
      return "dnf";

    case "paused":
      return "paused";

    default:
      return "planned";
  }
}


/* =========================================================
   FORMAT MAPPING
   ========================================================= */

function mapBookFormat(
  binding: string
): BookFormat | undefined {
  const normalized =
    binding.trim().toLowerCase();

  if (
    normalized.includes("kindle") ||
    normalized.includes("ebook") ||
    normalized.includes("e-book")
  ) {
    return "ebook";
  }

  if (
    normalized.includes("audio") ||
    normalized.includes("audible")
  ) {
    return "audiobook";
  }

  if (
    normalized.includes("paperback") ||
    normalized.includes("hardcover") ||
    normalized.includes("hardback") ||
    normalized.includes("mass market")
  ) {
    return "physical";
  }

  return undefined;
}


/* =========================================================
   DATE NORMALIZATION
   ========================================================= */

function normalizeGoodreadsDate(
  value?: string
): string | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return undefined;
  }

  return date
    .toISOString()
    .split("T")[0];
}


/* =========================================================
   CERTIFIED SLAY / TBB LOGIC
   ========================================================= */

function isCertifiedSlay(
  shelves: string[]
): boolean {
  return shelves.some(
    (shelf) =>
      shelf.toLowerCase() ===
      "5-star-reads"
  );
}


function isTbbBuddyRead(
  shelves: string[]
): boolean {
  return shelves.some(
    (shelf) =>
      shelf.toLowerCase() ===
      "tbb-buddy-reads"
  );
}


/* =========================================================
   GOODREADS ROW → BOOK
   ========================================================= */

export function mapGoodreadsRowToBook(
  row: GoodreadsRow
): Book {
  const shelves =
    parseShelves(
      row["Bookshelves"]
    );

  const format =
    mapBookFormat(
      row["Binding"]
    );

  const rating =
    parsePositiveNumber(
      row["My Rating"]
    );

  const now =
    new Date().toISOString();

  return {
    id:
      `goodreads-${row["Book Id"]}`,

    title:
      cleanText(
        row["Title"]
      ) ??
      "Untitled",

    authors:
      parseAuthors(
        row["Author"],
        row["Additional Authors"]
      ),

    isbn10:
      cleanGoodreadsIdentifier(
        row["ISBN"]
      ),

    isbn13:
      cleanGoodreadsIdentifier(
        row["ISBN13"]
      ),

    pageCount:
      parsePositiveNumber(
        row["Number of Pages"]
      ),

    publicationDate:
      cleanText(
        row["Original Publication Year"]
      ) ??
      cleanText(
        row["Year Published"]
      ),

    publisher:
      cleanText(
        row["Publisher"]
      ),

    status:
      mapLibraryStatus(
        row["Exclusive Shelf"]
      ),

    genreIds: [],

    tropeIds: [],

    tagIds: [],

    /*
      Goodreads shelves will eventually be
      converted into real Shelf IDs during
      the import process.

      Raw Goodreads shelf names are
      intentionally NOT placed here.
    */
    shelfIds: [],

    formats:
      format
        ? [format]
        : [],

    ownership: [],

    primaryFormat:
      format,

    personalRating:
      rating,

    certifiedSlay:
      isCertifiedSlay(
        shelves
      ),

    brainChemistry: false,

    favorite: false,

    privateNotes:
      cleanText(
        row["Private Notes"]
      ),

    goodreadsBookId:
      row["Book Id"],

    dateAdded:
      normalizeGoodreadsDate(
        row["Date Added"]
      ),

    source: "goodreads",

    createdAt: now,

    updatedAt: now,
  };
}


/* =========================================================
   GOODREADS ROW → READING RECORD
   ========================================================= */

export function mapGoodreadsRowToReadingRecord(
  row: GoodreadsRow
): ReadingRecord | null {
  const status =
    mapReadingStatus(
      row["Exclusive Shelf"]
    );

  /*
    Pure TBR books do not need a historical
    ReadingRecord yet.

    They exist in Slaybase as Books until an
    actual reading experience begins.
  */
  if (
    status === "planned"
  ) {
    return null;
  }

  const shelves =
    parseShelves(
      row["Bookshelves"]
    );

  const format =
    mapBookFormat(
      row["Binding"]
    );

  const rating =
    parsePositiveNumber(
      row["My Rating"]
    );

  const readCount =
    parsePositiveNumber(
      row["Read Count"]
    ) ?? 1;

  const now =
    new Date().toISOString();

  return {
    id:
      `goodreads-${row["Book Id"]}-read-1`,

    bookId:
      `goodreads-${row["Book Id"]}`,

    status,

    readingMethod:
      format,

    /*
      Goodreads gives us Date Read, but not
      necessarily the historical start date.
      We do not invent one.
    */
    finishedAt:
      normalizeGoodreadsDate(
        row["Date Read"]
      ),

    rating,

    certifiedSlay:
      isCertifiedSlay(
        shelves
      ),

    readingNumber: 1,

    isReread:
      readCount > 1,

    notes:
      cleanText(
        row["Private Notes"]
      ),

    progressEntries: [],

    createdAt: now,

    updatedAt: now,
  };
}


/* =========================================================
   GOODREADS ROW → REVIEW
   ========================================================= */

export function mapGoodreadsRowToReview(
  row: GoodreadsRow,
  readingRecord:
    ReadingRecord | null
): Review | null {
  const body =
    cleanText(
      row["My Review"]
    );

  /*
    Star ratings alone do not create Review
    entities. There must be a written review.
  */
  if (!body) {
    return null;
  }

  const rating =
    parsePositiveNumber(
      row["My Rating"]
    );

  /*
    Our audit confirmed all 10 Goodreads
    written reviews have ratings.

    We still refuse to invent one if future
    imports contain an unrated review.
  */
  if (
    rating === undefined
  ) {
    return null;
  }

  const importedDate =
    normalizeGoodreadsDate(
      row["Date Read"]
    ) ??
    normalizeGoodreadsDate(
      row["Date Added"]
    );

  const timestamp =
    importedDate
      ? `${importedDate}T00:00:00.000Z`
      : new Date().toISOString();

  return {
    id:
      `goodreads-review-${row["Book Id"]}`,

    bookId:
      `goodreads-${row["Book Id"]}`,

    readingRecordId:
      readingRecord?.id,

    rating,

    /*
      Goodreads does not provide a separate
      review title, favorite quote, or
      reaction field, so we do not invent
      those values.
    */
    body,

    containsSpoilers:
      parseGoodreadsBoolean(
        row["Spoiler"]
      ),

    createdAt:
      timestamp,

    updatedAt:
      timestamp,
  };
}


/* =========================================================
   COMPLETE ROW MAPPER
   ========================================================= */

export interface GoodreadsMappedRecord {
  book: Book;

  readingRecord:
    ReadingRecord | null;

  review:
    Review | null;

  rawShelves: string[];

  readCount: number;

  wasTbbBuddyRead: boolean;
}


export function mapGoodreadsRow(
  row: GoodreadsRow
): GoodreadsMappedRecord {
  const readingRecord =
    mapGoodreadsRowToReadingRecord(
      row
    );

  return {
    book:
      mapGoodreadsRowToBook(
        row
      ),

    readingRecord,

    review:
      mapGoodreadsRowToReview(
        row,
        readingRecord
      ),

    rawShelves:
      parseShelves(
        row["Bookshelves"]
      ),

    readCount:
      parsePositiveNumber(
        row["Read Count"]
      ) ?? 0,

    wasTbbBuddyRead:
      isTbbBuddyRead(
        parseShelves(
          row["Bookshelves"]
        )
      ),
  };
}
