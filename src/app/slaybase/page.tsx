const statusFilters = [
  { label: "All Books", count: 2507, accent: "pink" },
  { label: "TBR", count: 2115, accent: "violet" },
  { label: "Read", count: 384, accent: "ice" },
  { label: "Current", count: 4, accent: "mixed" },
  { label: "DNF", count: 4, accent: "pink" },
];

const previewBooks = [
  {
    id: "book-1",
    title: "Book Title One",
    author: "Author Name",
    status: "TBR",
    rating: null,
    accent: "pink",
    tags: ["Fantasy", "Romance"],
  },
  {
    id: "book-2",
    title: "Book Title Two",
    author: "Author Name",
    status: "READ",
    rating: 5,
    accent: "violet",
    tags: ["Thriller", "Mystery"],
  },
  {
    id: "book-3",
    title: "Book Title Three",
    author: "Author Name",
    status: "CURRENT",
    rating: null,
    accent: "ice",
    tags: ["YA", "Contemporary"],
  },
  {
    id: "book-4",
    title: "Book Title Four",
    author: "Author Name",
    status: "TBR",
    rating: null,
    accent: "mixed",
    tags: ["Horror", "Dark"],
  },
  {
    id: "book-5",
    title: "Book Title Five",
    author: "Author Name",
    status: "READ",
    rating: 4,
    accent: "pink",
    tags: ["Fantasy", "Magic"],
  },
  {
    id: "book-6",
    title: "Book Title Six",
    author: "Author Name",
    status: "TBR",
    rating: null,
    accent: "violet",
    tags: ["Romance", "Adult"],
  },
];

export default function SlaybasePage() {
  return (
    <main className="slaybase-page">

      {/* =========================
          SLAYBASE HERO
          ========================= */}

      <section className="slaybase-hero">
        <div>
          <p className="eyebrow">
            LIBRARY DATABASE // 2,507 RECORDS
          </p>

          <h1 className="slaybase-title">
            THE
            <span> SLAYBASE</span>
          </h1>

          <p className="slaybase-intro">
            Every book. Every shelf. Every questionable
            decision that somehow became part of the collection.
          </p>
        </div>

        <div className="slaybase-orbit">
          <span>2,507</span>
          <small>BOOKS INDEXED</small>
        </div>
      </section>


      {/* =========================
          STATUS FILTERS
          ========================= */}

      <section className="slaybase-status-grid">
        {statusFilters.map((filter) => (
          <button
            type="button"
            key={filter.label}
            className={`slaybase-status-card status-${filter.accent}`}
          >
            <span>{filter.label}</span>

            <strong>
              {filter.count.toLocaleString()}
            </strong>
          </button>
        ))}
      </section>


      {/* =========================
          CONTROL BAR
          ========================= */}

      <section className="slaybase-controls">

        <div className="slaybase-search">
          <span>⌕</span>

          <input
            type="search"
            placeholder="Search title, author, series..."
            aria-label="Search the Slaybase"
          />
        </div>

        <div className="slaybase-control-buttons">
          <button type="button">
            FILTERS +
          </button>

          <button type="button">
            SORT: RECENTLY ADDED
          </button>

          <button type="button">
            ▦
          </button>

          <button type="button">
            ☰
          </button>
        </div>

      </section>


      {/* =========================
          LIBRARY HEADING
          ========================= */}

      <section className="slaybase-library-heading">
        <div>
          <p className="eyebrow">
            CURRENT QUERY // ALL BOOKS
          </p>

          <h2 className="section-title">
            The Library
          </h2>
        </div>

        <p className="slaybase-results">
          SHOWING 6 OF 2,507
        </p>
      </section>


      {/* =========================
          BOOK GRID
          ========================= */}

      <section className="slaybase-book-grid">

        {previewBooks.map((book) => (
          <article
            key={book.id}
            className="slaybase-book"
          >

            <div
              className={`slaybase-book-cover book-${book.accent}`}
            >
              <span className="book-status">
                {book.status}
              </span>

              <span className="book-cover-symbol">
                ✦
              </span>

              <strong>
                {book.title}
              </strong>
            </div>

            <div className="slaybase-book-info">

              <div className="book-info-heading">
                <div>
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                </div>

                <button
                  type="button"
                  aria-label={`More options for ${book.title}`}
                >
                  •••
                </button>
              </div>

              {book.rating ? (
                <div className="book-rating">
                  {"★".repeat(book.rating)}
                  {"☆".repeat(5 - book.rating)}
                </div>
              ) : (
                <div className="book-rating unrated">
                  NOT YET RATED
                </div>
              )}

              <div className="book-tags">
                {book.tags.map((tag) => (
                  <span key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

            </div>

          </article>
        ))}

      </section>


      {/* =========================
          LOAD MORE
          ========================= */}

      <div className="slaybase-load-more">
        <button type="button">
          LOAD MORE FROM THE ARCHIVES ↓
        </button>

        <p>
          2,501 more books are minding their business in the database.
        </p>
      </div>

    </main>
  );
}