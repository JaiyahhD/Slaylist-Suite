"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import {
  Bookwave,
  BookwaveRow,
  mapBookwaveRow,
} from "@/types/bookwave";

type BookwaveDossierConnectionProps = {
  bookId: string;
  bookTitle: string;
};

type ConnectionState =
  | "loading"
  | "connected"
  | "empty"
  | "error";

export default function BookwaveDossierConnection({
  bookId,
  bookTitle,
}: BookwaveDossierConnectionProps) {
  const [wave, setWave] =
    useState<Bookwave | null>(null);

  const [state, setState] =
    useState<ConnectionState>("loading");

  useEffect(() => {
    let active = true;

    async function loadConnection() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (userError || !user) {
        setState("error");
        return;
      }

      const { data, error } = await supabase
        .from("bookwaves")
        .select(
          `
            id,
            owner_id,
            book_id,
            playlist_name,
            spotify_url,
            vibe,
            description,
            use_book_cover,
            custom_cover_url,
            created_at,
            updated_at
          `
        )
        .eq("owner_id", user.id)
        .eq("book_id", bookId)
        .maybeSingle();

      if (!active) {
        return;
      }

      if (error) {
        setState("error");
        return;
      }

      if (!data) {
        setWave(null);
        setState("empty");
        return;
      }

      setWave(
        mapBookwaveRow(data as BookwaveRow)
      );
      setState("connected");
    }

    void loadConnection();

    return () => {
      active = false;
    };
  }, [bookId]);

  if (state === "loading") {
    return (
      <article className="book-detail-panel bookwave-dossier-panel">
        <p className="eyebrow">
          BOOKWAVE // SCANNING
        </p>

        <h2>Story Soundtrack</h2>

        <p className="book-detail-muted">
          Checking the airwaves...
        </p>
      </article>
    );
  }

  if (state === "error") {
    return (
      <article className="book-detail-panel bookwave-dossier-panel">
        <p className="eyebrow">
          BOOKWAVE // SIGNAL ERROR
        </p>

        <h2>Story Soundtrack</h2>

        <p className="book-detail-muted">
          The soundtrack connection could not
          be checked right now.
        </p>
      </article>
    );
  }

  if (state === "empty" || !wave) {
    return (
      <article className="book-detail-panel bookwave-dossier-panel">
        <p className="eyebrow">
          BOOKWAVE // NO SIGNAL
        </p>

        <h2>Story Soundtrack</h2>

        <p className="book-detail-muted">
          {bookTitle} does not have a Bookwave yet.
        </p>

        <Link
          href="/bookwave"
          className="bookwave-dossier-suite-link"
        >
          CREATE A BOOKWAVE →
        </Link>
      </article>
    );
  }

  return (
    <article className="book-detail-panel bookwave-dossier-panel is-connected">
      <div className="bookwave-dossier-heading">
        <div>
          <p className="eyebrow">
            BOOKWAVE // FREQUENCY FOUND
          </p>

          <h2>Story Soundtrack</h2>
        </div>

        <span className="bookwave-dossier-live">
          ● LIVE
        </span>
      </div>

      <div className="bookwave-dossier-waveform">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="bookwave-dossier-copy">
        <span className="bookwave-mini-label">
          NOW ON THE AIRWAVES
        </span>

        <h3>{wave.playlistName}</h3>

        {wave.vibe && (
          <p className="bookwave-dossier-vibe">
            {wave.vibe}
          </p>
        )}

        {wave.description && (
          <p className="bookwave-dossier-description">
            {wave.description}
          </p>
        )}
      </div>

      <div className="bookwave-dossier-actions">
        <a
          href={wave.spotifyUrl}
          target="_blank"
          rel="noreferrer"
          className="bookwave-spotify-button"
        >
          ▶ OPEN ON SPOTIFY
        </a>

        <Link
          href="/bookwave"
          className="bookwave-dossier-suite-link"
        >
          VIEW IN BOOKWAVE →
        </Link>
      </div>
    </article>
  );
}
