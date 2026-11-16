"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { Faq } from "./faqs";
import { PricingIcon } from "./pricing-icons";

/** Minimal accordion: hairline separators, one item open at a time (none at first), grid-rows 0fr to 1fr animation. */
export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const count = items.length;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number | undefined> = {
      ArrowDown: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    refs.current[next]?.focus();
  }

  return (
    <div className="border-t border-border">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <div key={item.q} className="border-b border-border">
            <h3>
              <button
                ref={(el) => {
                  refs.current[index] = el;
                }}
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="flex min-h-14 w-full items-center justify-between gap-4 rounded-lg py-3 text-left text-base font-medium text-text"
              >
                {item.q}
                <PricingIcon
                  name="chevron-down"
                  className={`size-5 shrink-0 text-text-muted transition-transform duration-200 ease-out motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${
                open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <p className="max-w-[60ch] pb-5 text-[15px] font-normal leading-[1.6] text-text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
