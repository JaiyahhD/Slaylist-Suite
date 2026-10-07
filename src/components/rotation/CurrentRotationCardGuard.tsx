"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

type CurrentRotationCardGuardProps = {
  bookId: string;
  readingNumber?: number;
  children: ReactNode;
};

type ReadingFinishedEvent = CustomEvent<{
  bookId: string;
}>;

export default function CurrentRotationCardGuard({
  bookId,
  readingNumber = 1,
  children,
}: CurrentRotationCardGuardProps) {
  const [isCompleted, setIsCompleted] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const checkStatus = useCallback(
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("reading_records")
        .select("status")
        .eq("owner_id", user.id)
        .eq("book_id", bookId)
        .eq(
          "reading_number",
          readingNumber
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Could not check reading status:",
          error
        );

        setLoading(false);
        return;
      }

      setIsCompleted(
        data?.status === "completed"
      );

      setLoading(false);
    },
    [bookId, readingNumber]
  );

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const handleReadingFinished = (
      event: Event
    ) => {
      const finishedEvent =
        event as ReadingFinishedEvent;

      if (
        finishedEvent.detail?.bookId ===
        bookId
      ) {
        setIsCompleted(true);
      }
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
  }, [bookId]);

  if (loading) {
    return <>{children}</>;
  }

  if (isCompleted) {
    return null;
  }

  return <>{children}</>;
}
