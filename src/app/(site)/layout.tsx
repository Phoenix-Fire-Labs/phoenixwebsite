import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

/** Chrome for the public marketing site.
 *
 *  Deliberately a route group rather than the root layout: /login sits outside
 *  it. When the header and footer lived in the root layout, an unauthenticated
 *  visitor to the gate saw the full product navigation — every one of the six
 *  product names — which is exactly the positioning the preview withholds. */
// trace:v1 id=impl.site-layout work=WORK-PHO-32N4ZH5K satisfies=REQ-PHO-NRXVT28A
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}
