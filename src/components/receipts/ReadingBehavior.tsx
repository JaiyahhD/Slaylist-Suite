import type {
  Book,
  ReadingRecord,
} from "@/types";

type BehaviorRecord = {
  book: Book;

  readingRecord:
    ReadingRecord | null;

  readCount: number;

  wasTbbBuddyRead: boolean;
};

type ReadingBehaviorProps = {
  records: BehaviorRecord[];
};

type FormatBucket = {
  label: string;
  count: number;
  percentage: number;
};

function formatNumber(
  value: number
) {
  return new Intl.NumberFormat(
    "en-US"
  ).format(value);
}

function formatAuthors(
  authors: string[]
) {
  return authors.length > 0
    ? authors.join(", ")
    : "Unknown author";
}

export default function ReadingBehavior({
  records,
}: ReadingBehaviorProps) {

  /* =====================================================
     REREAD BEHAVIOR
     ===================================================== */

  const rereadBooks =
    records.filter(
      ({ readCount }) =>
        readCount > 1
    );

  const additionalReads =
    rereadBooks.reduce(
      (
        total,
        { readCount }
      ) =>
        total +
        Math.max(
          readCount - 1,
          0
        ),
      0
    );

  const totalRecordedReads =
    records.reduce(
      (
        total,
        { readCount }
      ) =>
        total + readCount,
      0
    );

  const maxReadCount =
    Math.max(
      ...records.map(
        ({ readCount }) =>
          readCount
      ),
      0
    );

  const mostRereadBooks =
    maxReadCount > 1
      ? records.filter(
          ({ readCount }) =>
            readCount ===
            maxReadCount
        )
      : [];


  /* =====================================================
     TBB BUDDY READS
     ===================================================== */

  const tbbBuddyReads =
    records.filter(
      ({
        wasTbbBuddyRead,
      }) =>
        wasTbbBuddyRead
    );


  /* =====================================================
     READING FORMAT
     ===================================================== */

  const formatCounts =
    new Map<string, number>();

  records.forEach(
    ({ readingRecord }) => {
      const rawMethod =
        readingRecord?.readingMethod;

      const normalized =
        typeof rawMethod ===
          "string" &&
        rawMethod.trim()
          ? rawMethod
              .trim()
              .toLowerCase()
          : "unknown";

      formatCounts.set(
        normalized,
        (
          formatCounts.get(
            normalized
          ) ?? 0
        ) + 1
      );
    }
  );

  const totalFormatRecords =
    Array.from(
      formatCounts.values()
    ).reduce(
      (
        total,
        count
      ) =>
        total + count,
      0
    );

  const formatData: FormatBucket[] =
    Array.from(
      formatCounts.entries()
    )
      .map(
        ([label, count]) => ({
          label:
            label === "unknown"
              ? "UNKNOWN"
              : label
                  .replace(
                    /[-_]/g,
                    " "
                  )
                  .toUpperCase(),

          count,

          percentage:
            totalFormatRecords > 0
              ? (
                  count /
                  totalFormatRecords
                ) * 100
              : 0,
        })
      )
      .sort(
        (a, b) =>
          b.count - a.count
      );

  const largestFormat =
    Math.max(
      ...formatData.map(
        ({ count }) => count
      ),
      1
    );


  /* =====================================================
     READING BEHAVIOR
     ===================================================== */

  return (
    <section className="receipts-behavior">

      <div className="receipts-section-heading">

        <div>
          <p className="eyebrow">
            RECEIPT 006 // BEHAVIOR
          </p>

          <h2>
            Reading Behavior
          </h2>
        </div>

        <span>
          HABIT DATA
        </span>

      </div>


      {/* =============================================
          SUMMARY
          ============================================= */}

      <div className="receipts-behavior-summary">

        <article>

          <span>
            RECORDED READS
          </span>

          <strong>
            {formatNumber(
              totalRecordedReads
            )}
          </strong>

          <small>
            INCLUDING REREADS
          </small>

        </article>


        <article>

          <span>
            REREAD BOOKS
          </span>

          <strong>
            {formatNumber(
              rereadBooks.length
            )}
          </strong>

          <small>
            UNIQUE BOOKS
          </small>

        </article>


        <article>

          <span>
            EXTRA READS
          </span>

          <strong>
            {formatNumber(
              additionalReads
            )}
          </strong>

          <small>
            BEYOND FIRST READS
          </small>

        </article>


        <article>

          <span>
            TBB BUDDY READS
          </span>

          <strong>
            {formatNumber(
              tbbBuddyReads.length
            )}
          </strong>

          <small>
            HISTORICAL SHELF
          </small>

        </article>

      </div>


      {/* =============================================
          MOST REREAD
          ============================================= */}

      <div className="receipts-analytics-panel">

        <div className="receipts-analytics-heading">

          <div>
            <span>
              REPEAT OFFENDERS
            </span>

            <h3>
              Most Reread
            </h3>
          </div>

          <small>
            GOODREADS READ COUNT
          </small>

        </div>


        {mostRereadBooks.length > 0 ? (
          <div className="receipts-reread-list">

            {mostRereadBooks.map(
              ({
                book,
                readCount,
              }) => (
                <article
                  key={book.id}
                  className="receipts-reread-card"
                >

                  <div>
                    <span>
                      READ
                    </span>

                    <strong>
                      {readCount}×
                    </strong>
                  </div>


                  <div>

                    <h4>
                      {book.title}
                    </h4>

                    <p>
                      {formatAuthors(
                        book.authors
                      )}
                    </p>

                  </div>

                </article>
              )
            )}

          </div>
        ) : (
          <div className="receipts-analytics-empty">

            <span>
              ↻
            </span>

            <strong>
              No rereads recorded.
            </strong>

            <p>
              Repeat reads will appear
              here once a book has a
              Read Count greater than one.
            </p>

          </div>
        )}

      </div>


      {/* =============================================
          FORMAT BREAKDOWN
          ============================================= */}

      <div className="receipts-analytics-panel">

        <div className="receipts-analytics-heading">

          <div>
            <span>
              FORMAT OUTPUT
            </span>

            <h3>
              How the Books Were Read
            </h3>
          </div>

          <small>
            RECORDED FORMAT DATA
          </small>

        </div>


        <div className="receipts-format-list">

          {formatData.map(
            ({
              label,
              count,
              percentage,
            }) => {

              const barWidth =
                (
                  count /
                  largestFormat
                ) * 100;

              return (
                <div
                  key={label}
                  className="receipts-format-row"
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


                  <div className="receipts-format-count">

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


      {/* =============================================
          TBB HISTORY NOTE
          ============================================= */}

      <div className="receipts-data-note">

        <span>
          ♡
        </span>

        <div>

          <strong>
            BUDDY READ RECEIPT
          </strong>

          <p>
            The TBB Buddy Reads total
            preserves books historically
            tagged on your Goodreads
            tbb-buddy-reads shelf. It does
            not invent a buddy, date, or
            ReadSync session where that
            information was not recorded.
          </p>

        </div>

      </div>


      <p className="receipts-analytics-footnote">
        Reread totals preserve Goodreads
        Read Count data. Historical format
        analytics only reflect reading-method
        information actually available in
        the imported records; missing format
        data remains labeled unknown.
      </p>

    </section>
  );
}