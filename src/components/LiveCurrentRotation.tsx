
"use client";

import { useEffect, useState } from "react";
import CurrentRotationCarousel from "@/components/CurrentRotationCarousel";
import { supabase } from "@/lib/supabase";
import type { Entry } from "@/lib/library";

export default function LiveCurrentRotation() {
  const [books, setBooks] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRotation() {
      try {
        const { data, error } = await supabase
          .from("slaybase_books")
          .select("id,book_data");

        if (error) throw error;

        const currentBooks: Entry[] = (data || [])
          .map((row) => ({
            book: row.book_data as Entry["book"],
            readingRecord: null,
          }))
          .filter(
            (entry) =>
              entry.book.status === "currently-reading"
          );

        if (!cancelled) {
          setBooks(currentBooks);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your current rotation."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRotation();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <p className="muted">
        Loading your current rotation… 💗
      </p>
    );
  }

  if (error) {
    return (
      <p className="muted" role="alert">
        Could not load your current rotation: {error}
      </p>
    );
  }

  return <CurrentRotationCarousel entries={books} />;
}
