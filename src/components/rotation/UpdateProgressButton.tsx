"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type UpdateProgressButtonProps = {
  bookId: string;
  bookTitle: string;
  pageCount?: number;
  readingMethod?: "physical" | "ebook" | "audiobook";
  readingNumber?: number;
  onProgressSaved?: () => void | Promise<void>;
};

export default function UpdateProgressButton({
  bookId,
  bookTitle,
  pageCount,
  readingMethod,
  readingNumber = 1,
  onProgressSaved,
}: UpdateProgressButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [note, setNote] = useState("");
  const [mood, setMood] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const calculatedPercentage =
    pageCount && currentPage
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (Number(currentPage) / pageCount) * 100
            )
          )
        )
      : null;

  function closeModal() {
    if (saving) {
      return;
    }

    setIsOpen(false);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const page = Number(currentPage);

    if (!Number.isInteger(page) || page < 0) {
      setError("Enter a valid page number.");
      return;
    }

    if (pageCount && page > pageCount) {
      setError(
        `This book only has ${pageCount} pages.`
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Your owner session could not be verified. Please log in again."
        );
      }

      const percentage =
        pageCount && pageCount > 0
          ? Math.min(
              100,
              Math.max(
                0,
                Math.round(
                  (page / pageCount) * 100
                )
              )
            )
          : null;

      const recordId =
        `${user.id}:${bookId}:${readingNumber}`;

      const now = new Date().toISOString();

      const {
        error: recordError,
      } = await supabase
        .from("reading_records")
        .upsert(
          {
            id: recordId,
            owner_id: user.id,
            book_id: bookId,
            status: "currently-reading",
            reading_method:
              readingMethod ?? null,
            current_page: page,
            progress_percent: percentage,
            reading_number: readingNumber,
            is_reread: readingNumber > 1,
            updated_at: now,
          },
          {
            onConflict: "id",
          }
        );

      if (recordError) {
        throw recordError;
      }

      const {
        error: progressError,
      } = await supabase
        .from("reading_progress_entries")
        .insert({
          owner_id: user.id,
          reading_record_id: recordId,
          page,
          percentage,
          note: note.trim() || null,
          mood: mood.trim() || null,
          recorded_at: now,
        });

      if (progressError) {
        throw progressError;
      }

      setSuccess("Progress saved ✦");

      await onProgressSaved?.();

        setCurrentPage("");
        setNote("");
        setMood("");
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError(
          "Something went wrong while saving progress."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError("");
          setSuccess("");
          setIsOpen(true);
        }}
      >
        + UPDATE PROGRESS
      </button>

      {isOpen && (
        <div
          className="progress-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <section
            className="progress-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`progress-title-${bookId}`}
          >
            <button
              type="button"
              className="progress-modal-close"
              onClick={closeModal}
              aria-label="Close progress update"
            >
              ×
            </button>

            <p className="eyebrow">
              READING LAB // PROGRESS LOG
            </p>

            <h2
              id={`progress-title-${bookId}`}
            >
              Update Progress
            </h2>

            <p className="progress-modal-book">
              {bookTitle}
            </p>

            <form
              className="progress-modal-form"
              onSubmit={handleSubmit}
            >
              <label>
                Current Page

                <input
                  type="number"
                  min="0"
                  max={pageCount}
                  step="1"
                  value={currentPage}
                  onChange={(event) =>
                    setCurrentPage(
                      event.target.value
                    )
                  }
                  placeholder={
                    pageCount
                      ? `0–${pageCount}`
                      : "Page number"
                  }
                  required
                />
              </label>

              {pageCount && (
                <div className="progress-modal-calculation">
                  <span>
                    BOOK LENGTH
                    <strong>
                      {pageCount} pages
                    </strong>
                  </span>

                  <span>
                    CALCULATED
                    <strong>
                      {calculatedPercentage ??
                        0}
                      %
                    </strong>
                  </span>
                </div>
              )}

              <label>
                Reading Mood
                <input
                  type="text"
                  value={mood}
                  onChange={(event) =>
                    setMood(
                      event.target.value
                    )
                  }
                  placeholder="Obsessed, stressed, suspicious..."
                />
              </label>

              <label>
                Reading Note
                <textarea
                  value={note}
                  onChange={(event) =>
                    setNote(
                      event.target.value
                    )
                  }
                  placeholder="Optional lab notes..."
                  rows={4}
                />
              </label>

              {error && (
                <p
                  className="progress-modal-error"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  className="progress-modal-success"
                  role="status"
                >
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="progress-modal-save"
              >
                {saving
                  ? "LOGGING DATA..."
                  : "SAVE PROGRESS ✦"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}