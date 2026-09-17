"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

/** Albatross prediction: observed perimeter, current state, possible spread. No accuracy claims. */
// trace:v1 id=impl.visual-albatross-prediction work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function AlbatrossPrediction() {
  const root = useRef<SVGSVGElement>(null);

  // trace:exempt reason=internal-effect -- GSAP perimeter draw
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scope = root.current;

    if (!scope) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paths = scope.querySelectorAll("[data-perimeter]");

    for (const path of paths) {
      // SAFETY: selector is scoped to [data-perimeter] paths in this SVG, all SVGPathElement.
      const length = (path as SVGPathElement).getTotalLength();

      gsap.fromTo(
        path,
        { strokeDashoffset: length, strokeDasharray: String(length) },
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.out" },
      );
    }

    return () => {
      gsap.killTweensOf(paths);
    };
  }, []);

  return (
    <svg ref={root} viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Observed perimeter, current state, and predicted possible spread">
      <path
        data-perimeter
        d="M 60,160 C 55,130 70,105 110,95 C 150,85 200,90 220,110 C 240,130 230,160 200,170 C 160,185 90,185 60,160 Z"
        stroke="var(--color-text-tertiary)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <text x="60" y="195" fill="var(--color-text-tertiary)" fontSize="10" fontWeight="600">OBSERVED</text>
      <path
        data-perimeter
        d="M 90,140 C 100,115 140,100 180,105 C 215,110 235,130 225,150 C 215,168 170,175 130,168 C 100,162 85,155 90,140 Z"
        stroke="var(--color-accent)"
        strokeWidth="2"
      />
      <text x="90" y="60" fill="var(--color-accent)" fontSize="10" fontWeight="600">CURRENT</text>
      <path
        d="M 120,120 C 150,80 220,65 280,80 C 330,93 350,130 320,160 C 300,178 240,180 190,170"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeDasharray="2 5"
        opacity="0.65"
      />
      <text x="280" y="60" fill="var(--color-accent)" fontSize="10" fontWeight="600">POSSIBLE SPREAD</text>
    </svg>
  );
}
