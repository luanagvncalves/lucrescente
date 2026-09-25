"use client";

import { useEffect, useRef } from "react";
import { SectionHeader } from "@/components/ui/typography";
import { Reveal } from "@/components/ui/reveal";
import { getTestimonialCopy, type Testimonial } from "@/data/testimonials";
import type { ProductLocale } from "@/content/product-locales";

/** Auto-scroll speed, in pixels per second. Slow enough to read a card as it drifts by. */
const SCROLL_SPEED = 28;
/** One arrow click moves one card: the `sm` card width (340px) plus the gap (20px). */
const CARD_STEP = 360;

/**
 * Length of one full cycle: the distance between a card and its copy in the
 * duplicated half. Measured from the DOM rather than derived from `scrollWidth`,
 * which also carries the list's padding and its trailing gap.
 */
function cycleLength(list: HTMLUListElement, itemCount: number) {
  const cards = list.children;
  const first = cards[0] as HTMLElement | undefined;
  const twin = cards[itemCount] as HTMLElement | undefined;
  if (!first || !twin) return 0;
  return twin.offsetLeft - first.offsetLeft;
}

function Stars({ count }: { count: number }) {
  return (
    <p aria-label={`${count} de 5 estrelas`} className="text-clay text-[0.95rem] tracking-wide">
      {"★".repeat(count)}
      <span className="text-clay/25">{"★".repeat(Math.max(0, 5 - count))}</span>
    </p>
  );
}

/**
 * Testimonial cards clamp their quote to 10 lines (the `line-clamp-[10]`
 * class below) and expand on hover to show the rest — that 10-line ceiling
 * is a deliberate product rule (not just a visual default). Tailwind needs
 * the literal class string in source to generate its CSS, so if this ever
 * changes, edit the class directly rather than making it a variable.
 *
 * The strip drifts leftwards on its own. The list is rendered twice so the
 * scroll can wrap from the end of the first copy back to its start without a
 * visible jump; the second copy is `aria-hidden` so screen readers only ever
 * meet each testimonial once. Motion stops while the pointer is over the
 * section (so a card can be read, and so the hover-to-expand above works),
 * while anything inside has keyboard focus, while the strip is being dragged,
 * and entirely under `prefers-reduced-motion`.
 *
 * Hover, focus and drag are tracked separately rather than as one `paused`
 * flag: releasing an arrow click would otherwise resume the drift while the
 * pointer was still over the section, and the per-frame `scrollLeft` write
 * below would then cancel that click's smooth scroll mid-animation.
 */
export function Testimonials({
  label,
  title,
  subtitle,
  items,
  locale = "pt",
  prevLabel = "anterior",
  nextLabel = "seguinte",
}: {
  label: string;
  title: string;
  subtitle?: string;
  items: Testimonial[];
  locale?: ProductLocale;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const hovering = useRef(false);
  const focused = useRef(false);
  const dragging = useRef(false);

  function scrollByCard(direction: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    // Going left from the very start would hit the wall at scrollLeft 0. Hop
    // forward one whole cycle first — the content there is identical, so the
    // jump is invisible — and the click can then scroll left as normal.
    const cycle = cycleLength(el, items.length);
    if (direction === -1 && cycle > 0 && el.scrollLeft < CARD_STEP) {
      el.scrollLeft += cycle;
    }
    el.scrollBy({ left: direction * CARD_STEP, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();
    let pos = el.scrollLeft;

    function step(now: number) {
      frame = requestAnimationFrame(step);
      // Clamp the delta so a backgrounded tab doesn't resume with one big jump.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const list = el!;
      if (hovering.current || focused.current || dragging.current || document.hidden) {
        // Track the element instead of driving it, so a smooth scroll from an
        // arrow click (or a manual drag) plays out and we resume from its end.
        pos = list.scrollLeft;
        return;
      }

      const cycle = cycleLength(list, items.length);
      if (cycle <= 0) return; // not laid out yet (still inside the reveal)

      pos += SCROLL_SPEED * dt;
      // An arrow click can leave the strip a cycle or more along; fold it back.
      pos = ((pos % cycle) + cycle) % cycle;
      list.scrollLeft = pos;
    }

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [items.length]);

  const arrowClass =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-forest/25 bg-ivory text-forest shadow-[0_6px_16px_rgba(49,61,53,0.12)] transition-colors hover:border-forest hover:bg-forest hover:text-white sm:flex";

  return (
    <section className="bg-ivory" aria-labelledby="testemunhos">
      <div className="container-brand section-gap !pb-10">
        <SectionHeader label={label} title={title} subtitle={subtitle} />

        <Reveal>
          <div
            className="relative mt-10"
            onMouseEnter={() => (hovering.current = true)}
            onMouseLeave={() => {
              hovering.current = false;
              dragging.current = false;
            }}
            // Keyboard focus should hold the strip still; a mouse click on an
            // arrow should not, or the drift would never resume — the button
            // keeps focus long after the pointer has left. `:focus-visible` is
            // exactly that distinction.
            onFocusCapture={(e) => {
              focused.current = e.target instanceof HTMLElement && e.target.matches(":focus-visible");
            }}
            onBlurCapture={() => (focused.current = false)}
            onPointerDown={() => (dragging.current = true)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
            onTouchStart={() => (dragging.current = true)}
            onTouchEnd={() => (dragging.current = false)}
          >
            <button type="button" aria-label={prevLabel} onClick={() => scrollByCard(-1)} className={`${arrowClass} -left-3`}>
              ←
            </button>

            <ul
              ref={scroller}
              // `items-stretch` (rather than `items-start`) gives every card the
              // height of the tallest one in the strip, so short feedbacks no
              // longer leave a ragged gap beside long ones. It is the tallest
              // card's own height, not a fixed number, so it keeps up when the
              // quotes are edited.
              className="flex items-stretch gap-5 overflow-x-auto scroll-px-5 px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {[0, 1].flatMap((copy) =>
                items.map((item) => {
                  const copyText = getTestimonialCopy(item, locale);
                  return (
                    <li
                      key={`${copy}-${item.id}`}
                      aria-hidden={copy === 1 || undefined}
                      className="card-brand group flex w-[300px] shrink-0 flex-col gap-3 p-6 transition-shadow hover:z-10 hover:shadow-[0_18px_36px_rgba(49,61,53,0.14)] sm:w-[340px]"
                    >
                      <Stars count={item.stars} />
                      <p className="line-clamp-[10] font-display text-[1.1rem] leading-snug text-forest group-hover:line-clamp-none">
                        {item.verbatim === false ? copyText.quote : `“${copyText.quote}”`}
                      </p>
                      <div className="mt-auto pt-1 text-[0.82rem] text-ink/70">
                        <p className="lowercase">{copyText.product}</p>
                        {item.year ? <p className="mt-0.5 text-ink/50">{item.year}</p> : null}
                      </div>
                    </li>
                  );
                }),
              )}
            </ul>

            <button type="button" aria-label={nextLabel} onClick={() => scrollByCard(1)} className={`${arrowClass} -right-3`}>
              →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
