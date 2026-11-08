
"use client";

import { useMemo, useState } from "react";

export type TagCategory = "genres" | "tropes" | "tags";

export type TagFilters = {
  genre: string;
  trope: string;
  tag: string;
};

type Props = {
  books: Array<{
    genres?: string[];
    tropes?: string[];
    tags?: string[];
  }>;
  filters: TagFilters;
  onChange: (filters: TagFilters) => void;
};

const CONFIG = [
  {
    key: "genre" as const,
    field: "genres" as const,
    label: "♡ GENRES",
    placeholder: "All Genres",
    search: "Search genres...",
  },
  {
    key: "trope" as const,
    field: "tropes" as const,
    label: "★ TROPES",
    placeholder: "All Tropes",
    search: "Search tropes...",
  },
  {
    key: "tag" as const,
    field: "tags" as const,
    label: "✦ CUSTOM TAGS",
    placeholder: "All Tags",
    search: "Search custom tags...",
  },
];

export default function SlaybaseTagFilters({
  books,
  filters,
  onChange,
}: Props) {
  const [searches, setSearches] = useState({
    genre: "",
    trope: "",
    tag: "",
  });

  const options = useMemo(() => {
    const result = {
      genre: new Set<string>(),
      trope: new Set<string>(),
      tag: new Set<string>(),
    };

    for (const book of books) {
      for (const config of CONFIG) {
        for (const value of book[config.field] || []) {
          const clean = value.trim();

          if (clean) {
            result[config.key].add(clean);
          }
        }
      }
    }

    return {
      genre: [...result.genre].sort(),
      trope: [...result.trope].sort(),
      tag: [...result.tag].sort(),
    };
  }, [books]);

  function changeFilter(
    key: keyof TagFilters,
    value: string
  ) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <>
      {CONFIG.map((config) => {
        const visible = options[config.key].filter(
          (value) =>
            value
              .toLowerCase()
              .includes(
                searches[config.key].toLowerCase()
              )
        );

        return (
          <div
            className="slaybase-filter-field slaybase-tag-field"
            key={config.key}
          >
            <label htmlFor={`slay-${config.key}-search`}>
              {config.label}
            </label>

            <input
              id={`slay-${config.key}-search`}
              type="search"
              placeholder={config.search}
              value={searches[config.key]}
              onChange={(event) =>
                setSearches((previous) => ({
                  ...previous,
                  [config.key]: event.target.value,
                }))
              }
            />

            <select
              aria-label={`Choose ${config.label}`}
              value={filters[config.key]}
              onChange={(event) =>
                changeFilter(
                  config.key,
                  event.target.value
                )
              }
            >
              <option value="">
                {config.placeholder}
              </option>

              {visible.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}

              {filters[config.key] &&
                !visible.includes(filters[config.key]) && (
                  <option value={filters[config.key]}>
                    {filters[config.key]}
                  </option>
                )}
            </select>
          </div>
        );
      })}
    </>
  );
}
