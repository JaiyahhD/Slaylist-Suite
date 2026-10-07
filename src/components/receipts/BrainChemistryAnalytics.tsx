"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

type BrainChemistryRecord = {
  id: string;
  book_id: string;
  rating: number | null;
  brain_chemistry: boolean | null;
  reaction: string | null;
  finished_at: string | null;
  reading_number: number | null;
};

type BrainChemistryBook = {
  id: string;
  title: string;
  authors: string[];
};

type BrainChemistryAnalyticsProps = {
  books: BrainChemistryBook[];
};

export default function BrainChemistryAnalytics({
  books,
}: BrainChemistryAnalyticsProps) {
  const [records, setRecords] = useState<BrainChemistryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBrainChemistry() {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setRecords([]);
          setLoading(false);
        }

        return;
      }

      const { data, error } = await supabase
        .from("reading_records")
        .select(
          [
            "id",
            "book_id",
            "rating",
            "brain_chemistry",
            "reaction",
            "finished_at",
            "reading_number",
          ].join(",")
        )
        .eq("owner_id", user.id)
        .eq("brain_chemistry", true)
        .order("finished_at", {
          ascending: false,
          nullsFirst: false,
        });

      if (!active) return;

      if (error) {
        console.error(
          "Could not load Brain Chemistry analytics:",
          error
        );

        setRecords([]);
        setLoading(false);
        return;
      }

      setRecords(
        (data ?? []) as unknown as BrainChemistryRecord[]
      );
      setLoading(false);
    }

    loadBrainChemistry();

    return () => {
      active = false;
    };
  }, []);

  const bookMap = useMemo(() => {
    return new Map(books.map((book) => [book.id, book]));
  }, [books]);

  const analytics = useMemo(() => {
    const uniqueBookIds = new Set(
      records.map((record) => record.book_id)
    );

    const ratedRecords = records.filter(
      (record) =>
        typeof record.rating === "number" &&
        record.rating > 0
    );

    const averageRating =
      ratedRecords.length > 0
        ? ratedRecords.reduce(
            (total, record) =>
              total + (record.rating ?? 0),
            0
          ) / ratedRecords.length
        : 0;

    const fiveStarRecords = ratedRecords.filter(
      (record) => record.rating === 5
    );

    const rereadRecords = records.filter(
      (record) => (record.reading_number ?? 1) > 1
    );

    const reactions = records.filter(
      (record) =>
        typeof record.reaction === "string" &&
        record.reaction.trim().length > 0
    );

    return {
      uniqueBooks: uniqueBookIds.size,
      averageRating,
      fiveStarRecords,
      rereadRecords,
      reactions,
    };
  }, [records]);

  const formatAuthors = (authors: string[]) =>
    authors.length > 0
      ? authors.join(", ")
      : "Unknown author";

  const formatDate = (value: string | null) => {
    if (!value) return "Date not recorded";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date not recorded";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <section className="receipts-section">
      <div className="receipts-section-heading">
        <div>
          <p className="receipts-eyebrow">
            🧪 THE BOOKS THAT ALTERED THE FORMULA
          </p>
          <h2>Brain Chemistry</h2>
        </div>

        <p className="receipts-section-copy">
          Not necessarily perfect. Not necessarily five
          stars. These are the books that got into the lab,
          rearranged something, and left your reading brain
          different than they found it.
        </p>
      </div>

      {loading ? (
        <article className="receipts-analysis-card">
          <span className="receipts-analysis-kicker">
            ANALYZING SPECIMENS...
          </span>

          <h3>Loading Brain Chemistry</h3>

          <p className="receipts-analysis-copy">
            Checking the lab for books you&apos;ve marked
            as Brain Chemistry.
          </p>
        </article>
      ) : (
        <>
          <div className="receipts-stat-grid">
            <article className="receipts-stat-card glass-mixed">
              <span className="receipts-stat-label">
                Specimens
              </span>

              <strong className="receipts-stat-value">
                {analytics.uniqueBooks.toLocaleString()}
              </strong>

              <span className="receipts-stat-detail">
                unique books that altered the formula
              </span>
            </article>

            <article className="receipts-stat-card glass-violet">
              <span className="receipts-stat-label">
                Recorded Reactions
              </span>

              <strong className="receipts-stat-value">
                {analytics.reactions.length.toLocaleString()}
              </strong>

              <span className="receipts-stat-detail">
                Brain Chemistry reads with a reaction
              </span>
            </article>

            <article className="receipts-stat-card glass-pink">
              <span className="receipts-stat-label">
                Avg. Rating
              </span>

              <strong className="receipts-stat-value">
                {analytics.averageRating > 0
                  ? analytics.averageRating.toFixed(2)
                  : "—"}
              </strong>

              <span className="receipts-stat-detail">
                among rated Brain Chemistry reads
              </span>
            </article>

            <article className="receipts-stat-card glass-ice">
              <span className="receipts-stat-label">
                5-Star Chemistry
              </span>

              <strong className="receipts-stat-value">
                {analytics.fiveStarRecords.length.toLocaleString()}
              </strong>

              <span className="receipts-stat-detail">
                altered the brain and earned five stars
              </span>
            </article>
          </div>

          {records.length === 0 ? (
            <article className="receipts-analysis-card">
              <div className="receipts-analysis-header">
                <div>
                  <span className="receipts-analysis-kicker">
                    🧬 BASELINE ESTABLISHED
                  </span>

                  <h3>No Specimens Yet</h3>
                </div>

                <span className="receipts-analysis-badge">
                  0 logged
                </span>
              </div>

              <p className="receipts-analysis-copy">
                Brain Chemistry begins with the Slaylist
                Suite, so no Goodreads books have been
                retroactively assigned this distinction.
                When you finish a book and mark Brain
                Chemistry during the Post-Read Ritual, it
                will begin building this archive
                automatically.
              </p>

              <div className="receipts-signal-list">
                <div className="receipts-signal">
                  <span>Historical labels invented</span>
                  <strong>0</strong>
                </div>

                <div className="receipts-signal">
                  <span>Suite-era specimens</span>
                  <strong>0</strong>
                </div>

                <div className="receipts-signal">
                  <span>Lab status</span>
                  <strong>Ready 🧪</strong>
                </div>
              </div>
            </article>
          ) : (
            <div className="receipts-analysis-grid">
              <article className="receipts-analysis-card">
                <div className="receipts-analysis-header">
                  <div>
                    <span className="receipts-analysis-kicker">
                      🧬 SPECIMEN LOG
                    </span>

                    <h3>Recent Brain Chemistry</h3>
                  </div>

                  <span className="receipts-analysis-badge">
                    {records.length}{" "}
                    {records.length === 1
                      ? "read"
                      : "reads"}
                  </span>
                </div>

                <div className="receipts-profile-list">
                  {records.slice(0, 5).map((record) => {
                    const book = bookMap.get(record.book_id);

                    return (
                      <div
                        className="receipts-signal"
                        key={record.id}
                      >
                        <span>
                          <strong>
                            {book?.title ??
                              "Unknown book"}
                          </strong>

                          <small>
                            {book
                              ? formatAuthors(
                                  book.authors
                                )
                              : formatDate(
                                  record.finished_at
                                )}
                          </small>
                        </span>

                        <strong>
                          {record.rating
                            ? `${record.rating} ★`
                            : "🧪"}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </article>

              <article className="receipts-analysis-card">
                <div className="receipts-analysis-header">
                  <div>
                    <span className="receipts-analysis-kicker">
                      ⚗️ LAB RESULTS
                    </span>

                    <h3>Chemistry Signals</h3>
                  </div>
                </div>

                <div className="receipts-signal-list">
                  <div className="receipts-signal">
                    <span>Unique specimens</span>
                    <strong>
                      {analytics.uniqueBooks}
                    </strong>
                  </div>

                  <div className="receipts-signal">
                    <span>5-star specimens</span>
                    <strong>
                      {analytics.fiveStarRecords.length}
                    </strong>
                  </div>

                  <div className="receipts-signal">
                    <span>Reread specimens</span>
                    <strong>
                      {analytics.rereadRecords.length}
                    </strong>
                  </div>

                  <div className="receipts-signal">
                    <span>Written reactions</span>
                    <strong>
                      {analytics.reactions.length}
                    </strong>
                  </div>
                </div>
              </article>
            </div>
          )}

          {analytics.reactions.length > 0 && (
            <article className="receipts-analysis-card">
              <div className="receipts-analysis-header">
                <div>
                  <span className="receipts-analysis-kicker">
                    🧫 REACTION NOTES
                  </span>

                  <h3>What Happened in the Lab?</h3>
                </div>
              </div>

              <div className="receipts-profile-list">
                {analytics.reactions
                  .slice(0, 3)
                  .map((record) => {
                    const book = bookMap.get(record.book_id);

                    return (
                      <div
                        className="receipts-profile-row"
                        key={`reaction-${record.id}`}
                      >
                        <div className="receipts-profile-row-top">
                          <span>
                            {book?.title ??
                              "Unknown book"}
                          </span>

                          <strong>
                            {formatDate(
                              record.finished_at
                            )}
                          </strong>
                        </div>

                        <p className="receipts-analysis-copy">
                          {record.reaction}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </article>
          )}

          <p className="receipts-footnote">
            Brain Chemistry is Suite-era data. Historical
            Goodreads reads remain unclassified unless you
            intentionally classify them later; the Suite
            will never infer this distinction from ratings
            alone.
          </p>
        </>
      )}
    </section>
  );
}
