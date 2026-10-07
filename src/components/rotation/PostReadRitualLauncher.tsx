"use client";

import {
  useEffect,
  useState,
} from "react";

import PostReadRitual from "./PostReadRitual";

type FinishedBook = {
  bookId: string;
  bookTitle: string;
  readingNumber: number;
};

type ReadingFinishedEvent =
  CustomEvent<FinishedBook>;

export default function PostReadRitualLauncher() {
  const [
    finishedBook,
    setFinishedBook,
  ] = useState<FinishedBook | null>(
    null
  );

  useEffect(() => {
    const handleReadingFinished = (
      event: Event
    ) => {
      const finishedEvent =
        event as ReadingFinishedEvent;

      if (
        !finishedEvent.detail?.bookId ||
        !finishedEvent.detail?.bookTitle
      ) {
        return;
      }

      setFinishedBook({
        bookId:
          finishedEvent.detail.bookId,

        bookTitle:
          finishedEvent.detail.bookTitle,

        readingNumber:
          finishedEvent.detail
            .readingNumber ?? 1,
      });
    };

    window.addEventListener(
      "slaylist:reading-finished",
      handleReadingFinished
    );

    return () => {
      window.removeEventListener(
        "slaylist:reading-finished",
        handleReadingFinished
      );
    };
  }, []);

  if (!finishedBook) {
    return null;
  }

  return (
    <div
      className="post-read-ritual-backdrop"
      role="presentation"
      onMouseDown={() =>
        setFinishedBook(null)
      }
    >
      <div
        className="post-read-ritual-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={
          `Post-read ritual for ${finishedBook.bookTitle}`
        }
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="post-read-ritual-close"
          aria-label="Close post-read ritual"
          onClick={() =>
            setFinishedBook(null)
          }
        >
          ×
        </button>

        <PostReadRitual
            bookId={
                finishedBook.bookId
            }
            bookTitle={
                finishedBook.bookTitle
            }
            readingNumber={
                finishedBook.readingNumber
            }
            onClose={() =>
                setFinishedBook(null)
            }
            />
      </div>
    </div>
  );
}
