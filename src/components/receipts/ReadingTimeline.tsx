import type {
  Book,
  ReadingRecord,
} from "@/types";

type TimelineRecord = {
  book: Book;
  readingRecord:
    ReadingRecord | null;
};

type ReadingTimelineProps = {
  records: TimelineRecord[];
};

type YearData = {
  year: number;
  count: number;
};

type MonthData = {
  month: string;
  count: number;
};

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function getCompletedDate(
  record: TimelineRecord
) {
  const value =
    record.readingRecord?.finishedAt;

  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date;
}

export default function ReadingTimeline({
  records,
}: ReadingTimelineProps) {
  /* =====================================================
     DATED READS
     ===================================================== */

  const datedReads =
    records
      .map((record) => ({
        record,
        date:
          getCompletedDate(
            record
          ),
      }))
      .filter(
        (
          item
        ): item is {
          record: TimelineRecord;
          date: Date;
        } =>
          item.date !== null
      );


  /* =====================================================
     READS BY YEAR
     ===================================================== */

  const yearMap =
    new Map<number, number>();

  datedReads.forEach(
    ({ date }) => {
      const year =
        date.getUTCFullYear();

      yearMap.set(
        year,
        (
          yearMap.get(year) ??
          0
        ) + 1
      );
    }
  );

  const yearData: YearData[] =
    Array.from(
      yearMap.entries()
    )
      .map(
        ([year, count]) => ({
          year,
          count,
        })
      )
      .sort(
        (a, b) =>
          b.year - a.year
      );

  const peakYearCount =
    Math.max(
      ...yearData.map(
        (item) => item.count
      ),
      1
    );


  /* =====================================================
     MOST RECENT YEAR
     ===================================================== */

  const latestYear =
    yearData.length > 0
      ? yearData[0].year
      : null;

  const monthData: MonthData[] =
    monthNames.map(
      (month, index) => ({
        month,

        count:
          latestYear === null
            ? 0
            : datedReads.filter(
                ({ date }) =>
                  date.getUTCFullYear() ===
                    latestYear &&
                  date.getUTCMonth() ===
                    index
              ).length,
      })
    );

  const peakMonthCount =
    Math.max(
      ...monthData.map(
        (item) => item.count
      ),
      1
    );


  /* =====================================================
     EMPTY STATE
     ===================================================== */

  if (datedReads.length === 0) {
    return (
      <section className="receipts-timeline">

        <div className="receipts-section-heading">

          <div>
            <p className="eyebrow">
              RECEIPT 003 // TIMELINE
            </p>

            <h2>
              Reading Timeline
            </h2>
          </div>

          <span>
            DATE DATA
          </span>

        </div>

        <div className="receipts-analytics-empty">

          <span>
            ◌
          </span>

          <strong>
            No dated reads found.
          </strong>

          <p>
            Historical timeline analytics
            require a recorded completion
            date.
          </p>

        </div>

      </section>
    );
  }


  /* =====================================================
     TIMELINE
     ===================================================== */

  return (
    <section className="receipts-timeline">

      <div className="receipts-section-heading">

        <div>
          <p className="eyebrow">
            RECEIPT 003 // TIMELINE
          </p>

          <h2>
            Reading Timeline
          </h2>
        </div>

        <span>
          {datedReads.length} DATED READS
        </span>

      </div>


      {/* =============================================
          YEARLY DATA
          ============================================= */}

      <div className="receipts-analytics-panel">

        <div className="receipts-analytics-heading">

          <div>
            <span>
              YEARLY OUTPUT
            </span>

            <h3>
              Reads by Year
            </h3>
          </div>

          <small>
            COMPLETION DATES
          </small>

        </div>


        <div className="receipts-year-list">

          {yearData.map(
            ({
              year,
              count,
            }) => {

              const width =
                (
                  count /
                  peakYearCount
                ) * 100;

              return (
                <div
                  key={year}
                  className="receipts-year-row"
                >

                  <strong>
                    {year}
                  </strong>

                  <div className="receipts-bar-track">

                    <div
                      className="receipts-bar-fill"
                      style={{
                        width:
                          `${width}%`,
                      }}
                    />

                  </div>

                  <span>
                    {count}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* =============================================
          MONTHLY DATA
          ============================================= */}

      {latestYear !== null && (
        <div className="receipts-analytics-panel">

          <div className="receipts-analytics-heading">

            <div>
              <span>
                MONTHLY OUTPUT
              </span>

              <h3>
                {latestYear} by Month
              </h3>
            </div>

            <small>
              LATEST DATED YEAR
            </small>

          </div>


          <div className="receipts-month-grid">

            {monthData.map(
              ({
                month,
                count,
              }) => {

                const intensity =
                  count === 0
                    ? 0
                    : Math.max(
                        count /
                          peakMonthCount,
                        0.12
                      );

                return (
                  <div
                    key={month}
                    className="receipts-month-cell"
                    style={{
                      opacity:
                        count === 0
                          ? 0.42
                          : 0.55 +
                            intensity *
                              0.45,
                    }}
                  >

                    <span>
                      {month}
                    </span>

                    <strong>
                      {count}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </div>
      )}


      <p className="receipts-analytics-footnote">
        Timeline totals include only books
        with a recorded completion date.
        Undated historical reads remain in
        your lifetime totals but are not
        assigned to a year or month.
      </p>

    </section>
  );
}
