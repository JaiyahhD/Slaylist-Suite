import Link from "next/link";

export default function ReadingDashboard() {
  return (
    <section className="suite-section reading-dashboard-section">

      <div className="dashboard-heading">
        <p className="eyebrow">
          THE NUMBERS ARE NUMBERS-ING
        </p>

        <h2 className="section-title">
          Reading Dashboard
        </h2>

        <p className="section-copy">
          Goals, elite reads, and the increasingly concerning state
          of my TBR.
        </p>
      </div>

      <div className="reading-dashboard-grid">

        {/* =========================
            READING GOAL
            ========================= */}

        <article className="dashboard-card goal-card">
          <div className="dashboard-card-top">
            <div>
              <span className="dashboard-kicker">
                2026 READING GOAL
              </span>

              <h3>Reading Goal</h3>
            </div>

            <span className="dashboard-symbol">
              ✦
            </span>
          </div>

          <div className="goal-display">
            <div className="goal-ring">
              <div className="goal-ring-inner">
                <strong>64%</strong>
                <span>COMPLETE</span>
              </div>
            </div>

            <div className="goal-numbers">
              <strong>
                64
                <span>/100</span>
              </strong>

              <p>books read this year</p>
            </div>
          </div>

          <div className="goal-progress-track">
            <div
              className="goal-progress-fill"
              style={{ width: "64%" }}
            />
          </div>

          <div className="dashboard-footer">
            <span>36 BOOKS TO GO</span>
            <span>KEEP SLAYING →</span>
          </div>
        </article>


        {/* =========================
            LATEST CERTIFIED SLAY
            ========================= */}

        <article className="dashboard-card certified-card">
          <div className="dashboard-card-top">
            <div>
              <span className="dashboard-kicker">
                LATEST ENTRY
              </span>

              <h3>Certified Slay</h3>
            </div>

            <span className="dashboard-symbol">
              ★
            </span>
          </div>

          <div className="certified-content">
            <div className="mini-book-cover">
              <span>CERTIFIED</span>

              <strong>
                FIVE
                <br />
                STARS
              </strong>

              <small>★★★★★</small>
            </div>

            <div className="certified-info">
              <span className="certified-badge">
                CERTIFIED SLAY #052
              </span>

              <h4>
                Your Latest Five-Star Read
              </h4>

              <p>
                Author Name
              </p>

              <div className="star-row">
                ★★★★★
              </div>

              <span className="certified-note">
                No notes. Standards met.
              </span>
            </div>
          </div>

          <Link
            href="/certified-slays"
            className="dashboard-link"
          >
            ENTER THE HALL OF FAME →
          </Link>
        </article>


        {/* =========================
            TBR SITUATION
            ========================= */}

        <article className="dashboard-card tbr-card">
          <div className="dashboard-card-top">
            <div>
              <span className="dashboard-kicker">
                LIVE SYSTEM STATUS
              </span>

              <h3>The TBR Situation</h3>
            </div>

            <span className="dashboard-symbol">
              !
            </span>
          </div>

          <div className="tbr-number">
            2,115
          </div>

          <p className="tbr-label">
            BOOKS WAITING PATIENTLY*
          </p>

          <p className="tbr-footnote">
            *Patiently is a generous interpretation.
          </p>

          <div className="tbr-status-box">
            <div>
              <span>STATUS</span>
              <strong>CRITICAL</strong>
            </div>

            <div>
              <span>SELF CONTROL</span>
              <strong>OFFLINE</strong>
            </div>

            <div>
              <span>NEW BOOKS</span>
              <strong>INEVITABLE</strong>
            </div>
          </div>

          <Link
            href="/slaybase"
            className="dashboard-link"
          >
            INVESTIGATE THE DAMAGE →
          </Link>
        </article>

      </div>
    </section>
  );
}

// Reading Dashboard