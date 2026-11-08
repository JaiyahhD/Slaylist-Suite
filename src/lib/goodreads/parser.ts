/* =========================================================
   THE SLAYLIST SUITE
   Goodreads CSV Parser

   Converts raw Goodreads CSV text into typed GoodreadsRow
   objects before sending them through the Suite mapper.
   ========================================================= */

import Papa from "papaparse";

import type { GoodreadsRow } from "./types";


/* =========================================================
   PARSER RESULT
   ========================================================= */

export interface GoodreadsParseResult {
  rows: GoodreadsRow[];

  errors: Papa.ParseError[];

  totalRows: number;
}


/* =========================================================
   PARSE GOODREADS CSV
   ========================================================= */

export function parseGoodreadsCsv(
  csvText: string
): GoodreadsParseResult {
  const result = Papa.parse<GoodreadsRow>(
    csvText,
    {
      header: true,

      skipEmptyLines: true,

      transformHeader: (header) =>
        header.trim(),
    }
  );

  return {
    rows: result.data,

    errors: result.errors,

    totalRows: result.data.length,
  };
}
