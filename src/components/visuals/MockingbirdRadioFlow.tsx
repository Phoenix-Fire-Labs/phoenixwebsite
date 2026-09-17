// trace:v1 id=impl.visual-mockingbird-flow work=WORK-PHO-18KENMFK satisfies=REQ-PHO-8P8WDXWR
/** Golden-master Mockingbird flow icons: listen, transcribe, extract, synchronize. */
export function MockingbirdRadioFlow() {
  return (
    <div className="flow" aria-hidden="true">
      <div className="flow-step">
        <div className="flow-icon">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="20" r="2.5" fill="currentColor" stroke="none" />
            <path d="M 18 14 A 8 8 0 0 1 18 26" className="wave-anim" />
            <path d="M 23 9 A 14 14 0 0 1 23 31" className="wave-anim" />
            <path d="M 28 4 A 20 20 0 0 1 28 36" className="wave-anim" />
          </svg>
        </div>
        <span className="flow-title">Listen</span>
        <span className="flow-desc">Monitor tactical VHF radio channels during active incidents</span>
      </div>
      <div className="flow-step">
        <div className="flow-icon">
          <svg viewBox="0 0 40 40" fill="currentColor">
            <rect x="3" y="16" width="2.5" height="8" rx="1.25" opacity="0.45" />
            <rect x="8" y="11" width="2.5" height="18" rx="1.25" opacity="0.6" />
            <rect x="13" y="14" width="2.5" height="12" rx="1.25" opacity="0.8" />
            <rect x="18" y="7" width="2.5" height="26" rx="1.25" />
            <rect x="23" y="12" width="2.5" height="16" rx="1.25" opacity="0.75" />
            <rect x="28" y="9" width="2.5" height="22" rx="1.25" opacity="0.55" />
            <rect x="33" y="15" width="2.5" height="10" rx="1.25" opacity="0.35" />
            <line x1="0" y1="20" x2="40" y2="20" stroke="var(--color-accent)" strokeWidth="1" className="scan-anim" opacity="0.8" />
          </svg>
        </div>
        <span className="flow-title">Transcribe</span>
        <span className="flow-desc">Real-time speech recognition on noisy field audio</span>
      </div>
      <div className="flow-step">
        <div className="flow-icon">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M 9 8 L 5 8 L 5 32 L 9 32" />
            <path d="M 31 8 L 35 8 L 35 32 L 31 32" />
            <circle cx="15" cy="14" r="2.5" fill="currentColor" stroke="none" className="extract-anim" />
            <line x1="20" y1="14" x2="28" y2="14" />
            <circle cx="15" cy="21" r="2.5" fill="currentColor" stroke="none" className="extract-anim" />
            <line x1="20" y1="21" x2="26" y2="21" />
            <circle cx="15" cy="28" r="2.5" fill="currentColor" stroke="none" className="extract-anim" />
            <line x1="20" y1="28" x2="24" y2="28" />
          </svg>
        </div>
        <span className="flow-title">Extract</span>
        <span className="flow-desc">Identify locations, units, and incident events from transcripts</span>
      </div>
      <div className="flow-step">
        <div className="flow-icon">
          <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M 20 5 C 28 5 34 11 34 19 C 34 29 20 37 20 37 C 20 37 6 29 6 19 C 6 11 12 5 20 5 Z" />
            <circle cx="20" cy="18" r="4.5" fill="currentColor" stroke="none" />
            <path d="M 20 10 L 20 14 M 20 22 L 20 26 M 14 18 L 10 18 M 30 18 L 26 18" strokeWidth="1" className="sync-anim" />
          </svg>
        </div>
        <span className="flow-title">Synchronize</span>
        <span className="flow-desc">Push structured updates to geospatial command views</span>
      </div>
    </div>
  );
}
