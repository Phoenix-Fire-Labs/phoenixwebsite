import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { RevealController } from "@/components/motion/RevealController";
import { SpeedInsights } from "@vercel/speed-insights/next";

/** Self-hosted at build time. The previous <link> to fonts.googleapis.com
 *  blocked first render on a third-party round-trip and shifted layout when
 *  the faces swapped in. `variable` exposes each family as a CSS custom
 *  property that globals.css maps onto --font-display / --font-body. */
const fraunces = Fraunces({
  subsets: ["latin"],
  // Variable font: weights come from the axis, and `axes` is only valid when
  // no static weight list is given. The design uses the optical-size axis.
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

/** Marks the document as animation-capable before first paint. Every rule that
 *  starts an element at `opacity: 0` is scoped to `.js-anim`, so a visit with
 *  JavaScript blocked renders the whole page visible instead of blank. React
 *  does not reconcile script-added attributes on <html>, so this cannot cause
 *  a hydration mismatch. */
const JS_ANIM_BOOTSTRAP = "document.documentElement.classList.add('js-anim');";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.phoenixfirelabs.com"),
  title: {
    default: "Phoenix Fire Labs | Real-Time Wildfire Intelligence",
    template: "%s | Phoenix Fire Labs",
  },
  description:
    "Phoenix Fire Labs builds operational intelligence systems for wildfire response. Mockingbird turns tactical radio traffic into structured incident intelligence. Osprey assembles GIS, satellite imagery, fire perimeters, infrastructure, evacuations, and field data into one live operational picture.",
  keywords: [
    "wildfire",
    "incident command",
    "operational intelligence",
    "Mockingbird wildfire radio intelligence",
    "Osprey wildfire operational intelligence",
    "Raven operational world model",
    "fire perimeter",
    "tactical VHF",
    "Phoenix Fire Labs",
  ],
  authors: [{ name: "Phoenix Fire Labs" }],
  robots:
    process.env.SITE_PREVIEW_GATED !== "false"
      ? { index: false, follow: false }
      : { index: true, follow: true },
  // No canonical here: it would be inherited by every route. Each page
  // declares its own via canonicalFor().
  // No `images` here on purpose: src/app/opengraph-image.tsx generates the
  // card, and Next only uses it when metadata does not override it. The
  // static /og-image.jpg override made that route dead weight.
  openGraph: {
    type: "website",
    url: "https://www.phoenixfirelabs.com/",
    title: "Phoenix Fire Labs | Real-Time Wildfire Intelligence",
    description:
      "Operational intelligence systems for wildfire response: Mockingbird radio intelligence, Osprey operational picture, Raven intelligence layer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phoenix Fire Labs | Real-Time Wildfire Intelligence",
    description:
      "Operational intelligence systems for wildfire response: Mockingbird radio intelligence, Osprey operational picture, Raven intelligence layer.",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f3ed",
};

// trace:v1 id=impl.app-shell work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-XH2DZ7EX
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // <html> carries suppressHydrationWarning because JS_ANIM_BOOTSTRAP stamps a
  // class on it before first paint: server markup and hydrated DOM differ by
  // that one class by design. The suppression covers this element's attributes
  // only, so any mismatch inside the tree still reports.
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_ANIM_BOOTSTRAP }} />
      </head>
      <body>
        {children}
        <RevealController />
        <SpeedInsights />
      </body>
    </html>
  );
}
