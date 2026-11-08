
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import BookEditor from "@/components/BookEditor";
import type { Entry } from "@/lib/library";

type BookDetails = Entry["book"] & {
  description?: string;
  genres?: string[];
  tropes?: string[];
  tags?: string[];
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetails({ params }: Props) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const { data, error } = await supabase
    .from("slaybase_books")
    .select("owner_id, book_data")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const book = data.book_data as BookDetails;

  const statusLabels: Record<string, string> = {
    read: "Completed",
    tbr: "Want to Read",
    "currently-reading": "Currently Reading",
    paused: "Paused",
    dnf: "Did Not Finish",
  };

  function renderChips(
    heading: string,
    items: string[] | undefined,
    parameter: string
  ) {
    if (!items?.length) return null;

    return (
      <div style={{ marginTop: 24 }}>
        <h3>{heading}</h3>

        <div className="slay-chip-list">
          {items.map((item) => (
            <Link
              key={item}
              className="slay-chip"
              href={`/slaybase?${parameter}=${encodeURIComponent(item)}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <Link href="/slaybase" className="muted">
        ← Back to The Slaybase
      </Link>

      <section style={{ marginTop: 32 }}>
        <p className="eyebrow">
          SLAYBASE · BACKSTAGE PASS
        </p>

        <h1 className="page-title">
          {book.title}
        </h1>

        <p className="muted">
          {(book.authors || []).join(", ")}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            marginTop: 28,
            alignItems: "flex-start",
          }}
        >
          <div
            className="book-cover"
            style={{
              width: 200,
              minHeight: 280,
            }}
          >
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
              />
            ) : (
              book.title
            )}
          </div>

          <div style={{ flex: "1 1 280px" }}>
            <h2>💿 The Book File</h2>

            <p>
              <strong>Status:</strong>{" "}
              {statusLabels[book.status] || book.status}
            </p>

            {book.personalRating != null && (
              <p>
                <strong>My Rating:</strong>{" "}
                {book.personalRating} / 5 ★
              </p>
            )}

            {book.certifiedSlay && (
              <p className="pill">
                ★ CERTIFIED SLAY
              </p>
            )}

            {book.brainChemistry && (
              <p>
                💗 Altered My Brain Chemistry
              </p>
            )}

            {book.favorite && (
              <p>
                ♡ Forever Favorite
              </p>
            )}

            {book.description && (
              <div style={{ marginTop: 24 }}>
                <h3>About This Book</h3>

                <p style={{ whiteSpace: "pre-wrap" }}>
                  {book.description}
                </p>
              </div>
            )}

            {renderChips(
              "Genres",
              book.genres,
              "genre"
            )}

            {renderChips(
              "Tropes",
              book.tropes,
              "trope"
            )}

            {renderChips(
              "Custom Tags",
              book.tags,
              "tag"
            )}
          </div>
        </div>

        {/* OWNER-ONLY BOOK EDITOR */}
        <BookEditor
          initialBook={book}
          ownerId={data.owner_id}
        />
      </section>
    </>
  );
}
