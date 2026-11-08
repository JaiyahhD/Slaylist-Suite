import Image from "next/image";
import Link from "next/link";

const favoriteGenres = [
  "Street Lit",
  "Thriller",
  "Fantasy",
  "YA",
  "Memoir",
  "Black Romance",
];

const favoriteTropes = [
  "Ride-or-Die",
  "Secretive Criminal",
  "Legacy Kids",
  "Found Family",
  "Arranged Marriage",
  "Surrogates",
  "Touch Her & Die",
];

const vipAuthors = [
  "Jahquel J",
  "LaDarrion Williams",
  "Holly Jackson",
  "Lauren Asher",
  "Ashley Antoinette",
];

const hallOfFame = [
  { title: "Capone", author: "Jahquel J" },
  { title: "Blood at the Root", author: "LaDarrion Williams" },
  {
    title: "A Good Girl's Guide to Murder",
    author: "Holly Jackson",
  },
  { title: "Oathbound", author: "Tracy Deonn" },
];

export default function About() {
  return (
    <main className="about-suite">

      {/* INTRO */}
      
<section className="about-hero about-hero-with-photo">

  {/* LEFT SIDE — ABOUT ME TEXT */}
  <div className="about-hero-content">

    <p className="eyebrow">
      🐆 SLAYLIST FM · THE GIRL BEHIND THE GLOSS
    </p>

    <h1>
      Meet Jaiyah <span>♡</span>
    </h1>

    <p className="about-hero-subtitle">
      Mood reader. Fictional-man collector.
      Emotionally attached and unapologetic.
    </p>

    <div className="about-hero-tags">
      <span>💿 BOOKISH IT GIRL</span>
      <span>💋 PINK GLOSS ENERGY</span>
      <span>🐆 EXPENSIVE TASTE</span>
      <span>🎧 ALWAYS ON REPEAT</span>
    </div>

    <p className="about-intro">
      Heyyy, babes! Welcome to my little corner of
      bookish luxury. I'm Jaiyah, the girl behind
      The Slaylist Suite, where books, playlists,
      fictional obsessions, and a whole lot of
      personality come together.
    </p>

    <p className="about-intro">
      I'm the kind of reader who chooses her next
      book based on her mood, gets way too attached
      to fictional characters, and believes every
      unforgettable story deserves its own soundtrack.
      Around here, reading is more than a hobby.
      It's an entire era.
    </p>

  </div>

  {/* RIGHT SIDE — TRANSPARENT PORTRAIT */}
  <div className="about-hero-photo">
    <Image
      src="/images/jaiyah-portrait.png"
      alt="Jaiyah — The Slaylist Suite"
      width={700}
      height={850}
      priority
      className="about-jaiyah-image"
    />
  </div>

</section>


      {/* READER PROFILE */}
      <section className="about-panel">
        <p className="about-track">TRACK 01 · THE MAIN CHARACTER</p>
        <h2>💋 The It-Girl Files</h2>

        <div className="about-profile-grid">
          <div>
            <small>READER TYPE</small>
            <strong>Mood Reader with Expensive Taste</strong>
          </div>
          <div>
            <small>LITERARY PERSONALITY</small>
            <strong>Emotionally Attached & Unapologetic</strong>
          </div>
          <div>
            <small>CURRENT ENERGY</small>
            <strong>Booked, Busy & Slightly Delusional</strong>
          </div>
          <div>
            <small>PERSONAL MOTTO</small>
            <strong>Stay Booked. Stay Bougie. Stay Slayin'.</strong>
          </div>
        </div>
      </section>

      {/* GENRES + TROPES */}
      <div className="about-two-col">
        <section className="about-panel">
          <p className="about-track">TRACK 02 · THE READING DNA</p>
          <h2>📚 My Literary Taste</h2>
          <p>
            My shelves have range, babes. One minute
            I'm solving a murder, the next I'm emotionally
            invested in a fictional man with questionable
            decision-making skills.
          </p>

          <h3>🎀 Favorite Genres</h3>
          <div className="about-chip-list">
            {favoriteGenres.map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>
        </section>

        <section className="about-panel">
          <p className="about-track">TRACK 03 · THE OBSESSIONS</p>
          <h2>🐆 Tropes That Get Me Every Time</h2>
          <p>
            Give me loyalty, drama, complicated love,
            found family, and characters willing to
            risk absolutely everything.
          </p>

          <div className="about-chip-list">
            {favoriteTropes.map((trope) => (
              <span key={trope}>{trope}</span>
            ))}
          </div>
        </section>
      </div>

      {/* AUTHORS */}
      <section className="about-panel">
        <p className="about-track">TRACK 04 · THE VIP LIST</p>
        <h2>💿 Authors on Heavy Rotation</h2>
        <p>
          Some authors release a book and immediately
          have my attention. These are a few names
          that stay in my literary rotation.
        </p>

        <div className="about-author-grid">
          {vipAuthors.map((author, index) => (
            <div className="about-author" key={author}>
              <span>0{index + 1}</span>
              <strong>{author}</strong>
              <small>VIP AUTHOR ♡</small>
            </div>
          ))}
        </div>
      </section>

      {/* HALL OF FAME */}
      <section className="about-panel">
        <p className="about-track">TRACK 05 · DIAMOND RECORDS</p>
        <h2>🧠 Permanent Brain Chemistry Damage</h2>
        <p>
          Some books earn five stars. Others move
          into my head, unpack their bags, and
          refuse to pay rent.
        </p>

        <div className="about-favorites-grid">
          {hallOfFame.map((book, index) => (
            <div className="about-favorite" key={book.title}>
              <span>💿 DISC 0{index + 1}</span>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <small>PERMANENTLY ON REPEAT ♡</small>
            </div>
          ))}
        </div>
      </section>

      {/* BOOKWAVE */}
      <section className="about-radio">
        <p className="about-track">TRACK 06 · THE SOUNDTRACK</p>
        <h2>🎧 Every Book Has a Vibe</h2>

        <p>
          Sometimes the soundtrack is just as important
          as the story. That's why I created Bookwave:
          a place for the playlists, moods, and songs
          that bring my reading experiences to life.
        </p>

        <Link href="/bookwave" className="about-button">
          ♫ Tune Into Bookwave
        </Link>
      </section>

      {/* CONNECT */}
      <section className="about-panel about-outro">
        <p className="about-track">BONUS TRACK · OFF THE AIR</p>
        <h2>💌 Come Hang Out, Babes!</h2>

        <p>
          Whether you're here for the recommendations,
          the playlists, the fictional men, or just
          the vibes, there's always room for another
          bookish bestie in the Suite.
        </p>

        <div className="about-links">
          <Link href="/slaybase" className="about-button">
            💿 Explore My Slaybase
          </Link>

          <Link href="/readsync" className="about-button">
            ♧ Visit ReadSync
          </Link>

          <a
            href="https://www.goodreads.com/author/show/54636770.Jaiyah_Symone"
            target="_blank"
            rel="noopener noreferrer"
            className="about-button"
          >
            ♡ My Goodreads ↗
          </a>
        </div>

        <p className="about-signature">
          Stay booked. Stay bougie. Stay slayin'.
          <br />
          xoxo, Jaiyah ♡ 🐆
        </p>
      </section>
    </main>
  );
}
