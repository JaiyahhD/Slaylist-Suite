
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Entry } from "@/lib/library";
import BookCoverUploader from "@/components/BookCoverUploader";

type Book = Entry["book"] & {
  description?: string;
  genres?: string[];
  tropes?: string[];
  tags?: string[];
};

type Category = "genres" | "tropes" | "tags";

type Props = {
  initialBook: Book;
  ownerId: string;
};

const DEFAULT_GENRES = [
  "Dark Romance",
  "YA",
  "Nonfiction",
  "Urban",
  "Cozy",
  "Fantasy",
  "Romance",
  "Thriller",
  "Spicy",
  "Mystery",
  "Historical Fiction",
  "Memoir",
  "Dark Academia",
  "Paranormal",
  "Horror",
  "Poetry",
];

const DEFAULT_TROPES = [
  "Black Author",
  "Single Parent MC",
  "Black MC",
  "Forced Proximity",
  "Workplace Romance",
  "Academy / School Setting",
  "Love Triangle",
  "Rich Family Drama",
  "Found Family",
  "Mafia / Dark Romance",
  "Time Travel Romance",
  "Opposites Attract",
  "Arranged Marriage",
  "Secret Baby / Pregnancy",
  "Fake Dating",
  "City Love / Urban Romance",
  "Small Town Romance",
  "Royal Romance",
  "Forbidden Love",
  "Second Chance Romance",
  "Enemies to Lovers",
  "Friends to Lovers",
  "Vampires",
  "Vampire",
  "Christmas",
  "Sports Romance",
];

const STATUS_OPTIONS = [
  { value: "tbr", label: "Want to Read" },
  { value: "currently-reading", label: "Currently Reading" },
  { value: "read", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "dnf", label: "Did Not Finish" },
];

export default function BookEditor({
  initialBook,
  ownerId,
}: Props) {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [book, setBook] = useState<Book>(initialBook);

  const [message, setMessage] = useState("");
  const [tagOptions, setTagOptions] = useState<
    Record<Category, string[]>
  >({
    genres: DEFAULT_GENRES,
    tropes: DEFAULT_TROPES,
    tags: [],
  });

  const [newGenre, setNewGenre] = useState("");
  const [newTrope, setNewTrope] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    let active = true;

    async function verifyOwner() {
      const { data, error } = await supabase.auth.getUser();

      if (!active) return;

      const isOwner =
        !error &&
        !!data.user &&
        data.user.id === ownerId;

      setAuthorized(isOwner);
      setChecking(false);

      if (!isOwner) return;

      const { data: inventory, error: inventoryError } =
        await supabase.rpc("slaybase_tag_inventory");

      if (!active || inventoryError || !inventory) return;

      setTagOptions((previous) => {
        const updated = {
          genres: [...previous.genres],
          tropes: [...previous.tropes],
          tags: [...previous.tags],
        };

        for (const item of inventory as {
          category: Category;
          name: string;
        }[]) {
          if (
            item.category in updated &&
            !updated[item.category].some(
              (name) =>
                name.toLowerCase() === item.name.toLowerCase()
            )
          ) {
            updated[item.category].push(item.name);
          }
        }

        return updated;
      });
    }

    verifyOwner();

    const { data: listener } =
      supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;

        setAuthorized(session?.user?.id === ownerId);
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [ownerId]);

  function updateBook<K extends keyof Book>(
    field: K,
    value: Book[K]
  ) {
    setBook((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function toggleTag(
    category: Category,
    value: string
  ) {
    setBook((previous) => {
      const selected = previous[category] || [];

      const exists = selected.some(
        (item) =>
          item.toLowerCase() === value.toLowerCase()
      );

      return {
        ...previous,
        [category]: exists
          ? selected.filter(
              (item) =>
                item.toLowerCase() !== value.toLowerCase()
            )
          : [...selected, value],
      };
    });
  }

  function addTag(
    category: Category,
    value: string,
    clearInput: (value: string) => void
  ) {
    const clean = value.trim();

    if (!clean) return;

    setTagOptions((previous) => {
      const existing = previous[category];

      if (
        existing.some(
          (item) =>
            item.toLowerCase() === clean.toLowerCase()
        )
      ) {
        return previous;
      }

      return {
        ...previous,
        [category]: [...existing, clean],
      };
    });

    setBook((previous) => {
      const existing = previous[category] || [];

      if (
        existing.some(
          (item) =>
            item.toLowerCase() === clean.toLowerCase()
        )
      ) {
        return previous;
      }

      return {
        ...previous,
        [category]: [...existing, clean],
      };
    });

    clearInput("");
  }

  async function saveBook() {
    setMessage("");

    if (!book.title.trim()) {
      setMessage("Please enter a book title.");
      return;
    }

    const authors = (book.authors || [])
      .map((author) => author.trim())
      .filter(Boolean);

    if (authors.length === 0) {
      setMessage("Please enter at least one author.");
      return;
    }

    setSaving(true);

    try {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (
        authError ||
        !auth.user ||
        auth.user.id !== ownerId
      ) {
        throw new Error(
          "Your owner session has expired. Please sign in again."
        );
      }

      const cleanBook: Book = {
        ...book,
        title: book.title.trim(),
        authors,
        genres: book.genres || [],
        tropes: book.tropes || [],
        tags: book.tags || [],
      };

      const { data, error } = await supabase
        .from("slaybase_books")
        .update({
          book_data: cleanBook,
          updated_at: new Date().toISOString(),
        })
        .eq("id", initialBook.id)
        .eq("owner_id", ownerId)
        .select("id")
        .single();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Supabase did not confirm the update."
        );
      }

      setBook(cleanBook);
      setEditing(false);
      setMessage("Book updated successfully! ♡");

      window.location.reload();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  function renderTagSection(
    title: string,
    category: Category,
    inputValue: string,
    setInputValue: (value: string) => void
  ) {
    const selected = book[category] || [];

    const available = Array.from(
      new Set([
        ...tagOptions[category],
        ...selected,
      ])
    ).sort((a, b) => a.localeCompare(b));

    return (
      <div className="slay-tag-section">
        <h3>{title}</h3>

        <div className="slay-chip-list">
          {available.map((option) => {
            const active = selected.some(
              (item) =>
                item.toLowerCase() === option.toLowerCase()
            );

            return (
              <button
                type="button"
                key={option}
                className={`slay-chip ${
                  active ? "selected" : ""
                }`}
                aria-pressed={active}
                onClick={() =>
                  toggleTag(category, option)
                }
              >
                {active ? "✓ " : "+ "}
                {option}
              </button>
            );
          })}
        </div>

        <div className="slay-add-row">
          <input
            type="text"
            value={inputValue}
            placeholder={`Add a ${title.toLowerCase()}...`}
            onChange={(event) =>
              setInputValue(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();

                addTag(
                  category,
                  inputValue,
                  setInputValue
                );
              }
            }}
          />

          <button
            type="button"
            onClick={() =>
              addTag(
                category,
                inputValue,
                setInputValue
              )
            }
          >
            + Add
          </button>
        </div>
      </div>
    );
  }

  if (checking || !authorized) {
    return null;
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="slay-edit-button"
        onClick={() => {
          setMessage("");
          setEditing(true);
        }}
      >
        ♡ Edit Book
      </button>
    );
  }

  return (
    <section className="slay-editor">
      <p className="eyebrow">
        SLAYLIST FM · OWNER EDITING MODE
      </p>

      <h2>♡ Edit Book Details</h2>

      <div>
        <label htmlFor="slay-title">
          Book Title
        </label>

        <input
          id="slay-title"
          type="text"
          value={book.title}
          onChange={(event) =>
            updateBook("title", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="slay-authors">
          Author(s)
        </label>

        <input
          id="slay-authors"
          type="text"
          value={(book.authors || []).join(", ")}
          onChange={(event) =>
            updateBook(
              "authors",
              event.target.value.split(",")
            )
          }
        />

        <small className="muted">
          Separate multiple authors with commas.
        </small>
      </div>

      <div>
        <label htmlFor="slay-description">
          Book Description
        </label>

        <textarea
          id="slay-description"
          rows={6}
          value={book.description || ""}
          placeholder="Add your book description..."
          onChange={(event) =>
            updateBook(
              "description",
              event.target.value
            )
          }
        />
      </div>

      <div>
        <label htmlFor="slay-cover">
          Book Cover URL
        </label>
        <BookCoverUploader
        bookId={initialBook.id}
        ownerId={ownerId}
        currentCover={book.coverUrl}
        onUploaded={(url) =>
            updateBook("coverUrl", url)
        }
        />

        <input
          id="slay-cover"
          type="url"
          value={book.coverUrl || ""}
          placeholder="https://..."
          onChange={(event) =>
            updateBook(
              "coverUrl",
              event.target.value
            )
          }
        />

        {book.coverUrl && (
          <img
            src={book.coverUrl}
            alt="Book cover preview"
            style={{
              width: 110,
              maxHeight: 170,
              objectFit: "cover",
              borderRadius: 10,
              marginTop: 12,
            }}
          />
        )}
      </div>

      <div className="slay-editor-grid">
        <div>
          <label htmlFor="slay-status">
            Reading Status
          </label>

          <select
            id="slay-status"
            value={book.status}
            onChange={(event) =>
              updateBook(
                "status",
                event.target.value as Book["status"]
              )
            }
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="slay-rating">
            My Rating
          </label>

          <select
            id="slay-rating"
            value={book.personalRating ?? ""}
            onChange={(event) =>
              updateBook(
                "personalRating",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value)
              )
            }
          >
            <option value="">Not Rated</option>

            {Array.from(
              { length: 10 },
              (_, index) => (index + 1) / 2
            ).map((rating) => (
              <option
                key={rating}
                value={rating}
              >
                ★ {rating.toFixed(1)} / 5
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="slay-editor-toggles">
        <label>
          <input
            type="checkbox"
            checked={!!book.certifiedSlay}
            onChange={(event) =>
              updateBook(
                "certifiedSlay",
                event.target.checked
              )
            }
          />
          ★ Certified Slay
        </label>

        <label>
          <input
            type="checkbox"
            checked={!!book.brainChemistry}
            onChange={(event) =>
              updateBook(
                "brainChemistry",
                event.target.checked
              )
            }
          />
          💗 Altered My Brain Chemistry
        </label>

        <label>
          <input
            type="checkbox"
            checked={!!book.favorite}
            onChange={(event) =>
              updateBook(
                "favorite",
                event.target.checked
              )
            }
          />
          ♡ Forever Favorite
        </label>
      </div>

      {renderTagSection(
        "Genres",
        "genres",
        newGenre,
        setNewGenre
      )}

      {renderTagSection(
        "Tropes",
        "tropes",
        newTrope,
        setNewTrope
      )}

      {renderTagSection(
        "Custom Tags",
        "tags",
        newTag,
        setNewTag
      )}

      {message && (
        <p role="status">
          {message}
        </p>
      )}

      <div className="slay-editor-actions">
        <button
          type="button"
          className="slay-edit-button"
          disabled={saving}
          onClick={saveBook}
        >
          {saving
            ? "Saving Changes..."
            : "💗 Save Book Changes"}
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => {
            setBook(initialBook);
            setEditing(false);
            setMessage("");
          }}
        >
          Cancel
        </button>
      </div>
    </section>
  );
}
