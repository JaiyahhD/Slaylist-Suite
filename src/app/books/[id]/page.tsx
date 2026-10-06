import { notFound } from "next/navigation";

import type {
  Book,
  ReadingRecord,
  Review,
} from "@/types";

import goodreadsLibrary from "@/data/goodreads-library.json";


/* =========================================================
   TYPES
   ========================================================= */

type GoodreadsLibraryRecord = {
  book: Book;

  readingRecord:
    ReadingRecord | null;

  review:
    Review | null;

  rawShelves: string[];

  readCount: number;

  wasTbbBuddyRead: boolean;
};

type BookPageProps = {
  params: Promise<{
    id: string;
  }>;
};


/* =========================================================
   LIBRARY DATA
   ========================================================= */

const library =
  goodreadsLibrary as GoodreadsLibraryRecord[];


/* =========================================================
   HELPERS
   ========================================================= */

function formatLabel(
  value: string
) {
  return value
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}


function formatDate(
  value?: string
) {
  if (!value) {
    return "Not recorded";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}


/* =========================================================
   BOOK PAGE
   ========================================================= */

export default async function BookPage({
  params,
}: BookPageProps) {

  const { id } =
    await params;


  /* =======================================================
     FIND BOOK
     ======================================================= */

  const record =
    library.find(
      (item) =>
        item.book.id === id
    );


  if (!record) {
    notFound();
  }


  const {
  book,
  readingRecord,
  review,
  rawShelves,
  readCount,
  wasTbbBuddyRead,
} = record;


  /* =======================================================
     DISPLAY VALUES
     ======================================================= */

  const publicationYear =
    book.publicationDate
      ? new Date(
          book.publicationDate
        ).getFullYear()
      : undefined;

  const displayPublicationYear =
    publicationYear &&
    !Number.isNaN(
      publicationYear
    )
      ? publicationYear
      : "Not recorded";


  return (
    <main className="book-detail-page">

      {/* =========================
          HERO
          ========================= */}

      <section className="book-detail-hero">

        {/* BOOK COVER */}

<div
  className={
    `book-detail-cover ` +
    `${book.coverUrl ? "has-real-cover" : ""}`
  }
>

  {book.coverUrl ? (
    <>
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        className="book-detail-real-cover"
      />

      <span className="book-detail-status">
        {formatLabel(
          book.status
        )}
      </span>
    </>
  ) : (
    <>
      <span className="book-detail-status">
        {formatLabel(
          book.status
        )}
      </span>

      <span className="book-detail-cover-symbol">
        ✦
      </span>

      <strong>
        {book.title}
      </strong>

      <small>
        {book.authors.join(", ")}
      </small>
    </>
  )}

</div>

        {/* PRIMARY INFORMATION */}

        <div className="book-detail-primary">

          <p className="eyebrow">
            SLAYBASE RECORD //{" "}
            {book.goodreadsBookId
              ? `GR-${book.goodreadsBookId}`
              : book.id}
          </p>


          <h1>
            {book.title}
          </h1>


          {book.subtitle && (
            <p className="book-detail-subtitle">
              {book.subtitle}
            </p>
          )}


          <p className="book-detail-author">
            by{" "}
            <strong>
              {book.authors.join(", ")}
            </strong>
          </p>


          {book.series && (
            <p className="book-detail-series">
              {book.series.name}

              {book.series.number !==
                undefined &&
                ` #${book.series.number}`}
            </p>
          )}


          {/* PERSONAL RATING */}

          <div className="book-detail-rating">

            {book.personalRating ? (
              <>
                <span>
                  {"★".repeat(
                    book.personalRating
                  )}

                  {"☆".repeat(
                    5 -
                      book.personalRating
                  )}
                </span>

                <small>
                  {book.personalRating}/5
                  PERSONAL RATING
                </small>
              </>
            ) : (
              <>
                <span>
                  ☆☆☆☆☆
                </span>

                <small>
                  NOT YET RATED
                </small>
              </>
            )}

          </div>


          {/* BADGES */}

          <div className="book-detail-badges">

            {book.certifiedSlay && (
              <span>
                ✦ CERTIFIED SLAY
              </span>
            )}


            {book.brainChemistry && (
              <span>
                🧪 BRAIN CHEMISTRY
              </span>
            )}


            {readCount > 1 && (
              <span>
                ↻ READ ×{readCount}
              </span>
            )}


            {wasTbbBuddyRead && (
              <span>
                ♡ TBB BUDDY READ
              </span>
            )}


            {book.primaryFormat && (
              <span>
                {formatLabel(
                  book.primaryFormat
                )}
              </span>
            )}

          </div>

        </div>

      </section>


      {/* =========================
          QUICK RECEIPTS
          ========================= */}

      <section className="book-detail-receipts">

        <article>
          <span>
            STATUS
          </span>

          <strong>
            {formatLabel(
              book.status
            )}
          </strong>
        </article>


        <article>
          <span>
            PAGES
          </span>

          <strong>
            {book.pageCount
              ? book.pageCount
                  .toLocaleString()
              : "—"}
          </strong>
        </article>


        <article>
          <span>
            READ COUNT
          </span>

          <strong>
            {readCount}
          </strong>
        </article>


        <article>
          <span>
            ADDED
          </span>

          <strong>
            {formatDate(
              book.dateAdded
            )}
          </strong>
        </article>

      </section>


      {/* =========================
          BOOK DATA
          ========================= */}

      <section className="book-detail-grid">

        <article className="book-detail-panel">

          <p className="eyebrow">
            SPECIMEN DATA
          </p>

          <h2>
            Book Details
          </h2>


          <dl className="book-detail-list">

            <div>
              <dt>
                Publisher
              </dt>

              <dd>
                {book.publisher ??
                  "Not recorded"}
              </dd>
            </div>


            <div>
              <dt>
                Publication Year
              </dt>

              <dd>
                {displayPublicationYear}
              </dd>
            </div>


            <div>
              <dt>
                ISBN-10
              </dt>

              <dd>
                {book.isbn10 ??
                  "Not recorded"}
              </dd>
            </div>


            <div>
              <dt>
                ISBN-13
              </dt>

              <dd>
                {book.isbn13 ??
                  "Not recorded"}
              </dd>
            </div>


            <div>
              <dt>
                Format
              </dt>

              <dd>
                {book.formats.length > 0
                  ? book.formats
                      .map(
                        formatLabel
                      )
                      .join(", ")
                  : "Not recorded"}
              </dd>
            </div>


            <div>
              <dt>
                Source
              </dt>

              <dd>
                {book.source
                  ? formatLabel(
                      book.source
                    )
                  : "Not recorded"}
              </dd>
            </div>

          </dl>

        </article>


        {/* =========================
            IMPORTED SHELVES
            ========================= */}

        <article className="book-detail-panel">

          <p className="eyebrow">
            ORIGINAL ORGANIZATION
          </p>

          <h2>
            Imported Shelves
          </h2>


          {rawShelves.length > 0 ? (
            <div className="book-detail-shelves">

              {rawShelves.map(
                (shelf) => (
                  <span key={shelf}>
                    {formatLabel(
                      shelf
                    )}
                  </span>
                )
              )}

            </div>
          ) : (
            <p className="book-detail-muted">
              No additional Goodreads
              shelves were recorded.
            </p>
          )}

        </article>


        {/* =========================
            READING RECORD
            ========================= */}

        <article className="book-detail-panel">

          <p className="eyebrow">
            READING RECEIPTS
          </p>

          <h2>
            Reading Record
          </h2>


          {readingRecord ? (
            <dl className="book-detail-list">

              <div>
                <dt>
                  Reading Status
                </dt>

                <dd>
                  {formatLabel(
                    readingRecord.status
                  )}
                </dd>
              </div>


              <div>
                <dt>
                  Finished
                </dt>

                <dd>
                  {formatDate(
                    readingRecord.finishedAt
                  )}
                </dd>
              </div>


              <div>
                <dt>
                  Reading Number
                </dt>

                <dd>
                  {readingRecord
                    .readingNumber}
                </dd>
              </div>


              <div>
                <dt>
                  Reread
                </dt>

                <dd>
                  {readCount > 1
                    ? `Yes — ${readCount} total reads recorded`
                    : "No"}
                </dd>
              </div>


              <div>
                <dt>
                  TBB Buddy Read
                </dt>

                <dd>
                  {wasTbbBuddyRead
                    ? "Historical buddy read"
                    : "No"}
                </dd>
              </div>

            </dl>
          ) : (
            <p className="book-detail-muted">
              No reading record yet.
              This book is waiting on
              the TBR.
            </p>
          )}

        </article>

        {/* =========================
    WRITTEN REVIEW
    ========================= */}

{review && (

  <article className="book-detail-panel book-detail-review-panel">

    <div className="book-detail-review-heading">

      <div>
        <p className="eyebrow">
          THE VERDICT
        </p>

        <h2>
          My Review
        </h2>
      </div>

      <div
        className="book-detail-review-rating"
        aria-label={`${review.rating} out of 5 stars`}
      >
        <span>
          {"★".repeat(
            review.rating
          )}

          {"☆".repeat(
            5 -
            review.rating
          )}
        </span>

        <small>
          {review.rating}/5
        </small>
      </div>

    </div>


    <div className="book-detail-review-meta">

      <span>
        REVIEWED{" "}
        {formatDate(
          review.createdAt
        ).toUpperCase()}
      </span>

      {book.certifiedSlay && (
        <span>
          ✦ CERTIFIED SLAY
        </span>
      )}

      {review.containsSpoilers && (
        <span className="is-spoiler">
          ⚠ SPOILERS
        </span>
      )}

    </div>


    <p className="book-detail-review-body">
      {review.body}
    </p>


    <a
      href="/reviews"
      className="book-detail-review-link"
    >
      VIEW IN REVIEW ARCHIVE →
    </a>

  </article>

)}

        {/* =========================
            NOTES / FUTURE DATA
            ========================= */}

        <article className="book-detail-panel">

          <p className="eyebrow">
            THE LAB NOTES
          </p>

          <h2>
            Personal Notes
          </h2>


          {book.privateNotes ? (
            <p className="book-detail-notes">
              {book.privateNotes}
            </p>
          ) : (
            <p className="book-detail-muted">
              No private notes have been
              added to this record yet.
            </p>
          )}

        </article>

      </section>

    </main>
  );
}
