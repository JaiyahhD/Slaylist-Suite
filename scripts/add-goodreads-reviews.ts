/* =========================================================
   THE SLAYLIST SUITE
   Goodreads Review Migration

   Adds Goodreads Review entities to the EXISTING
   enriched development dataset without regenerating
   books or destroying enriched coverUrl values.
   ========================================================= */

import fs from "node:fs";
import path from "node:path";

import Papa from "papaparse";

import type { GoodreadsRow } from "../src/lib/goodreads/types";

import {
  mapGoodreadsRowToReview,
} from "../src/lib/goodreads/mapper";

import type {
  Book,
  ReadingRecord,
  Review,
} from "../src/types";


/* =========================================================
   PATHS
   ========================================================= */

const csvPath =
  path.resolve(
    "data/imports/Goodreads.csv"
  );

const libraryPath =
  path.resolve(
    "src/data/goodreads-library.json"
  );


/* =========================================================
   EXISTING RECORD TYPE
   ========================================================= */

type ExistingLibraryRecord = {
  book: Book;

  readingRecord:
    ReadingRecord | null;

  review?: Review | null;

  rawShelves: string[];

  readCount: number;

  wasTbbBuddyRead: boolean;
};


/* =========================================================
   LOAD CSV
   ========================================================= */

const csv =
  fs.readFileSync(
    csvPath,
    "utf8"
  );

const parsed =
  Papa.parse<GoodreadsRow>(
    csv,
    {
      header: true,
      skipEmptyLines: true,
    }
  );

if (
  parsed.errors.length > 0
) {
  console.error(
    "CSV PARSER ERRORS:"
  );

  console.error(
    parsed.errors
  );

  process.exit(1);
}


/* =========================================================
   LOAD EXISTING ENRICHED LIBRARY
   ========================================================= */

const library =
  JSON.parse(
    fs.readFileSync(
      libraryPath,
      "utf8"
    )
  ) as ExistingLibraryRecord[];


/* =========================================================
   INDEX CSV ROWS BY BOOK ID
   ========================================================= */

const rowsByBookId =
  new Map<
    string,
    GoodreadsRow
  >();

for (
  const row of parsed.data
) {
  rowsByBookId.set(
    `goodreads-${row["Book Id"]}`,
    row
  );
}


/* =========================================================
   ADD REVIEWS
   ========================================================= */

let reviewsAdded = 0;
let booksWithCoversBefore = 0;

for (
  const record of library
) {
  if (
    record.book.coverUrl
  ) {
    booksWithCoversBefore += 1;
  }

  const row =
    rowsByBookId.get(
      record.book.id
    );

  if (!row) {
    record.review = null;
    continue;
  }

  const review =
    mapGoodreadsRowToReview(
      row,
      record.readingRecord
    );

  record.review =
    review;

  if (review) {
    reviewsAdded += 1;
  }
}


/* =========================================================
   SAVE
   ========================================================= */

fs.writeFileSync(
  libraryPath,
  JSON.stringify(
    library,
    null,
    2
  ),
  "utf8"
);


/* =========================================================
   VERIFY COVERS SURVIVED
   ========================================================= */

const booksWithCoversAfter =
  library.filter(
    (record) =>
      Boolean(
        record.book.coverUrl
      )
  ).length;


/* =========================================================
   REPORT
   ========================================================= */

console.log("");
console.log(
  "=========================================="
);
console.log(
  "   THE SLAYLIST SUITE // REVIEW MIGRATION"
);
console.log(
  "=========================================="
);
console.log("");

console.log(
  `Library records: ${library.length}`
);

console.log(
  `Reviews added: ${reviewsAdded}`
);

console.log("");

console.log(
  `Covers before: ${booksWithCoversBefore}`
);

console.log(
  `Covers after: ${booksWithCoversAfter}`
);

console.log("");

if (
  booksWithCoversBefore !==
  booksWithCoversAfter
) {
  console.error(
    "⚠ COVER COUNT CHANGED."
  );

  process.exit(1);
}

if (
  reviewsAdded !== 10
) {
  console.error(
    `⚠ EXPECTED 10 REVIEWS, FOUND ${reviewsAdded}.`
  );

  process.exit(1);
}

console.log(
  "✓ 10 GOODREADS REVIEWS MIGRATED"
);

console.log(
  "✓ COVER DATA PRESERVED"
);

console.log("");
console.log(
  "=========================================="
);
console.log(
  "   REVIEW DATA READY"
);
console.log(
  "=========================================="
);
console.log("");