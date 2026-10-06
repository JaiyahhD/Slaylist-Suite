import { mapGoodreadsRow } from "@/lib/goodreads/mapper";

import type { GoodreadsRow } from "@/lib/goodreads/types";


const testRow: GoodreadsRow = {
  "Book Id": "123456",

  "Title": "The Slaylist Test Book",

  "Author": "Jaiyah Example",

  "Author l-f": "Example, Jaiyah",

  "Additional Authors": "",

  "ISBN": '="1234567890"',

  "ISBN13": '="9781234567890"',

  "My Rating": "5",

  "Publisher": "Pretty Smart Press",

  "Binding": "Paperback",

  "Number of Pages": "384",

  "Year Published": "2026",

  "Original Publication Year": "2026",

  "Date Read": "2026/10/06",

  "Date Added": "2026/09/01",

  "Bookshelves":
    "5-star-reads, fantasy, favorites",

  "Bookshelves with positions":
    "5-star-reads (#1), fantasy (#1), favorites (#1)",

  "Exclusive Shelf": "read",

  "My Review":
    "She ate. The end.",

  "Spoiler": "",

  "Private Notes":
    "Testing the Slaylist import system.",

  "Read Count": "1",

  "Owned Copies": "1",
};


export const mappedGoodreadsTest =
  mapGoodreadsRow(testRow);