"use client";

import {
  MouseEvent,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

type PostReadRitualProps = {
  bookId: string;
  bookTitle: string;
  readingNumber?: number;
  onClose?: () => void;
};

export default function PostReadRitual({
  bookId,
  bookTitle,
  readingNumber = 1,
  onClose,
}: PostReadRitualProps) {
  const [rating, setRating] =
    useState<number | null>(null);

  const [certifiedSlay, setCertifiedSlay] =
    useState(false);

  const [brainChemistry, setBrainChemistry] =
    useState(false);

  const [reaction, setReaction] =
    useState("");

  const [review, setReview] =
    useState("");

  const [containsSpoilers, setContainsSpoilers] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleStarClick = (
    event: MouseEvent<HTMLButtonElement>,
    starNumber: number
  ) => {
    const bounds =
      event.currentTarget.getBoundingClientRect();

    const clickPosition =
      event.clientX - bounds.left;

    const clickedHalf =
      clickPosition < bounds.width / 2;

    const nextRating =
      clickedHalf
        ? starNumber - 0.5
        : starNumber;

    setRating(nextRating);
  };


  /* =====================================================
     SAVE VERDICT
     ===================================================== */

  const handleSaveVerdict =
    async () => {
      setSaving(true);
      setError("");
      setSuccess("");

      try {
        const {
          data: { user },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError || !user) {
          setError(
            "Your session could not be verified. Please log in again."
          );
          return;
        }

        const recordId =
          `${user.id}:${bookId}:${readingNumber}`;

        const updatedAt =
          new Date().toISOString();


        /* -----------------------------------------------
           UPDATE READING RECORD
           ----------------------------------------------- */

        const {
          error: recordError,
        } = await supabase
          .from("reading_records")
          .update({
            rating,
            certified_slay:
              certifiedSlay,
            brain_chemistry:
              brainChemistry,
            reaction:
              reaction.trim() || null,
            updated_at:
              updatedAt,
          })
          .eq("id", recordId)
          .eq("owner_id", user.id);

        if (recordError) {
          setError(
            `Could not save your verdict: ${recordError.message}`
          );
          return;
        }


        /* -----------------------------------------------
           SAVE REVIEW ONLY IF ONE EXISTS
           ----------------------------------------------- */

        if (review.trim()) {
          const {
            data: existingReview,
            error:
              existingReviewError,
          } = await supabase
            .from("reviews")
            .select("id")
            .eq(
              "owner_id",
              user.id
            )
            .eq(
              "reading_record_id",
              recordId
            )
            .maybeSingle();

          if (existingReviewError) {
            setError(
              `Your verdict was saved, but the review could not be checked: ${existingReviewError.message}`
            );
            return;
          }

          if (existingReview) {
            const {
              error:
                reviewUpdateError,
            } = await supabase
              .from("reviews")
              .update({
                rating,
                body:
                  review.trim(),
                contains_spoilers:
                  containsSpoilers,
                updated_at:
                  updatedAt,
              })
              .eq(
                "id",
                existingReview.id
              )
              .eq(
                "owner_id",
                user.id
              );

            if (reviewUpdateError) {
              setError(
                `Your verdict was saved, but the review could not be updated: ${reviewUpdateError.message}`
              );
              return;
            }
          } else {
            const {
              error:
                reviewInsertError,
            } = await supabase
              .from("reviews")
              .insert({
                owner_id:
                  user.id,
                book_id:
                  bookId,
                reading_record_id:
                  recordId,
                rating,
                body:
                  review.trim(),
                contains_spoilers:
                  containsSpoilers,
                created_at:
                  updatedAt,
                updated_at:
                  updatedAt,
              });

            if (reviewInsertError) {
              setError(
                `Your verdict was saved, but the review could not be created: ${reviewInsertError.message}`
              );
              return;
            }
          }
        }

        setSuccess(
          "Verdict saved ✦"
        );

        window.dispatchEvent(
          new CustomEvent(
            "slaylist:verdict-saved",
            {
              detail: {
                bookId,
                readingNumber,
              },
            }
          )
        );

        window.setTimeout(
          () => {
            onClose?.();
          },
          650
        );

      } finally {
        setSaving(false);
      }
    };


  return (
    <div className="post-read-ritual">

      <div className="post-read-ritual-heading">
        <p className="eyebrow">
          READING LAB // FINAL RESULTS
        </p>

        <h2>
          The Post-Read Ritual
        </h2>

        <p>
          The experiment is complete.
          Time to record the damage.
        </p>
      </div>


      <div className="post-read-ritual-book">
        <span>
          COMPLETED SPECIMEN
        </span>

        <strong>
          {bookTitle}
        </strong>
      </div>


      {/* =============================================
          RATING
          ============================================= */}

      <section className="post-read-ritual-section">

        <div className="post-read-ritual-label">

          <div>
            <span>
              01
            </span>

            <h3>
              Final Rating
            </h3>
          </div>

          <strong>
            {rating !== null
              ? `${rating} / 5`
              : "UNRATED"}
          </strong>

        </div>


        <div
          className="post-read-stars"
          aria-label="Choose rating"
        >
          {[1, 2, 3, 4, 5].map(
            (starNumber) => {
              const isFull =
                rating !== null &&
                rating >= starNumber;

              const isHalf =
                rating !== null &&
                rating ===
                  starNumber - 0.5;

              return (
                <button
                  key={starNumber}
                  type="button"
                  className={
                    `post-read-star ` +
                    `${isFull
                      ? "is-full"
                      : ""} ` +
                    `${isHalf
                      ? "is-half"
                      : ""}`
                  }
                  aria-label={
                    `Rate ${starNumber - 0.5} or ${starNumber} stars`
                  }
                  disabled={saving}
                  onClick={(event) =>
                    handleStarClick(
                      event,
                      starNumber
                    )
                  }
                >
                  <span className="post-read-star-empty">
                    ☆
                  </span>

                  <span className="post-read-star-full">
                    ★
                  </span>
                </button>
              );
            }
          )}
        </div>


        <p className="post-read-rating-hint">
          Click the left half of a star for
          a half-star rating.
        </p>

      </section>


      {/* =============================================
          SPECIAL STATUS
          ============================================= */}

      <section className="post-read-ritual-section">

        <div className="post-read-ritual-label">

          <div>
            <span>
              02
            </span>

            <h3>
              Special Status
            </h3>
          </div>

        </div>


        <div className="post-read-toggle-grid">

          <button
            type="button"
            className={
              `post-read-toggle ` +
              `${certifiedSlay
                ? "is-selected"
                : ""}`
            }
            aria-pressed={
              certifiedSlay
            }
            disabled={saving}
            onClick={() =>
              setCertifiedSlay(
                (current) =>
                  !current
              )
            }
          >
            <span className="post-read-toggle-icon">
              ✦
            </span>

            <span>
              <strong>
                Certified Slay
              </strong>

              <small>
                Crown-worthy.
                No explanation needed.
              </small>
            </span>
          </button>


          <button
            type="button"
            className={
              `post-read-toggle ` +
              `${brainChemistry
                ? "is-selected"
                : ""}`
            }
            aria-pressed={
              brainChemistry
            }
            disabled={saving}
            onClick={() =>
              setBrainChemistry(
                (current) =>
                  !current
              )
            }
          >
            <span className="post-read-toggle-icon">
              ⚗
            </span>

            <span>
              <strong>
                Brain Chemistry
              </strong>

              <small>
                I am chemically different
                after reading this.
              </small>
            </span>
          </button>

        </div>

      </section>


      {/* =============================================
          REACTION
          ============================================= */}

      <section className="post-read-ritual-section">

        <div className="post-read-ritual-label">

          <div>
            <span>
              03
            </span>

            <h3>
              Immediate Reaction
            </h3>
          </div>

          <small>
            OPTIONAL
          </small>

        </div>


        <input
          type="text"
          className="post-read-input"
          value={reaction}
          disabled={saving}
          onChange={(event) =>
            setReaction(
              event.target.value
            )
          }
          placeholder="WTF did I just read..."
          maxLength={180}
        />

        <div className="post-read-character-count">
          {reaction.length} / 180
        </div>

      </section>


      {/* =============================================
          REVIEW
          ============================================= */}

      <section className="post-read-ritual-section">

        <div className="post-read-ritual-label">

          <div>
            <span>
              04
            </span>

            <h3>
              The Verdict
            </h3>
          </div>

          <small>
            OPTIONAL
          </small>

        </div>


        <textarea
          className="post-read-textarea"
          value={review}
          disabled={saving}
          onChange={(event) =>
            setReview(
              event.target.value
            )
          }
          placeholder="Give the official verdict..."
          rows={7}
        />


        <label className="post-read-spoiler-toggle">

          <input
            type="checkbox"
            checked={
              containsSpoilers
            }
            disabled={saving}
            onChange={(event) =>
              setContainsSpoilers(
                event.target.checked
              )
            }
          />

          <span>
            This review contains spoilers
          </span>

        </label>

      </section>


      {/* =============================================
          FEEDBACK
          ============================================= */}

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


      {/* =============================================
          ACTIONS
          ============================================= */}

      <div className="post-read-ritual-actions">

        <button
          type="button"
          className="post-read-save"
          disabled={saving}
          onClick={
            handleSaveVerdict
          }
        >
          {saving
            ? "SAVING VERDICT..."
            : "SAVE MY VERDICT ✦"}
        </button>

        <button
          type="button"
          className="post-read-later"
          disabled={saving}
          onClick={onClose}
        >
          I&apos;LL DO THIS LATER
        </button>

      </div>


      <p className="post-read-ritual-note">
        Your book is already marked complete.
        Rating and reviewing are optional.
      </p>

    </div>
  );
}
