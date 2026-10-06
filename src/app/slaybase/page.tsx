"use client";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import type {
  Book,
  BookFormat,
  LibraryStatus,
} from "@/types";

import goodreadsLibrary from "@/data/goodreads-library.json";


/* =========================================================
   TYPES
   ========================================================= */

type GoodreadsLibraryRecord = {
  book: Book;
  readingRecord: unknown | null;
  rawShelves: string[];
  readCount: number;
  wasTbbBuddyRead: boolean;
};

type StatusFilter =
  | "all"
  | LibraryStatus;

type SortOption =
  | "recently-added"
  | "oldest-added"
  | "title-az"
  | "title-za"
  | "highest-rated"
  | "lowest-rated";

type SpecialFilter =
  | "certified-slay"
  | "reread"
  | "tbb-buddy-read";


/* =========================================================
   GOODREADS LIBRARY DATA
   ========================================================= */

const library =
  goodreadsLibrary as GoodreadsLibraryRecord[];


/* =========================================================
   STATUS FILTERS
   ========================================================= */

const statusFilters: {
  label: string;
  value: StatusFilter;
  count: number;
  accent: string;
}[] = [
  {
    label: "All Books",
    value: "all",
    count: 2507,
    accent: "pink",
  },
  {
    label: "TBR",
    value: "tbr",
    count: 2115,
    accent: "violet",
  },
  {
    label: "Read",
    value: "read",
    count: 384,
    accent: "ice",
  },
  {
    label: "Current",
    value: "currently-reading",
    count: 4,
    accent: "mixed",
  },
  {
    label: "DNF",
    value: "dnf",
    count: 4,
    accent: "pink",
  },
];


/* =========================================================
   SORT OPTIONS
   ========================================================= */

const sortOptions: {
  label: string;
  value: SortOption;
}[] = [
  {
    label: "Recently Added",
    value: "recently-added",
  },
  {
    label: "Oldest Added",
    value: "oldest-added",
  },
  {
    label: "Title A–Z",
    value: "title-az",
  },
  {
    label: "Title Z–A",
    value: "title-za",
  },
  {
    label: "Highest Rated",
    value: "highest-rated",
  },
  {
    label: "Lowest Rated",
    value: "lowest-rated",
  },
];

const bookAccents = [
  "pink",
  "violet",
  "ice",
  "mixed",
];


/* =========================================================
   SLAYBASE PAGE
   ========================================================= */

export default function SlaybasePage() {
  const [
    activeStatus,
    setActiveStatus,
  ] = useState<StatusFilter>("all");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    sortOption,
    setSortOption,
  ] = useState<SortOption>(
    "recently-added"
  );

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(12);

  const [
    filtersOpen,
    setFiltersOpen,
  ] = useState(false);

  const [
    selectedRatings,
    setSelectedRatings,
  ] = useState<number[]>([]);

  const [
    selectedFormats,
    setSelectedFormats,
  ] = useState<BookFormat[]>([]);

  const [
    selectedSpecialFilters,
    setSelectedSpecialFilters,
  ] = useState<SpecialFilter[]>([]);

  const [
    selectedShelves,
    setSelectedShelves,
  ] = useState<string[]>([]);


  /* =======================================================
     DERIVED LIBRARY INFORMATION
     ======================================================= */

  const books =
    useMemo(
      () =>
        library.map(
          (record) => record.book
        ),
      []
    );

  const availableShelves =
    useMemo(() => {
      const shelves =
        new Set<string>();

      library.forEach(
        (record) => {
          record.rawShelves.forEach(
            (shelf) => {
              if (shelf.trim()) {
                shelves.add(
                  shelf.trim()
                );
              }
            }
          );
        }
      );

      return Array
        .from(shelves)
        .sort(
          (a, b) =>
            a.localeCompare(b)
        );
    }, []);


  /* =======================================================
     ACTIVE DEEP FILTER COUNT
     ======================================================= */

  const activeDeepFilterCount =
    selectedRatings.length +
    selectedFormats.length +
    selectedSpecialFilters.length +
    selectedShelves.length;


  /* =======================================================
     FILTER + SEARCH + SORT
     ======================================================= */

  const filteredRecords =
    useMemo(() => {
      let results =
        [...library];

      /* -------------------------
         STATUS
         ------------------------- */

      if (activeStatus !== "all") {
        results =
          results.filter(
            (record) =>
              record.book.status ===
              activeStatus
          );
      }

      /* -------------------------
         SEARCH
         ------------------------- */

      const normalizedQuery =
        searchQuery
          .trim()
          .toLowerCase();

      if (normalizedQuery) {
        results =
          results.filter(
            (record) => {
              const book =
                record.book;

              const title =
                book.title
                  .toLowerCase();

              const authors =
                book.authors
                  .join(" ")
                  .toLowerCase();

              const series =
                book.series?.name
                  ?.toLowerCase() ??
                "";

              return (
                title.includes(
                  normalizedQuery
                ) ||
                authors.includes(
                  normalizedQuery
                ) ||
                series.includes(
                  normalizedQuery
                )
              );
            }
          );
      }

      /* -------------------------
         RATING
         ------------------------- */

      if (
        selectedRatings.length > 0
      ) {
        results =
          results.filter(
            (record) => {
              const rating =
                record.book
                  .personalRating;

              return (
                rating !== undefined &&
                selectedRatings.includes(
                  rating
                )
              );
            }
          );
      }

      /* -------------------------
         FORMAT
         ------------------------- */

      if (
        selectedFormats.length > 0
      ) {
        results =
          results.filter(
            (record) =>
              selectedFormats.some(
                (format) =>
                  record.book.formats
                    .includes(format)
              )
          );
      }

      /* -------------------------
         SPECIAL FILTERS
         ------------------------- */

      if (
        selectedSpecialFilters
          .includes(
            "certified-slay"
          )
      ) {
        results =
          results.filter(
            (record) =>
              record.book
                .certifiedSlay
          );
      }

      if (
        selectedSpecialFilters
          .includes("reread")
      ) {
        results =
          results.filter(
            (record) =>
              record.readCount > 1
          );
      }

      if (
        selectedSpecialFilters
          .includes(
            "tbb-buddy-read"
          )
      ) {
        results =
          results.filter(
            (record) =>
              record.wasTbbBuddyRead
          );
      }

      /* -------------------------
         GOODREADS SHELVES
         ------------------------- */

      if (
        selectedShelves.length > 0
      ) {
        results =
          results.filter(
            (record) =>
              selectedShelves.some(
                (selectedShelf) =>
                  record.rawShelves
                    .includes(
                      selectedShelf
                    )
              )
          );
      }

      /* -------------------------
         SORTING
         ------------------------- */

      results.sort(
        (a, b) => {
          const bookA =
            a.book;

          const bookB =
            b.book;

          switch (sortOption) {
            case "oldest-added":
              return (
                new Date(
                  bookA.dateAdded ?? 0
                ).getTime() -
                new Date(
                  bookB.dateAdded ?? 0
                ).getTime()
              );

            case "title-az":
              return (
                bookA.title
                  .localeCompare(
                    bookB.title
                  )
              );

            case "title-za":
              return (
                bookB.title
                  .localeCompare(
                    bookA.title
                  )
              );

            case "highest-rated":
              return (
                (
                  bookB.personalRating ??
                  0
                ) -
                (
                  bookA.personalRating ??
                  0
                )
              );

            case "lowest-rated":
              return (
                (
                  bookA.personalRating ??
                  0
                ) -
                (
                  bookB.personalRating ??
                  0
                )
              );

            case "recently-added":
            default:
              return (
                new Date(
                  bookB.dateAdded ?? 0
                ).getTime() -
                new Date(
                  bookA.dateAdded ?? 0
                ).getTime()
              );
          }
        }
      );

      return results;
    }, [
      activeStatus,
      searchQuery,
      sortOption,
      selectedRatings,
      selectedFormats,
      selectedSpecialFilters,
      selectedShelves,
    ]);


  /* =======================================================
     VISIBLE RECORDS
     ======================================================= */

  const visibleRecords =
    filteredRecords.slice(
      0,
      visibleCount
    );

  const remainingBooks =
    Math.max(
      filteredRecords.length -
        visibleRecords.length,
      0
    );


  /* =======================================================
     HANDLERS
     ======================================================= */

  function handleStatusChange(
    status: StatusFilter
  ) {
    setActiveStatus(status);
    setVisibleCount(12);
  }

  function handleSearchChange(
    value: string
  ) {
    setSearchQuery(value);
    setVisibleCount(12);
  }

  function handleSortChange(
    value: SortOption
  ) {
    setSortOption(value);
    setVisibleCount(12);
  }

  function handleLoadMore() {
    setVisibleCount(
      (current) =>
        current + 12
    );
  }

  function toggleRating(
    rating: number
  ) {
    setSelectedRatings(
      (current) =>
        current.includes(rating)
          ? current.filter(
              (item) =>
                item !== rating
            )
          : [
              ...current,
              rating,
            ]
    );

    setVisibleCount(12);
  }

  function toggleFormat(
    format: BookFormat
  ) {
    setSelectedFormats(
      (current) =>
        current.includes(format)
          ? current.filter(
              (item) =>
                item !== format
            )
          : [
              ...current,
              format,
            ]
    );

    setVisibleCount(12);
  }

  function toggleSpecialFilter(
    filter: SpecialFilter
  ) {
    setSelectedSpecialFilters(
      (current) =>
        current.includes(filter)
          ? current.filter(
              (item) =>
                item !== filter
            )
          : [
              ...current,
              filter,
            ]
    );

    setVisibleCount(12);
  }

  function toggleShelf(
    shelf: string
  ) {
    setSelectedShelves(
      (current) =>
        current.includes(shelf)
          ? current.filter(
              (item) =>
                item !== shelf
            )
          : [
              ...current,
              shelf,
            ]
    );

    setVisibleCount(12);
  }

  function clearDeepFilters() {
    setSelectedRatings([]);
    setSelectedFormats([]);
    setSelectedSpecialFilters([]);
    setSelectedShelves([]);
    setVisibleCount(12);
  }

  function resetEverything() {
    setActiveStatus("all");
    setSearchQuery("");
    setSortOption(
      "recently-added"
    );
    setSelectedRatings([]);
    setSelectedFormats([]);
    setSelectedSpecialFilters([]);
    setSelectedShelves([]);
    setVisibleCount(12);
  }


  return (
    <main className="slaybase-page">

      {/* =========================
          HERO
          ========================= */}

      <section className="slaybase-hero">

        <div>
          <p className="eyebrow">
            LIBRARY DATABASE //{" "}
            {books.length.toLocaleString()} RECORDS
          </p>

          <h1 className="slaybase-title">
            THE
            <span> SLAYBASE</span>
          </h1>

          <p className="slaybase-intro">
            Every book. Every shelf. Every
            questionable decision that somehow
            became part of the collection.
          </p>
        </div>

        <div className="slaybase-orbit">
          <span>
            {books.length.toLocaleString()}
          </span>

          <small>
            BOOKS INDEXED
          </small>
        </div>

      </section>


      {/* =========================
          STATUS FILTERS
          ========================= */}

      <section className="slaybase-status-grid">

        {statusFilters.map(
          (filter) => {
            const isActive =
              activeStatus ===
              filter.value;

            return (
              <button
                type="button"
                key={filter.value}
                onClick={() =>
                  handleStatusChange(
                    filter.value
                  )
                }
                className={
                  `slaybase-status-card ` +
                  `status-${filter.accent} ` +
                  `${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                <span>
                  {filter.label}
                </span>

                <strong>
                  {filter.count
                    .toLocaleString()}
                </strong>
              </button>
            );
          }
        )}

      </section>


      {/* =========================
          MAIN CONTROLS
          ========================= */}

      <section className="slaybase-controls">

        <div className="slaybase-search">

          <span>⌕</span>

          <input
            type="search"
            value={searchQuery}
            onChange={(event) =>
              handleSearchChange(
                event.target.value
              )
            }
            placeholder="Search title, author, series..."
            aria-label="Search the Slaybase"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() =>
                handleSearchChange("")
              }
              aria-label="Clear search"
              className="slaybase-search-clear"
            >
              ×
            </button>
          )}

        </div>


        <div className="slaybase-control-buttons">

          <button
            type="button"
            onClick={() =>
              setFiltersOpen(
                (current) =>
                  !current
              )
            }
            aria-expanded={
              filtersOpen
            }
          >
            FILTERS
            {activeDeepFilterCount > 0
              ? ` (${activeDeepFilterCount})`
              : " +"}
          </button>


          <label className="slaybase-sort">

            <span className="sr-only">
              Sort books
            </span>

            <select
              value={sortOption}
              onChange={(event) =>
                handleSortChange(
                  event.target
                    .value as SortOption
                )
              }
              aria-label="Sort books"
            >
              {sortOptions.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>

          </label>


          <button
            type="button"
            aria-label="Grid view"
          >
            ▦
          </button>

          <button
            type="button"
            aria-label="List view"
            disabled
          >
            ☰
          </button>

        </div>

      </section>


      {/* =========================
          DEEP FILTER PANEL
          ========================= */}

      {filtersOpen && (
        <section className="slaybase-filter-panel">

          <div className="slaybase-filter-header">

            <div>
              <p className="eyebrow">
                ADVANCED QUERY
              </p>

              <h2>
                Filter the Slaybase
              </h2>
            </div>

            <div className="slaybase-filter-actions">

              {activeDeepFilterCount > 0 && (
                <button
                  type="button"
                  onClick={
                    clearDeepFilters
                  }
                >
                  CLEAR FILTERS
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  setFiltersOpen(false)
                }
                aria-label="Close filters"
              >
                ×
              </button>

            </div>

          </div>


          <div className="slaybase-filter-grid">

            <fieldset className="slaybase-filter-group">

              <legend>
                RATING
              </legend>

              <p>
                Pick one or more ratings.
              </p>

              <div className="slaybase-filter-options">

                {[5, 4, 3, 2, 1].map(
                  (rating) => {
                    const selected =
                      selectedRatings
                        .includes(
                          rating
                        );

                    return (
                      <button
                        type="button"
                        key={rating}
                        onClick={() =>
                          toggleRating(
                            rating
                          )
                        }
                        className={
                          selected
                            ? "selected"
                            : ""
                        }
                      >
                        {"★".repeat(
                          rating
                        )}{" "}
                        {rating}
                      </button>
                    );
                  }
                )}

              </div>

            </fieldset>


            <fieldset className="slaybase-filter-group">

              <legend>
                FORMAT
              </legend>

              <p>
                How was the book consumed?
              </p>

              <div className="slaybase-filter-options">

                {[
                  {
                    label:
                      "Physical",
                    value:
                      "physical" as BookFormat,
                  },
                  {
                    label:
                      "Ebook",
                    value:
                      "ebook" as BookFormat,
                  },
                  {
                    label:
                      "Audiobook",
                    value:
                      "audiobook" as BookFormat,
                  },
                ].map(
                  (format) => {
                    const selected =
                      selectedFormats
                        .includes(
                          format.value
                        );

                    return (
                      <button
                        type="button"
                        key={
                          format.value
                        }
                        onClick={() =>
                          toggleFormat(
                            format.value
                          )
                        }
                        className={
                          selected
                            ? "selected"
                            : ""
                        }
                      >
                        {format.label}
                      </button>
                    );
                  }
                )}

              </div>

            </fieldset>


            <fieldset className="slaybase-filter-group">

              <legend>
                SLAY DATA
              </legend>

              <p>
                The stuff Goodreads could
                never make this cute.
              </p>

              <div className="slaybase-filter-options">

                <button
                  type="button"
                  onClick={() =>
                    toggleSpecialFilter(
                      "certified-slay"
                    )
                  }
                  className={
                    selectedSpecialFilters
                      .includes(
                        "certified-slay"
                      )
                      ? "selected"
                      : ""
                  }
                >
                  ✦ Certified Slay
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleSpecialFilter(
                      "reread"
                    )
                  }
                  className={
                    selectedSpecialFilters
                      .includes(
                        "reread"
                      )
                      ? "selected"
                      : ""
                  }
                >
                  ↻ Rereads
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleSpecialFilter(
                      "tbb-buddy-read"
                    )
                  }
                  className={
                    selectedSpecialFilters
                      .includes(
                        "tbb-buddy-read"
                      )
                      ? "selected"
                      : ""
                  }
                >
                  ♡ TBB Buddy Reads
                </button>

              </div>

            </fieldset>


            <fieldset className="slaybase-filter-group">

              <legend>
                IMPORTED SHELVES
              </legend>

              <p>
                Your original Goodreads
                organization, preserved.
              </p>

              <div className="slaybase-filter-options">

                {availableShelves.map(
                  (shelf) => {
                    const selected =
                      selectedShelves
                        .includes(
                          shelf
                        );

                    return (
                      <button
                        type="button"
                        key={shelf}
                        onClick={() =>
                          toggleShelf(
                            shelf
                          )
                        }
                        className={
                          selected
                            ? "selected"
                            : ""
                        }
                      >
                        {shelf
                          .replaceAll(
                            "-",
                            " "
                          )
                          .toUpperCase()}
                      </button>
                    );
                  }
                )}

              </div>

            </fieldset>

          </div>


          <div className="slaybase-filter-footer">

            <p>
              {filteredRecords.length
                .toLocaleString()}{" "}
              {filteredRecords.length === 1
                ? "book matches"
                : "books match"}{" "}
              the current query.
            </p>

            <button
              type="button"
              onClick={() =>
                setFiltersOpen(false)
              }
            >
              SHOW RESULTS ✦
            </button>

          </div>

        </section>
      )}

          {/* =========================
          QUERY INFORMATION
          ========================= */}

      <section className="slaybase-library-heading">

        <div>

          <p className="eyebrow">
            CURRENT QUERY //{" "}

            {activeStatus === "all"
              ? "ALL BOOKS"
              : activeStatus
                  .replaceAll(
                    "-",
                    " "
                  )
                  .toUpperCase()}

            {searchQuery.trim() &&
              ` // "${searchQuery.trim()}"`}

            {activeDeepFilterCount > 0 &&
              ` // ${activeDeepFilterCount} ACTIVE FILTER${
                activeDeepFilterCount === 1
                  ? ""
                  : "S"
              }`}
          </p>

          <h2 className="section-title">
            The Library
          </h2>

        </div>


        <p className="slaybase-results">
          SHOWING{" "}
          {visibleRecords.length
            .toLocaleString()}
          {" "}OF{" "}
          {filteredRecords.length
            .toLocaleString()}
        </p>

      </section>


      {/* =========================
          EMPTY STATE
          ========================= */}

      {filteredRecords.length === 0 && (
        <section className="slaybase-empty">

          <span>
            ⌕
          </span>

          <h3>
            THE SLAYBASE FOUND NOTHING.
          </h3>

          <p>
            Not a single book survived
            this particular combination
            of fictional chaos.
          </p>

          <button
            type="button"
            onClick={
              resetEverything
            }
          >
            RESET THE SLAYBASE
          </button>

        </section>
      )}


      {/* =========================
          BOOK GRID
          ========================= */}

      {filteredRecords.length > 0 && (
        <section className="slaybase-book-grid">

          {visibleRecords.map(
            (record, index) => {
              const book =
                record.book;

              const accent =
                bookAccents[
                  index %
                    bookAccents.length
                ];

              return (
                <article
                  key={book.id}
                  className="slaybase-book"
                >

                  {/* BOOK COVER */}

                  {/* BOOK COVER */}

<Link
  href={`/books/${book.id}`}
  className={
    `slaybase-book-cover ` +
    `book-${accent} ` +
    `${book.coverUrl ? "has-real-cover" : ""}`
  }
  aria-label={`Open ${book.title}`}
>

  {book.coverUrl ? (
  <>
    <img
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        className="slaybase-real-cover"
        loading="lazy"
      />

      <span className="book-status">
        {book.status
          .replaceAll(
            "-",
            " "
          )
          .toUpperCase()}
      </span>
    </>
  ) : (
    <>
      <span className="book-status">
        {book.status
          .replaceAll(
            "-",
            " "
          )
          .toUpperCase()}
      </span>

      <span className="book-cover-symbol">
        ✦
      </span>

      <strong>
        {book.title}
      </strong>
    </>
  )}

</Link>


                  {/* BOOK INFORMATION */}

                  <div className="slaybase-book-info">

                    <div className="book-info-heading">

                      <div>

                        <h3>
                          <Link
                            href={`/books/${book.id}`}
                          >
                            {book.title}
                          </Link>
                        </h3>

                        <p>
                          {book.authors.join(
                            ", "
                          )}
                        </p>

                      </div>


                      <button
                        type="button"
                        aria-label={
                          `More options for ` +
                          book.title
                        }
                      >
                        •••
                      </button>

                    </div>


                    {/* RATING */}

                    {book.personalRating ? (
                      <div className="book-rating">

                        {"★".repeat(
                          book.personalRating
                        )}

                        {"☆".repeat(
                          5 -
                            book.personalRating
                        )}

                      </div>
                    ) : (
                      <div className="book-rating unrated">
                        NOT YET RATED
                      </div>
                    )}


                    {/* BADGES */}

                    <div className="book-tags">

                      {book.certifiedSlay && (
                        <span>
                          CERTIFIED SLAY
                        </span>
                      )}

                      {record.readCount > 1 && (
                        <span>
                          REREAD ×
                          {record.readCount}
                        </span>
                      )}

                      {record.wasTbbBuddyRead && (
                        <span>
                          TBB BUDDY READ
                        </span>
                      )}

                      {book.primaryFormat && (
                        <span>
                          {book.primaryFormat
                            .toUpperCase()}
                        </span>
                      )}

                    </div>

                  </div>

                </article>
              );
            }
          )}

        </section>
      )}


      {/* =========================
          LOAD MORE
          ========================= */}

      {filteredRecords.length > 0 && (
        <div className="slaybase-load-more">

          {remainingBooks > 0 ? (
            <>

              <button
                type="button"
                onClick={
                  handleLoadMore
                }
              >
                LOAD MORE FROM THE ARCHIVES ↓
              </button>

              <p>
                {remainingBooks
                  .toLocaleString()}
                {" "}
                more{" "}
                {remainingBooks === 1
                  ? "book is"
                  : "books are"}
                {" "}
                minding{" "}
                {remainingBooks === 1
                  ? "its"
                  : "their"}
                {" "}
                business in the database.
              </p>

            </>
          ) : (
            <p>
              ✦ YOU HAVE REACHED THE END
              OF THIS SHELF ✦
            </p>
          )}

        </div>
      )}

    </main>
  );
}
