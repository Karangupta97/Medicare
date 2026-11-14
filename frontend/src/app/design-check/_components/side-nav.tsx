"use client";
// Section links, grouped. Below lg it is one row that scrolls inside its own container; from lg up it
// is a vertical list with group labels and an active marker.
import { SECTIONS } from "../_lib/sections";
import { useActiveSection } from "./active-section";

const GROUPS = ["Foundations", "Library", "Tools"] as const;

export function SideNav() {
  const { active, select } = useActiveSection();
  return (
    <nav aria-label="Design system sections" className="overflow-x-auto px-2 py-2 lg:overflow-visible lg:px-4 lg:pb-3 lg:pt-4">
      <ul className="flex gap-1 lg:flex-col lg:gap-0">
        {GROUPS.map((group) => (
          <li key={group} className="shrink-0 lg:mt-4 lg:shrink lg:first:mt-0">
            <p className="hidden px-3 pb-1 text-xs font-bold uppercase tracking-widest text-text-muted lg:[@media(min-height:720px)]:block">{group}</p>
            <ul className="flex gap-1 lg:flex-col">
              {SECTIONS.filter((section) => section.group === group).map((section) => {
                const isActive = section.id === active;
                return (
                  <li key={section.id} className="shrink-0 lg:shrink">
                    <a
                      href={`#${section.id}`}
                      onClick={() => select(section.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative flex min-h-11 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm lg:whitespace-normal ${
                        isActive
                          ? "bg-surface-muted font-bold text-brand lg:before:absolute lg:before:bottom-2 lg:before:left-0 lg:before:top-2 lg:before:w-1 lg:before:rounded-full lg:before:bg-brand"
                          : "font-medium text-text-muted hover:bg-surface-muted hover:text-text"
                      }`}
                    >
                      <span className="text-xs tabular-nums">{section.number}</span>
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
