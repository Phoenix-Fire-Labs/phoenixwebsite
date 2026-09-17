"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRIEFING_CTA, FOOTER_LEGAL, NAV_GROUPS } from "./nav-links";

/** Mobile navigation. Reads the same registry as the desktop header so the
 *  two can't drift. Motion owns the transform on this element and nothing
 *  else does (spec §32). */
// trace:v1 id=impl.mobile-menu work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openedOn, setOpenedOn] = useState(pathname);

  // Next keeps the layout mounted across navigation, so the panel has to close
  // on a route change. This is React's "adjust state when a prop changes"
  // pattern: previous value in state, compared during render. An effect would
  // paint the open menu and then close it; a ref mutated during render is not
  // replay-safe.
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  const isOpen = open && openedOn === pathname;

  // trace:exempt reason=internal-effect -- escape-key dismissal listener
  useEffect(() => {
    if (!isOpen) return;

    // trace:exempt reason=internal-detail -- keydown handler bound by the effect above
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        onClick={() => {
          setOpen((value) => !value);
        }}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      {/* LazyMotion + `m` loads only the DOM animation feature set; the full
          `motion` import pulls in roughly 30 kB for this one panel. */}
      <LazyMotion features={domAnimation} strict>
        <AnimatePresence>
        {isOpen ? (
          <m.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mobile-nav-group">
                <p className="mobile-nav-heading">{group.label}</p>
                {group.sections.flatMap((s) => s.links).map((link) => (
                  <Link key={link.href + link.label} href={link.href}>{link.label}</Link>
                ))}
              </div>
            ))}
            <div className="mobile-nav-group">
              <Link href={BRIEFING_CTA.href} className="btn btn-primary btn-sm">{BRIEFING_CTA.label}</Link>
            </div>
            <div className="mobile-nav-group mobile-nav-legal">
              {FOOTER_LEGAL.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </div>
          </m.nav>
        ) : null}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
