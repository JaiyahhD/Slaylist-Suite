
import BookwaveManager from "@/components/bookwave/BookwaveManager";
import { library } from "@/lib/library";

export default function BookwavePage() {
  const books = library.map((entry) => ({
    id: entry.book.id,
    title: entry.book.title,
    authors: entry.book.authors,
    coverUrl: entry.book.coverUrl ?? null,
  }));

  return (
    <div className="bookwave-page">
      <p className="eyebrow">YOUR SOUNDTRACK STATION</p>
      <h1 className="page-title">My Bookwaves ♫</h1>

      <BookwaveManager books={books} />
    </div>
  );
}

