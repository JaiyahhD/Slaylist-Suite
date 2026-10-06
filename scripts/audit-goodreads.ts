import fs from "node:fs";
import path from "node:path";

import {
  parseGoodreadsCsv,
} from "../src/lib/goodreads/parser";

import {
  validateGoodreadsRows,
} from "../src/lib/goodreads/validator";


/* =========================================================
   LOCATE GOODREADS EXPORT
   ========================================================= */

const csvPath = path.join(
  process.cwd(),
  "data",
  "imports",
  "Goodreads.csv"
);


/* =========================================================
   READ CSV
   ========================================================= */

const csvText =
  fs.readFileSync(
    csvPath,
    "utf8"
  );


/* =========================================================
   PARSE CSV
   ========================================================= */

const parsed =
  parseGoodreadsCsv(csvText);


/* =========================================================
   VALIDATE DATA
   ========================================================= */

const summary =
  validateGoodreadsRows(
    parsed.rows
  );


/* =========================================================
   REPORT
   ========================================================= */

console.log("\n");
console.log(
  "=========================================="
);
console.log(
  "   THE SLAYLIST SUITE // IMPORT AUDIT"
);
console.log(
  "=========================================="
);

console.log(
  `\nCSV rows parsed: ${parsed.totalRows}`
);

console.log(
  `Parser errors: ${parsed.errors.length}`
);


console.log("\n--- LIBRARY STATUS ---");

console.log(
  `TBR: ${summary.statuses.tbr}`
);

console.log(
  `Read: ${summary.statuses.read}`
);

console.log(
  `Currently Reading: ${summary.statuses.currentlyReading}`
);

console.log(
  `DNF: ${summary.statuses.dnf}`
);

console.log(
  `Paused: ${summary.statuses.paused}`
);

console.log(
  `Other: ${summary.statuses.other}`
);


console.log("\n--- SLAY DATA ---");

console.log(
  `Certified Slays: ${summary.certifiedSlays}`
);

console.log(
  `Five-Star Ratings: ${summary.ratedFiveStars}`
);

console.log(
  `Written Reviews: ${summary.writtenReviews}`
);

console.log(
  `Books Read More Than Once: ${summary.rereadBooks}`
);

console.log(
  `Total Recorded Reads: ${summary.totalRecordedReads}`
);


console.log("\n--- METADATA ---");

console.log(
  `Missing ISBN-13: ${summary.missingIsbn13}`
);

console.log(
  `Missing Page Count: ${summary.missingPageCount}`
);

console.log(
  `Missing Publication Year: ${summary.missingPublicationYear}`
);

console.log(
  `Books With Private Notes: ${summary.booksWithPrivateNotes}`
);

console.log(
  `Books With Additional Authors: ${summary.booksWithAdditionalAuthors}`
);


console.log("\n--- ORGANIZATION ---");

console.log(
  `Unique Goodreads Shelves: ${summary.uniqueGoodreadsShelves}`
);

console.log(
  "\nShelf Names:"
);

console.log(
  summary.shelfNames.join(", ")
);


if (parsed.errors.length > 0) {
  console.log("\n--- PARSER ERRORS ---");

  console.dir(
    parsed.errors,
    {
      depth: null,
    }
  );
}


console.log("\n");
console.log(
  "=========================================="
);
console.log(
  "   AUDIT COMPLETE"
);
console.log(
  "=========================================="
);
console.log("\n");

