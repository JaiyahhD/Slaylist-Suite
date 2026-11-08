
"use client";

import { useRef } from "react";
import BookCard from "@/components/BookCard";
import type { Entry } from "@/lib/library";

type Props = {
  entries: Entry[];
};

export default function CurrentRotationCarousel({
  entries,
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const firstCard = carousel.querySelector<HTMLElement>(
      ".rotation-carousel-item"
    );

    const cardWidth = firstCard?.getBoundingClientRect().width ?? 190;
    const gap = 14;

    carousel.scrollBy({
      left: direction * (cardWidth + gap) * 2,
      behavior: "smooth",
    });
  }

  if (entries.length === 0) {
    return (
      <div className="rotation-empty">
        Nothing in your current rotation yet. ♡
      </div>
    );
  }

  return (
    <div className="rotation-carousel">
      <div className="rotation-carousel-top">
        <span className="rotation-carousel-count">
          🐾 {entries.length} currently reading
        </span>

        <div className="rotation-carousel-controls">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll current rotation left"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll current rotation right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="rotation-carousel-track"
        ref={carouselRef}
        aria-label="Currently reading books"
      >
        {entries.map((entry) => (
          <div
            className="rotation-carousel-item"
            key={entry.book.id}
          >
            <BookCard entry={entry} />
          </div>
        ))}
      </div>
    </div>
  );
}
