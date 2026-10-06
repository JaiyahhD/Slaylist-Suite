"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

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


type ReviewedBookRecord =
  GoodreadsLibraryRecord & {
    review: Review;
  };


type RatingFilter =
  | "all"
  | 5
  | 4
  | 3
  | 2
  | 1;


type ReviewSort =
  | "newest"
  | "oldest"
  | "highest"
  | "lowest";


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

  /* =======================================================
     FILTER STATE
     ======================================================= */

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    ratingFilter,
    setRatingFilter,
  ] = useState<RatingFilter>(
    "all"
  );

  const [
    certifiedOnly,
    setCertifiedOnly,
  ] = useState(false);

  const [
    sortBy,
    setSortBy,
  ] = useState<ReviewSort>(
    "newest"
  );


  /* =======================================================
     REVIEW DATA
     ======================================================= */

  const library =
    goodreadsLibrary as GoodreadsLibraryRecord[];


  const reviewedBooks =
    useMemo(
      () =>
        library.filter(
          (
            record
          ): record is ReviewedBookRecord =>
            record.review !== null
        ),
      [library]
    );


  /* =======================================================
     RECEIPTS
     ======================================================= */

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
    [...reviewedBooks].sort(
      (a, b) =>
        new Date(
          b.review.createdAt
        ).getTime() -
        new Date(
          a.review.createdAt
        ).getTime()
    )[0];


  /* =======================================================
     FILTER + SORT
     ======================================================= */

  const filteredReviews =
    useMemo(
      () => {
        const normalizedSearch =
          searchQuery
            .trim()
            .toLowerCase();

        const filtered =
          reviewedBooks.filter(
            (record) => {
              const {
                book,
                review,
              } = record;

              const matchesSearch =
                normalizedSearch.length === 0 ||
                book.title
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                book.authors.some(
                  (author) =>
                    author
                      .toLowerCase()
                      .includes(
                        normalizedSearch
                      )
                ) ||
                review.body
                  .toLowerCase()
                  .includes(
                    normalizedSearch
                  );

              const matchesRating =
                ratingFilter === "all" ||
                review.rating ===
                  ratingFilter;

              const matchesCertified =
                !certifiedOnly ||
                book.certifiedSlay;

              return (
                matchesSearch &&
                matchesRating &&
                matchesCertified
              );
            }
          );

        return filtered.sort(
          (a, b) => {
            switch (sortBy) {
              case "oldest":
                return (
                  new Date(
                    a.review.createdAt
                  ).getTime() -
                  new Date(
                    b.review.createdAt
                  ).getTime()
                );

              case "highest":
                return (
                  b.review.rating -
                    a.review.rating ||
                  new Date(
                    b.review.createdAt
                  ).getTime() -
                    new Date(
                      a.review.createdAt
                    ).getTime()
                );

              case "lowest":
                return (
                  a.review.rating -
                    b.review.rating ||
                  new Date(
                    b.review.createdAt
                  ).getTime() -
                    new Date(
                      a.review.createdAt
                    ).getTime()
                );

              case "newest":
              default:
                return (
                  new Date(
                    b.review.createdAt
                  ).getTime() -
                  new Date(
                    a.review.createdAt
                  ).getTime()
                );
            }
          }
        );
      },
      [
        reviewedBooks,
        searchQuery,
        ratingFilter,
        certifiedOnly,
        sortBy,
      ]
    );


  /* =======================================================
     FILTER HELPERS
     ======================================================= */

  const filtersActive =
    searchQuery.trim() !== "" ||
    ratingFilter !== "all" ||
    certifiedOnly ||
    sortBy !== "newest";


  function clearFilters() {
    setSearchQuery("");
    setRatingFilter("all");
    setCertifiedOnly(false);
    setSortBy("newest");
  }


  /* =======================================================
     PAGE
     ======================================================= */

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
          <span>
            {" "}
            With Opinions.
          </span>
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


        {/* ==============================================
            REVIEW CONTROLS
            ============================================== */}

        <div className="review-controls">

          <div className="review-search">

            <label
              htmlFor="review-search"
            >
              SEARCH THE FILES
            </label>

            <div className="review-search-box">

              <span aria-hidden="true">
                ⌕
              </span>

              <input
                id="review-search"
                type="search"
                placeholder="Title, author, or something I said..."
                value={searchQuery}
                onChange={
                  (event) =>
                    setSearchQuery(
                      event.target.value
                    )
                }
              />

            </div>

          </div>


          <div className="review-control-group">

            <label
              htmlFor="review-rating"
            >
              RATING
            </label>

            <select
              id="review-rating"
              value={ratingFilter}
              onChange={
                (event) => {
                  const value =
                    event.target.value;

                  setRatingFilter(
                    value === "all"
                      ? "all"
                      : Number(
                          value
                        ) as RatingFilter
                  );
                }
              }
            >
              <option value="all">
                All Ratings
              </option>

              <option value="5">
                5 Stars
              </option>

              <option value="4">
                4 Stars
              </option>

              <option value="3">
                3 Stars
              </option>

              <option value="2">
                2 Stars
              </option>

              <option value="1">
                1 Star
              </option>
            </select>

          </div>


          <div className="review-control-group">

            <label
              htmlFor="review-sort"
            >
              SORT BY
            </label>

            <select
              id="review-sort"
              value={sortBy}
              onChange={
                (event) =>
                  setSortBy(
                    event.target
                      .value as ReviewSort
                  )
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="highest">
                Highest Rated
              </option>

              <option value="lowest">
                Lowest Rated
              </option>
            </select>

          </div>


          <button
            type="button"
            className={
              `review-certified-toggle ` +
              `${certifiedOnly
                ? "is-active"
                : ""}`
            }
            aria-pressed={
              certifiedOnly
            }
            onClick={
              () =>
                setCertifiedOnly(
                  (current) =>
                    !current
                )
            }
          >
            <span aria-hidden="true">
              ✦
            </span>

            Certified Slays
          </button>

        </div>


        {/* ==============================================
            RESULTS BAR
            ============================================== */}

        <div className="review-results-bar">

          <p>
            SHOWING{" "}
            <strong>
              {filteredReviews.length}
            </strong>{" "}
            OF{" "}
            <strong>
              {reviewedBooks.length}
            </strong>{" "}
            REVIEW FILES
          </p>


          {filtersActive && (
            <button
              type="button"
              onClick={
                clearFilters
              }
            >
              CLEAR FILTERS ×
            </button>
          )}

        </div>


        {/* ==============================================
            REVIEW GRID
            ============================================== */}

        {filteredReviews.length > 0 ? (

          <div className="reviews-grid">

            {filteredReviews.map(
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

        ) : (

          <div className="reviews-empty-state">

            <span aria-hidden="true">
              ⌕
            </span>

            <p className="eyebrow">
              SEARCH RETURNED // 0 FILES
            </p>

            <h3>
              No receipts found.
            </h3>

            <p>
              Nothing in the review archive matches
              those filters. The files are innocent
              this time.
            </p>

            <button
              type="button"
              onClick={
                clearFilters
              }
            >
              RESET THE ARCHIVE
            </button>

          </div>

        )}

      </section>

    </main>
  );
}