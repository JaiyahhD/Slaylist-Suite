import fs from "node:fs";
import path from "node:path";


/* =========================================================
   THE SLAYLIST SUITE // COVER ENRICHMENT
   ========================================================= */

type Book = {
  id: string;
  title: string;
  authors: string[];
  isbn10?: string;
  isbn13?: string;
  coverUrl?: string;
};

type GoodreadsLibraryRecord = {
  book: Book;
  readingRecord: unknown | null;
  rawShelves: string[];
  readCount: number;
  wasTbbBuddyRead: boolean;
};

type OpenLibrarySearchDoc = {
  title?: string;
  author_name?: string[];
  cover_i?: number;
  isbn?: string[];
};

type OpenLibrarySearchResponse = {
  numFound?: number;
  docs?: OpenLibrarySearchDoc[];
};


/* =========================================================
   CONFIG
   ========================================================= */

const DATA_FILE = path.resolve(
  process.cwd(),
  "src/data/goodreads-library.json"
);

const CHECKPOINT_EVERY = 25;

/*
  Keep requests polite and intentionally paced.

  350ms means roughly fewer than 3 requests/second
  when requests are performed sequentially.
*/
const REQUEST_DELAY_MS = 350;


/* =========================================================
   HELPERS
   ========================================================= */

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}


function normalizeText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


function cleanIsbn(value?: string) {
  if (!value) {
    return undefined;
  }

  const cleaned = value
    .replace(/[^0-9Xx]/g, "")
    .toUpperCase();

  return cleaned || undefined;
}


function writeLibrary(
  library: GoodreadsLibraryRecord[]
) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(
      library,
      null,
      2
    ),
    "utf8"
  );
}


/* =========================================================
   ISBN COVER LOOKUP
   ========================================================= */

async function findCoverByIsbn(
  isbn: string
): Promise<string | null> {
  const clean = cleanIsbn(isbn);

  if (!clean) {
    return null;
  }

  /*
    Open Library's Covers API can return a 404
    when default=false and no cover exists.

    We use the large cover when available.
  */

  const coverUrl =
    `https://covers.openlibrary.org/b/isbn/` +
    `${encodeURIComponent(clean)}-L.jpg?default=false`;

  try {
    const response =
      await fetch(
        coverUrl,
        {
          method: "HEAD",
          redirect: "follow",
        }
      );

    if (!response.ok) {
      return null;
    }

    const contentType =
      response.headers.get(
        "content-type"
      );

    if (
      contentType &&
      !contentType.startsWith(
        "image/"
      )
    ) {
      return null;
    }

    /*
      Store the clean URL without the
      validation query parameter.
    */

    return (
      `https://covers.openlibrary.org/b/isbn/` +
      `${encodeURIComponent(clean)}-L.jpg`
    );
  } catch {
    return null;
  }
}


/* =========================================================
   TITLE + AUTHOR SEARCH
   ========================================================= */

async function findCoverByTitleAndAuthor(
  title: string,
  authors: string[]
): Promise<string | null> {
  const primaryAuthor =
    authors[0]?.trim();

  if (!title.trim()) {
    return null;
  }

  const params =
    new URLSearchParams();

  params.set(
    "title",
    title
  );

  if (primaryAuthor) {
    params.set(
      "author",
      primaryAuthor
    );
  }

  params.set(
    "fields",
    "title,author_name,cover_i,isbn"
  );

  params.set(
    "limit",
    "10"
  );

  const url =
    `https://openlibrary.org/search.json?${params.toString()}`;

  try {
    const response =
      await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as
        OpenLibrarySearchResponse;

    const docs =
      data.docs ?? [];

    if (docs.length === 0) {
      return null;
    }

    const wantedTitle =
      normalizeText(title);

    const wantedAuthor =
      normalizeText(
        primaryAuthor
      );

    /*
      We deliberately require a strong match.

      A pretty cover on the wrong book is worse
      than keeping our Slaylist placeholder.
    */

    const match =
      docs.find((doc) => {
        if (!doc.cover_i) {
          return false;
        }

        const resultTitle =
          normalizeText(
            doc.title
          );

        if (
          resultTitle !==
          wantedTitle
        ) {
          return false;
        }

        /*
          If Goodreads has no author,
          exact title is enough.
        */

        if (!wantedAuthor) {
          return true;
        }

        const resultAuthors =
          (
            doc.author_name ?? []
          ).map(
            normalizeText
          );

        return resultAuthors.some(
          (author) =>
            author ===
              wantedAuthor ||
            author.includes(
              wantedAuthor
            ) ||
            wantedAuthor.includes(
              author
            )
        );
      });

    if (!match?.cover_i) {
      return null;
    }

    return (
      `https://covers.openlibrary.org/b/id/` +
      `${match.cover_i}-L.jpg`
    );
  } catch {
    return null;
  }
}


/* =========================================================
   FIND BEST COVER
   ========================================================= */

async function findBestCover(
  book: Book
): Promise<{
  url: string | null;
  source:
    | "isbn13"
    | "isbn10"
    | "title-author"
    | "none";
}> {
  if (book.isbn13) {
    const url =
      await findCoverByIsbn(
        book.isbn13
      );

    if (url) {
      return {
        url,
        source: "isbn13",
      };
    }

    await sleep(
      REQUEST_DELAY_MS
    );
  }

  if (book.isbn10) {
    const url =
      await findCoverByIsbn(
        book.isbn10
      );

    if (url) {
      return {
        url,
        source: "isbn10",
      };
    }

    await sleep(
      REQUEST_DELAY_MS
    );
  }

  const url =
    await findCoverByTitleAndAuthor(
      book.title,
      book.authors
    );

  if (url) {
    return {
      url,
      source: "title-author",
    };
  }

  return {
    url: null,
    source: "none",
  };
}


/* =========================================================
   MAIN
   ========================================================= */

async function main() {
  if (
    !fs.existsSync(DATA_FILE)
  ) {
    throw new Error(
      `Library file not found:\n${DATA_FILE}`
    );
  }

  const library =
    JSON.parse(
      fs.readFileSync(
        DATA_FILE,
        "utf8"
      )
    ) as GoodreadsLibraryRecord[];


  /* -------------------------------------------------------
     STATS
     ------------------------------------------------------- */

  let alreadyHadCover = 0;

  let foundByIsbn13 = 0;

  let foundByIsbn10 = 0;

  let foundByTitleAuthor = 0;

  let noCoverFound = 0;

  let processedThisRun = 0;


  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    "   THE SLAYLIST SUITE // COVER LAB"
  );

  console.log(
    "=========================================="
  );

  console.log("");

  console.log(
    `Books loaded: ${library.length}`
  );

  console.log(
    `Checkpoint every: ${CHECKPOINT_EVERY} books`
  );

  console.log("");


  /* -------------------------------------------------------
     PROCESS LIBRARY
     ------------------------------------------------------- */

  for (
    let index = 0;
    index < library.length;
    index++
  ) {
    const record =
      library[index];

    const book =
      record.book;

    const position =
      index + 1;


    /* -------------------------
       SKIP EXISTING COVER
       ------------------------- */

    if (book.coverUrl) {
      alreadyHadCover++;

      console.log(
        `[${position}/${library.length}] SKIP  ${book.title}`
      );

      continue;
    }


    /* -------------------------
       LOOKUP
       ------------------------- */

    console.log(
      `[${position}/${library.length}] FIND  ${book.title}`
    );

    const result =
      await findBestCover(
        book
      );

    processedThisRun++;


    /* -------------------------
       SUCCESS
       ------------------------- */

    if (result.url) {
      book.coverUrl =
        result.url;

      switch (
        result.source
      ) {
        case "isbn13":
          foundByIsbn13++;
          break;

        case "isbn10":
          foundByIsbn10++;
          break;

        case "title-author":
          foundByTitleAuthor++;
          break;
      }

      console.log(
        `   ✓ COVER FOUND // ${result.source.toUpperCase()}`
      );
    }


    /* -------------------------
       NO MATCH
       ------------------------- */

    else {
      noCoverFound++;

      console.log(
        "   — NO SAFE MATCH // KEEP PLACEHOLDER"
      );
    }


    /* -------------------------
       CHECKPOINT
       ------------------------- */

    if (
      processedThisRun %
        CHECKPOINT_EVERY ===
      0
    ) {
      writeLibrary(
        library
      );

      console.log(
        `   💾 CHECKPOINT SAVED // ${processedThisRun} PROCESSED`
      );
    }


    /* -------------------------
       REQUEST DELAY
       ------------------------- */

    await sleep(
      REQUEST_DELAY_MS
    );
  }


  /* -------------------------------------------------------
     FINAL SAVE
     ------------------------------------------------------- */

  writeLibrary(
    library
  );


  /* -------------------------------------------------------
     REPORT
     ------------------------------------------------------- */

  const totalWithCover =
    library.filter(
      (record) =>
        Boolean(
          record.book.coverUrl
        )
    ).length;

  const totalWithoutCover =
    library.length -
    totalWithCover;


  console.log("");
  console.log(
    "=========================================="
  );

  console.log(
    "   COVER LAB COMPLETE"
  );

  console.log(
    "=========================================="
  );

  console.log("");

  console.log(
    `Already had cover: ${alreadyHadCover}`
  );

  console.log(
    `Found by ISBN-13: ${foundByIsbn13}`
  );

  console.log(
    `Found by ISBN-10: ${foundByIsbn10}`
  );

  console.log(
    `Found by title + author: ${foundByTitleAuthor}`
  );

  console.log(
    `No cover found this run: ${noCoverFound}`
  );

  console.log("");

  console.log(
    `TOTAL WITH COVER: ${totalWithCover}`
  );

  console.log(
    `TOTAL WITHOUT COVER: ${totalWithoutCover}`
  );

  console.log("");

  console.log(
    "=========================================="
  );

  console.log(
    "   SLAYBASE COVER DATA SAVED"
  );

  console.log(
    "=========================================="
  );

  console.log("");
}


/* =========================================================
   RUN
   ========================================================= */

main().catch(
  (error) => {
    console.error("");
    console.error(
      "COVER LAB FAILED:"
    );

    console.error(
      error
    );

    process.exit(1);
  }
);