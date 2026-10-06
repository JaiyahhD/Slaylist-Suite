"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import UpdateProgressButton from "@/components/rotation/UpdateProgressButton";
import FinishReadButton from "@/components/rotation/FinishReadButton";
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

type ProgressEntry = {
  id: string;
  page: number | null;
  percentage: number | null;
  note: string | null;
  mood: string | null;
  recorded_at: string;
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

    const [latestEntry, setLatestEntry] =
  useState<ProgressEntry | null>(null);

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

      const {
  data: latestProgressEntry,
  error: progressEntryError,
} = await supabase
  .from("reading_progress_entries")
  .select(
    `
      id,
      page,
      percentage,
      note,
      mood,
      recorded_at
    `
  )
  .eq("owner_id", user.id)
  .eq(
    "reading_record_id",
    `${user.id}:${bookId}:${readingNumber}`
  )
  .order("recorded_at", {
    ascending: false,
  })
  .limit(1)
  .maybeSingle();

if (progressEntryError) {
  console.error(
    "Could not load latest progress entry:",
    progressEntryError
  );
} else {
  setLatestEntry(
    latestProgressEntry as ProgressEntry | null
  );
}
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
      <span className="current-rotation-live-percent">
        {safeProgress}% COMPLETE
      </span>

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


          {latestEntry && (
        <div className="current-rotation-checkin">
          <div className="current-rotation-checkin-heading">
            <span>LATEST CHECK-IN</span>

            <strong>
              {new Intl.DateTimeFormat(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }
              ).format(
                new Date(
                  latestEntry.recorded_at
                )
              )}
            </strong>
          </div>

          <div className="current-rotation-checkin-meta">
            {latestEntry.page !== null && (
              <span>
                PAGE {latestEntry.page}
              </span>
            )}

            {latestEntry.percentage !== null && (
              <span>
                {latestEntry.percentage}%
              </span>
            )}

            {latestEntry.mood && (
              <span>
                MOOD: {latestEntry.mood}
              </span>
            )}
          </div>

          {latestEntry.note && (
            <p className="current-rotation-checkin-note">
              “{latestEntry.note}”
            </p>
          )}
        </div>
      )
    }

      <UpdateProgressButton
        bookId={bookId}
        bookTitle={bookTitle}
        pageCount={pageCount}
        readingMethod={readingMethod}
        readingNumber={readingNumber}
        onProgressSaved={loadProgress}
      />

      <FinishReadButton
  bookId={bookId}
  bookTitle={bookTitle}
  readingNumber={readingNumber}
  pageCount={pageCount}
  onFinished={loadProgress}
/>
    </>
  );
}
