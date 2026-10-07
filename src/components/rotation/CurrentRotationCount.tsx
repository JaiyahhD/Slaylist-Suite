"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

type CurrentRotationCountProps = {
  bookIds: string[];
};

export default function CurrentRotationCount({
  bookIds,
}: CurrentRotationCountProps) {
  const [activeCount, setActiveCount] =
    useState(bookIds.length);

  const loadActiveCount = useCallback(
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || bookIds.length === 0) {
        setActiveCount(bookIds.length);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("reading_records")
        .select("book_id, status")
        .eq("owner_id", user.id)
        .in("book_id", bookIds);

      if (error) {
        console.error(
          "Could not load active reading count:",
          error
        );
        return;
      }

      const completedBookIds =
        new Set(
          (data ?? [])
            .filter(
              (record) =>
                record.status === "completed"
            )
            .map(
              (record) =>
                record.book_id
            )
        );

      const count =
        bookIds.filter(
          (bookId) =>
            !completedBookIds.has(bookId)
        ).length;

      setActiveCount(count);
    },
    [bookIds]
  );

  useEffect(() => {
    loadActiveCount();

    const handleReadingFinished =
      () => {
        loadActiveCount();
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
  }, [loadActiveCount]);

  return (
    <strong>
      {activeCount}
    </strong>
  );
}
