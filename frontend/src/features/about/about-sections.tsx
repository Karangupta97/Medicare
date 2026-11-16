import Image from "next/image";
import type { ReactNode } from "react";
import { CurveDivider } from "@/components/curve-divider";
import { FaqAccordion } from "@/features/pricing/faq-accordion";
import { PricingIcon } from "@/features/pricing/pricing-icons";
import { ABOUT_FAQ } from "./faqs";
import { ABOUT_MILESTONES } from "./milestones";
import { ImageFrame, PullStatement, Reveal, RevealLines } from "./motion";
import { ABOUT_STATS } from "./stats";
import { STORY } from "./story";
import { TEAM, type TeamMember } from "./team";
import { VALUES } from "./values";
import { VISION } from "./vision";

/**
 * One spacing scale for the page. Section padding clamp(72px, 9vw, 128px) is applied on top only (one gap between
 * sections, no stacked margins). Eyebrow to heading 12px, heading to lead 16px, heading block to content
 * clamp(40px, 5vw, 64px). Two-column sections: 5/7 columns, column gap clamp(32px, 6vw, 96px), top-aligned.
 */
const SECTION_PAD = "pt-[clamp(72px,9vw,128px)]";
const CONTAINER = "mx-auto w-full max-w-[1120px] px-4 sm:px-6";
const TWO_COLUMNS = "grid items-start gap-y-[clamp(40px,5vw,64px)] lg:grid-cols-[5fr_7fr] lg:gap-x-[clamp(32px,6vw,96px)]";
const HEADING_TO_CONTENT = "mb-[clamp(40px,5vw,64px)]";
const BODY = "text-[17px] font-normal leading-[1.7] text-text-muted sm:text-lg";
const DISPLAY = "text-[clamp(1.75rem,1.1rem+2.4vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-text";

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-secondary">{children}</p>;
}

/** Left-aligned section heading block: eyebrow, h2 (accent word in the loaded italic face), optional muted lead. Sticky from lg. */
function SectionIntro({ id, eyebrow, start, accent, children }: { id: string; eyebrow: string; start: string; accent: string; children?: ReactNode }) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className={DISPLAY}>
        <RevealLines
          lines={[
            <>
              {start}
              <em className="font-normal italic">{accent}</em>
            </>,
          ]}
        />
      </h2>
      {children !== undefined && (
        <Reveal className="mt-4 max-w-[40ch]">
          <p className="text-base font-normal leading-normal text-text-muted">{children}</p>
        </Reveal>
      )}
    </div>
  );
}

/** Optional stats strip. Renders nothing until ABOUT_STATS has real data. */
export function StatsStrip() {
  if (ABOUT_STATS.length === 0) return null;
  return (
    <section aria-label="Medicare in numbers" className={`${SECTION_PAD} ${CONTAINER}`}>
      <dl className="grid grid-cols-2 gap-6 border-y border-border py-8 md:grid-cols-4">
        {ABOUT_STATS.map((stat, index) => (
          <Reveal key={stat.label} index={index} innerClassName="flex flex-col-reverse">
            <dt className="text-sm font-normal text-text-muted">{stat.label}</dt>
            <dd className="text-[clamp(2rem,1.4rem+2vw,3rem)] font-medium tracking-[-0.02em] text-text">{stat.value}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/** 01 Mission: sticky heading left, paragraph and commitments right, then two staggered photos (fixed ratios). */
export function MissionSection() {
  return (
    <section aria-labelledby="mission-title" className={`${SECTION_PAD} ${CONTAINER}`}>
      <div className={TWO_COLUMNS}>
        <SectionIntro id="mission-title" eyebrow="01 Mission" start={STORY.headingStart} accent={STORY.headingAccent}>
          {STORY.subtitle}
        </SectionIntro>
        <div>
          <Reveal>
            <p className="max-w-[40ch] text-[clamp(1.25rem,1.05rem+0.8vw,1.5rem)] font-normal leading-[1.5] text-text">{STORY.paragraph}</p>
          </Reveal>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {STORY.points.map((point, index) => (
              <li key={point}>
                <Reveal index={index} innerClassName="flex min-h-14 items-center gap-4 py-4">
                  <PricingIcon name="check" strokeWidth={1.75} className="size-[18px] shrink-0 text-brand" />
                  <span className="text-base font-normal leading-normal text-text sm:text-[17px]">{point}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-[clamp(40px,5vw,64px)] grid grid-cols-12 items-start gap-4 sm:gap-6">
        <div className="col-span-5">
          <ImageFrame src={STORY.images[0].src} alt={STORY.images[0].alt} className="aspect-[4/5]" sizes="(min-width: 1120px) 440px, 42vw" parallax />
        </div>
        <div className="col-span-7 mt-8 lg:-ml-10 lg:mt-16">
          <ImageFrame src={STORY.images[1].src} alt={STORY.images[1].alt} className="aspect-[4/3]" sizes="(min-width: 1120px) 620px, 58vw" parallax index={1} />
        </div>
      </div>
    </section>
  );
}

/** 02 Vision: the vision paragraph as one large statement that fills in as you scroll. */
export function VisionSection() {
  return (
    <section aria-labelledby="vision-title" className={`${SECTION_PAD} ${CONTAINER}`}>
      <div className={HEADING_TO_CONTENT}>
        <Eyebrow>02 Vision</Eyebrow>
        <h2 id="vision-title" className={DISPLAY}>
          <RevealLines
            lines={[
              <>
                {VISION.headingStart}
                <em className="font-normal italic">{VISION.headingAccent}</em>
              </>,
            ]}
          />
        </h2>
      </div>
      <PullStatement
        text={VISION.paragraph}
        className="max-w-[30ch] text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-text sm:max-w-[34ch]"
      />
    </section>
  );
}

/** Values band with curved top and bottom edges. */
export function ValuesSection() {
  return (
    <section aria-labelledby="values-title" className={SECTION_PAD}>
      <CurveDivider orientation="top" className="text-surface-muted" />
      <div className="-my-px bg-surface-muted py-[clamp(24px,4vw,48px)]">
        <div className={CONTAINER}>
          <div className={`${HEADING_TO_CONTENT} ${TWO_COLUMNS} gap-y-4! lg:items-end`}>
            <div>
              <Eyebrow>03 Values</Eyebrow>
              <h2 id="values-title" className={DISPLAY}>
                <RevealLines
                  lines={[
                    <>
                      {VALUES.headingStart}
                      <em className="font-normal italic">{VALUES.headingAccent}</em>
                    </>,
                  ]}
                />
              </h2>
            </div>
            <p className="text-base font-normal leading-normal text-text-muted">{VALUES.subtitle}</p>
          </div>
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {VALUES.items.map((value, index) => (
              <li key={value.title}>
                <Reveal index={index} className="h-full" innerClassName="h-full">
                  <div className="relative flex h-full min-h-48 flex-col rounded-2xl border border-border bg-surface p-6 transition-[transform,border-color,background-color] duration-[250ms] ease-out hover:-translate-y-1 hover:border-border-strong hover:bg-secondary-subtle motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <span aria-hidden="true" className="absolute right-5 top-5 text-sm font-normal text-text-muted">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    <PricingIcon name={value.icon} strokeWidth={1.5} className="size-6 text-brand" />
                    <h3 className="mt-auto pt-8 text-lg font-medium leading-tight text-text">{value.title}</h3>
                    <p className="mt-2 text-[15px] font-normal leading-normal text-text-muted">{value.desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <CurveDivider orientation="bottom" className="text-surface-muted" />
    </section>
  );
}

/** Optional milestones timeline. Renders nothing until ABOUT_MILESTONES has real data. */
export function MilestonesTimeline() {
  if (ABOUT_MILESTONES.length === 0) return null;
  return (
    <section aria-label="Milestones" className={`${SECTION_PAD} ${CONTAINER}`}>
      <ol className="divide-y divide-border border-y border-border">
        {ABOUT_MILESTONES.map((milestone, index) => (
          <li key={`${milestone.year}-${milestone.title}`}>
            <Reveal index={index} innerClassName="grid gap-2 py-6 md:grid-cols-[8rem_1fr] md:gap-8">
              <p className="text-sm font-medium text-secondary">{milestone.year}</p>
              <div>
                <h3 className="text-lg font-medium text-text">{milestone.title}</h3>
                <p className="mt-1 text-[15px] leading-normal text-text-muted">{milestone.description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Goal quote with a large decorative quote mark and the founder as attribution. */
export function QuoteSection() {
  const founder = TEAM.members[0];
  return (
    <section aria-label="Our goal" className={`${SECTION_PAD} ${CONTAINER}`}>
      <figure className="relative">
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 48 40"
          className="mb-6 h-[clamp(40px,6vw,72px)] w-auto fill-secondary-subtle"
        >
          <path d="M0 40V24.5C0 10.2 8 2.2 22 0v8.2C14.6 9.8 11.6 14 11.4 19H22v21H0Zm26 0V24.5C26 10.2 34 2.2 48 0v8.2c-7.4 1.6-10.4 5.8-10.6 10.8H48v21H26Z" />
        </svg>
        <Reveal>
          <blockquote className="max-w-[28ch] text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] font-medium leading-[1.2] tracking-[-0.02em] text-text">
            <p>{VISION.quote}</p>
          </blockquote>
        </Reveal>
        {founder !== undefined && (
          <figcaption className="mt-8 flex flex-col text-base">
            <span className="font-medium text-text">{founder.name}</span>
            <span className="font-normal text-text-muted">{founder.role}</span>
          </figcaption>
        )}
      </figure>
    </section>
  );
}

function FounderFeature({ member }: { member: TeamMember }) {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[5fr_6fr] md:gap-12 lg:gap-16">
      <ImageFrame src={member.photo} alt={member.photoAlt} className="aspect-[4/5]" sizes="(min-width: 768px) 460px, 100vw" />
      <div>
        <Reveal>
          <h3 className="text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.02em] text-text">{member.name}</h3>
          <p className="mt-2 text-base font-normal text-secondary">{member.role}</p>
        </Reveal>
        {member.bio !== undefined && (
          <Reveal index={1} className="mt-6">
            <p className={`${BODY} max-w-[60ch]`}>{member.bio}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function TeamGrid({ members }: { members: readonly TeamMember[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member, index) => (
        <li key={member.name}>
          <Reveal index={index} className="h-full" innerClassName="h-full">
            <article
              aria-label={member.name}
              className={`flex h-full flex-col rounded-2xl p-5 ${member.highlighted === true ? "bg-brand text-on-brand" : "bg-surface-muted text-text"}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                <Image src={member.photo} alt={member.photoAlt} fill sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw" className="object-cover object-top" />
              </div>
              <h3 className="mt-5 text-lg font-medium leading-tight">{member.name}</h3>
              <p className={`mt-1 text-sm font-normal ${member.highlighted === true ? "text-on-brand" : "text-text-muted"}`}>{member.role}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** 04 Team: a founder feature for one member, a card grid otherwise. */
export function TeamSection() {
  const members = TEAM.members;
  const [only] = members;
  return (
    <section aria-labelledby="team-title" className={`${SECTION_PAD} ${CONTAINER}`}>
      <div className={`${HEADING_TO_CONTENT} max-w-[48ch]`}>
        <Eyebrow>04 Team</Eyebrow>
        <h2 id="team-title" className={DISPLAY}>
          <RevealLines
            lines={[
              <>
                {TEAM.headingStart}
                <em className="font-normal italic">{TEAM.headingAccent}</em>
              </>,
            ]}
          />
        </h2>
        <p className="mt-4 text-base font-normal leading-normal text-text-muted">{TEAM.subtitle}</p>
      </div>
      {members.length === 1 && only !== undefined ? <FounderFeature member={only} /> : <TeamGrid members={members} />}
    </section>
  );
}

/** 05 Questions: sticky heading left, accordion right. */
export function AboutFaq() {
  return (
    <section aria-labelledby="about-faq-title" className={`${SECTION_PAD} ${CONTAINER} pb-[clamp(72px,9vw,128px)]`}>
      <div className={TWO_COLUMNS}>
        <SectionIntro id="about-faq-title" eyebrow="05 Questions" start={ABOUT_FAQ.headingStart} accent={ABOUT_FAQ.headingAccent}>
          {ABOUT_FAQ.subtitle}
        </SectionIntro>
        <FaqAccordion items={ABOUT_FAQ.items} />
      </div>
    </section>
  );
}
