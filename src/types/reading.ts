/* =========================================================
   THE SLAYLIST SUITE
   Reading Types

   A ReadingRecord represents one reading experience/session
   for a Book.

   One Book can have multiple ReadingRecords, which allows
   rereads to remain separate instead of overwriting history.
   ========================================================= */

export type ReadingRecordStatus =
  | "planned"
  | "currently-reading"
  | "paused"
  | "completed"
  | "dnf";

export type ReadingMethod =
  | "physical"
  | "ebook"
  | "audiobook";

export interface ReadingProgressEntry {
  /* -------------------------
     IDENTITY
     ------------------------- */

  id: string;

  readingRecordId: string;


  /* -------------------------
     PROGRESS
     ------------------------- */

  page?: number;

  percentage?: number;

  minutesListened?: number;


  /* -------------------------
     REACTION / NOTES
     ------------------------- */

  note?: string;

  mood?: string;


  /* -------------------------
     SYSTEM
     ------------------------- */

  recordedAt: string;
}


export interface ReadingRecord {
  /* -------------------------
     IDENTITY
     ------------------------- */

  id: string;

  bookId: string;


  /* -------------------------
     READING STATUS
     ------------------------- */

  status: ReadingRecordStatus;

  readingMethod?: ReadingMethod;


  /* -------------------------
     READING DATES
     ------------------------- */

  startedAt?: string;

  finishedAt?: string;


  /* -------------------------
     CURRENT PROGRESS
     ------------------------- */

  currentPage?: number;

  progressPercent?: number;


  /* -------------------------
     READING RESULT
     ------------------------- */

  rating?: number;

  reviewId?: string;

  certifiedSlay: boolean;


  /* -------------------------
     REREAD DATA
     ------------------------- */

  readingNumber: number;

  isReread: boolean;


  /* -------------------------
     READING CONTEXT
     ------------------------- */

  readSyncId?: string;

  notes?: string;


  /* -------------------------
     PROGRESS HISTORY
     ------------------------- */

  progressEntries: ReadingProgressEntry[];


  /* -------------------------
     SYSTEM
     ------------------------- */

  createdAt: string;

  updatedAt: string;
}