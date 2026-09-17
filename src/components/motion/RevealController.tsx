"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Scroll reveal, post-hydration, re-armed on every navigation.
 *
 *  Two things this has to get right, both of which produced a blank page:
 *
 *  1. `.visible` must never be applied before React hydrates. Doing it from a
 *     streaming inline script makes server and client markup disagree, React
 *     reconciles the class away, and any element already unobserved stays at
 *     `opacity: 0` forever.
 *  2. The observer must be rebuilt on route change. Next keeps the root layout
 *     mounted across client-side navigation, so a mount-only effect observes
 *     the first page's elements and never sees any subsequent page's — every
 *     in-app link then lands on an empty page.
 *
 *  Elements only hide once `js-anim` is on <html>, so a script-blocked visit
 *  renders everything visible. */
// trace:v1 id=impl.motion-reveal work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function RevealController() {
  const pathname = usePathname();

  // Keyed by route so the observer below remounts on navigation. Using
  // pathname as an effect dependency instead left it unused inside the effect,
  // which reads as an accidental dependency.
  return <RevealObserver key={pathname} />;
}

/** Owns exactly one IntersectionObserver for the life of one route. */
// trace:exempt reason=internal-component
function RevealObserver() {
  // trace:exempt reason=internal-effect -- observer lifecycle
  useEffect(() => {
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          seen.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    document.querySelectorAll(".reveal:not(.visible)").forEach((el) => seen.observe(el));

    // Content can stream in after this effect runs. Watching the tree picks
    // those up whenever they land, instead of guessing at fixed delays.
    const added = new MutationObserver(() => {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => seen.observe(el));
    });

    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      added.disconnect();
      seen.disconnect();
    };
  }, []);

  return null;
}
