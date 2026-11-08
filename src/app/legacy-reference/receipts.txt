import type {
  Book,
  ReadingRecord,
  Review,
} from "@/types";

import goodreadsLibrary from "@/data/goodreads-library.json";

import ReadingTimeline from "@/components/receipts/ReadingTimeline";
import RatingDistribution from "@/components/receipts/RatingDistribution";
import PageAnalytics from "@/components/receipts/PageAnalytics";
import ReadingBehavior from "@/components/receipts/ReadingBehavior";
import SlayMetrics from "@/components/receipts/SlayMetrics";
import SlayProfile from "@/components/receipts/SlayProfile";
import BrainChemistryAnalytics from "@/components/receipts/BrainChemistryAnalytics";

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

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}


/* =========================================================
   READING RECEIPTS
   ========================================================= */

export default function ReadingReceiptsPage() {
  const library =
    goodreadsLibrary as GoodreadsLibraryRecord[];


  /* =======================================================
     CORE LIBRARY COUNTS
     ======================================================= */

  const totalBooks =
    library.length;

  const readBooks =
    library.filter(
      ({ book }) =>
        book.status === "read"
    );

  const tbrBooks =
    library.filter(
      ({ book }) =>
        book.status === "tbr"
    );

  const currentReads =
    library.filter(
      ({ book }) =>
        book.status ===
        "currently-reading"
    );

  const dnfBooks =
    library.filter(
      ({ book }) =>
        book.status === "dnf"
    );


  /* =======================================================
     READING HISTORY
     ======================================================= */

  const totalRecordedReads =
    library.reduce(
      (
        total,
        record
      ) =>
        total +
        record.readCount,
      0
    );

  const rereadBooks =
    library.filter(
      (record) =>
        record.readCount > 1
    );

  const totalRereadSessions =
    rereadBooks.reduce(
      (
        total,
        record
      ) =>
        total +
        Math.max(
          record.readCount - 1,
          0
        ),
      0
    );


  /* =======================================================
     RATINGS + SLAYS
     ======================================================= */

  const ratedBooks =
    library.filter(
      ({ book }) =>
        typeof book.personalRating ===
          "number" &&
        book.personalRating > 0
    );

  const fiveStarBooks =
    ratedBooks.filter(
      ({ book }) =>
        book.personalRating === 5
    );

  const certifiedSlays =
    library.filter(
      ({ book }) =>
        book.certifiedSlay
    );

  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce(
          (
            total,
            { book }
          ) =>
            total +
            (
              book.personalRating ??
              0
            ),
          0
        ) / ratedBooks.length
      : 0;


  /* =======================================================
     PAGES
     ======================================================= */

  const knownPagesRead =
    readBooks.reduce(
      (
        total,
        { book }
      ) =>
        total +
        (
          book.pageCount ??
          0
        ),
      0
    );

  const booksWithKnownPages =
    readBooks.filter(
      ({ book }) =>
        typeof book.pageCount ===
          "number" &&
        book.pageCount > 0
    ).length;


  /* =======================================================
     REVIEWS + BUDDY READS
     ======================================================= */

  const writtenReviews =
    library.filter(
      ({ review }) =>
        review !== null
    ).length;

  const tbbBuddyReads =
    library.filter(
      (record) =>
        record.wasTbbBuddyRead
    ).length;

  void tbbBuddyReads;


  /* =======================================================
     RECEIPTS
     ======================================================= */

  const receipts = [
    {
      label: "BOOKS READ",
      value:
        formatNumber(
          readBooks.length
        ),
      note:
        "Unique books marked read",
      symbol: "✓",
    },
    {
      label: "RECORDED READS",
      value:
        formatNumber(
          totalRecordedReads
        ),
      note:
        "Includes rereads",
      symbol: "↻",
    },
    {
      label: "KNOWN PAGES",
      value:
        formatNumber(
          knownPagesRead
        ),
      note:
        `Across ${formatNumber(
          booksWithKnownPages
        )} books with page data`,
      symbol: "▤",
    },
    {
      label: "AVG. RATING",
      value:
        averageRating > 0
          ? averageRating.toFixed(2)
          : "—",
      note:
        `${formatNumber(
          ratedBooks.length
        )} rated books`,
      symbol: "★",
    },
    {
      label: "5-STAR READS",
      value:
        formatNumber(
          fiveStarBooks.length
        ),
      note:
        "Rated exactly 5 stars",
      symbol: "★",
    },
    {
      label: "CERTIFIED SLAYS",
      value:
        formatNumber(
          certifiedSlays.length
        ),
      note:
        "The crown is earned",
      symbol: "✦",
    },
    {
      label: "REREAD BOOKS",
      value:
        formatNumber(
          rereadBooks.length
        ),
      note:
        `${formatNumber(
          totalRereadSessions
        )} additional reads`,
      symbol: "∞",
    },
    {
      label: "REVIEWS",
      value:
        formatNumber(
          writtenReviews
        ),
      note:
        "Written verdicts",
      symbol: "✎",
    },
  ];


  return (
    <main className="receipts-page">

      {/* ================================================
          HERO
          ================================================ */}

      <section className="receipts-hero">

        <p className="eyebrow">
          THE SLAYLIST SUITE // ANALYTICS
        </p>

        <h1>
          Reading
          <span> Receipts.</span>
        </h1>

        <p className="receipts-hero-copy">
          Because apparently reading thousands
          of pages and emotionally attaching
          myself to fictional people requires
          documentation.
        </p>

        <div className="receipts-dataset-status">

          <span>
            DATASET
          </span>

          <strong>
            {formatNumber(
              totalBooks
            )} BOOKS
          </strong>

          <i />

          <span>
            GOODREADS IMPORT
          </span>

        </div>

      </section>


      {/* ================================================
          CHAPTER 01 — THE ARCHIVE
          ================================================ */}

      <div className="receipts-chapter">

        <div className="receipts-chapter-number">
          01
        </div>

        <div className="receipts-chapter-copy">

          <span>
            THE ARCHIVE
          </span>

          <strong>
            What&apos;s on the shelves.
            What&apos;s already been read.
          </strong>

        </div>

        <div className="receipts-chapter-line" />

      </div>


      {/* ================================================
          LIBRARY SNAPSHOT
          ================================================ */}

      <section className="receipts-section">

        <div className="receipts-section-heading">

          <div>

            <p className="eyebrow">
              RECEIPT 001 // THE LIBRARY
            </p>

            <h2>
              Library Snapshot
            </h2>

          </div>

          <span>
            SOURCE OF TRUTH
          </span>

        </div>


        <div className="receipts-library-strip">

          <div>

            <span>
              TOTAL LIBRARY
            </span>

            <strong>
              {formatNumber(
                totalBooks
              )}
            </strong>

          </div>


          <div>

            <span>
              TBR
            </span>

            <strong>
              {formatNumber(
                tbrBooks.length
              )}
            </strong>

          </div>


          <div>

            <span>
              READ
            </span>

            <strong>
              {formatNumber(
                readBooks.length
              )}
            </strong>

          </div>


          <div>

            <span>
              CURRENT
            </span>

            <strong>
              {formatNumber(
                currentReads.length
              )}
            </strong>

          </div>


          <div>

            <span>
              DNF
            </span>

            <strong>
              {formatNumber(
                dnfBooks.length
              )}
            </strong>

          </div>

        </div>

      </section>


      {/* ================================================
          LIFETIME RECEIPTS
          ================================================ */}

      <section className="receipts-section">

        <div className="receipts-section-heading">

          <div>

            <p className="eyebrow">
              RECEIPT 002 // LIFETIME
            </p>

            <h2>
              The Evidence
            </h2>

          </div>

          <span>
            VERIFIED DATA
          </span>

        </div>


        <div className="receipts-stat-grid">

          {receipts.map(
            (receipt) => (
              <article
                key={
                  receipt.label
                }
                className="receipts-stat-card"
              >

                <div className="receipts-stat-topline">

                  <span>
                    {receipt.label}
                  </span>

                  <i>
                    {receipt.symbol}
                  </i>

                </div>


                <strong className="receipts-stat-value">
                  {receipt.value}
                </strong>


                <p>
                  {receipt.note}
                </p>

              </article>
            )
          )}

        </div>

      </section>


      {/* ================================================
          CHAPTER 02 — THE READING LAB
          ================================================ */}

      <div className="receipts-chapter">

        <div className="receipts-chapter-number">
          02
        </div>

        <div className="receipts-chapter-copy">

          <span>
            THE READING LAB
          </span>

          <strong>
            Patterns, pages, ratings,
            rereads, and reading behavior.
          </strong>

        </div>

        <div className="receipts-chapter-line" />

      </div>


      <ReadingTimeline
        records={library}
      />

      <RatingDistribution
        records={library}
      />

      <PageAnalytics
        records={library}
      />

      <ReadingBehavior
        records={library}
      />


      {/* ================================================
          CHAPTER 03 — THE SLAY SCIENCE
          ================================================ */}

      <div className="receipts-chapter">

        <div className="receipts-chapter-number">
          03
        </div>

        <div className="receipts-chapter-copy">

          <span>
            THE SLAY SCIENCE
          </span>

          <strong>
            The crown, the chemistry,
            and the books that hit different.
          </strong>

        </div>

        <div className="receipts-chapter-line" />

      </div>


      <SlayMetrics
        records={library}
      />

      <SlayProfile
        records={library}
      />

      <BrainChemistryAnalytics
        books={library.map(
          ({ book }) => ({
            id: book.id,
            title: book.title,
            authors: book.authors,
          })
        )}
      />


      {/* ================================================
          DATA NOTE
          ================================================ */}

      <section className="receipts-data-note">

        <span>
          ⚗
        </span>

        <div>

          <strong>
            DATA LAB NOTE
          </strong>

          <p>
            These receipts are calculated from
            your imported Goodreads library.
            Historical totals only reflect data
            Goodreads actually recorded. New
            Slaylist activity will become richer
            as live reading records accumulate.
          </p>

        </div>

      </section>

    </main>
  );
}
