import type { Book } from "@/types";

type SlayMetricRecord = {
  book: Book;
};

type SlayMetricsProps = {
  records: SlayMetricRecord[];
};

export default function SlayMetrics({ records }: SlayMetricsProps) {
  const readBooks = records.filter(
    ({ book }) => book.status === "read"
  );

  const ratedBooks = readBooks.filter(
    ({ book }) =>
      typeof book.personalRating === "number" &&
      book.personalRating > 0
  );

  const fiveStarBooks = ratedBooks.filter(
    ({ book }) => book.personalRating === 5
  );

  const certifiedSlays = readBooks.filter(
    ({ book }) => book.certifiedSlay === true
  );

  const certifiedFiveStars = certifiedSlays.filter(
    ({ book }) => book.personalRating === 5
  );

  const fiveStarsNotCertified = fiveStarBooks.filter(
    ({ book }) => !book.certifiedSlay
  );

  const certifiedBelowFive = certifiedSlays.filter(
    ({ book }) => book.personalRating !== 5
  );

  const fiveStarRate =
    ratedBooks.length > 0
      ? (fiveStarBooks.length / ratedBooks.length) * 100
      : 0;

  const certificationRate =
    readBooks.length > 0
      ? (certifiedSlays.length / readBooks.length) * 100
      : 0;

  const fiveStarToSlayRate =
    fiveStarBooks.length > 0
      ? (certifiedFiveStars.length / fiveStarBooks.length) * 100
      : 0;

  const slayToFiveStarRate =
    certifiedSlays.length > 0
      ? (certifiedFiveStars.length / certifiedSlays.length) * 100
      : 0;

  const formatPercent = (value: number) =>
    `${value.toFixed(1)}%`;

  return (
    <section className="receipts-section">
      <div className="receipts-section-heading">
        <div>
          <p className="receipts-eyebrow">THE SLAY STANDARD</p>
          <h2>Slay Analytics</h2>
        </div>

        <p className="receipts-section-copy">
          Five stars means a book earned the rating. Certified Slay means it
          earned the crown. Similar energy, very different standards.
        </p>
      </div>

      <div className="receipts-stat-grid">
        <article className="receipts-stat-card glass-pink">
          <span className="receipts-stat-label">5-Star Reads</span>
          <strong className="receipts-stat-value">
            {fiveStarBooks.length.toLocaleString()}
          </strong>
          <span className="receipts-stat-detail">
            {formatPercent(fiveStarRate)} of rated reads
          </span>
        </article>

        <article className="receipts-stat-card glass-violet">
          <span className="receipts-stat-label">Certified Slays</span>
          <strong className="receipts-stat-value">
            {certifiedSlays.length.toLocaleString()}
          </strong>
          <span className="receipts-stat-detail">
            {formatPercent(certificationRate)} of read books
          </span>
        </article>

        <article className="receipts-stat-card glass-mixed">
          <span className="receipts-stat-label">
            5 Stars + Certified
          </span>
          <strong className="receipts-stat-value">
            {certifiedFiveStars.length.toLocaleString()}
          </strong>
          <span className="receipts-stat-detail">
            books holding both distinctions
          </span>
        </article>

        <article className="receipts-stat-card glass-ice">
          <span className="receipts-stat-label">
            Crown Conversion
          </span>
          <strong className="receipts-stat-value">
            {formatPercent(fiveStarToSlayRate)}
          </strong>
          <span className="receipts-stat-detail">
            of 5-star reads became Certified Slays
          </span>
        </article>
      </div>

      <div className="receipts-analysis-grid">
        <article className="receipts-analysis-card">
          <div className="receipts-analysis-header">
            <div>
              <span className="receipts-analysis-kicker">
                ★ RATING VS. CROWN
              </span>
              <h3>The Slay Gap</h3>
            </div>

            <span className="receipts-analysis-badge">
              {fiveStarsNotCertified.length.toLocaleString()} uncrowned
            </span>
          </div>

          <p className="receipts-analysis-copy">
            {fiveStarsNotCertified.length.toLocaleString()} of your 5-star
            reads were not Certified Slays. That gap is intentional: loving a
            book and inducting it into the Slaylist hall of fame are two
            different decisions.
          </p>

          <div className="receipts-meter">
            <div
              className="receipts-meter-fill"
              style={{
                width: `${Math.min(fiveStarToSlayRate, 100)}%`,
              }}
            />
          </div>

          <div className="receipts-meter-labels">
            <span>5-Star → Certified Slay</span>
            <strong>{formatPercent(fiveStarToSlayRate)}</strong>
          </div>
        </article>

        <article className="receipts-analysis-card">
          <div className="receipts-analysis-header">
            <div>
              <span className="receipts-analysis-kicker">
                ♛ CERTIFIED STATUS
              </span>
              <h3>Crown Composition</h3>
            </div>

            <span className="receipts-analysis-badge">
              {certifiedSlays.length.toLocaleString()} total
            </span>
          </div>

          <p className="receipts-analysis-copy">
            {certifiedFiveStars.length.toLocaleString()} Certified Slays also
            carry a 5-star rating, while{" "}
            {certifiedBelowFive.length.toLocaleString()} do not. Certification
            stays independent from the numeric rating.
          </p>

          <div className="receipts-meter">
            <div
              className="receipts-meter-fill"
              style={{
                width: `${Math.min(slayToFiveStarRate, 100)}%`,
              }}
            />
          </div>

          <div className="receipts-meter-labels">
            <span>Certified Slays rated 5 stars</span>
            <strong>{formatPercent(slayToFiveStarRate)}</strong>
          </div>
        </article>
      </div>

      <p className="receipts-footnote">
        Certified Slay status is intentionally separate from star ratings. A
        5-star rating does not automatically certify a book, and certification
        is never inferred from rating alone.
      </p>
    </section>
  );
}
