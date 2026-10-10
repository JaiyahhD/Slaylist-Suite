
import Link from "next/link";

import type { Bookwave } from "@/types/bookwave";

type FeaturedBook = {
  id: string;
  title: string;
  authors: string[];
  coverUrl?: string | null;
};

type Props = {
  wave: Bookwave | null;
  book: FeaturedBook | null;
  loading: boolean;
};

export default function BookwaveNowTransmitting({
  wave,
  book,
  loading,
}: Props) {
  const artwork = wave
    ? wave.useBookCover
      ? book?.coverUrl
      : wave.customCoverUrl
    : null;

  return (
    <section className="bookwave-console">
      <div className="bookwave-console-header">
        <div>
          <span className="bookwave-eyebrow">
            NOW TRANSMITTING
          </span>
          <h2>My Reading Frequency</h2>
        </div>

        <span className="bookwave-status">
          <span className="bookwave-status-dot" />
          {wave ? "ON AIR" : loading ? "SCANNING" : "SYSTEM READY"}
        </span>
      </div>

      <div className="bookwave-now-playing">
        <div className="bookwave-now-art">
          {artwork ? (
            <img src={artwork} alt={`${wave?.playlistName} artwork`} />
          ) : (
            <span>♫</span>
          )}
        </div>

        <div className="bookwave-now-copy">
          <span className="bookwave-mini-label">
            {wave
              ? "BOOKWAVE // FREQUENCY FOUND"
              : loading
                ? "BOOKWAVE // SCANNING"
                : "BOOKWAVE // NO SIGNAL YET"}
          </span>

          <h3>
            {wave
              ? wave.playlistName
              : loading
                ? "Searching the airwaves..."
                : "Nothing on the airwaves."}
          </h3>

          {wave ? (
            <>
              <p>
                Soundtrack for{" "}
                <strong>{book?.title ?? "Unknown book"}</strong>
              </p>

              {wave.vibe && <p>{wave.vibe}</p>}

              <div className="bookwave-featured-actions">
                <a
                  href={wave.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bookwave-spotify-button"
                >
                  ▶ OPEN ON SPOTIFY
                </a>

                {book && (
                  <Link
                    href={`/books/${book.id}`}
                    className="bookwave-dossier-button"
                  >
                    ✦ BOOK DOSSIER
                  </Link>
                )}
              </div>
            </>
          ) : (
            <p>
              {loading
                ? "Checking your soundtrack archive."
                : "Once a playlist is attached to a book, its soundtrack can live here."}
            </p>
          )}
        </div>

        <div className="bookwave-frequency">
          <span>{wave ? "LIVE" : "00:00"}</span>
          <div className="bookwave-frequency-line">
            <div />
          </div>
          <span>∞</span>
        </div>
      </div>
    </section>
  );
}
