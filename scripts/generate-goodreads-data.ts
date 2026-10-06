import fs from "node:fs";
import path from "node:path";

import {
  parseGoodreadsCsv,
} from "../src/lib/goodreads/parser";

import {
  mapGoodreadsRow,
} from "../src/lib/goodreads/mapper";




/* =========================================================
   FILE LOCATIONS
   ========================================================= */

const inputPath = path.join(
  process.cwd(),
  "data",
  "imports",
  "Goodreads.csv"
);

const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "goodreads-library.json"
);


/* =========================================================
   READ + PARSE
   ========================================================= */

const csvText =
  fs.readFileSync(
    inputPath,
    "utf8"
  );

const parsed =
  parseGoodreadsCsv(csvText);


/* =========================================================
   SAFETY CHECK
   ========================================================= */

if (parsed.errors.length > 0) {
  console.error(
    "Goodreads CSV contains parser errors."
  );

  console.dir(
    parsed.errors,
    {
      depth: null,
    }
  );

  process.exit(1);
}


/* =========================================================
   MAP INTO SLAYLIST DATA
   ========================================================= */

const library =
  parsed.rows.map((row) =>
    mapGoodreadsRow(row)
  );


/* =========================================================
   WRITE DEVELOPMENT DATASET
   ========================================================= */

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    library,
    null,
    2
  ),
  "utf8"
);


/* =========================================================
   REPORT
   ========================================================= */

const books =
  library.map(
    (record) => record.book
  );

const certifiedSlays =
  books.filter(
    (book) => book.certifiedSlay
  ).length;

const buddyReads =
  library.filter(
    (record) =>
      record.wasTbbBuddyRead
  ).length;


console.log("\n");
console.log(
  "=========================================="
);
console.log(
  "   THE SLAYLIST SUITE // DATA GENERATED"
);
console.log(
  "=========================================="
);

console.log(
  `\nBooks generated: ${books.length}`
);

console.log(
  `Certified Slays: ${certifiedSlays}`
);

console.log(
  `TBB Buddy Reads: ${buddyReads}`
);

console.log(
  `Output: ${outputPath}`
);

console.log("\n");
console.log(
  "=========================================="
);
console.log(
  "   SLAYBASE DATA READY"
);
console.log(
  "=========================================="
);
console.log("\n");