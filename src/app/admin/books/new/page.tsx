
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type TagCategory = "genres" | "tropes" | "tags";

type BookForm = {
  title: string;
  authors: string;
  description: string;
  coverUrl: string;
  status: string;
  personalRating: string;
  certifiedSlay: boolean;
  brainChemistry: boolean;
  favorite: boolean;
  genres: string[];
  tropes: string[];
  tags: string[];
};

const INITIAL_FORM: BookForm = {
  title: "",
  authors: "",
  description: "",
  coverUrl: "",
  status: "tbr",
  personalRating: "",
  certifiedSlay: false,
  brainChemistry: false,
  favorite: false,
  genres: [],
  tropes: [],
  tags: [],
};

const CATEGORIES: {
  key: TagCategory;
  title: string;
  singular: string;
}[] = [
  {
    key: "genres",
    title: "♡ Genres",
    singular: "genre",
  },
  {
    key: "tropes",
    title: "★ Tropes",
    singular: "trope",
  },
  {
    key: "tags",
    title: "✦ Custom Tags",
    singular: "tag",
  },
];

function uniqueValues(values: string[]) {
  return Array.from(
    new Map(
      values
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => [value.toLowerCase(), value])
    ).values()
  );
}

export default function AddNewBookPage() {
  const router = useRouter();

  const [form, setForm] = useState<BookForm>(INITIAL_FORM);
  const [ownerId, setOwnerId] = useState("");
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [tagOptions, setTagOptions] = useState<
    Record<TagCategory, string[]>
  >({
    genres: [],
    tropes: [],
    tags: [],
  });

  const [tagInputs, setTagInputs] = useState<
    Record<TagCategory, string>
  >({
    genres: "",
    tropes: "",
    tags: "",
  });

  const [tagLoading, setTagLoading] = useState(false);
  const [tagError, setTagError] = useState("");

  // Verify the logged-in Slaybase owner.
  useEffect(() => {
    let cancelled = false;

    async function checkOwner() {
      const { data, error: authError } =
        await supabase.auth.getUser();

      if (cancelled) return;

      if (authError || !data.user) {
        router.replace("/admin");
        return;
      }

      const { data: ownedBook, error: ownershipError } =
        await supabase
          .from("slaybase_books")
          .select("id")
          .eq("owner_id", data.user.id)
          .limit(1);

      if (cancelled) return;

      if (
        ownershipError ||
        !ownedBook ||
        ownedBook.length === 0
      ) {
        setError("This account cannot manage the Slaybase.");
        setChecking(false);
        return;
      }

      setOwnerId(data.user.id);
      setChecking(false);
    }

    void checkOwner();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Load existing genres, tropes, and tags from Tag Vault.
  useEffect(() => {
    if (!ownerId) return;

    let cancelled = false;

    async function loadTags() {
      setTagLoading(true);
      setTagError("");

      const { data, error: inventoryError } =
        await supabase.rpc("slaybase_tag_inventory");

      if (cancelled) return;

      if (inventoryError) {
        setTagError(
          "Could not load Tag Vault options: " +
            inventoryError.message
        );
        setTagLoading(false);
        return;
      }

      const next: Record<TagCategory, string[]> = {
        genres: [],
        tropes: [],
        tags: [],
      };

      if (Array.isArray(data)) {
        for (const rawItem of data) {
          if (
            !rawItem ||
            typeof rawItem !== "object"
          ) {
            continue;
          }

          const item = rawItem as Record<string, unknown>;

          const rawCategory = String(
            item.category ??
              item.tag_type ??
              item.type ??
              ""
          ).toLowerCase();

          const name = String(
            item.name ??
              item.tag_name ??
              item.value ??
              item.label ??
              ""
          ).trim();

          const category =
            rawCategory === "genre"
              ? "genres"
              : rawCategory === "trope"
              ? "tropes"
              : rawCategory === "tag"
              ? "tags"
              : rawCategory;

          if (
            (category === "genres" ||
              category === "tropes" ||
              category === "tags") &&
            name
          ) {
            next[category].push(name);
          }
        }
      }

      setTagOptions({
        genres: uniqueValues(next.genres).sort(),
        tropes: uniqueValues(next.tropes).sort(),
        tags: uniqueValues(next.tags).sort(),
      });

      setTagLoading(false);
    }

    void loadTags();

    return () => {
      cancelled = true;
    };
  }, [ownerId]);

  const canSave = useMemo(
    () =>
      Boolean(
        ownerId &&
          form.title.trim() &&
          form.authors.trim() &&
          !saving &&
          !uploading
      ),
    [
      ownerId,
      form.title,
      form.authors,
      saving,
      uploading,
    ]
  );

  function update<K extends keyof BookForm>(
    key: K,
    value: BookForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function addTag(
    category: TagCategory,
    value: string
  ) {
    const clean = value.trim();

    if (!clean) return;

    setForm((previous) => ({
      ...previous,
      [category]: uniqueValues([
        ...previous[category],
        clean,
      ]),
    }));

    setTagInputs((previous) => ({
      ...previous,
      [category]: "",
    }));
  }

  function removeTag(
    category: TagCategory,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [category]: previous[category].filter(
        (item) => item !== value
      ),
    }));
  }

  // Upload cover images to the existing Supabase bucket.
  async function uploadCover(file: File | undefined) {
    if (!file) return;

    setError("");
    setNotice("");

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(
        file.type
      )
    ) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The image must be smaller than 5 MB.");
      return;
    }

    if (!ownerId) {
      setError("Please sign in to Admin Studio.");
      return;
    }

    setUploading(true);

    try {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (
        authError ||
        !auth.user ||
        auth.user.id !== ownerId
      ) {
        throw new Error("Owner login required.");
      }

      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
          ? "webp"
          : "jpg";

      const path =
        `${ownerId}/new-books/` +
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("slaybase-covers")
          .upload(path, file, {
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("slaybase-covers")
        .getPublicUrl(path);

      update("coverUrl", data.publicUrl);

      setNotice(
        "Cover uploaded! Save your book to finish."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not upload cover."
      );
    } finally {
      setUploading(false);
    }
  }

  // Save the book to Supabase.
  async function saveBook(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!canSave) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const { data: auth, error: authError } =
        await supabase.auth.getUser();

      if (
        authError ||
        !auth.user ||
        auth.user.id !== ownerId
      ) {
        throw new Error("Owner login required.");
      }

      const id = crypto.randomUUID();

      const book = {
        id,
        title: form.title.trim(),
        authors: uniqueValues(
          form.authors.split(",")
        ),
        description: form.description.trim(),
        coverUrl: form.coverUrl.trim(),
        status: form.status,
        personalRating: form.personalRating
          ? Number(form.personalRating)
          : null,
        certifiedSlay: form.certifiedSlay,
        brainChemistry: form.brainChemistry,
        favorite: form.favorite,
        genres: form.genres,
        tropes: form.tropes,
        tags: form.tags,
      };

      const { error: insertError } =
        await supabase
          .from("slaybase_books")
          .insert({
            id,
            owner_id: ownerId,
            book_data: book,
          });

      if (insertError) throw insertError;

      router.push(
        `/slaybase/${encodeURIComponent(id)}`
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save your new book."
      );

      setSaving(false);
    }
  }

  if (checking) {
    return (
      <p className="muted">
        Checking Studio access… 💗
      </p>
    );
  }

  if (!ownerId) {
    return (
      <div className="slay-new-book">
        <h1>Studio Access Required</h1>

        <p role="alert">{error}</p>

        <Link href="/admin">
          ♡ Admin Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="slay-new-book">
      <Link
        href="/admin/studio"
        className="muted"
      >
        ← Back to Admin Studio
      </Link>

      <p className="eyebrow">
        THE SLAYLIST STUDIO · NEW RELEASE
      </p>

      <h1 className="page-title">
        ♡ Add a New Book
      </h1>

      <p className="muted">
        Every obsession deserves a place in The Slaybase.
      </p>

      <form onSubmit={saveBook}>
        {/* BOOK TITLE AND AUTHORS */}
        <div className="slay-new-book-grid">
          <div>
            <label htmlFor="new-book-title">
              Book Title *
            </label>

            <input
              id="new-book-title"
              required
              value={form.title}
              onChange={(event) =>
                update(
                  "title",
                  event.target.value
                )
              }
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label htmlFor="new-book-authors">
              Author(s) *
            </label>

            <input
              id="new-book-authors"
              required
              value={form.authors}
              onChange={(event) =>
                update(
                  "authors",
                  event.target.value
                )
              }
              placeholder="Separate multiple authors with commas"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label htmlFor="new-book-description">
            Description
          </label>

          <textarea
            id="new-book-description"
            rows={5}
            value={form.description}
            onChange={(event) =>
              update(
                "description",
                event.target.value
              )
            }
            placeholder="What's this book about?"
          />
        </div>

        {/* STATUS AND RATING */}
        <div className="slay-new-book-grid">
          <div>
            <label htmlFor="new-book-status">
              Reading Status
            </label>

            <select
              id="new-book-status"
              value={form.status}
              onChange={(event) =>
                update(
                  "status",
                  event.target.value
                )
              }
            >
              <option value="tbr">
                TBR
              </option>

              <option value="currently-reading">
                Currently Reading
              </option>

              <option value="read">
                Read
              </option>

              <option value="dnf">
                DNF
              </option>

              <option value="paused">
                Paused
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="new-book-rating">
              Personal Rating
            </label>

            <select
              id="new-book-rating"
              value={form.personalRating}
              onChange={(event) =>
                update(
                  "personalRating",
                  event.target.value
                )
              }
            >
              <option value="">
                Not Rated
              </option>

              {Array.from(
                { length: 10 },
                (_, index) => (index + 1) / 2
              ).map((rating) => (
                <option
                  key={rating}
                  value={rating}
                >
                  ★ {rating.toFixed(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SPECIAL COLLECTIONS */}
        <div className="slay-new-book-checks">
          {(
            [
              [
                "certifiedSlay",
                "★ Certified Slay",
              ],
              [
                "brainChemistry",
                "🧠 Brain Chemistry",
              ],
              [
                "favorite",
                "♡ Favorite",
              ],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) =>
                  update(
                    key,
                    event.target.checked
                  )
                }
              />

              {label}
            </label>
          ))}
        </div>

        {/* BOOK COVER */}
        <div className="slay-new-book-grid">
          <div>
            <label htmlFor="new-book-cover">
              Cover Image URL
            </label>

            <input
              id="new-book-cover"
              type="url"
              value={form.coverUrl}
              onChange={(event) =>
                update(
                  "coverUrl",
                  event.target.value
                )
              }
              placeholder="https://..."
            />

            <label htmlFor="new-book-upload">
              Or Upload From Computer
            </label>

            <input
              id="new-book-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading || saving}
              onChange={(event) => {
                void uploadCover(
                  event.target.files?.[0]
                );

                event.target.value = "";
              }}
            />

            <small className="muted">
              JPG, PNG, or WebP · Maximum 5 MB
            </small>

            {uploading && (
              <p className="muted">
                Uploading your cover… 💗
              </p>
            )}
          </div>

          <div className="slay-new-book-preview">
            {form.coverUrl ? (
              <img
                src={form.coverUrl}
                alt="New book cover preview"
              />
            ) : (
              <div className="slay-new-book-placeholder">
                💿

                <span>
                  YOUR COVER ART
                </span>
              </div>
            )}
          </div>
        </div>

        {/* GENRES, TROPES AND CUSTOM TAGS */}
        {tagLoading && (
          <p className="muted">
            Loading your Tag Vault options… 💗
          </p>
        )}

        {tagError && (
          <p role="alert" className="empty">
            {tagError}
          </p>
        )}

        {CATEGORIES.map((category) => (
          <div
            key={category.key}
            className="slay-new-book-tags"
          >
            <h3>{category.title}</h3>

            {/* Selected options */}
            <div className="slay-new-book-selected">
              {form[category.key].map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() =>
                    removeTag(
                      category.key,
                      tag
                    )
                  }
                >
                  {tag} ×
                </button>
              ))}
            </div>

            {/* Dropdown + custom entry */}
            <div className="slay-new-book-tag-entry">
              <select
                aria-label={`Choose existing ${category.title}`}
                value=""
                disabled={tagLoading}
                onChange={(event) => {
                  if (event.target.value) {
                    addTag(
                      category.key,
                      event.target.value
                    );
                  }
                }}
              >
                <option value="">
                  Select existing {category.key}...
                </option>

                {tagOptions[category.key]
                  .filter(
                    (option) =>
                      !form[category.key].some(
                        (selected) =>
                          selected.toLowerCase() ===
                          option.toLowerCase()
                      )
                  )
                  .map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}
              </select>

              <input
                aria-label={`Create new ${category.singular}`}
                value={tagInputs[category.key]}
                placeholder={`Or create a new ${category.singular}...`}
                onChange={(event) =>
                  setTagInputs(
                    (previous) => ({
                      ...previous,
                      [category.key]:
                        event.target.value,
                    })
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();

                    addTag(
                      category.key,
                      tagInputs[category.key]
                    );
                  }
                }}
              />

              <button
                type="button"
                onClick={() =>
                  addTag(
                    category.key,
                    tagInputs[category.key]
                  )
                }
              >
                + Add
              </button>
            </div>

            {tagOptions[category.key].length === 0 &&
              !tagLoading &&
              !tagError && (
                <p className="muted">
                  No existing {category.key} loaded.
                  You can still create new ones.
                </p>
              )}
          </div>
        ))}

        {/* MESSAGES */}
        {notice && (
          <p className="muted" role="status">
            {notice}
          </p>
        )}

        {error && (
          <p className="empty" role="alert">
            {error}
          </p>
        )}

        {/* SAVE */}
        <button
          type="submit"
          className="slay-new-book-submit"
          disabled={!canSave}
        >
          {saving
            ? "Saving to The Slaybase…"
            : "💗 Add Book to The Slaybase"}
        </button>
      </form>
    </div>
  );
}
