
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "The Suite", icon: "⌂" },
  { href: "/slaybase", label: "The Slaybase", icon: "▦" },
  { href: "/about", label: "About Me", icon: "♡" },
  { href: "/readsync", label: "ReadSync", icon: "♧" },
  { href: "/bookwave", label: "Bookwave", icon: "♫" },
  { href: "/reports", label: "Reading Reports", icon: "▥" },
];

export default function Shell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);

  const closeMenu = () => setMenu(false);

  return (
    <>
      <header className="top">
        <button
          type="button"
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label="Toggle navigation"
          aria-expanded={menu}
        >
          ☰
        </button>

        <div className="slay-top-brand">
          <span>✦</span> THE LEOPARD ERA <span>✦</span>
        </div>

        <Link href="/about" className="profile">
          ♡ Jaiyah ♡
        </Link>
      </header>

      <aside className={`side ${menu ? "show" : ""}`}>
        <Link
          className="brand"
          href="/"
          onClick={closeMenu}
        >
          <span className="brand-disc">◉</span>

          <span>
            THE SLAYLIST
            <br />
            SUITE™
            <small>SLAYLIST FM ♫</small>
          </span>
        </Link>

        <p className="side-label">YOUR STATION</p>

        <nav>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={path === link.href ? "active" : ""}
              onClick={closeMenu}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="side-label">MY LIBRARY</p>

        <nav className="secondary">
          <Link
            href="/slaybase?filter=certified"
            onClick={closeMenu}
          >
            ★ Certified Slays
          </Link>

          <Link
            href="/slaybase?status=tbr"
            onClick={closeMenu}
          >
            ♡ Want to Read
          </Link>

          <Link
            href="/slaybase?status=read"
            onClick={closeMenu}
          >
            ✓ Completed
          </Link>
        </nav>

        <nav className="secondary">
          <Link href="/admin" onClick={closeMenu}>
            ♡ Admin Sign In
          </Link>
        </nav>

        <div className="side-promo">
          <span className="slay-promo-paw">🐾</span>
          <strong>SLAYLIST FM</strong>
          <small>Books · Playlists · Obsessions</small>
        </div>
      </aside>

      <main className="content">{children}</main>

      <footer className="player">
        <span className="record">◉</span>

        <div>
          <strong>Currently Booked & Busy</strong>
          <small>Jaiyah’s current rotation</small>
        </div>

        <Link
          href="/slaybase#current-rotation"
          className="play"
          aria-label="View current reading rotation"
        >
          ▶
        </Link>

        <div className="player-track">
          <span />
        </div>

        <span className="player-label">
          READING MODE ♡
        </span>
      </footer>
    </>
  );
}
