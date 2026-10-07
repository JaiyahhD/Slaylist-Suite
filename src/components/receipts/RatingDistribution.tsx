import type { Book } from "@/types";

type RatingRecord = {
  book: Book;
};

type RatingDistributionProps = {
  records: RatingRecord[];
};

type RatingBucket = {
  rating: number;
  count: number;
  percentage: number;
};

const ratingScale = [
  5,
  4.5,
  4,
  3.5,
  3,
  2.5,
  2,
  1.5,
  1,
  0.5,
];

function formatRating(
  rating: number
) {
  return rating.toFixed(1);
}

export default function RatingDistribution({
  records,
}: RatingDistributionProps) {

  /* =====================================================
     RATED BOOKS
     ===================================================== */

  const ratedBooks =
    records.filter(
      ({ book }) =>
        typeof book.personalRating ===
          "number" &&
        book.personalRating > 0
    );

  const totalRated =
    ratedBooks.length;


  /* =====================================================
     DISTRIBUTION
     ===================================================== */

  const distribution: RatingBucket[] =
    ratingScale.map(
      (rating) => {

        const count =
          ratedBooks.filter(
            ({ book }) =>
              book.personalRating ===
              rating
          ).length;

        const percentage =
          totalRated > 0
            ? (
                count /
                totalRated
              ) * 100
            : 0;

        return {
          rating,
          count,
          percentage,
        };
      }
    );

  const largestBucket =
    Math.max(
      ...distribution.map(
        ({ count }) => count
      ),
      1
    );


  /* =====================================================
     RATING BEHAVIOR
     ===================================================== */

  const averageRating =
    totalRated > 0
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
        ) / totalRated
      : 0;

  const highestBucket =
    distribution.reduce(
      (
        highest,
        current
      ) =>
        current.count >
        highest.count
          ? current
          : highest,
      distribution[0]
    );

  const fourPlusBooks =
    ratedBooks.filter(
      ({ book }) =>
        (
          book.personalRating ??
          0
        ) >= 4
    ).length;

  const fourPlusPercentage =
    totalRated > 0
      ? (
          fourPlusBooks /
          totalRated
        ) * 100
      : 0;

  const fiveStarBooks =
    ratedBooks.filter(
      ({ book }) =>
        book.personalRating === 5
    ).length;

  const fiveStarPercentage =
    totalRated > 0
      ? (
          fiveStarBooks /
          totalRated
        ) * 100
      : 0;


  /* =====================================================
     EMPTY STATE
     ===================================================== */

  if (totalRated === 0) {
    return (
      <section className="receipts-ratings">

        <div className="receipts-section-heading">

          <div>
            <p className="eyebrow">
              RECEIPT 004 // RATINGS
            </p>

            <h2>
              Rating Distribution
            </h2>
          </div>

          <span>
            STAR DATA
          </span>

        </div>


        <div className="receipts-analytics-empty">

          <span>
            ☆
          </span>

          <strong>
            No ratings found.
          </strong>

          <p>
            Rating analytics will appear
            after books receive a star
            rating.
          </p>

        </div>

      </section>
    );
  }


  /* =====================================================
     RATING DISTRIBUTION
     ===================================================== */

  return (
    <section className="receipts-ratings">

      <div className="receipts-section-heading">

        <div>
          <p className="eyebrow">
            RECEIPT 004 // RATINGS
          </p>

          <h2>
            Rating Distribution
          </h2>
        </div>

        <span>
          {totalRated} RATED BOOKS
        </span>

      </div>


      {/* =============================================
          RATING SUMMARY
          ============================================= */}

      <div className="receipts-rating-summary">

        <article>

          <span>
            AVERAGE
          </span>

          <strong>
            {averageRating.toFixed(2)}
          </strong>

          <small>
            OUT OF 5
          </small>

        </article>


        <article>

          <span>
            MOST COMMON
          </span>

          <strong>
            {formatRating(
              highestBucket.rating
            )}
            ★
          </strong>

          <small>
            {
              highestBucket.count
            }{" "}
            BOOKS
          </small>

        </article>


        <article>

          <span>
            4★ OR HIGHER
          </span>

          <strong>
            {fourPlusPercentage.toFixed(
              1
            )}
            %
          </strong>

          <small>
            {fourPlusBooks} BOOKS
          </small>

        </article>


        <article>

          <span>
            PERFECT 5★
          </span>

          <strong>
            {fiveStarPercentage.toFixed(
              1
            )}
            %
          </strong>

          <small>
            {fiveStarBooks} BOOKS
          </small>

        </article>

      </div>


      {/* =============================================
          DISTRIBUTION BARS
          ============================================= */}

      <div className="receipts-analytics-panel">

        <div className="receipts-analytics-heading">

          <div>
            <span>
              STAR OUTPUT
            </span>

            <h3>
              The Rating Curve
            </h3>
          </div>

          <small>
            0.5–5.0 SCALE
          </small>

        </div>


        <div className="receipts-rating-list">

          {distribution.map(
            ({
              rating,
              count,
              percentage,
            }) => {

              const barWidth =
                (
                  count /
                  largestBucket
                ) * 100;

              return (
                <div
                  key={rating}
                  className="receipts-rating-row"
                >

                  <div className="receipts-rating-label">

                    <strong>
                      {formatRating(
                        rating
                      )}
                    </strong>

                    <span>
                      ★
                    </span>

                  </div>


                  <div className="receipts-bar-track">

                    <div
                      className="receipts-bar-fill"
                      style={{
                        width:
                          `${barWidth}%`,
                      }}
                    />

                  </div>


                  <div className="receipts-rating-count">

                    <strong>
                      {count}
                    </strong>

                    <span>
                      {percentage.toFixed(
                        1
                      )}
                      %
                    </span>

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>


      <p className="receipts-analytics-footnote">
        Historical Goodreads ratings use
        whole stars. The Slaylist Suite
        supports half-star ratings, so the
        0.5 increments are already included
        and will populate as new ratings are
        recorded.
      </p>

    </section>
  );
}
