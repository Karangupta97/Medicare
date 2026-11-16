import Image from "next/image";
import hospitalRoom from "@/assets/image/hospitalbad.webp";
import { LandingIcon } from "./landing-icons";
import { VISION_POINTS } from "./landing-data";
import { Reveal } from "./reveal";

/**
 * Vision section. The old page loaded this photo from images.unsplash.com (800 x 1203 crop);
 * the same 800 x 1203 file is now local (src/assets/image/hospitalbad.webp), so it is optimized and has a fixed ratio.
 */
export function Vision() {
  return (
    <section
      id="vision-section"
      aria-labelledby="vision-title"
      // Old: py-14 below md, py-8 from md, my-4. Fluid: 56px at 375px to 32px at 768px.
      className="mt-4 w-full scroll-mt-4 bg-linear-to-b from-tint to-surface py-[clamp(2rem,4.931rem-6.107vw,3.5rem)]"
    >
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="grid items-center gap-12 md:grid-cols-2">
          <div className="md:order-2">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 -m-6 rounded-full bg-linear-to-r from-violet/20 to-brand/20 opacity-30 blur-3xl sm:-m-10"
              />
              <div className="relative aspect-800/1203 overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={hospitalRoom}
                  alt="Modern hospital room with a bed and patient monitor"
                  fill
                  sizes="(min-width: 1280px) 600px, (min-width: 768px) calc(50vw - 40px), calc(100vw - 32px)"
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-overlay/70 to-transparent">
                  <div className="p-6 text-on-hero">
                    <span className="rounded-full bg-violet px-3 py-1 text-sm font-medium text-on-violet">Our Vision</span>
                    <p className="mt-2 text-2xl font-bold">Healthcare of Tomorrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:order-1">
            <div className="mb-6 inline-block rounded-full bg-violet-subtle px-4 py-1.5">
              <span className="text-sm font-bold uppercase tracking-wide text-on-violet-subtle">Our Vision</span>
            </div>
            {/* Old: text-3xl below md, text-4xl from md; leading 1.11 */}
            <h2 id="vision-title" className="mb-8 text-[clamp(1.875rem,1.517rem+1.53vw,2.25rem)] font-bold leading-[1.15] text-text">
              Healthcare <span className="italic text-violet">Reimagined</span> For The Digital Age
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-text-muted">
              We envision a future where healthcare information is easily accessible, securely managed, and efficiently
              shared between patients and healthcare providers, leading to better health outcomes for all. Our platform
              aims to bridge the gap between patients and healthcare providers, creating a unified ecosystem where health
              information flows seamlessly.
            </p>
            <ul className="space-y-4">
              {VISION_POINTS.map((point) => (
                <li key={point} className="flex items-start">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-subtle text-violet">
                    <LandingIcon name="feather-check" className="size-4" />
                  </span>
                  <span className="ml-3 text-text">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
