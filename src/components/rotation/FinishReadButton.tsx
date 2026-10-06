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

  return (
    <>
      <button
        type="button"
        className="current-rotation-finish-button"
        onClick={() => setIsOpen(true)}
      >
        ✦ FINISH READ
      </button>

      {isOpen && (
        <div
          className="finish-read-backdrop"
          role="presentation"
          onMouseDown={() =>
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
              Confirming will eventually close
              this reading record, preserve your
              progress history, and move the book
              out of Current Rotation.
            </p>

            <div className="finish-read-warning">
              <span>✦</span>

              <p>
                Nothing will be changed yet.
                We&apos;re testing the Finish Read
                flow before connecting it to your
                database.
              </p>
            </div>

            <div className="finish-read-actions">
              <button
                type="button"
                className="finish-read-cancel"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                NOT YET
              </button>

              <button
                type="button"
                className="finish-read-confirm"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                YES, I FINISHED ✦
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}