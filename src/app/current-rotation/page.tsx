import Link from "next/link";

import type {
  Book,
  ReadingRecord,
  Review,
} from "@/types";

import goodreadsLibrary from "@/data/goodreads-library.json";

import CurrentRotationClient from "@/components/rotation/CurrentRotationClient";

import CurrentRotationCardGuard from "@/components/rotation/CurrentRotationCardGuard";

import CurrentRotationCount from "@/components/rotation/CurrentRotationCount";

import PostReadRitualLauncher from "@/components/rotation/PostReadRitualLauncher";

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


/* =========================================================
   HELPERS
   ========================================================= */

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
    return "Not recorded";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}


function formatReadingMethod(
  method?: ReadingRecord["readingMethod"]
) {
  if (!method) {
    return "Not recorded";
  }

  switch (method) {
    case "ebook":
      return "Ebook";

    case "audiobook":
      return "Audiobook";

    case "physical":
      return "Physical";

    default:
      return method;
  }
}


/* =========================================================
   CURRENT ROTATION PAGE
   ========================================================= */

export default function CurrentRotationPage() {
  const library =
    goodreadsLibrary as GoodreadsLibraryRecord[];

  const currentReads =
    library.filter(
      (record) =>
        record.book.status ===
        "currently-reading"
    );

  const currentReadBookIds =
    currentReads.map(
      (record) => record.book.id
    );

  return (
    <main className="current-rotation-page">

      {/* ================================================
          HERO
          ================================================ */}

      <section className="current-rotation-hero">

        <p className="eyebrow">
          THE SLAYLIST SUITE // ACTIVE READS
        </p>

        <h1>
          Current
          <span> Rotation.</span>
        </h1>

        <p className="current-rotation-hero-copy">
          Books currently occupying tabs in my brain,
          stealing my sleep, and undergoing active
          literary experimentation.
        </p>

        <div className="current-rotation-hero-status">

          <span>
            ACTIVE EXPERIMENTS
          </span>

          <CurrentRotationCount
            bookIds={currentReadBookIds}
          />

        </div>

      </section>


      {/* ================================================
          ACTIVE READS
          ================================================ */}

      <section className="current-rotation-lab">

        <div className="current-rotation-section-heading">

          <div>

            <p className="eyebrow">
              READING LAB // LIVE
            </p>

            <h2>
              On the Nightstand
            </h2>

          </div>

          <span className="current-rotation-live-indicator">
            <i />
            LIVE
          </span>

        </div>


        {currentReads.length > 0 ? (

          <div className="current-rotation-grid">

            {currentReads.map(
              ({
                book,
                readingRecord,
              }) => {

                return (
                  <CurrentRotationCardGuard
                    key={book.id}
                    bookId={book.id}
                    readingNumber={
                      readingRecord?.readingNumber ??
                      1
                    }
                  >

                    <article className="current-rotation-card">

                      {/* =========================
                          COVER
                          ========================= */}

                      <Link
                        href={`/books/${book.id}`}
                        className={
                          `current-rotation-cover ` +
                          `${book.coverUrl
                            ? "has-real-cover"
                            : ""}`
                        }
                        aria-label={
                          `Open ${book.title}`
                        }
                      >

                        {book.coverUrl ? (

                          <img
                            src={book.coverUrl}
                            alt={
                              `Cover of ${book.title}`
                            }
                            className="current-rotation-real-cover"
                          />

                        ) : (

                          <div className="current-rotation-cover-placeholder">

                            <span>
                              ✦
                            </span>

                            <strong>
                              {book.title}
                            </strong>

                          </div>

                        )}

                      </Link>


                      {/* =========================
                          BOOK DATA
                          ========================= */}

                      <div className="current-rotation-card-content">

                        <div className="current-rotation-card-topline">

                          <span>
                            CURRENT EXPERIMENT
                          </span>

                        </div>


                        <Link
                          href={`/books/${book.id}`}
                          className="current-rotation-title-link"
                        >
                          <h3>
                            {book.title}
                          </h3>
                        </Link>


                        <p className="current-rotation-author">
                          {book.authors.join(", ")}
                        </p>


                        {/* =========================
                            READING DETAILS
                            ========================= */}

                        <div className="current-rotation-data-grid">

                          <div>

                            <span>
                              FORMAT
                            </span>

                            <strong>
                              {formatReadingMethod(
                                readingRecord
                                  ?.readingMethod
                              )}
                            </strong>

                          </div>


                          <div>

                            <span>
                              STARTED
                            </span>

                            <strong>
                              {formatDate(
                                readingRecord
                                  ?.startedAt
                              )}
                            </strong>

                          </div>


                          <div>

                            <span>
                              READ #
                            </span>

                            <strong>
                              {readingRecord
                                ?.readingNumber ??
                                1}
                            </strong>

                          </div>


                          <div>

                            <span>
                              SOURCE
                            </span>

                            <strong>
                              {book.source ===
                              "goodreads"
                                ? "Goodreads"
                                : "Slaylist"}
                            </strong>

                          </div>

                        </div>


                        {/* =========================
                            LIVE READING DATA
                            ========================= */}

                        <CurrentRotationClient
                          bookId={book.id}
                          bookTitle={book.title}
                          pageCount={book.pageCount}
                          readingMethod={
                            readingRecord?.readingMethod
                          }
                          readingNumber={
                            readingRecord?.readingNumber ??
                            1
                          }
                          fallbackPage={
                            readingRecord?.currentPage
                          }
                          fallbackProgress={
                            readingRecord?.progressPercent ??
                            0
                          }
                        />


                        {/* =========================
                            ACTIONS
                            ========================= */}

                        <div className="current-rotation-actions">

                          <Link
                            href={`/books/${book.id}`}
                          >
                            OPEN DOSSIER →
                          </Link>

                        </div>

                      </div>

                    </article>

                  </CurrentRotationCardGuard>
                );
              }
            )}

          </div>

        ) : (

          <div className="current-rotation-empty">

            <span>
              ✦
            </span>

            <h2>
              The lab is suspiciously quiet.
            </h2>

            <p>
              No books are currently marked as
              actively reading.
            </p>

          </div>

        )}

      </section>

<PostReadRitualLauncher />

    </main>
  );
}
