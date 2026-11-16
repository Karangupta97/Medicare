"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM, type TeamMember } from "./team";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  const highlighted = member.highlighted === true;
  return (
    <article
      aria-label={member.name}
      className={`flex w-[min(18rem,80%)] shrink-0 snap-center flex-col items-center rounded-2xl p-6 text-center md:w-72 ${
        highlighted ? "bg-brand text-on-brand" : "bg-surface-muted text-text"
      }`}
    >
      <div className="relative size-28 overflow-hidden rounded-full">
        <Image src={member.photo} alt={member.photoAlt} fill sizes="112px" className="object-cover object-top" />
      </div>
      <h3 className="mt-5 text-lg font-medium leading-tight">{member.name}</h3>
      <p className={`mt-1 text-sm font-normal ${highlighted ? "text-on-brand" : "text-text-muted"}`}>{member.role}</p>
    </article>
  );
}

/**
 * Team row. From md the cards sit in a centered row. Below md it is a horizontal scroll-snap carousel with 44px
 * previous/next buttons (shown only when the row overflows), keyboard scrollable (the region is focusable) and no auto-play.
 */
export function TeamCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el === null) return;
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (el === null) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  }, []);

  return (
    <div>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={TEAM.carouselLabel}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] md:snap-none md:flex-wrap md:justify-center md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {TEAM.members.map((member) => (
          <MemberCard key={member.name} member={member} />
        ))}
      </div>
      {overflowing && (
        <div className="mt-4 flex justify-center gap-3 md:hidden">
          <button
            type="button"
            aria-label={TEAM.previousLabel}
            onClick={() => scrollByCard(-1)}
            className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-text transition-colors duration-150 ease-out hover:bg-secondary-subtle motion-reduce:transition-none"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            aria-label={TEAM.nextLabel}
            onClick={() => scrollByCard(1)}
            className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-text transition-colors duration-150 ease-out hover:bg-secondary-subtle motion-reduce:transition-none"
          >
            <Chevron direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}
