/* =========================================================
   THE SLAYLIST SUITE
   Reading Types

   ReadingRecord represents ONE reading experience.
   A single book can have multiple ReadingRecords.
   ========================================================= */

import type { BookFormat } from "./book";

export type ReadingStatus =
  | "currently-reading"
  | "finished"
  | "paused"
  | "dnf";

export interface ReadingRecord {
  id: string;

  bookId: string;

  status: ReadingStatus;


  /* -------------------------
     DATES
     ------------------------- */

  startedAt?: string;

  finishedAt?: string;


  /* -------------------------
     PROGRESS
     ------------------------- */

  currentPage?: number;

  totalPages?: number;

  progressPercent?: number;


  /* -------------------------
     READING METHOD
     ------------------------- */

  format?: BookFormat;

  isReread: boolean;

  rereadNumber?: number;


  /* -------------------------
     PERSONAL RESPONSE
     ------------------------- */

  rating?: number;

  mood?: string[];

  notes?: string;


  /* -------------------------
     STATS
     ------------------------- */

  pagesRead?: number;


  /* -------------------------
     SYSTEM
     ------------------------- */

  createdAt: string;

  updatedAt: string;
}