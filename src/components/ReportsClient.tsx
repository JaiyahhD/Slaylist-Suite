

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  library as goodreadsLibrary,
} from "@/lib/library";
import type { Entry } from "@/lib/library";


type Mode = "monthly" | "annual" | "all";
type ReadEntry = Entry;

const PINK = "#f35aa7";
const ROSE = "#ff9acb";
const GOLD = "#d9a777";
const COLORS = [
  "#f35aa7",
  "#d9a777",
  "#a96bdf",
  "#ff9acb",
  "#79c9db",
  "#8c5741",
];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function validDate(entry: ReadEntry) {
  const raw = entry.readingRecord?.finishedAt || "";
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function ratingOf(entry: ReadEntry) {
  const rating = entry.book.personalRating;
  return typeof rating === "number" &&
    Number.isFinite(rating) &&
    rating > 0 &&
    rating <= 5
    ? rating
    : null;
}

function number(value: number) {
  return value.toLocaleString("en-US");
}

function percent(value: number, total: number) {
  return total ? (value / total) * 100 : 0;
}

function Card({
  label,
  value,
  note,
}: {
  label: string;
  value: string | number;
  note?: string;
}) {
  return (
    <div className="rr-stat">
      <span className="rr-kicker">{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}

function Section({
  number: receipt,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rr-section">
      <div className="rr-section-heading">
        <div>
          <span className="rr-kicker">
            RECEIPT {receipt} // {eyebrow}
          </span>
          <h2>{title}</h2>
        </div>
        <span className="rr-receipt-number">
          {receipt}
        </span>
      </div>
      {children}
    </section>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rr-chart-panel">
      <div className="rr-chart-heading">
        <h3>{title}</h3>
        {subtitle && <span>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function VerticalBars({
  data,
  color = PINK,
}: {
  data: { label: string; value: number }[];
  color?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="rr-vertical-chart">
      {data.map((item) => (
        <div className="rr-vertical-item" key={item.label}>
          <span className="rr-bar-value">
            {number(item.value)}
          </span>
          <div className="rr-vertical-track">
            <div
              className="rr-vertical-fill"
              style={{
                height: `${
                  item.value
                    ? Math.max(3, (item.value / max) * 100)
                    : 0
                }%`,
                background:
                  `linear-gradient(180deg, ${ROSE}, ${color})`,
              }}
            />
          </div>
          <span className="rr-bar-label">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function HorizontalBars({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="rr-horizontal-chart">
      {data.map((item) => (
        <div className="rr-horizontal-row" key={item.label}>
          <span>{item.label}</span>
          <div className="rr-horizontal-track">
            <div
              style={{
                width: `${(item.value / max) * 100}%`,
              }}
            />
          </div>
          <strong>{number(item.value)}</strong>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const width = 760;
  const height = 260;
  const left = 42;
  const right = 18;
  const top = 25;
  const bottom = 42;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const max = Math.max(1, ...data.map((d) => d.value));
  const ceiling = Math.ceil(max / 5) * 5 || 5;

  const points = data.map((item, index) => ({
    ...item,
    x:
      left +
      (data.length <= 1
        ? plotWidth / 2
        : (index / (data.length - 1)) * plotWidth),
    y:
      top +
      plotHeight -
      (item.value / ceiling) * plotHeight,
  }));

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const area = points.length
    ? `${line} L ${points[points.length - 1].x} ${
        top + plotHeight
      } L ${points[0].x} ${top + plotHeight} Z`
    : "";

  return (
    <div className="rr-line-scroll">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={
          "Reading trend: " +
          data.map((d) => `${d.label}: ${d.value}`).join(", ")
        }
      >
        <defs>
          <linearGradient
            id="rr-line-fill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={PINK} stopOpacity=".35" />
            <stop offset="100%" stopColor={PINK} stopOpacity="0" />
          </linearGradient>
        </defs>

        {Array.from({ length: 5 }, (_, i) => {
          const y = top + (i / 4) * plotHeight;
          const value = Math.round(ceiling * (1 - i / 4));

          return (
            <g key={i}>
              <line
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#ffffff19"
                strokeDasharray="4 6"
              />
              <text
                x={left - 10}
                y={y + 4}
                textAnchor="end"
                fill="#cda7b7"
                fontSize="11"
              >
                {value}
              </text>
            </g>
          );
        })}

        {area && <path d={area} fill="url(#rr-line-fill)" />}

        {line && (
          <path
            d={line}
            fill="none"
            stroke={PINK}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {points.map((p, i) => (
          <g key={`${p.label}-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={ROSE}
              stroke="#251019"
              strokeWidth="2"
            />
            <text
              x={p.x}
              y={height - 13}
              textAnchor="middle"
              fill="#eac7d4"
              fontSize="11"
            >
              {p.label}
            </text>
            <title>
              {p.label}: {p.value} reads
            </title>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Donut({
  data,
  centerLabel = "TOTAL",
}: {
  data: { label: string; value: number }[];
  centerLabel?: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let progress = 0;

  const gradient = data
    .filter((d) => d.value > 0)
    .map((d, index) => {
      const start = progress;
      progress += percent(d.value, total);
      return `${COLORS[index % COLORS.length]} ${start}% ${progress}%`;
    })
    .join(", ");

  return (
    <div className="rr-donut-layout">
      <div
        className="rr-donut"
        style={{
          background: total
            ? `conic-gradient(${gradient})`
            : "#3a2733",
        }}
        role="img"
        aria-label={data
          .map((d) => `${d.label}: ${d.value}`)
          .join(", ")}
      >
        <div className="rr-donut-center">
          <strong>{number(total)}</strong>
          <span>{centerLabel}</span>
        </div>
      </div>

      <div className="rr-donut-legend">
        {data.map((d, index) => (
          <div key={d.label}>
            <i
              style={{
                background: COLORS[index % COLORS.length],
              }}
            />
            <span>{d.label}</span>
            <strong>{number(d.value)}</strong>
            <small>{percent(d.value, total).toFixed(1)}%</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function useLiveReadingLibrary() {
  const [library, setLibrary] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const allBooks: Entry[] = [];
        const pageSize = 1000;

        for (let from = 0; ; from += pageSize) {
          const { data, error } = await supabase
            .from("slaybase_books")
            .select("id, book_data")
            .order("id", { ascending: true })
            .range(from, from + pageSize - 1);

          if (error) throw error;

          if (cancelled) return;

          const rows = data || [];

          allBooks.push(
            ...rows.map((row) => ({
              book: row.book_data as Entry["book"],
              readingRecord: null,
            }))
          );

          if (rows.length < pageSize) break;
        }

        // Historical records are matched by stable identifiers.
        // No title-based guessing or duplicate books.
        const historicalById = new Map<string, Entry>();
        const historicalByGoodreadsId = new Map<string, Entry>();

        for (const entry of goodreadsLibrary) {
          historicalById.set(entry.book.id, entry);
          if (entry.book.goodreadsBookId) {
            historicalByGoodreadsId.set(
              String(entry.book.goodreadsBookId), entry
            );
          }
        }

        const combined = allBooks.map((entry) => {
          const book = entry.book;
          const historical = historicalById.get(book.id) ||
            (book.goodreadsBookId
              ? historicalByGoodreadsId.get(String(book.goodreadsBookId))
              : undefined);
          return {
            book,
            readingRecord: historical?.readingRecord || null,
          };
        });

        if (!cancelled) {
          setLibrary(combined);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your live reading library."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { library, loading, error };
}


export default function ReportsClient() {
  const { library, loading, error } = useLiveReadingLibrary();
  const read = useMemo(
    () => library.filter((entry) => entry.book.status === "read"),
    [library]
  );
  const certified = useMemo(
    () => library.filter((entry) => entry.book.certifiedSlay),
    [library]
  );
  const dateOf = (entry: Entry) => entry.readingRecord?.finishedAt || "";
  const now = new Date();

  const [mode, setMode] = useState<Mode>("annual");
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const datedReads = useMemo(
    () =>
      read
        .map((entry) => ({
          entry,
          date: validDate(entry),
        }))
        .filter(
          (item): item is {
            entry: ReadEntry;
            date: Date;
          } => item.date !== null
        ),
    [read]
  );

  const years = useMemo(() => {
    const found = new Set(
      datedReads.map((item) => item.date.getUTCFullYear())
    );
    found.add(now.getFullYear());

    return [...found].sort((a, b) => b - a);
  }, [datedReads]);

  const subset = useMemo(() => {
    if (mode === "all") return read;

    return datedReads
      .filter(
        ({ date }) =>
          date.getUTCFullYear() === year &&
          (mode !== "monthly" ||
            date.getUTCMonth() + 1 === month)
      )
      .map(({ entry }) => entry);
  }, [mode, year, month, datedReads]);

  const analytics = useMemo(() => {
    const rated = subset
      .map(ratingOf)
      .filter((r): r is number => r !== null);

    const pages = subset
      .map((entry) => entry.book.pageCount || 0)
      .filter((n) => n > 0);

    const ratings = Array.from({ length: 10 }, (_, i) => {
      const star = (i + 1) / 2;
      return {
        label: `${star.toFixed(1)}★`,
        value: rated.filter((r) => r === star).length,
      };
    });

    const pageRanges = [
      { label: "Under 200", value: 0 },
      { label: "200–299", value: 0 },
      { label: "300–399", value: 0 },
      { label: "400–499", value: 0 },
      { label: "500+", value: 0 },
    ];

    for (const count of pages) {
      const index =
        count < 200 ? 0 :
        count < 300 ? 1 :
        count < 400 ? 2 :
        count < 500 ? 3 : 4;

      pageRanges[index].value++;
    }

    const certifiedCount = subset.filter(
      (entry) => entry.book.certifiedSlay
    ).length;

    const fiveStars = subset.filter(
      (entry) => ratingOf(entry) === 5
    ).length;

    const both = subset.filter(
      (entry) =>
        entry.book.certifiedSlay &&
        ratingOf(entry) === 5
    ).length;

    const authorCounts = new Map<string, number>();

    for (const entry of subset.filter(
      (item) => item.book.certifiedSlay
    )) {
      for (const author of entry.book.authors || []) {
        authorCounts.set(
          author,
          (authorCounts.get(author) || 0) + 1
        );
      }
    }

    const topAuthors = [...authorCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    return {
      rated,
      ratings,
      pages,
      pageRanges,
      totalPages: pages.reduce((a, b) => a + b, 0),
      avgRating: rated.length
        ? (
            rated.reduce((a, b) => a + b, 0) /
            rated.length
          ).toFixed(2)
        : "—",
      avgPages: pages.length
        ? Math.round(
            pages.reduce((a, b) => a + b, 0) /
            pages.length
          )
        : 0,
      certifiedCount,
      fiveStars,
      both,
      topAuthors,
    };
  }, [subset]);

  const yearly = useMemo(
    () =>
      [...years].reverse().map((y) => ({
        label: String(y),
        value: datedReads.filter(
          (item) => item.date.getUTCFullYear() === y
        ).length,
      })),
    [datedReads, years]
  );

  const monthly = useMemo(
    () =>
      MONTHS.map((label, index) => ({
        label,
        value: datedReads.filter(
          (item) =>
            item.date.getUTCFullYear() === year &&
            item.date.getUTCMonth() === index
        ).length,
      })),
    [datedReads, year]
  );

  const statusData = useMemo(() => {
    const statuses = [
      { label: "Read", value: 0 },
      { label: "TBR", value: 0 },
      { label: "Current", value: 0 },
      { label: "DNF", value: 0 },
      { label: "Other", value: 0 },
    ];

    for (const entry of library) {
      const status = entry.book.status;
      const index =
        status === "read" ? 0 :
        status === "tbr" ? 1 :
        status === "currently-reading" ? 2 :
        status === "dnf" ? 3 : 4;

      statuses[index].value++;
    }

    return statuses.filter((s) => s.value > 0);
  }, [library]);

  const history = useMemo(
    () =>
      [...subset]
        .sort(
          (a, b) =>
            (validDate(b)?.getTime() || 0) -
            (validDate(a)?.getTime() || 0)
        )
        .slice(0, 20),
    [subset]
  );

  const currentYear = mode === "all"
    ? "All Years"
    : String(year);

  return (
    <div className="rr-dashboard">
      <style>{`
        .rr-dashboard {
          --rr-pink: #f35aa7;
          --rr-rose: #ff9acb;
          --rr-gold: #d9a777;
          color: #fff0ed;
          padding-bottom: 45px;
        }
        .rr-dashboard * { box-sizing: border-box; }
        .rr-hero {
          padding: 36px;
          border: 1px solid #a5687866;
          border-radius: 24px;
          background:
            radial-gradient(ellipse at top right, #68223d70, transparent 55%),
            linear-gradient(135deg, #2a151d, #140d15);
          margin-bottom: 24px;
        }
        .rr-kicker {
          color: var(--rr-rose);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .rr-hero h1 {
          font-family: Georgia, serif;
          font-size: clamp(38px, 5vw, 66px);
          margin: 12px 0;
          line-height: 1.05;
        }
        .rr-hero h1 span { color: var(--rr-pink); }
        .rr-hero p {
          max-width: 700px;
          line-height: 1.7;
          color: #e0bcc8;
        }
        .rr-controls {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 28px;
        }
        .rr-tabs {
          display: flex;
          gap: 5px;
          padding: 5px;
          background: #120b10;
          border: 1px solid #704257;
          border-radius: 12px;
          flex-wrap: wrap;
        }
        .rr-tabs button {
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #f4d6e2;
          padding: 11px 16px;
          cursor: pointer;
          font-weight: 700;
        }
        .rr-tabs button.active {
          background: var(--rr-pink);
          color: #240d17;
        }
        .rr-controls select {
          background: #20121b;
          color: #ffe3ee;
          border: 1px solid #87506a;
          border-radius: 10px;
          padding: 12px;
          min-width: 110px;
        }
        .rr-section {
          padding: clamp(18px, 3vw, 32px);
          border: 1px solid #8d586155;
          border-radius: 22px;
          background:
            linear-gradient(140deg, #261620f5, #130d15f8);
          margin-bottom: 22px;
          box-shadow: 0 12px 35px #00000025;
        }
        .rr-section-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 25px;
        }
        .rr-section h2 {
          font-family: Georgia, serif;
          font-size: clamp(26px, 3vw, 38px);
          margin: 6px 0 0;
        }
        .rr-receipt-number {
          color: #e5a2be;
          font-family: Georgia, serif;
          font-size: 32px;
          opacity: .45;
        }
        .rr-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .rr-stat {
          min-width: 0;
          padding: 21px;
          border: 1px solid #a25d7966;
          border-radius: 15px;
          background:
            linear-gradient(145deg, #482035, #251721 65%, #34201c);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rr-stat strong {
          color: #fff4ee;
          font-size: clamp(25px, 3vw, 35px);
          font-family: Georgia, serif;
          line-height: 1.1;
          overflow-wrap: anywhere;
        }
        .rr-stat small {
          color: #cfaeb9;
          line-height: 1.4;
        }
        .rr-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .rr-chart-panel {
          min-width: 0;
          padding: 22px;
          border: 1px solid #85506566;
          border-radius: 17px;
          background: #170f19ed;
        }
        .rr-chart-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 20px;
        }
        .rr-chart-heading h3 {
          font-family: Georgia, serif;
          font-size: 21px;
          margin: 0;
        }
        .rr-chart-heading span {
          color: #dba2b9;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-align: right;
        }
        .rr-vertical-chart {
          display: flex;
          align-items: stretch;
          justify-content: space-around;
          gap: 8px;
          height: 250px;
          padding-top: 8px;
        }
        .rr-vertical-item {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
        }
        .rr-bar-value {
          color: #ffe1ed;
          font-size: 12px;
          font-weight: 800;
        }
        .rr-vertical-track {
          width: min(100%, 44px);
          flex: 1;
          display: flex;
          align-items: flex-end;
          border-radius: 7px 7px 0 0;
          background: #ffffff0a;
          overflow: hidden;
        }
        .rr-vertical-fill {
          width: 100%;
          border-radius: 7px 7px 0 0;
          min-height: 0;
        }
        .rr-bar-label {
          font-size: 10px;
          color: #dfc0cd;
          text-align: center;
          white-space: nowrap;
        }
        .rr-horizontal-chart {
          display: grid;
          gap: 15px;
        }
        .rr-horizontal-row {
          display: grid;
          grid-template-columns: minmax(85px, 1fr) 3fr 38px;
          align-items: center;
          gap: 12px;
          font-size: 12px;
        }
        .rr-horizontal-row > span {
          overflow-wrap: anywhere;
        }
        .rr-horizontal-row strong {
          text-align: right;
          color: var(--rr-rose);
        }
        .rr-horizontal-track {
          height: 10px;
          background: #ffffff14;
          border-radius: 20px;
          overflow: hidden;
        }
        .rr-horizontal-track > div {
          height: 100%;
          border-radius: 20px;
          background: linear-gradient(90deg, #f35aa7, #d9a777);
        }
        .rr-line-scroll {
          overflow-x: auto;
        }
        .rr-line-scroll svg {
          width: 100%;
          min-width: 400px;
          height: auto;
        }
        .rr-donut-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
        }
        .rr-donut {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .rr-donut-center {
          width: 132px;
          height: 132px;
          border-radius: 50%;
          background: #170f19;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }
        .rr-donut-center strong {
          font-size: 30px;
          font-family: Georgia, serif;
        }
        .rr-donut-center span {
          color: #d8a9bd;
          font-size: 10px;
          letter-spacing: 1px;
        }
        .rr-donut-legend {
          display: grid;
          gap: 12px;
          flex: 1;
          min-width: 170px;
        }
        .rr-donut-legend > div {
          display: grid;
          grid-template-columns: 10px minmax(0, 1fr) auto auto;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }
        .rr-donut-legend i {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .rr-donut-legend small { color: #c69aac; }
        .rr-note {
          color: #cfaebb;
          font-size: 12px;
          line-height: 1.8;
          margin-top: 16px;
        }
        .rr-history {
          display: grid;
          gap: 8px;
          max-height: 370px;
          overflow-y: auto;
        }
        .rr-history a {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: 1px solid #794b5b55;
          border-radius: 9px;
          color: #ffe3ed;
          text-decoration: none;
          background: #ffffff05;
        }
        .rr-history a:hover {
          border-color: var(--rr-pink);
          background: #f35aa712;
        }
        .rr-history small {
          color: #d7a6bb;
          white-space: nowrap;
        }
        .rr-empty {
          color: #d5aebe;
          padding: 25px;
          text-align: center;
        }
        .rr-progress {
          height: 14px;
          border-radius: 30px;
          background: #ffffff14;
          overflow: hidden;
          margin: 15px 0;
        }
        .rr-progress div {
          height: 100%;
          background: linear-gradient(90deg, #f35aa7, #d9a777);
          border-radius: inherit;
        }
        @media (max-width: 900px) {
          .rr-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .rr-hero { padding: 22px; }
          .rr-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rr-stat { padding: 14px; }
          .rr-vertical-chart { gap: 3px; }
          .rr-bar-label { font-size: 9px; }
          .rr-chart-panel { padding: 15px; }
          .rr-horizontal-row {
            grid-template-columns: 80px minmax(0, 1fr) 28px;
            gap: 7px;
          }
          .rr-history a {
            flex-direction: column;
          }
        }
      `}</style>

      <header className="rr-hero">
        <span className="rr-kicker">
          THE SLAYLIST SUITE // ANALYTICS
        </span>
        <h1>
          Reading <span>Receipts.</span>
        </h1>
        <p>
          Because apparently reading thousands of pages and
          emotionally attaching myself to fictional people
          requires documentation.
        </p>

        <div className="rr-controls">
          <div className="rr-tabs">
            {(
              [
                ["monthly", "Monthly"],
                ["annual", "Annually"],
                ["all", "All Time"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={mode === key ? "active" : ""}
                onClick={() => setMode(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {mode !== "all" && (
            <select
              aria-label="Select report year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>
          )}

          {mode === "monthly" && (
            <select
              aria-label="Select report month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTHS.map((name, i) => (
                <option value={i + 1} key={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>

      {loading && <p className="rr-note" role="status">💗 Gathering your latest Reading Receipts...</p>}
      {error && <p className="rr-empty" role="alert">Could not load Reading Receipts: {error}</p>}
      {!loading && !error && <>
      <Section
        number="001"
        eyebrow="THE LIBRARY"
        title="Library Snapshot"
      >
        <div className="rr-stats">
          <Card
            label="Total Library"
            value={number(library.length)}
            note="Saved Slaybase books"
          />
          <Card
            label="Books Read"
            value={number(read.length)}
            note="Unique read entries"
          />
          <Card
            label="Certified Slays"
            value={number(certified.length)}
            note="The crown is earned"
          />
          <Card
            label="Dated Reads"
            value={number(datedReads.length)}
            note="Known completion dates"
          />
        </div>

        <div className="rr-grid">
          <ChartPanel
            title="The Shelf Breakdown"
            subtitle="Reading status"
          >
            <Donut
              data={statusData}
              centerLabel="BOOKS"
            />
          </ChartPanel>

          <ChartPanel
            title="The Reading Archive"
            subtitle="Selected period"
          >
            <div className="rr-stats">
              <Card
                label="Finished"
                value={number(subset.length)}
              />
              <Card
                label="Known Pages"
                value={number(analytics.totalPages)}
              />
            </div>
            <p className="rr-note">
              {mode === "all"
                ? "All-time saved read books."
                : `Showing dated reads for ${
                    mode === "monthly"
                      ? MONTHS[month - 1] + " "
                      : ""
                  }${currentYear}.`}
            </p>
          </ChartPanel>
        </div>
      </Section>

      <Section
        number="002"
        eyebrow="LIFETIME"
        title="The Evidence"
      >
        <div className="rr-stats">
          <Card
            label="Books Finished"
            value={number(subset.length)}
            note="Selected reporting period"
          />
          <Card
            label="Known Pages"
            value={number(analytics.totalPages)}
            note={`${analytics.pages.length} books with page data`}
          />
          <Card
            label="Average Rating"
            value={analytics.avgRating}
            note={`${analytics.rated.length} rated books`}
          />
          <Card
            label="5-Star Reads"
            value={analytics.fiveStars}
            note="Rated exactly five stars"
          />
          <Card
            label="Certified Slays"
            value={analytics.certifiedCount}
            note="Personally crowned"
          />
        </div>
      </Section>

      <Section
        number="003"
        eyebrow="TIMELINE"
        title="Reading Timeline"
      >
        <div className="rr-grid">
          <ChartPanel
            title="Reads by Year"
            subtitle="Line graph"
          >
            <LineChart data={yearly} />
          </ChartPanel>

          <ChartPanel
            title={`${year} by Month`}
            subtitle="Monthly output"
          >
            <VerticalBars data={monthly} />
          </ChartPanel>
        </div>

        <p className="rr-note">
          Timeline charts use only reads with recorded
          completion dates. Undated historical reads are
          not assigned an invented month or year.
        </p>
      </Section>

      <Section
        number="004"
        eyebrow="RATINGS"
        title="Rating Distribution"
      >
        <div className="rr-stats">
          <Card
            label="Average"
            value={analytics.avgRating}
            note="Out of 5"
          />
          <Card
            label="Rated Books"
            value={analytics.rated.length}
          />
          <Card
            label="4★ or Higher"
            value={`${percent(
              analytics.rated.filter((r) => r >= 4).length,
              analytics.rated.length
            ).toFixed(1)}%`}
          />
          <Card
            label="Perfect 5★"
            value={analytics.fiveStars}
          />
        </div>

        <ChartPanel
          title="The Rating Curve"
          subtitle="0.5–5.0 star scale"
        >
          <VerticalBars
            data={analytics.ratings}
          />
        </ChartPanel>

        <p className="rr-note">
          Half-star values are supported. Historical Goodreads
          ratings may contain only whole stars.
        </p>
      </Section>

      <Section
        number="005"
        eyebrow="PAGES"
        title="Page Analytics"
      >
        <div className="rr-stats">
          <Card
            label="Known Pages"
            value={number(analytics.totalPages)}
          />
          <Card
            label="Average Length"
            value={number(analytics.avgPages)}
            note="Pages per book with known length"
          />
          <Card
            label="Shortest"
            value={
              analytics.pages.length
                ? Math.min(...analytics.pages)
                : "—"
            }
            note="Pages"
          />
          <Card
            label="Longest"
            value={
              analytics.pages.length
                ? Math.max(...analytics.pages)
                : "—"
            }
            note="Pages"
          />
        </div>

        <div className="rr-grid">
          <ChartPanel
            title="Where the Books Live"
            subtitle="Page length donut"
          >
            <Donut
              data={analytics.pageRanges}
              centerLabel="BOOKS"
            />
          </ChartPanel>

          <ChartPanel
            title="Length Distribution"
            subtitle="Page ranges"
          >
            <HorizontalBars
              data={analytics.pageRanges}
            />
          </ChartPanel>
        </div>

        <p className="rr-note">
          Page totals use the known page count for each
          selected book. They do not multiply historical
          rereads without session-level evidence.
        </p>
      </Section>

      <Section
        number="006"
        eyebrow="THE SLAY SCIENCE"
        title="Slay Analytics"
      >
        <div className="rr-stats">
          <Card
            label="5-Star Reads"
            value={analytics.fiveStars}
          />
          <Card
            label="Certified Slays"
            value={analytics.certifiedCount}
          />
          <Card
            label="5 Stars + Certified"
            value={analytics.both}
          />
          <Card
            label="Crown Conversion"
            value={`${percent(
              analytics.both,
              analytics.fiveStars
            ).toFixed(1)}%`}
          />
        </div>

        <div className="rr-grid">
          <ChartPanel
            title="The Slay Gap"
            subtitle="Rating vs. crown"
          >
            <Donut
              data={[
                {
                  label: "5★ + Certified",
                  value: analytics.both,
                },
                {
                  label: "5★ Not Certified",
                  value: Math.max(
                    0,
                    analytics.fiveStars - analytics.both
                  ),
                },
              ]}
              centerLabel="5★ READS"
            />
          </ChartPanel>

          <ChartPanel
            title="Crown Conversion"
            subtitle="The slay standard"
          >
            <span className="rr-kicker">
              5-star reads that earned the crown
            </span>
            <h3
              style={{
                fontSize: 45,
                margin: "15px 0 5px",
                color: ROSE,
              }}
            >
              {percent(
                analytics.both,
                analytics.fiveStars
              ).toFixed(1)}%
            </h3>
            <div className="rr-progress">
              <div
                style={{
                  width: `${percent(
                    analytics.both,
                    analytics.fiveStars
                  )}%`,
                }}
              />
            </div>
            <p className="rr-note">
              Five stars means a book earned the rating.
              Certified Slay means it earned the crown.
              They remain separate decisions.
            </p>
          </ChartPanel>
        </div>
      </Section>

      <Section
        number="007"
        eyebrow="AUTHOR DNA"
        title="Your Slay Profile"
      >
        <ChartPanel
          title="Who Keeps Earning the Crown?"
          subtitle="Top certified authors"
        >
          {analytics.topAuthors.length ? (
            <HorizontalBars
              data={analytics.topAuthors}
            />
          ) : (
            <p className="rr-empty">
              No crowned authors for this period.
            </p>
          )}
        </ChartPanel>
      </Section>

      <Section
        number="008"
        eyebrow="THE LAB"
        title="Brain Chemistry"
      >
        <div className="rr-chart-panel">
          <span className="rr-kicker">
            THE BOOKS THAT ALTERED THE FORMULA
          </span>
          <h3 style={{ marginTop: 12 }}>
            🧪 The Lab Is Ready
          </h3>
          <p className="rr-note">
            Books marked as Brain Chemistry in your Slaybase:
            {" "}{library.filter((entry) => entry.book.brainChemistry).length}.
            This distinction is read directly from your saved book metadata.
            Session-specific reactions are not yet connected.
          </p>
        </div>
      </Section>

      <Section
        number="009"
        eyebrow="THE ARCHIVE"
        title="Reading History"
      >
        <ChartPanel
          title="The Latest Chapters"
          subtitle={`${subset.length} selected books`}
        >
          {history.length ? (
            <div className="rr-history">
              {history.map((entry) => (
                <Link
                  key={entry.book.id}
                  href={`/slaybase/${encodeURIComponent(
                    entry.book.id
                  )}`}
                >
                  <span>{entry.book.title}</span>
                  <small>
                    {dateOf(entry) || "Date unavailable"}
                  </small>
                </Link>
              ))}
            </div>
          ) : (
            <p className="rr-empty">
              No completed reads recorded for this period.
            </p>
          )}
        </ChartPanel>
      </Section>

      <p className="rr-note">
        ✦ DATA LAB NOTE: Book metadata comes from your saved Supabase Slaybase.
        Historical completion dates are retained only where stable book IDs match
        the Goodreads import. New reading sessions, rereads, and Bookwaves are
        not yet connected to this dashboard.
      </p>
      </>}
    </div>
  );
}
