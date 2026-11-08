
"use client";

import {
  useMemo,
  useState,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import SlaybaseTagFilters, {
  type TagFilters,
} from "@/components/SlaybaseTagFilters";
import { supabase } from "@/lib/supabase";
import type { Entry } from "@/lib/library";

const PAGE_SIZE = 1000;
const DISPLAY_SIZE = 120;

type SlaybaseBook = Entry["book"] & {
  genres?: string[];
  tropes?: string[];
  tags?: string[];
};

function matchesTags(
  book: SlaybaseBook,
  filters: TagFilters
) {
  const checks = [
    ["genres", filters.genre],
    ["tropes", filters.trope],
    ["tags", filters.tag],
  ] as const;

  return checks.every(([field, selected]) => {
    if (!selected) return true;

    return (book[field] || []).some(
      (value) =>
        value.toLowerCase() === selected.toLowerCase()
    );
  });
}

function Library() {
  const params = useSearchParams();
  const rotationRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(
    params.get("search") || ""
  );

  const [status, setStatus] = useState(
    params.get("status") || "all"
  );

  const [filter, setFilter] = useState(
    params.get("filter") || "all"
  );

  const [tagFilters, setTagFilters] = useState<TagFilters>({
    genre: params.get("genre") || "",
    trope: params.get("trope") || "",
    tag: params.get("tag") || "",
  });

  const [library, setLibrary] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(DISPLAY_SIZE);

  useEffect(() => {
    setQuery(params.get("search") || "");
    setStatus(params.get("status") || "all");
    setFilter(params.get("filter") || "all");

    setTagFilters({
      genre: params.get("genre") || "",
      trope: params.get("trope") || "",
      tag: params.get("tag") || "",
    });
  }, [params]);

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const allBooks: Entry[] = [];

        for (let from = 0; ; from += PAGE_SIZE) {
          const { data, error } = await supabase
            .from("slaybase_books")
            .select("id,book_data")
            .order("id", { ascending: true })
            .range(from, from + PAGE_SIZE - 1);

          if (error) throw error;
          if (cancelled) return;

          const rows = data || [];

          allBooks.push(
            ...rows.map((row) => ({
              book: row.book_data as Entry["book"],
              readingRecord: null,
            }))
          );

          if (rows.length < PAGE_SIZE) break;
        }

        if (!cancelled) {
          setLibrary(allBooks);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load Slaybase."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisible(DISPLAY_SIZE);
  }, [
    query,
    status,
    filter,
    tagFilters.genre,
    tagFilters.trope,
    tagFilters.tag,
  ]);

  const current = useMemo(
    () =>
      library.filter(
        ({ book }) =>
          book.status === "currently-reading"
      ),
    [library]
  );

  const tagBooks = useMemo(
    () =>
      library.map(
        (entry) => entry.book as SlaybaseBook
      ),
    [library]
  );

  const results = useMemo(
    () =>
      library.filter(({ book }) => {
        const matchesStatus =
          status === "all" ||
          book.status === status;

        const matchesCollection =
          filter !== "certified" ||
          book.certifiedSlay;

        const searchable = (
          book.title +
          " " +
          (book.authors || []).join(" ")
        ).toLowerCase();

        const matchesSearch = searchable.includes(
          query.trim().toLowerCase()
        );

        return (
          matchesStatus &&
          matchesCollection &&
          matchesSearch &&
          matchesTags(
            book as SlaybaseBook,
            tagFilters
          )
        );
      }),
    [
      library,
      query,
      status,
      filter,
      tagFilters,
    ]
  );

  function scrollRotation(direction: -1 | 1) {
    const track = rotationRef.current;

    if (!track) return;

    const card = track.querySelector<HTMLElement>(
      ".slaybase-rotation-item"
    );

    const distance =
      (card?.getBoundingClientRect().width || 156) + 14;

    track.scrollBy({
      left: direction * distance * 2,
      behavior: "smooth",
    });
  }

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setFilter("all");
    setTagFilters({
      genre: "",
      trope: "",
      tag: "",
    });
  }

  const hasFilters =
    query.trim() !== "" ||
    status !== "all" ||
    filter !== "all" ||
    !!tagFilters.genre ||
    !!tagFilters.trope ||
    !!tagFilters.tag;

  return (
    <>
      <p className="eyebrow">
        YOUR LIBRARY · ALL ACCESS
      </p>

      <h1 className="page-title">
        The Slaybase 💿
      </h1>

      <p className="muted">
        One girl. A million fictional obsessions.
        All the books.
      </p>

      {loading && (
        <p className="muted">
          Loading your Slaybase… 💗
        </p>
      )}

      {error && (
        <p className="empty" role="alert">
          Could not load Slaybase: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* COMPACT CURRENT ROTATION */}
          <section
            id="current-rotation"
            className="slaybase-rotation-section"
          >
            <div className="heading">
              <h2>▶ Current Rotation</h2>

              <span className="muted">
                NOW PLAYING · {current.length} BOOKS
              </span>
            </div>

            {current.length ? (
              <div className="slaybase-rotation-shell">
                <div className="slaybase-rotation-top">
                  <span>
                    🐾 Books on repeat
                  </span>

                  <div className="slaybase-rotation-arrows">
                    <button
                      type="button"
                      onClick={() => scrollRotation(-1)}
                      aria-label="Previous books"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollRotation(1)}
                      aria-label="Next books"
                    >
                      ›
                    </button>
                  </div>
                </div>

                <div
                  className="slaybase-rotation-track"
                  ref={rotationRef}
                  aria-label="Current reading rotation"
                >
                  {current.map((entry) => (
                    <div
                      className="slaybase-rotation-item"
                      key={entry.book.id}
                    >
                      <BookCard entry={entry} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="empty">
                Nothing in rotation yet.
              </p>
            )}
          </section>

          {/* FULL LIBRARY */}
          <section className="slaybase-library-section">
            <div className="heading">
              <h2>▦ The Full Library</h2>

              <span className="muted">
                {results.length.toLocaleString()} books
              </span>
            </div>

            <div className="slaybase-filter-panel">
              <div className="slaybase-filter-heading">
                <span>
                  ✦ FIND YOUR NEXT OBSESSION
                </span>

                <span>
                  SLAYBASE FILTERS ♡
                </span>
              </div>

              <div className="slaybase-filter-grid">
                <label className="slaybase-filter-field slaybase-filter-search">
                  <span>⌕ SEARCH THE LIBRARY</span>

                  <input
                    type="search"
                    placeholder="Search titles or authors..."
                    value={query}
                    onChange={(event) =>
                      setQuery(event.target.value)
                    }
                  />
                </label>

                <label className="slaybase-filter-field">
                  <span>💿 READING STATUS</span>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                  >
                    <option value="all">
                      All Books
                    </option>
                    <option value="tbr">TBR</option>
                    <option value="read">Read</option>
                    <option value="currently-reading">
                      Currently Reading
                    </option>
                    <option value="dnf">DNF</option>
                    <option value="paused">
                      Paused
                    </option>
                  </select>
                </label>

                <label className="slaybase-filter-field">
                  <span>★ COLLECTION</span>

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value)
                    }
                  >
                    <option value="all">
                      All Collections
                    </option>
                    <option value="certified">
                      ★ Certified Slays
                    </option>
                  </select>
                </label>

                <SlaybaseTagFilters
                  books={tagBooks}
                  filters={tagFilters}
                  onChange={setTagFilters}
                />
              </div>

              <div className="slaybase-filter-bottom">
                <span>
                  {results.length.toLocaleString()} books
                  matching your vibe ♡
                </span>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="slaybase-clear-filters"
                  >
                    Clear Filters ×
                  </button>
                )}
              </div>
            </div>

            <div className="full-books">
              {results
                .slice(0, visible)
                .map((entry) => (
                  <BookCard
                    key={entry.book.id}
                    entry={entry}
                  />
                ))}
            </div>

            {results.length === 0 && (
              <p className="empty">
                No books match your search or filters.
              </p>
            )}

            {results.length > visible && (
              <button
                type="button"
                className="slaybase-load-more"
                onClick={() =>
                  setVisible(
                    (previous) =>
                      previous + DISPLAY_SIZE
                  )
                }
              >
                Load More Books 💗
              </button>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default function SlaybaseClient() {
  return (
    <Suspense
      fallback={
        <p className="muted">
          Loading library… 💗
        </p>
      }
    >
      <Library />
    </Suspense>
  );
}
