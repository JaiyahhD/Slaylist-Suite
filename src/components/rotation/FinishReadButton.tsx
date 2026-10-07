"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase/client";

type FinishReadButtonProps = {
  bookId: string;
  bookTitle: string;
  readingNumber?: number;
  pageCount?: number;
  onFinished?: () => void | Promise<void>;
};

export default function FinishReadButton({
  bookId,
  bookTitle,
  readingNumber = 1,
  pageCount,
  onFinished,
}: FinishReadButtonProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [finishing, setFinishing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleFinishRead = async () => {
    setFinishing(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError(
          "Your session could not be verified. Please log in again."
        );
        return;
      }

      const recordId =
        `${user.id}:${bookId}:${readingNumber}`;

      const finishedAt =
        new Date().toISOString();

      const {
        error: recordError,
      } = await supabase
        .from("reading_records")
        .upsert(
          {
            id: recordId,
            owner_id: user.id,
            book_id: bookId,
            status: "completed",
            current_page:
              pageCount ?? null,
            progress_percent: 100,
            reading_number:
              readingNumber,
            is_reread:
              readingNumber > 1,
            finished_at:
              finishedAt,
            updated_at:
              finishedAt,
          },
          {
            onConflict: "id",
          }
        );

      if (recordError) {
        setError(
          `Could not finish this read: ${recordError.message}`
        );
        return;
      }

      const {
        error: historyError,
      } = await supabase
        .from(
          "reading_progress_entries"
        )
        .insert({
          owner_id: user.id,
          reading_record_id:
            recordId,
          page:
            pageCount ?? null,
          percentage: 100,
          note:
            "Finished reading.",
          mood: null,
          recorded_at:
            finishedAt,
        });

      if (historyError) {
        setError(
          `The book was completed, but the final history entry could not be saved: ${historyError.message}`
        );
        return;
      }

      setSuccess(
        "Read completed ✦"
      );

      window.dispatchEvent(
      new CustomEvent(
        "slaylist:reading-finished",
        {
          detail: {
            bookId,
            bookTitle,
            readingNumber,
          },
        }
      )
    );

      await onFinished?.();

    } finally {
      setFinishing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="current-rotation-finish-button"
        onClick={() =>
          setIsOpen(true)
        }
      >
        ✦ FINISH READ
      </button>

      {isOpen && (
        <div
          className="finish-read-backdrop"
          role="presentation"
          onMouseDown={() =>
            !finishing &&
            setIsOpen(false)
          }
        >
          <div
            className="finish-read-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="finish-read-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="finish-read-close"
              aria-label="Close finish read modal"
              disabled={finishing}
              onClick={() =>
                setIsOpen(false)
              }
            >
              ×
            </button>

            <p className="eyebrow">
              READING LAB // FINAL RESULTS
            </p>

            <h2 id="finish-read-title">
              Finished this one?
            </h2>

            <p className="finish-read-book-title">
              {bookTitle}
            </p>

            <p className="finish-read-copy">
              Confirming will close
              this reading record,
              preserve your progress
              history, and move the
              book out of Current
              Rotation.
            </p>

            <div className="finish-read-warning">
              <span>✦</span>

              <p>
                This is a real update.
                Your reading record will
                be marked completed and
                a final 100% check-in
                will be saved to your
                reading history.
              </p>
            </div>

            {error && (
              <p className="finish-read-error">
                {error}
              </p>
            )}

            {success && (
              <p className="finish-read-success">
                {success}
              </p>
            )}

            <div className="finish-read-actions">
              <button
                type="button"
                className="finish-read-cancel"
                disabled={finishing}
                onClick={() =>
                  setIsOpen(false)
                }
              >
                NOT YET
              </button>

              <button
                type="button"
                className="finish-read-confirm"
                onClick={
                  handleFinishRead
                }
                disabled={finishing}
              >
                {finishing
                  ? "FINISHING..."
                  : "YES, I FINISHED ✦"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

