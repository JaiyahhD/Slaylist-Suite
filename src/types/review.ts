/* =========================================================
   THE SLAYLIST SUITE
   Review Types
   ========================================================= */

export interface Review {
  id: string;

  bookId: string;

  readingRecordId?: string;

  rating: number;

  title?: string;

  body: string;

  containsSpoilers: boolean;

  favoriteQuote?: string;

  reaction?: string;

  createdAt: string;

  updatedAt: string;
}