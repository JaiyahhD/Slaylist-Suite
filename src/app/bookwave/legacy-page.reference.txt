import Link from "next/link";

import BookwaveManager from "@/components/bookwave/BookwaveManager";
import goodreadsLibrary from "@/data/goodreads-library.json";

type GoodreadsLibraryEntry = {
  book: {
    id: string;
    title: string;
    authors: string[];
    coverUrl?: string | null;
  };
};

export default function BookwavePage() {
  const library =
    goodreadsLibrary as GoodreadsLibraryEntry[];

  const books = library.map(({ book }) => ({
    id: book.id,
    title: book.title,
    authors: book.authors,
    coverUrl: book.coverUrl ?? null,
  }));

  return (
    <main className="bookwave-page">
      <section className="bookwave-hero">
        <div className="bookwave-hero-glow bookwave-hero-glow-pink" />
        <div className="bookwave-hero-glow bookwave-hero-glow-blue" />

        <div className="bookwave-hero-content">
          <span className="bookwave-kicker">
            THE SLAYLIST SUITE // AUDIO ARCHIVE
          </span>

          <h1>
            BOOK<span>WAVE</span>
          </h1>

          <p className="bookwave-tagline">
            Every story deserves a soundtrack.
          </p>

          <p className="bookwave-intro">
            The musical side of my reading universe — playlists,
            soundtracks, and songs attached to the books that made
            something in my brain light up.
          </p>

          <div className="bookwave-hero-actions">
            <a
              href="#bookwave-library"
              className="bookwave-primary-action"
            >
              Explore the Waves
            </a>

            <Link
              href="/slaybase"
              className="bookwave-secondary-action"
            >
              Back to the Slaybase
            </Link>
          </div>
        </div>

        <div
          className="bookwave-signal"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <BookwaveManager books={books} />

      <section className="bookwave-manifesto">
        <span className="bookwave-eyebrow">
          THE FORMULA
        </span>

        <div className="bookwave-equation">
          <span>BOOK</span>
          <strong>+</strong>
          <span>MUSIC</span>
          <strong>+</strong>
          <span>MEMORY</span>
          <strong>=</strong>
          <span className="bookwave-equation-result">
            BOOKWAVE
          </span>
        </div>

        <p>
          A playlist is not just background noise.
          Sometimes it becomes part of how a story is
          remembered.
        </p>
      </section>
    </main>
  );
}
