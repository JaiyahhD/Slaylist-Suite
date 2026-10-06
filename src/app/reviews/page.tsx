import Link from "next/link";

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


/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}


/* =========================================================
   REVIEWS PAGE
   ========================================================= */

export default function ReviewsPage() {
  const library =
    goodreadsLibrary as GoodreadsLibraryRecord[];

  const reviewedBooks =
    library
      .filter(
        (
          record
        ): record is GoodreadsLibraryRecord & {
          review: Review;
        } =>
          record.review !== null
      )
      .sort(
        (a, b) =>
          new Date(
            b.review.createdAt
          ).getTime() -
          new Date(
            a.review.createdAt
          ).getTime()
      );

  const fiveStarReviews =
    reviewedBooks.filter(
      (record) =>
        record.review.rating === 5
    ).length;

  const averageRating =
    reviewedBooks.length > 0
      ? (
          reviewedBooks.reduce(
            (total, record) =>
              total +
              record.review.rating,
            0
          ) /
          reviewedBooks.length
        ).toFixed(1)
      : "0.0";

  const mostRecentReview =
    reviewedBooks[0];


  return (
    <main className="reviews-page">

      {/* ================================================
          HERO
          ================================================ */}

      <section className="reviews-hero">

        <p className="eyebrow">
          THE SLAYLIST SUITE // REVIEW ARCHIVE
        </p>

        <h1>
          Reading Receipts,
          <span> With Opinions.</span>
        </h1>

        <p className="reviews-hero-copy">
          The books were read. The stars were assigned.
          The thoughts were absolutely documented.
        </p>

      </section>


      {/* ================================================
          REVIEW RECEIPTS
          ================================================ */}

      <section className="reviews-receipts">

        <article>
          <span>
            WRITTEN REVIEWS
          </span>

          <strong>
            {reviewedBooks.length}
          </strong>
        </article>


        <article>
          <span>
            FIVE-STAR REVIEWS
          </span>

          <strong>
            {fiveStarReviews}
          </strong>
        </article>


        <article>
          <span>
            AVG. REVIEW RATING
          </span>

          <strong>
            {averageRating}
          </strong>
        </article>


        <article>
          <span>
            MOST RECENT
          </span>

          <strong>
            {mostRecentReview
              ? formatDate(
                  mostRecentReview
                    .review
                    .createdAt
                )
              : "—"}
          </strong>
        </article>

      </section>


      {/* ================================================
          REVIEW ARCHIVE
          ================================================ */}

      <section className="reviews-archive">

        <div className="reviews-section-heading">

          <div>
            <p className="eyebrow">
              DOCUMENTED THOUGHTS
            </p>

            <h2>
              The Review Files
            </h2>
          </div>

          <span className="reviews-count">
            {reviewedBooks.length} FILES
          </span>

        </div>


        <div className="reviews-grid">

          {reviewedBooks.map(
            ({
              book,
              review,
            }) => (

              <article
                key={review.id}
                className="review-card"
              >

                <Link
                  href={`/books/${book.id}`}
                  className={
                    `review-cover ` +
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
                      className="review-real-cover"
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span>
                        ✦
                      </span>

                      <strong>
                        {book.title}
                      </strong>
                    </>
                  )}

                </Link>


                <div className="review-card-content">

                  <div className="review-card-meta">

                    <span>
                      {formatDate(
                        review.createdAt
                      )}
                    </span>

                    {book.certifiedSlay && (
                      <span>
                        ✦ CERTIFIED SLAY
                      </span>
                    )}

                  </div>


                  <Link
                    href={`/books/${book.id}`}
                    className="review-title-link"
                  >
                    <h3>
                      {book.title}
                    </h3>
                  </Link>


                  <p className="review-author">
                    {book.authors.join(", ")}
                  </p>


                  <div
                    className="review-rating"
                    aria-label={
                      `${review.rating} out of 5 stars`
                    }
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


                  {review.containsSpoilers && (
                    <div className="review-spoiler-warning">
                      SPOILER REVIEW
                    </div>
                  )}


                  <p className="review-body">
                    {review.body}
                  </p>


                  <Link
                    href={`/books/${book.id}`}
                    className="review-book-link"
                  >
                    OPEN BOOK DOSSIER →
                  </Link>

                </div>

              </article>

            )
          )}

        </div>

      </section>

    </main>
  );
}