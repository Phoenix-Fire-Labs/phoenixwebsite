"use client";

import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { WildfireContourMap } from "./WildfireContourMap";

const STAGES = [
  {
    id: "radio",
    label: "Radio",
    heading: "Division Alpha, Engine 72 moving north…",
    detail: "Tactical VHF waveform arrives as raw audio.",
  },
  {
    id: "mockingbird",
    label: "Mockingbird",
    heading: "Unit E72 · Ridge 4 · north · advancing",
    detail: "Mockingbird extracts unit, location, direction, event.",
  },
  {
    id: "raven",
    label: "Raven",
    heading: "E72 — located-at — Ridge 4",
    detail: "Raven connects the report to the shared operational world.",
  },
  {
    id: "osprey",
    label: "Osprey",
    heading: "Engine 72 appears on the live map",
    detail: "Osprey places the unit in full operational context.",
  },
];

/** Signature story: radio waveform → Mockingbird → Raven → Osprey map. Static-first, JS enhances. */
// trace:v1 id=impl.visual-signature-story work=WORK-PHO-18KENMFK satisfies=REQ-PHO-W3J1V0YP
export function RadioToMap() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  // Ref for the observer (which never re-subscribes) and state for the
  // auto-advance effect (which must stop once the reader takes control).
  const pickedRef = useRef(false);
  const [picked, setPicked] = useState(false);

  const advance = useCallback(() => {
    setActive((stage) => (stage + 1) % STAGES.length);
  }, []);

  // trace:exempt reason=internal-effect -- run only while the section is on screen
  useEffect(() => {
    const scope = root.current;

    if (scope == null) {
      setInView(true);

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Restart from the radio call when the section scrolls back into view,
        // so the story is never joined half-way through — unless the reader
        // has chosen a stage, in which case a reset would undo their click.
        if (entry.isIntersecting && !pickedRef.current) setActive(0);
        setInView(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );

    observer.observe(scope);

    return () => observer.disconnect();
  }, []);

  // trace:exempt reason=internal-effect -- auto-advance timer
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!inView || picked) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // trace:exempt reason=internal-detail -- frame handle
    let frame = 0;
    let last = performance.now();

    // trace:exempt reason=internal-detail -- rAF tick
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);

      if (now - last >= 3200) {
        last = now;
        advance();
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [advance, inView, picked]);

  // trace:exempt reason=internal-effect -- GSAP stage choreography
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scope = root.current;

    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeline = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });

    // Motion owns the mobile menu; GSAP owns only this story subtree.
    timeline.fromTo(
      scope.querySelectorAll("[data-story-copy]"),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.06 },
    );

    // Only the frame that just became active. Targeting every
    // `[data-story-visual] svg` animated all four stacked frames on each
    // stage change, including the three that are cross-faded out.
    const activeFrame = scope.querySelector(`[data-story-frame="${STAGES[active].id}"]`);

    if (activeFrame) {
      timeline.fromTo(
        activeFrame.querySelectorAll("svg"),
        { opacity: 0.35 },
        { opacity: 1, stagger: 0.05 },
        "<",
      );
    }

    return () => {
      timeline.kill();
    };
  }, [active]);

  const stage = STAGES[active];

  return (
    <div ref={root} className="story">
      <ol className="story-progress" aria-label="Story stages">
        {STAGES.map((entry, index) => (
          <li key={entry.id} className={index === active ? "is-active" : undefined} aria-current={index === active ? "step" : undefined} />
        ))}
      </ol>
      <div className="split-section">
        <div className="story-copy">
          {/* One live region for the pair: two polite regions made screen
              readers announce every stage change twice. */}
          <div aria-live="polite" aria-atomic="true">
            <p className="section-label" data-story-copy>{stage.label}</p>
            <p className="hero-sub" data-story-copy><strong>{stage.heading}</strong> {stage.detail}</p>
          </div>
          <p className="story-stages" role="group" aria-label="Story stages">
            {STAGES.map((entry, index) => (
              <button key={entry.id} type="button" className={index === active ? "is-active" : undefined} onClick={() => {
                  pickedRef.current = true;
                  setPicked(true);
                  setActive(index);
                }} aria-pressed={index === active}>
                {entry.label}
              </button>
            ))}
          </p>
          <noscript>
            <ol className="capabilities">
              {STAGES.map((entry) => (
                <li key={entry.id}>{entry.label}: {entry.heading} — {entry.detail}</li>
              ))}
            </ol>
          </noscript>
        </div>
        {/* All four visuals stay mounted and cross-fade. Swapping them by
            conditional render remounted the contour map on every cycle, and
            its CSS draw-in takes about three seconds against a 3.2s stage —
            so the map was permanently mid-redraw and never settled. */}
        <div className="vis-container story-visual" aria-hidden="true" data-story-visual>
          {STAGES.map((entry) => (
            <div
              key={entry.id}
              className="story-frame"
              data-story-frame={entry.id}
              data-active={entry.id === stage.id ? "true" : undefined}
            >
              {entry.id === "osprey" ? <WildfireContourMap /> : <StoryDiagram stage={entry.id} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// trace:exempt reason=presentational-variant
function StoryDiagram({ stage }: { stage: string }) {
  if (stage === "radio") {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radio waveform">
        {[16, 11, 14, 7, 12, 9, 15].map((height, index) => (
          <rect key={index} x={30 + index * 45} y={100 - height * 4} width="18" height={height * 8} rx="9" fill="var(--color-accent)" opacity={0.35 + index * 0.08} />
        ))}
        <line x1="0" y1="100" x2="400" y2="100" stroke="var(--color-accent)" strokeWidth="1" className="scan-anim" />
      </svg>
    );
  }

  if (stage === "mockingbird") {
    return (
      <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Extracted incident signals">
        <rect x="20" y="20" width="360" height="160" stroke="var(--color-rule)" strokeWidth="1" />
        <text x="40" y="60" fill="var(--color-accent)" fontSize="12" fontWeight="700">UNIT · E72</text>
        <text x="40" y="95" fill="var(--color-text)" fontSize="12" fontWeight="600">Ridge 4 · north</text>
        <text x="40" y="130" fill="var(--color-text-secondary)" fontSize="12">Advancing · Division Alpha</text>
        <path d="M 40 150 L 360 150" stroke="var(--color-accent)" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Raven knowledge graph">
      <circle cx="200" cy="100" r="10" fill="var(--color-accent)" />
      <circle cx="90" cy="60" r="7" fill="var(--color-text-mid)" />
      <circle cx="310" cy="60" r="7" fill="var(--color-text-mid)" />
      <circle cx="90" cy="145" r="7" fill="var(--color-text-mid)" />
      <circle cx="310" cy="145" r="7" fill="var(--color-text-mid)" />
      <path d="M 200 100 L 90 60 M 200 100 L 310 60 M 200 100 L 90 145 M 200 100 L 310 145" stroke="var(--color-accent)" strokeWidth="1.5" />
      <text x="200" y="170" fill="var(--color-text-secondary)" fontSize="11" textAnchor="middle">E72 — located-at — Ridge 4</text>
    </svg>
  );
}
