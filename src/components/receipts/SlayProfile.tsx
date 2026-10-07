import type { Book } from "@/types";

type SlayProfileRecord = {
  book: Book;
  rawShelves: string[];
  readCount: number;
  wasTbbBuddyRead: boolean;
};

type SlayProfileProps = {
  records: SlayProfileRecord[];
};

type ProfileItem = {
  label: string;
  count: number;
};

function formatAuthors(authors: string[]) {
  return authors.length > 0 ? authors.join(", ") : "Unknown author";
}

function getTopItems(
  values: string[],
  limit = 5
): ProfileItem[] {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const cleaned = value.trim();

    if (!cleaned) return;

    counts.set(cleaned, (counts.get(cleaned) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.label.localeCompare(b.label);
    })
    .slice(0, limit);
}

export default function SlayProfile({
  records,
}: SlayProfileProps) {
  const certifiedSlays = records.filter(
    ({ book }) => book.certifiedSlay === true
  );

  const certifiedAuthors = certifiedSlays.flatMap(
    ({ book }) => book.authors
  );

  const topAuthors = getTopItems(certifiedAuthors);

  const certifiedRereads = certifiedSlays.filter(
    ({ readCount }) => readCount > 1
  );

  const certifiedBuddyReads = certifiedSlays.filter(
    ({ wasTbbBuddyRead }) => wasTbbBuddyRead
  );

  const certifiedWithPages = certifiedSlays.filter(
    ({ book }) =>
      typeof book.pageCount === "number" &&
      book.pageCount > 0
  );

  const averageSlayLength =
    certifiedWithPages.length > 0
      ? Math.round(
          certifiedWithPages.reduce(
            (total, { book }) =>
              total + (book.pageCount ?? 0),
            0
          ) / certifiedWithPages.length
        )
      : 0;

  const repeatedSlayAuthors = topAuthors.filter(
    ({ count }) => count > 1
  );

  const mostFrequentAuthor = topAuthors[0] ?? null;

  const rereadRate =
    certifiedSlays.length > 0
      ? (certifiedRereads.length /
          certifiedSlays.length) *
        100
      : 0;

  const buddyReadRate =
    certifiedSlays.length > 0
      ? (certifiedBuddyReads.length /
          certifiedSlays.length) *
        100
      : 0;

  const formatPercent = (value: number) =>
    `${value.toFixed(1)}%`;

  return (
    <section className="receipts-section">
      <div className="receipts-section-heading">
        <div>
          <p className="receipts-eyebrow">
            YOUR CROWN FINGERPRINT
          </p>
          <h2>Slay Profile</h2>
        </div>

        <p className="receipts-section-copy">
          A data-backed look at the books and authors
          that keep making their way into your most
          exclusive reading tier.
        </p>
      </div>

      <div className="receipts-stat-grid">
        <article className="receipts-stat-card glass-pink">
          <span className="receipts-stat-label">
            Crowned Rereads
          </span>

          <strong className="receipts-stat-value">
            {certifiedRereads.length.toLocaleString()}
          </strong>

          <span className="receipts-stat-detail">
            {formatPercent(rereadRate)} of Certified Slays
          </span>
        </article>

        <article className="receipts-stat-card glass-violet">
          <span className="receipts-stat-label">
            Crowned Buddy Reads
          </span>

          <strong className="receipts-stat-value">
            {certifiedBuddyReads.length.toLocaleString()}
          </strong>

          <span className="receipts-stat-detail">
            {formatPercent(buddyReadRate)} of Certified Slays
          </span>
        </article>

        <article className="receipts-stat-card glass-ice">
          <span className="receipts-stat-label">
            Avg. Slay Length
          </span>

          <strong className="receipts-stat-value">
            {averageSlayLength > 0
              ? averageSlayLength.toLocaleString()
              : "—"}
          </strong>

          <span className="receipts-stat-detail">
            pages among Slays with known page counts
          </span>
        </article>

        <article className="receipts-stat-card glass-mixed">
          <span className="receipts-stat-label">
            Repeat Slay Authors
          </span>

          <strong className="receipts-stat-value">
            {repeatedSlayAuthors.length.toLocaleString()}
          </strong>

          <span className="receipts-stat-detail">
            authors with multiple Certified Slays
          </span>
        </article>
      </div>

      <div className="receipts-analysis-grid">
        <article className="receipts-analysis-card">
          <div className="receipts-analysis-header">
            <div>
              <span className="receipts-analysis-kicker">
                ♛ AUTHOR DNA
              </span>
              <h3>Who Keeps Earning the Crown?</h3>
            </div>

            {mostFrequentAuthor && (
              <span className="receipts-analysis-badge">
                {mostFrequentAuthor.count} Slays
              </span>
            )}
          </div>

          {topAuthors.length > 0 ? (
            <div className="receipts-profile-list">
              {topAuthors.map((author, index) => {
                const maxCount =
                  mostFrequentAuthor?.count ?? 1;

                const width =
                  (author.count / maxCount) * 100;

                return (
                  <div
                    className="receipts-profile-row"
                    key={author.label}
                  >
                    <div className="receipts-profile-row-top">
                      <span>
                        {index + 1}. {author.label}
                      </span>

                      <strong>
                        {author.count}{" "}
                        {author.count === 1
                          ? "Slay"
                          : "Slays"}
                      </strong>
                    </div>

                    <div className="receipts-meter">
                      <div
                        className="receipts-meter-fill"
                        style={{
                          width: `${Math.min(
                            width,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="receipts-analysis-copy">
              No Certified Slay author data is available
              yet.
            </p>
          )}
        </article>

        <article className="receipts-analysis-card">
          <div className="receipts-analysis-header">
            <div>
              <span className="receipts-analysis-kicker">
                🧬 READING DNA
              </span>
              <h3>Your Slay Signals</h3>
            </div>
          </div>

          <div className="receipts-signal-list">
            <div className="receipts-signal">
              <span>Certified Slays</span>
              <strong>
                {certifiedSlays.length.toLocaleString()}
              </strong>
            </div>

            <div className="receipts-signal">
              <span>Returned for a reread</span>
              <strong>
                {certifiedRereads.length.toLocaleString()}
              </strong>
            </div>

            <div className="receipts-signal">
              <span>Historical TBB buddy reads</span>
              <strong>
                {certifiedBuddyReads.length.toLocaleString()}
              </strong>
            </div>

            <div className="receipts-signal">
              <span>Known page-count sample</span>
              <strong>
                {certifiedWithPages.length.toLocaleString()}
              </strong>
            </div>
          </div>

          <p className="receipts-analysis-copy">
            These are your first measurable Slay signals.
            As the Suite collects richer reading data, this
            profile can evolve into a deeper picture of what
            consistently earns your crown.
          </p>
        </article>
      </div>

      {certifiedRereads.length > 0 && (
        <article className="receipts-analysis-card">
          <div className="receipts-analysis-header">
            <div>
              <span className="receipts-analysis-kicker">
                ↻ CAME BACK FOR MORE
              </span>
              <h3>Certified Slays You Reread</h3>
            </div>

            <span className="receipts-analysis-badge">
              {certifiedRereads.length} books
            </span>
          </div>

          <div className="receipts-profile-list">
            {certifiedRereads
              .slice()
              .sort(
                (a, b) => b.readCount - a.readCount
              )
              .slice(0, 5)
              .map(({ book, readCount }) => (
                <div
                  className="receipts-signal"
                  key={book.id}
                >
                  <span>
                    <strong>{book.title}</strong>
                    <small>
                      {formatAuthors(book.authors)}
                    </small>
                  </span>

                  <strong>
                    {readCount}{" "}
                    {readCount === 1
                      ? "read"
                      : "reads"}
                  </strong>
                </div>
              ))}
          </div>
        </article>
      )}

      <p className="receipts-footnote">
        Slay Profile uses only metadata already present in
        your library. It does not infer genres, tropes,
        moods, buddy-read partners, or historical reading
        details that were not included in your imported
        data.
      </p>
    </section>
  );
}