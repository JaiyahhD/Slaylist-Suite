
import Link from "next/link";
import Image from "next/image";
import LiveCurrentRotation from "@/components/LiveCurrentRotation";
import { read, current, certified, tbr } from "@/lib/library";

export default function Home() {
  const mixes = [
    {
      href: "/slaybase#current-rotation",
      name: "Current Rotation",
      sub: "What's playing right now",
    },
    {
      href: "/slaybase?status=tbr",
      name: "The TBR",
      sub: "Books I'm eyeing",
    },
    {
      href: "/slaybase?filter=certified",
      name: "Certified Slays",
      sub: "My elite favorites",
    },
    {
      href: "/reports",
      name: "Reading Reports",
      sub: "The stats and receipts",
    },
  ];

  return (
    <>
      {/* HOMEPAGE BANNER */}
      <section className="suite-hero">
        <Image
          src="/images/leopard-slaylist.png"
          alt="Jaiyah's Slaylist Suite — books, playlists, vibes, and obsessions"
          width={1648}
          height={928}
          priority
          sizes="(max-width: 768px) 100vw, 85vw"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
        />
      </section>

      {/* WELCOME */}
      <div className="heading">
        <h2>Welcome to The Suite ♡</h2>
        <Link href="/about">Meet the host ›</Link>
      </div>

      {/* READING STATISTICS */}
      <div className="stats">
        <div className="stat">
          <b>{read.length}</b>
          <small>Books Read</small>
        </div>

        <div className="stat">
          <b>{tbr.length}</b>
          <small>On My TBR</small>
        </div>

        <div className="stat">
          <b>{certified.length}</b>
          <small>Certified Slays</small>
        </div>

        <div className="stat">
          <b>{current.length}</b>
          <small>Now Reading</small>
        </div>
      </div>

      {/* CURRENT ROTATION + BOOKWAVE */}
      <div className="two-col">
        <section className="rotation-home-section">
          <div className="heading">
            <h2>▶ Continue Reading</h2>
            <Link href="/slaybase#current-rotation">
              View rotation ›
            </Link>
          </div>

          <LiveCurrentRotation />
        </section>

        <aside>
          <div className="heading">
            <h2>◉ On Repeat ♫</h2>
            <Link href="/bookwave">Bookwave ›</Link>
          </div>

          <div className="panel">
            <p className="muted">
              Every good book deserves a soundtrack.
            </p>

            <div className="mini-list">
              <Link href="/bookwave">♫ Bookwave Radio</Link>
              <Link href="/bookwave">♡ Reading Vibes</Link>
              <Link href="/bookwave">✦ Book Soundtracks</Link>
            </div>
          </div>
        </aside>
      </div>

      {/* SLAYLIST MIXES */}
      <div className="heading">
        <h2>▶ Your Slaylist Mixes</h2>
      </div>

      <div className="tiles">
        {mixes.map((mix) => (
          <Link
            className="tile"
            href={mix.href}
            key={mix.name}
          >
            <span>💿</span>
            <b>{mix.name}</b>
            <small>{mix.sub}</small>
          </Link>
        ))}
      </div>
    </>
  );
}
