
import Link from "next/link";
import type { Entry } from "@/lib/library";

export default function BookCard({ entry }: { entry: Entry }) {
  const b = entry.book;

  return (
    <Link
      href={`/slaybase/${encodeURIComponent(b.id)}`}
      className="book-card"
      style={{
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
      }}
      aria-label={`View details for ${b.title}`}
    >
      <div className="book-cover">
        {b.coverUrl ? (
          <img src={b.coverUrl} alt={b.title} loading="lazy" />
        ) : (
          b.title
        )}
      </div>

      <strong title={b.title}>{b.title}</strong>

      <small>{(b.authors || []).join(", ")}</small>

      {b.certifiedSlay && (
        <span className="pill">★ CERTIFIED SLAY</span>
      )}
    </Link>
  );
}
