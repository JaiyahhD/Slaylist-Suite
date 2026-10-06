import Link from "next/link";

const currentBooks = [
  {
    id: "current-1",
    title: "Current Read One",
    author: "Author Name",
    progress: 72,
    currentPage: 288,
    totalPages: 400,
    accent: "pink",
  },
  {
    id: "current-2",
    title: "Current Read Two",
    author: "Author Name",
    progress: 48,
    currentPage: 192,
    totalPages: 400,
    accent: "violet",
  },
  {
    id: "current-3",
    title: "Current Read Three",
    author: "Author Name",
    progress: 31,
    currentPage: 124,
    totalPages: 400,
    accent: "ice",
  },
  {
    id: "current-4",
    title: "Current Read Four",
    author: "Author Name",
    progress: 16,
    currentPage: 64,
    totalPages: 400,
    accent: "mixed",
  },
];

export default function CurrentRotation() {
  return (
    <section className="suite-section">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">
            LIVE READING DATA
          </p>

          <h2 className="section-title">
             TESTING 123 JAIYAH
          </h2>

          <p className="section-copy">
            Currently reading, currently obsessed, currently making
            questionable decisions about starting another book.
          </p>
        </div>

        <Link
          href="/current-rotation"
          className="text-link"
        >
          VIEW ROTATION →
        </Link>
      </div>

      <div className="rotation-grid">
        {currentBooks.map((book) => (
          <article
            key={book.id}
            className={`rotation-card rotation-${book.accent}`}
          >
            <div className="rotation-cover">
              <span className="cover-label">
                CURRENTLY
                <br />
                READING
              </span>

              <span className="cover-sparkle">
                ✦
              </span>

              <span className="cover-title">
                {book.title}
              </span>
            </div>

            <div className="rotation-info">
              <div>
                <span className="rotation-status">
                  ● IN ROTATION
                </span>

                <h3>{book.title}</h3>

                <p>{book.author}</p>
              </div>

              <div className="rotation-progress">
                <div className="progress-meta">
                  <span>
                    PAGE {book.currentPage}
                  </span>

                  <strong>
                    {book.progress}%
                  </strong>
                </div>

                <div
                  className="progress-track"
                  aria-label={`${book.progress}% complete`}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${book.progress}%`,
                    }}
                  />
                </div>

                <span className="progress-pages">
                  {book.currentPage} / {book.totalPages} PAGES
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}