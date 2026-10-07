import type { Book } from "@/types";

type PageRecord = {
  book: Book;
};

type PageAnalyticsProps = {
  records: PageRecord[];
};

type PageRange = {
  label: string;
  min: number;
  max: number | null;
};

const pageRanges: PageRange[] = [
  {
    label: "< 200",
    min: 1,
    max: 199,
  },
  {
    label: "200–299",
    min: 200,
    max: 299,
  },
  {
    label: "300–399",
    min: 300,
    max: 399,
  },
  {
    label: "400–499",
    min: 400,
    max: 499,
  },
  {
    label: "500+",
    min: 500,
    max: null,
  },
];

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}

export default function PageAnalytics({
  records,
}: PageAnalyticsProps) {

  /* =====================================================
     READ BOOKS WITH KNOWN PAGE COUNTS
     ===================================================== */

  const readBooksWithPages =
    records.filter(
      ({ book }) =>
        book.status === "read" &&
        typeof book.pageCount ===
          "number" &&
        book.pageCount > 0
    );

  const totalBooksWithPages =
    readBooksWithPages.length;


  /* =====================================================
     PAGE TOTALS
     ===================================================== */

  const knownPages =
    readBooksWithPages.reduce(
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

  const averageLength =
    totalBooksWithPages > 0
      ? knownPages /
        totalBooksWithPages
      : 0;


  /* =====================================================
     SHORTEST + LONGEST
     ===================================================== */

  const sortedByLength =
    [...readBooksWithPages].sort(
      (a, b) =>
        (
          a.book.pageCount ??
          0
        ) -
        (
          b.book.pageCount ??
          0
        )
    );

  const shortestBook =
    sortedByLength[0]?.book ??
    null;

  const longestBook =
    sortedByLength[
      sortedByLength.length - 1
    ]?.book ?? null;


  /* =====================================================
     PAGE RANGE DISTRIBUTION
     ===================================================== */

  const rangeData =
    pageRanges.map(
      ({
        label,
        min,
        max,
      }) => {

        const count =
          readBooksWithPages.filter(
            ({ book }) => {
              const pages =
                book.pageCount ?? 0;

              if (max === null) {
                return pages >= min;
              }

              return (
                pages >= min &&
                pages <= max
              );
            }
          ).length;

        const percentage =
          totalBooksWithPages > 0
            ? (
                count /
                totalBooksWithPages
              ) * 100
            : 0;

        return {
          label,
          count,
          percentage,
        };
      }
    );

  const largestRange =
    Math.max(
      ...rangeData.map(
        ({ count }) => count
      ),
      1
    );


  /* =====================================================
     EMPTY STATE
     ===================================================== */

  if (
    totalBooksWithPages === 0
  ) {
    return (
      <section className="receipts-pages">

        <div className="receipts-section-heading">

          <div>
            <p className="eyebrow">
              RECEIPT 005 // PAGES
            </p>

            <h2>
              Page Analytics
            </h2>
          </div>

          <span>
            PAGE DATA
          </span>

        </div>


        <div className="receipts-analytics-empty">

          <span>
            ▤
          </span>

          <strong>
            No page data found.
          </strong>

          <p>
            Page analytics require
            completed books with a known
            page count.
          </p>

        </div>

      </section>
    );
  }


  /* =====================================================
     PAGE ANALYTICS
     ===================================================== */

  return (
    <section className="receipts-pages">

      <div className="receipts-section-heading">

        <div>
          <p className="eyebrow">
            RECEIPT 005 // PAGES
          </p>

          <h2>
            Page Analytics
          </h2>
        </div>

        <span>
          {formatNumber(
            totalBooksWithPages
          )}{" "}
          BOOKS WITH PAGE DATA
        </span>

      </div>


      {/* =============================================
          SUMMARY
          ============================================= */}

      <div className="receipts-page-summary">

        <article>

          <span>
            KNOWN PAGES
          </span>

          <strong>
            {formatNumber(
              knownPages
            )}
          </strong>

          <small>
            UNIQUE READ BOOKS
          </small>

        </article>


        <article>

          <span>
            AVG. LENGTH
          </span>

          <strong>
            {formatNumber(
              Math.round(
                averageLength
              )
            )}
          </strong>

          <small>
            PAGES PER BOOK
          </small>

        </article>


        <article>

          <span>
            SHORTEST
          </span>

          <strong>
            {formatNumber(
              shortestBook?.pageCount ??
                0
            )}
          </strong>

          <small>
            PAGES
          </small>

        </article>


        <article>

          <span>
            LONGEST
          </span>

          <strong>
            {formatNumber(
              longestBook?.pageCount ??
                0
            )}
          </strong>

          <small>
            PAGES
          </small>

        </article>

      </div>


      {/* =============================================
          SHORTEST + LONGEST BOOKS
          ============================================= */}

      <div className="receipts-length-extremes">

        {shortestBook && (
          <article>

            <span>
              TINIEST RECEIPT
            </span>

            <h3>
              {shortestBook.title}
            </h3>

            <p>
              {shortestBook.authors.join(
                ", "
              )}
            </p>

            <strong>
              {formatNumber(
                shortestBook.pageCount ??
                  0
              )}{" "}
              pages
            </strong>

          </article>
        )}


        {longestBook && (
          <article>

            <span>
              THE UNIT
            </span>

            <h3>
              {longestBook.title}
            </h3>

            <p>
              {longestBook.authors.join(
                ", "
              )}
            </p>

            <strong>
              {formatNumber(
                longestBook.pageCount ??
                  0
              )}{" "}
              pages
            </strong>

          </article>
        )}

      </div>


      {/* =============================================
          PAGE RANGE DISTRIBUTION
          ============================================= */}

      <div className="receipts-analytics-panel">

        <div className="receipts-analytics-heading">

          <div>
            <span>
              LENGTH OUTPUT
            </span>

            <h3>
              Where the Books Live
            </h3>
          </div>

          <small>
            PAGE RANGES
          </small>

        </div>


        <div className="receipts-page-range-list">

          {rangeData.map(
            ({
              label,
              count,
              percentage,
            }) => {

              const barWidth =
                (
                  count /
                  largestRange
                ) * 100;

              return (
                <div
                  key={label}
                  className="receipts-page-range-row"
                >

                  <strong>
                    {label}
                  </strong>


                  <div className="receipts-bar-track">

                    <div
                      className="receipts-bar-fill"
                      style={{
                        width:
                          `${barWidth}%`,
                      }}
                    />

                  </div>


                  <div className="receipts-page-range-count">

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
        Known pages represent page counts
        across unique books marked read.
        Historical rereads are not multiplied
        into this total because Goodreads did
        not provide complete session-level
        page history for every reread.
      </p>

    </section>
  );
}
