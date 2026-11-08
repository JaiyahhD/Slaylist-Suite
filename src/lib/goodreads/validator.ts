/* =========================================================
   THE SLAYLIST SUITE
   Goodreads Import Validator

   Audits parsed Goodreads data before it is allowed into
   Slaybase.

   This helps us verify that the transformed dataset still
   agrees with the original Goodreads export.
   ========================================================= */

import type { GoodreadsRow } from "./types";

import {
  mapGoodreadsRow,
} from "./mapper";


/* =========================================================
   VALIDATION SUMMARY
   ========================================================= */

export interface GoodreadsValidationSummary {
  totalBooks: number;

  statuses: {
    tbr: number;
    read: number;
    currentlyReading: number;
    dnf: number;
    paused: number;
    other: number;
  };

  certifiedSlays: number;

  ratedFiveStars: number;

  writtenReviews: number;

  rereadBooks: number;

  totalRecordedReads: number;

  missingIsbn13: number;

  missingPageCount: number;

  missingPublicationYear: number;

  booksWithPrivateNotes: number;

  booksWithAdditionalAuthors: number;

  uniqueGoodreadsShelves: number;

  shelfNames: string[];
}


/* =========================================================
   HELPERS
   ========================================================= */

function parseNumber(
  value?: string
): number {
  if (!value?.trim()) {
    return 0;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : 0;
}


function hasWrittenText(
  value?: string
): boolean {
  return Boolean(value?.trim());
}


function getRawShelves(
  value?: string
): string[] {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((shelf) => shelf.trim())
    .filter(Boolean);
}


/* =========================================================
   VALIDATE DATASET
   ========================================================= */

export function validateGoodreadsRows(
  rows: GoodreadsRow[]
): GoodreadsValidationSummary {
  const summary: GoodreadsValidationSummary = {
    totalBooks: rows.length,

    statuses: {
      tbr: 0,
      read: 0,
      currentlyReading: 0,
      dnf: 0,
      paused: 0,
      other: 0,
    },

    certifiedSlays: 0,

    ratedFiveStars: 0,

    writtenReviews: 0,

    rereadBooks: 0,

    totalRecordedReads: 0,

    missingIsbn13: 0,

    missingPageCount: 0,

    missingPublicationYear: 0,

    booksWithPrivateNotes: 0,

    booksWithAdditionalAuthors: 0,

    uniqueGoodreadsShelves: 0,

    shelfNames: [],
  };

  const shelfNames =
    new Set<string>();


  for (const row of rows) {
    const mapped =
      mapGoodreadsRow(row);

    /* -------------------------
       STATUS
       ------------------------- */

    switch (mapped.book.status) {
      case "tbr":
        summary.statuses.tbr++;
        break;

      case "read":
        summary.statuses.read++;
        break;

      case "currently-reading":
        summary.statuses.currentlyReading++;
        break;

      case "dnf":
        summary.statuses.dnf++;
        break;

      case "paused":
        summary.statuses.paused++;
        break;

      default:
        summary.statuses.other++;
    }


    /* -------------------------
       CERTIFIED SLAYS
       ------------------------- */

    if (mapped.book.certifiedSlay) {
      summary.certifiedSlays++;
    }


    /* -------------------------
       RATINGS
       ------------------------- */

    if (
      mapped.book.personalRating === 5
    ) {
      summary.ratedFiveStars++;
    }


    /* -------------------------
       WRITTEN REVIEWS
       ------------------------- */

    if (
      hasWrittenText(
        row["My Review"]
      )
    ) {
      summary.writtenReviews++;
    }


    /* -------------------------
       REREADS
       ------------------------- */

    const readCount =
      parseNumber(
        row["Read Count"]
      );

    if (readCount > 1) {
      summary.rereadBooks++;
    }

    summary.totalRecordedReads +=
      readCount;


    /* -------------------------
       MISSING METADATA
       ------------------------- */

    if (!mapped.book.isbn13) {
      summary.missingIsbn13++;
    }

    if (!mapped.book.pageCount) {
      summary.missingPageCount++;
    }

    if (!mapped.book.publicationDate) {
      summary.missingPublicationYear++;
    }


    /* -------------------------
       PERSONAL DATA
       ------------------------- */

    if (
      hasWrittenText(
        row["Private Notes"]
      )
    ) {
      summary.booksWithPrivateNotes++;
    }

    if (
      hasWrittenText(
        row["Additional Authors"]
      )
    ) {
      summary.booksWithAdditionalAuthors++;
    }


    /* -------------------------
       GOODREADS SHELVES
       ------------------------- */

    const rawShelves =
      getRawShelves(
        row["Bookshelves"]
      );

    for (const shelf of rawShelves) {
      shelfNames.add(shelf);
    }
  }


  summary.shelfNames =
    Array.from(shelfNames)
      .sort((a, b) =>
        a.localeCompare(b)
      );

  summary.uniqueGoodreadsShelves =
    summary.shelfNames.length;


  return summary;
}

