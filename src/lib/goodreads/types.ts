/* =========================================================
   THE SLAYLIST SUITE
   Goodreads Import Types

   Represents the RAW structure coming from Jaiyah's actual
   Goodreads library export.

   GoodreadsRow = untouched source data
   Book / ReadingRecord = cleaned Slaylist data
   ========================================================= */

export interface GoodreadsRow {
  "Book Id": string;

  "Title": string;

  "Author": string;

  "Author l-f": string;

  "Additional Authors": string;

  "ISBN": string;

  "ISBN13": string;

  "My Rating": string;

  "Publisher": string;

  "Binding": string;

  "Number of Pages": string;

  "Year Published": string;

  "Original Publication Year": string;

  "Date Read": string;

  "Date Added": string;

  "Bookshelves": string;

  "Bookshelves with positions": string;

  "Exclusive Shelf": string;

  "My Review": string;

  "Spoiler": string;

  "Private Notes": string;

  "Read Count": string;

  "Owned Copies": string;
}

