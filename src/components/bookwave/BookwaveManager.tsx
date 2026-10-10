"use client";

import Link from "next/link";

import BookwaveNowTransmitting from "./BookwaveNowTransmitting";

import BookwaveSpotifyPlayer from "./BookwaveSpotifyPlayer";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";
import {
  Bookwave,
  BookwaveRow,
  mapBookwaveRow,
} from "@/types/bookwave";

type BookwaveBook = {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
};

type BookwaveManagerProps = {
  books: BookwaveBook[];
};

type SaveState =
  | "idle"
  | "saving"
  | "success"
  | "error";

type LibraryState =
  | "loading"
  | "ready"
  | "error";

export default function BookwaveManager({
  books,
}: BookwaveManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedBookId, setSelectedBookId] =
    useState<string | null>(null);

  const [playlistName, setPlaylistName] =
    useState("");
  const [spotifyUrl, setSpotifyUrl] =
    useState("");
  const [vibe, setVibe] = useState("");
  const [description, setDescription] =
    useState("");
  const [useBookCover, setUseBookCover] =
    useState(true);
  const [customCoverUrl, setCustomCoverUrl] =
    useState("");

  const [saveState, setSaveState] =
    useState<SaveState>("idle");
  const [message, setMessage] = useState("");

const [editingWaveId, setEditingWaveId] =
  useState<string | null>(null);

const isEditing = editingWaveId !== null;

const [bookwaves, setBookwaves] = useState<
  Bookwave[]
>([]);
const [frequencySearch, setFrequencySearch] = useState("");
const [frequencySort, setFrequencySort] = useState<
  "newest" | "oldest" | "alphabetical"
>("newest");
const [libraryState, setLibraryState] =
  useState<LibraryState>("loading");

const [libraryMessage, setLibraryMessage] =
  useState("");

const [deletingWaveId, setDeletingWaveId] =
  useState<string | null>(null);
  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const results = useMemo(() => {
    if (!normalizedSearch) {
      return [];
    }

    return books
      .filter((book) => {
        const title = book.title.toLowerCase();
        const authors = book.authors
          .join(" ")
          .toLowerCase();

        return (
          title.includes(normalizedSearch) ||
          authors.includes(normalizedSearch)
        );
      })
      .slice(0, 8);
  }, [books, normalizedSearch]);

  const selectedBook = useMemo(
    () =>
      books.find(
        (book) => book.id === selectedBookId
      ) ?? null,
    [books, selectedBookId]
  );

  const booksById = useMemo(
    () =>
      new Map(
        books.map((book) => [book.id, book])
      ),
    [books]
  );

  
const visibleBookwaves = useMemo(() => {
  const query = frequencySearch.trim().toLowerCase();

  const filtered = bookwaves.filter((wave) => {
    if (!query) return true;

    const book = booksById.get(wave.bookId);

    const searchableText = [
      wave.playlistName,
      wave.vibe ?? "",
      wave.description ?? "",
      book?.title ?? "",
      ...(book?.authors ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  return filtered.sort((a, b) => {
    if (frequencySort === "alphabetical") {
      return a.playlistName.localeCompare(b.playlistName);
    }

    const difference =
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime();

    return frequencySort === "oldest"
      ? difference
      : -difference;
  });
}, [bookwaves, booksById, frequencySearch, frequencySort]);

  const loadBookwaves = useCallback(
    async (showLoading = true) => {
      if (showLoading) {
        setLibraryState("loading");
      }

      setLibraryMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setBookwaves([]);
        setLibraryState("error");
        setLibraryMessage(
          "Your Bookwave archive could not verify your session."
        );
        return;
      }

      const { data, error } = await supabase
        .from("bookwaves")
        .select(
          `
            id,
            owner_id,
            book_id,
            playlist_name,
            spotify_url,
            vibe,
            description,
            use_book_cover,
            custom_cover_url,
            created_at,
            updated_at
          `
        )
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        setBookwaves([]);
        setLibraryState("error");
        setLibraryMessage(
          error.message ||
            "The Bookwave archive could not be loaded."
        );
        return;
      }

      const mapped = (
        (data ?? []) as BookwaveRow[]
      ).map(mapBookwaveRow);

      setBookwaves(mapped);
      setLibraryState("ready");
    },
    []
  );

  useEffect(() => {
    void loadBookwaves();
  }, [loadBookwaves]);

  function resetForm() {
    setPlaylistName("");
    setSpotifyUrl("");
    setVibe("");
    setDescription("");
    setUseBookCover(true);
    setCustomCoverUrl("");
    setSaveState("idle");
    setMessage("");
  }

  function selectBook(bookId: string) {
    setSelectedBookId(bookId);
    setSearch("");
    resetForm();
  }

  function clearSelection() {
  setSelectedBookId(null);
  setEditingWaveId(null);
  setSearch("");
  resetForm();
}

function startEditing(wave: Bookwave) {
  setEditingWaveId(wave.id);
  setSelectedBookId(wave.bookId);

  setPlaylistName(wave.playlistName);
  setSpotifyUrl(wave.spotifyUrl);
  setVibe(wave.vibe ?? "");
  setDescription(wave.description ?? "");
  setUseBookCover(wave.useBookCover);
  setCustomCoverUrl(
    wave.customCoverUrl ?? ""
  );

  setSaveState("idle");
  setMessage("");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function cancelEditing() {
  setEditingWaveId(null);
  setSelectedBookId(null);
  setSearch("");
  resetForm();
}

  function isSpotifyPlaylistUrl(value: string) {
    try {
      const url = new URL(value);

      const validHost =
        url.hostname === "open.spotify.com" ||
        url.hostname === "www.open.spotify.com";

      const segments = url.pathname
        .split("/")
        .filter(Boolean);

      return (
        validHost &&
        segments[0] === "playlist" &&
        Boolean(segments[1])
      );
    } catch {
      return false;
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedBook) {
      return;
    }

    const cleanPlaylistName =
      playlistName.trim();
    const cleanSpotifyUrl =
      spotifyUrl.trim();
    const cleanVibe = vibe.trim();
    const cleanDescription =
      description.trim();
    const cleanCustomCoverUrl =
      customCoverUrl.trim();

    setMessage("");

    if (!cleanPlaylistName) {
      setSaveState("error");
      setMessage(
        "Give this Bookwave a playlist name first."
      );
      return;
    }

    if (!isSpotifyPlaylistUrl(cleanSpotifyUrl)) {
      setSaveState("error");
      setMessage(
        "Paste a valid Spotify playlist link."
      );
      return;
    }

    if (!useBookCover && !cleanCustomCoverUrl) {
      setSaveState("error");
      setMessage(
        "Add a custom cover URL or switch back to the book cover."
      );
      return;
    }

    setSaveState("saving");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaveState("error");
      setMessage(
        "Your session could not be verified. Sign in again and retry."
      );
      return;
    }

    const payload = {
  playlist_name: cleanPlaylistName,
  spotify_url: cleanSpotifyUrl,
  vibe: cleanVibe || null,
  description: cleanDescription || null,
  use_book_cover: useBookCover,
  custom_cover_url: useBookCover
    ? null
    : cleanCustomCoverUrl,
};

const { error } = isEditing
  ? await supabase
      .from("bookwaves")
      .update(payload)
      .eq("id", editingWaveId)
      .eq("owner_id", user.id)
  : await supabase
      .from("bookwaves")
      .insert({
        owner_id: user.id,
        book_id: selectedBook.id,
        ...payload,
      });

    if (error) {
      setSaveState("error");

      if (error.code === "23505") {
        setMessage(
          "This book already has a Bookwave. Editing comes in 62C.4."
        );
        return;
      }

      setMessage(
        error.message ||
          "The transmission failed. Try again."
      );
      return;
    }

    setSaveState("success");
setMessage(
  isEditing
    ? `${selectedBook.title}'s Bookwave has been retuned.`
    : `${selectedBook.title} is officially on the airwaves.`
);

setEditingWaveId(null);

    setPlaylistName("");
    setSpotifyUrl("");
    setVibe("");
    setDescription("");
    setUseBookCover(true);
    setCustomCoverUrl("");

    await loadBookwaves(false);
  }

  return (
  <>
    <BookwaveNowTransmitting
      wave={bookwaves[0] ?? null}
      book={
        bookwaves.length > 0
          ? booksById.get(bookwaves[0].bookId) ?? null
          : null
      }
      loading={libraryState === "loading"}
    />

    <section className="bookwave-manager">
        <div className="bookwave-manager-heading">
          <div>
            <span className="bookwave-eyebrow">
              PRIVATE CONTROL DECK
            </span>

            <h2>
            {isEditing
                ? "Retune a Bookwave"
                : "Create a Bookwave"}
            </h2>

<p>
  {isEditing
    ? "Adjust the existing frequency and retransmit your changes."
    : "Search the Slaybase, lock onto a book, and transmit its soundtrack."}
</p>
          </div>

          <span className="bookwave-manager-count">
            {books.length.toLocaleString()} BOOKS ONLINE
          </span>
        </div>

        <div className="bookwave-picker">
          <label
            className="bookwave-picker-label"
            htmlFor="bookwave-book-search"
          >
            FIND A BOOK
          </label>

          <div className="bookwave-search-shell">
            <span
              className="bookwave-search-icon"
              aria-hidden="true"
            >
              ⌕
            </span>

            <input
              id="bookwave-book-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search title or author..."
              autoComplete="off"
            />
          </div>

          {normalizedSearch && (
            <div className="bookwave-search-results">
              {results.length > 0 ? (
                results.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    className="bookwave-search-result"
                    onClick={() =>
                      selectBook(book.id)
                    }
                  >
                    <div className="bookwave-result-cover">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt=""
                        />
                      ) : (
                        <span>BW</span>
                      )}
                    </div>

                    <div className="bookwave-result-copy">
                      <strong>{book.title}</strong>

                      <span>
                        {book.authors.length > 0
                          ? book.authors.join(", ")
                          : "Unknown author"}
                      </span>
                    </div>

                    <span
                      className="bookwave-result-select"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                ))
              ) : (
                <div className="bookwave-no-results">
                  <span>NO SIGNAL</span>

                  <strong>
                    Nothing in the Slaybase matched
                    &ldquo;{search}&rdquo;.
                  </strong>
                </div>
              )}
            </div>
          )}

          {selectedBook && (
            <>
              <div className="bookwave-selected-book">
                <div className="bookwave-selected-cover">
                  {selectedBook.coverUrl ? (
                    <img
                      src={selectedBook.coverUrl}
                      alt=""
                    />
                  ) : (
                    <span>BW</span>
                  )}
                </div>

                <div className="bookwave-selected-copy">
                  <span className="bookwave-mini-label">
                    FREQUENCY TARGET LOCKED
                  </span>

                  <h3>{selectedBook.title}</h3>

                  <p>
                    {selectedBook.authors.length > 0
                      ? selectedBook.authors.join(
                          ", "
                        )
                      : "Unknown author"}
                  </p>
                </div>

                <button
                  type="button"
                  className="bookwave-change-book"
                  onClick={clearSelection}
                >
                  Change Book
                </button>
              </div>

              <form
                className="bookwave-create-form"
                onSubmit={handleSubmit}
              >
                <div className="bookwave-form-header">
                  <div>
                    <span className="bookwave-mini-label">
                {isEditing
                    ? "EDITING FREQUENCY"
                    : "TRANSMISSION SETTINGS"}
                </span>

                <h3>
                {isEditing
                    ? "Retune the frequency."
                    : "Build the frequency."}
                </h3>
                  </div>

                  <span className="bookwave-form-status">
                    SPOTIFY // READY
                  </span>
                </div>

                <div className="bookwave-form-grid">
                  <label className="bookwave-field">
                    <span>
                      PLAYLIST NAME
                      <strong>*</strong>
                    </span>

                    <input
                      type="text"
                      value={playlistName}
                      onChange={(event) =>
                        setPlaylistName(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Cabin Fever FM"
                      required
                    />
                  </label>

                  <label className="bookwave-field">
                    <span>
                      SPOTIFY PLAYLIST LINK
                      <strong>*</strong>
                    </span>

                    <input
                      type="url"
                      value={spotifyUrl}
                      onChange={(event) =>
                        setSpotifyUrl(
                          event.target.value
                        )
                      }
                      placeholder="https://open.spotify.com/playlist/..."
                      required
                    />
                  </label>

                  <label className="bookwave-field bookwave-field-full">
                    <span>VIBE</span>

                    <input
                      type="text"
                      value={vibe}
                      onChange={(event) =>
                        setVibe(
                          event.target.value
                        )
                      }
                      placeholder="dark • obsessive • claustrophobic"
                    />

                    <small>
                      Short mood language for the
                      Bookwave card.
                    </small>
                  </label>

                  <label className="bookwave-field bookwave-field-full">
                    <span>CURATOR NOTE</span>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(
                          event.target.value
                        )
                      }
                      placeholder="What does this playlist sound like inside this story?"
                      rows={4}
                    />
                  </label>
                </div>

                <fieldset className="bookwave-cover-settings">
                  <legend>PLAYLIST ARTWORK</legend>

                  <button
                    type="button"
                    className={
                      useBookCover
                        ? "bookwave-cover-option bookwave-cover-option-active"
                        : "bookwave-cover-option"
                    }
                    onClick={() =>
                      setUseBookCover(true)
                    }
                  >
                    <span className="bookwave-cover-radio">
                      {useBookCover ? "✓" : ""}
                    </span>

                    <span>
                      <strong>Use Book Cover</strong>
                      <small>
                        Pull artwork directly from
                        the Slaybase.
                      </small>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      !useBookCover
                        ? "bookwave-cover-option bookwave-cover-option-active"
                        : "bookwave-cover-option"
                    }
                    onClick={() =>
                      setUseBookCover(false)
                    }
                  >
                    <span className="bookwave-cover-radio">
                      {!useBookCover ? "✓" : ""}
                    </span>

                    <span>
                      <strong>Custom Artwork</strong>
                      <small>
                        Use separate artwork for
                        this Bookwave.
                      </small>
                    </span>
                  </button>

                  {!useBookCover && (
                    <label className="bookwave-field bookwave-custom-cover-field">
                      <span>CUSTOM COVER URL</span>

                      <input
                        type="url"
                        value={customCoverUrl}
                        onChange={(event) =>
                          setCustomCoverUrl(
                            event.target.value
                          )
                        }
                        placeholder="https://..."
                      />
                    </label>
                  )}
                </fieldset>

                <div className="bookwave-form-footer">
                  <div
                    className={`bookwave-form-message bookwave-form-message-${saveState}`}
                    aria-live="polite"
                  >
                    {message || (
                      <>
                        <span>●</span>
                        READY FOR TRANSMISSION
                      </>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="bookwave-save-button"
                    disabled={
                      saveState === "saving"
                    }
                  >
                    {saveState === "saving"
                    ? isEditing
                        ? "RETUNING..."
                        : "TRANSMITTING..."
                    : isEditing
                        ? "SAVE RETUNE"
                        : "TRANSMIT BOOKWAVE"}
                  </button>
                  {isEditing && (
                    <button
                        type="button"
                        className="bookwave-cancel-edit-button"
                        onClick={cancelEditing}
                    >
                        CANCEL EDIT
                    </button>
                    )}
                   </div>
              </form>
            </>
          )}
        </div>
      </section>

      
<section
  className="bookwave-library"
  id="bookwave-library"
>
  <div className="bookwave-section-heading">
    <div>
      <span className="bookwave-eyebrow">
        THE FREQUENCY LIBRARY
      </span>
      <h2>Bookwaves</h2>
    </div>

    <p>
      Books and their musical counterparts collect
      here as the archive grows.
    </p>
  </div>

  {libraryState === "ready" && bookwaves.length > 0 && (
    <div className="bookwave-browse-toolbar">
      <label className="bookwave-browse-search">
        <span>SEARCH FREQUENCIES</span>
        <input
          type="search"
          value={frequencySearch}
          onChange={(event) =>
            setFrequencySearch(event.target.value)
          }
          placeholder="Playlist, book, author, or vibe..."
        />
      </label>

      <label className="bookwave-browse-sort">
        <span>SORT FREQUENCIES</span>
        <select
          value={frequencySort}
          onChange={(event) =>
            setFrequencySort(
              event.target.value as
                | "newest"
                | "oldest"
                | "alphabetical"
            )
          }
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">
            Playlist A–Z
          </option>
        </select>
      </label>

      <div
        className="bookwave-browse-count"
        aria-live="polite"
      >
        <strong>{visibleBookwaves.length}</strong>
        <span>
          OF {bookwaves.length} FREQUENCIES
        </span>
      </div>
    </div>
  )}

  {libraryState === "loading" && (
    <div className="bookwave-empty">
      <span className="bookwave-empty-code">
        SCANNING FREQUENCIES...
      </span>
      <h3>Loading the airwaves.</h3>
    </div>
  )}

  {libraryState === "error" && (
    <div className="bookwave-empty">
      <span className="bookwave-empty-code">
        SIGNAL_ERROR
      </span>
      <h3>Transmission interrupted.</h3>
      <p>{libraryMessage}</p>
    </div>
  )}

  {libraryState === "ready" &&
    bookwaves.length === 0 && (
      <div className="bookwave-empty">
        <div className="bookwave-empty-orbit">
          <div className="bookwave-empty-disc">
            <span>BW</span>
          </div>
        </div>

        <span className="bookwave-empty-code">
          SIGNAL_000 // AWAITING TRANSMISSION
        </span>

        <h3>Your airwaves are quiet.</h3>

        <p>
          No Bookwaves have been created yet.
          Lock onto a book above and attach its
          Spotify soundtrack when you&apos;re ready.
        </p>

        <div className="bookwave-empty-tags">
          <span>BOOK × MUSIC</span>
          <span>PLAYLIST ARCHIVE</span>
          <span>READING SOUNDTRACKS</span>
        </div>
      </div>
    )}

  {libraryState === "ready" &&
    bookwaves.length > 0 &&
    visibleBookwaves.length === 0 && (
      <div className="bookwave-empty">
        <span className="bookwave-empty-code">
          FREQUENCY_NOT_FOUND
        </span>
        <h3>No matching Bookwaves.</h3>
        <p>
          Try another playlist, book title,
          author, or vibe.
        </p>
        <button
          type="button"
          className="bookwave-edit-button"
          onClick={() => setFrequencySearch("")}
        >
          CLEAR SEARCH
        </button>
      </div>
    )}

  {libraryState === "ready" &&
    visibleBookwaves.length > 0 && (
      <div className="bookwave-live-grid">
        {visibleBookwaves.map((wave) => {
          const book = booksById.get(wave.bookId);

          const artwork = wave.useBookCover
            ? book?.coverUrl
            : wave.customCoverUrl;

          return (
            <article
              className="bookwave-live-card"
              key={wave.id}
            >
              <div className="bookwave-live-cover">
                {artwork ? (
                  <img src={artwork} alt="" />
                ) : (
                  <span>BW</span>
                )}

                <div className="bookwave-live-cover-signal">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="bookwave-live-copy">
                <span className="bookwave-mini-label">
                  NOW ON THE AIRWAVES
                </span>

                <h3>{wave.playlistName}</h3>

                <div className="bookwave-live-book">
                  <strong>
                    {book?.title ??
                      "Unknown Slaybase Book"}
                  </strong>

                  {book && book.authors.length > 0 && (
                    <span>
                      {book.authors.join(", ")}
                    </span>
                  )}
                </div>

                {wave.vibe && (
                  <p className="bookwave-live-vibe">
                    {wave.vibe}
                  </p>
                )}

                {wave.description && (
                  <p className="bookwave-live-description">
                    {wave.description}
                  </p>
                )}

                <BookwaveSpotifyPlayer
                  spotifyUrl={wave.spotifyUrl}
                  playlistName={wave.playlistName}
                />

                <div className="bookwave-card-actions">
                  <a
                    href={wave.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bookwave-spotify-button"
                  >
                    ▶ OPEN ON SPOTIFY
                  </a>

                  {book && (
                    <Link
                      href={`/books/${wave.bookId}`}
                      className="bookwave-dossier-button"
                    >
                      ✦ OPEN BOOK DOSSIER
                    </Link>
                  )}

                  <div className="bookwave-manage-actions">
                    <button
                      type="button"
                      className="bookwave-edit-button"
                      onClick={() => startEditing(wave)}
                    >
                      ✎ EDIT WAVE
                    </button>

                    <button
                      type="button"
                      className="bookwave-delete-button"
                      disabled={
                        deletingWaveId === wave.id
                      }
                      onClick={async () => {
                        const confirmed =
                          window.confirm(
                            `Delete "${wave.playlistName}" from Bookwave? This cannot be undone.`
                          );

                        if (!confirmed) return;

                        setDeletingWaveId(wave.id);
                        setLibraryMessage("");

                        const {
                          data: { user },
                          error: userError,
                        } =
                          await supabase.auth.getUser();

                        if (userError || !user) {
                          setLibraryMessage(
                            "Your session could not be verified. The Bookwave was not deleted."
                          );
                          setDeletingWaveId(null);
                          return;
                        }

                        const { error } = await supabase
                          .from("bookwaves")
                          .delete()
                          .eq("id", wave.id)
                          .eq("owner_id", user.id);

                        if (error) {
                          setLibraryMessage(
                            error.message ||
                              "The Bookwave could not be deleted."
                          );
                          setDeletingWaveId(null);
                          return;
                        }

                        if (editingWaveId === wave.id) {
                          cancelEditing();
                        }

                        await loadBookwaves(false);
                        setDeletingWaveId(null);
                      }}
                    >
                      {deletingWaveId === wave.id
                        ? "DELETING..."
                        : "× DELETE"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    )}
</section>

    </>
  );
}
