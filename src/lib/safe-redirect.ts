/** Single tested open-redirect guard for the preview gate.
 *
 *  Returns a same-origin *relative* path, or "/" for anything it cannot
 *  vouch for. `parseBase` is only a base for resolving the relative
 *  reference; it is not an allowlist, and the returned value never contains
 *  an origin. Callers should emit the result as a relative Location. */

// eslint-disable-next-line anti-slop/no-unknown-parameters -- FormDataEntryValue arrives
// unparsed from the request boundary; the string check below IS the decoder.

// trace:v1 id=impl.safe-redirect work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export function safeRedirect(
  value: FormDataEntryValue | string | null | undefined,
  parseBase: string,
): string {
  // eslint-disable-next-line anti-slop/no-runtime-typeof -- this IS the I/O boundary decoder.
  if (typeof value !== "string" || value === "") return "/";

  // eslint-disable-next-line no-control-regex -- control characters are exactly the open-redirect vector rejected here.
  if (/[\x00-\x1f\x7f]/.test(value)) return "/";
  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) return "/";

  if (trimmed.startsWith("//")) return "/";

  if (trimmed.startsWith("/\\")) return "/";

  let url: URL;

  try {
    url = new URL(trimmed, parseBase);
  } catch {
    return "/";
  }

  const dest = url.pathname + url.search + url.hash;

  if (!dest.startsWith("/") || dest.includes("\\")) return "/";

  let decoded: string;

  try {
    decoded = decodeURIComponent(dest);
  } catch {
    return "/";
  }

  // Encoded `//evil`, `https:evil`, `javascript:`, `data:` tricks all surface here.
  if (decoded.startsWith("//")) return "/";

  if (/^[a-z][a-z0-9+.-]*:/i.test(decoded)) return "/";

  if (/^(https?:)?\/\//i.test(decoded)) return "/";

  if (decoded.includes("\\")) return "/";

  // Never bounce back into the gate itself.
  if (url.pathname === "/login" || url.pathname.startsWith("/login/")) return "/";

  return dest || "/";
}
