import Link from "next/link";

export default function BookwavePage() {
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
            <a href="#bookwave-library" className="bookwave-primary-action">
              Explore the Waves
            </a>

            <Link href="/slaybase" className="bookwave-secondary-action">
              Back to the Slaybase
            </Link>
          </div>
        </div>

        <div className="bookwave-signal" aria-hidden="true">
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

      <section className="bookwave-console">
        <div className="bookwave-console-header">
          <div>
            <span className="bookwave-eyebrow">NOW TRANSMITTING</span>
            <h2>My Reading Frequency</h2>
          </div>

          <span className="bookwave-status">
            <span className="bookwave-status-dot" />
            SYSTEM READY
          </span>
        </div>

        <div className="bookwave-now-playing">
          <div className="bookwave-now-art">
            <span>♫</span>
          </div>

          <div className="bookwave-now-copy">
            <span className="bookwave-mini-label">
              BOOKWAVE // NO SIGNAL YET
            </span>

            <h3>Nothing on the airwaves.</h3>

            <p>
              Once a playlist is attached to a book, its soundtrack
              can live here.
            </p>
          </div>

          <div className="bookwave-frequency">
            <span>00:00</span>

            <div className="bookwave-frequency-line">
              <div />
            </div>

            <span>∞</span>
          </div>
        </div>
      </section>

      <section
        className="bookwave-library"
        id="bookwave-library"
      >
        <div className="bookwave-section-heading">
          <div>
            <span className="bookwave-eyebrow">
              THE FREQUENCY LIBRARY
            </span>

            <h2>Bookwaves</h2>
          </div>

          <p>
            Books and their musical counterparts will collect here
            as the archive grows.
          </p>
        </div>

        <div className="bookwave-empty">
          <div className="bookwave-empty-orbit">
            <div className="bookwave-empty-disc">
              <span>BW</span>
            </div>
          </div>

          <span className="bookwave-empty-code">
            SIGNAL_000 // AWAITING TRANSMISSION
          </span>

          <h3>Your airwaves are quiet.</h3>

          <p>
            No Bookwaves have been created yet. Soon, this space will
            connect real books from your Slaybase with the playlists
            that belong to them.
          </p>

          <div className="bookwave-empty-tags">
            <span>BOOK × MUSIC</span>
            <span>PLAYLIST ARCHIVE</span>
            <span>READING SOUNDTRACKS</span>
          </div>
        </div>
      </section>

      <section className="bookwave-manifesto">
        <span className="bookwave-eyebrow">THE FORMULA</span>

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
          A playlist is not just background noise. Sometimes it
          becomes part of how a story is remembered.
        </p>
      </section>
    </main>
  );
}
