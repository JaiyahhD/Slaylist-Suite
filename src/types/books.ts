/* =========================================================
   THE SLAYLIST SUITE
   Book Types

   A Book represents the title itself in Slaybase.
   Reading history/progress lives separately in ReadingRecord.
   ========================================================= */

export type BookFormat =
  | "physical"
  | "ebook"
  | "audiobook";

export type OwnershipStatus =
  | "owned"
  | "borrowed"
  | "kindle-unlimited"
  | "library"
  | "not-owned";

export type LibraryStatus =
  | "tbr"
  | "currently-reading"
  | "read"
  | "paused"
  | "dnf";

export interface Book {
  /* -------------------------
     IDENTITY
     ------------------------- */

  id: string;

  title: string;

  subtitle?: string;

  authors: string[];

  series?: {
    name: string;
    number?: number;
  };

  description?: string;


  /* -------------------------
     BOOK METADATA
     ------------------------- */

  isbn10?: string;

  isbn13?: string;

  pageCount?: number;

  publicationDate?: string;

  publisher?: string;

  coverUrl?: string;

  language?: string;


  /* -------------------------
     SLAYBASE ORGANIZATION
     ------------------------- */

  status: LibraryStatus;

 genreIds: string[];

tropeIds: string[];

tagIds: string[];

shelfIds: string[];


  /* -------------------------
     FORMATS + OWNERSHIP
     ------------------------- */

  formats: BookFormat[];

  ownership: OwnershipStatus[];

  primaryFormat?: BookFormat;


  /* -------------------------
     PERSONAL BOOK DATA
     ------------------------- */

  personalRating?: number;

  certifiedSlay: boolean;

  brainChemistry: boolean;

  favorite: boolean;

  privateNotes?: string;


  /* -------------------------
     SOURCE / IMPORT DATA
     ------------------------- */

  goodreadsBookId?: string;

  goodreadsAverageRating?: number;

  dateAdded?: string;

  source?: "goodreads" | "manual" | "other";


  /* -------------------------
     SYSTEM
     ------------------------- */

  createdAt: string;

  updatedAt: string;
}