"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import UpdateProgressButton from "@/components/rotation/UpdateProgressButton";
import { supabase } from "@/lib/supabase/client";

type ReadingMethod =
  | "physical"
  | "ebook"
  | "audiobook";

type CurrentRotationClientProps = {
  bookId: string;
  bookTitle: string;
  pageCount?: number;
  readingMethod?: ReadingMethod;
  readingNumber?: number;
  fallbackPage?: number;
  fallbackProgress?: number;
};

type LiveReadingRecord = {
  current_page: number | null;
  progress_percent: number | null;
};

export default function CurrentRotationClient({
  bookId,
  bookTitle,
  pageCount,
  readingMethod,
  readingNumber = 1,
  fallbackPage,
  fallbackProgress = 0,
}: CurrentRotationClientProps) {
  const [liveRecord, setLiveRecord] =
    useState<LiveReadingRecord | null>(null);

  const loadProgress = useCallback(
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("reading_records")
        .select(
          "current_page, progress_percent"
        )
        .eq("owner_id", user.id)
        .eq("book_id", bookId)
        .eq(
          "reading_number",
          readingNumber
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Could not load live reading progress:",
          error
        );
        return;
      }

      setLiveRecord(data);
    },
    [bookId, readingNumber]
  );

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const currentPage =
    liveRecord?.current_page ??
    fallbackPage ??
    null;

  const progress =
    liveRecord?.progress_percent ??
    fallbackProgress;

  const safeProgress = Math.min(
    100,
    Math.max(0, progress)
  );

  return (
    <>
      <div className="current-rotation-progress">
        <div className="current-rotation-progress-track">
          <div
            className="current-rotation-progress-fill"
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        <div className="current-rotation-progress-data">
          <span>
            {currentPage !== null
              ? pageCount
                ? `PAGE ${currentPage} / ${pageCount}`
                : `PAGE ${currentPage}`
              : pageCount
                ? `${pageCount} PAGES TOTAL`
                : "PAGE DATA UNAVAILABLE"}
          </span>

          <strong>
            {safeProgress}%
          </strong>
        </div>
      </div>

      <UpdateProgressButton
        bookId={bookId}
        bookTitle={bookTitle}
        pageCount={pageCount}
        readingMethod={readingMethod}
        readingNumber={readingNumber}
        onProgressSaved={loadProgress}
      />
    </>
  );
}