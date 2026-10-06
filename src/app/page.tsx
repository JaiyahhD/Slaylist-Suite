import Link from "next/link";

import CurrentRotation from "@/components/suite/CurrentRotation";
import ReadingDashboard from "@/components/suite/ReadingDashboard";
import { suiteCopy } from "@/config/copy";


export default function HomePage() {
  return (
    <main className="suite-page">

      {/* =====================================
          HERO
          ===================================== */}

      <section className="suite-hero">

        <div className="hero-code">
          {"<pretty-nerd-mode />"}
        </div>

        <h1 className="hero-title">
          THE
          <span>SLAYLIST</span>
          SUITE
        </h1>

        <p className="hero-tagline">
          BOOKS ✦ BRAINS ✦ BAD DECISIONS ✦ ON REPEAT
        </p>

        <div className="hero-status">
          <span className="status-dot" />

          {suiteCopy.libraryOnline}
        </div>

      </section>


      {/* =====================================
          GREETING
          ===================================== */}

      <section className="suite-section">

        <p className="eyebrow">
          READER PROFILE // ACTIVE
        </p>

        <h2 className="section-title">
          {suiteCopy.greeting}
        </h2>

        <p className="section-copy">
          {suiteCopy.greetingSubtext}
        </p>

      </section>


      {/* =====================================
          QUICK STATS
          ===================================== */}

      <section className="quick-stats">

        <article className="stat-card glass-pink">
          <span className="stat-label">
            SLAYBASE
          </span>

          <strong className="stat-number">
            2,507
          </strong>

          <span className="stat-detail">
            TOTAL RECORDS
          </span>
        </article>


        <article className="stat-card glass-violet">
          <span className="stat-label">
            TBR
          </span>

          <strong className="stat-number">
            2,115
          </strong>

          <span className="stat-detail">
            STATUS: CRITICAL
          </span>
        </article>


        <article className="stat-card glass-ice">
          <span className="stat-label">
            CURRENT ROTATION
          </span>

          <strong className="stat-number">
            04
          </strong>

          <span className="stat-detail">
            BOOKS ACTIVE
          </span>
        </article>


        <article className="stat-card glass-mixed">
          <span className="stat-label">
            CERTIFIED SLAYS
          </span>

          <strong className="stat-number">
            52
          </strong>

          <span className="stat-detail">
            ELITE STATUS
          </span>
        </article>

      </section>


      {/* =====================================
          CURRENT ROTATION
          ===================================== */}

        <CurrentRotation />

        <ReadingDashboard />

      {/* =====================================
          EXPLORE THE SUITE
          ===================================== */}

      <section className="suite-section">

        <p className="eyebrow">
          SELECT YOUR DESTINATION
        </p>

        <h2 className="section-title">
          Explore the Suite
        </h2>

        <div className="explore-grid">

          <Link
            href="/slaybase"
            className="explore-card glass-pink"
          >
            <span className="explore-icon">
              📚
            </span>

            <h3>
              The Slaybase
            </h3>

            <p>
              Every book. Every shelf. Every questionable TBR decision.
            </p>
          </Link>


          <Link
            href="/current-rotation"
            className="explore-card glass-violet"
          >
            <span className="explore-icon">
              💿
            </span>

            <h3>
              Current Rotation
            </h3>

            <p>
              What I'm reading, tracking, and currently spiraling over.
            </p>
          </Link>


          <Link
            href="/certified-slays"
            className="explore-card glass-mixed"
          >
            <span className="explore-icon">
              💗
            </span>

            <h3>
              Certified Slays
            </h3>

            <p>
              Five stars. No notes. Standards remain extremely high.
            </p>
          </Link>


          <Link
            href="/reviews"
            className="explore-card glass-ice"
          >
            <span className="explore-icon">
              🎀
            </span>

            <h3>
              Reviews
            </h3>

            <p>
              Ratings, reactions, receipts, and dramatic commentary.
            </p>
          </Link>


          <Link
            href="/readsync"
            className="explore-card glass-violet"
          >
            <span className="explore-icon">
              👯
            </span>

            <h3>
              ReadSync
            </h3>

            <p>
              Buddy reads, reading besties, and shared literary chaos.
            </p>
          </Link>


          <Link
            href="/bookwave"
            className="explore-card glass-pink"
          >
            <span className="explore-icon">
              🎧
            </span>

            <h3>
              Bookwave
            </h3>

            <p>
              Book-inspired playlists because every obsession needs a soundtrack.
            </p>
          </Link>


          <Link
            href="/reading-reports"
            className="explore-card glass-ice"
          >
            <span className="explore-icon">
              📊
            </span>

            <h3>
              Reading Reports
            </h3>

            <p>
              Monthly, quarterly, and annual reading wrap-ups.
            </p>
          </Link>


          <Link
            href="/receipts"
            className="explore-card glass-mixed"
          >
            <span className="explore-icon">
              🧬
            </span>

            <h3>
              Reading Receipts
            </h3>

            <p>
              Stats, patterns, history, and proof that the data is data-ing.
            </p>
          </Link>

        </div>

      </section>

    </main>
  );
}