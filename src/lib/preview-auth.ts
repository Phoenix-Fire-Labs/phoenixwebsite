/** Hardened private-preview gate. Password is stored as a scrypt hash, never
 *  plaintext. Sessions are `v1.issuedAt.expiresAt.nonce` HMAC-SHA256 tokens
 *  in a 24h `__Host-` cookie. Rotating PREVIEW_SESSION_SECRET revokes all.
 *  Receipts: scrypt N=16384,r=8,p=1 costs ~16 MiB per attempt; behind a
 *  10-attempt/min/IP WAF rule (Vercel dashboard, observe-first) that load is
 *  negligible and brute force uneconomical. 60s future-issue tolerance is
 *  conventional clock-skew allowance, not a security boundary. */

import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

export const PREVIEW_COOKIE_NAME = "__Host-phoenix_preview";

const PREVIEW_SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

// `__Host-` requires Secure, which browsers reject on http://localhost. Plain name for http dev only.
export const PREVIEW_COOKIE_NAME_HTTP = "phoenix_preview";

/** The cookie name valid for this request's scheme.
 *
 *  Exactly one name is accepted per scheme. Accepting both everywhere would
 *  make the `__Host-` prefix decorative: a client could present the plain
 *  cookie over HTTPS and sidestep the Secure + Path=/ + no-Domain rules the
 *  prefix exists to have the browser enforce. HTTP keeps the plain name only
 *  because browsers reject Secure cookies on http://localhost. */
// trace:exempt reason=internal-helper
export function previewCookieName(requestUrl?: string | null): string {
  return isSecureRequest(requestUrl) ? PREVIEW_COOKIE_NAME : PREVIEW_COOKIE_NAME_HTTP;
}

// trace:exempt reason=internal-helper
function isSecureRequest(requestUrl?: string | null): boolean {
  return requestUrl == null || requestUrl.startsWith("https://");
}

const SCRYPT_N = 16384;

const SCRYPT_R = 8;

const SCRYPT_P = 1;

const KEY_LEN = 32;

const SALT_LEN = 16;

// trace:exempt reason=internal-helper
function scryptKey(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  const { promise, resolve, reject } = Promise.withResolvers<Buffer>();
  scrypt(password, salt, KEY_LEN, { N: n, r, p }, (err, derivedKey) => {
    if (err) reject(err);
    else resolve(derivedKey);
  });

  return promise;
}

// trace:v1 id=impl.preview-auth.hash-password work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export async function hashPreviewPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = await scryptKey(password, salt, SCRYPT_N, SCRYPT_R, SCRYPT_P);

  return [
    "scrypt",
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    salt.toString("hex"),
    key.toString("hex"),
  ].join("$");
}

// trace:v1 id=impl.preview-auth.verify-password work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export async function verifyPreviewPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");

  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);

  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  const salt = Buffer.from(parts[4], "hex");
  const expected = Buffer.from(parts[5], "hex");

  if (salt.length === 0 || expected.length !== KEY_LEN) return false;
  const actual = await scryptKey(password, salt, n, r, p);

  if (actual.length !== expected.length) return false;

  return timingSafeEqual(actual, expected);
}

// trace:v1 id=impl.preview-auth.create-token work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export function createSessionToken(secret: string): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + PREVIEW_SESSION_MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(16).toString("hex");
  const body = ["v1", String(issuedAt), String(expiresAt), nonce].join(".");

  return `${body}.${createHmac("sha256", secret).update(body).digest("hex")}`;
}

// trace:v1 id=impl.preview-auth work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export function verifySessionToken(token: string | null | undefined, secret: string): boolean {
  // eslint-disable-next-line anti-slop/no-runtime-typeof -- cookie value arrives unparsed; this IS the decoder.
  if (typeof token !== "string") return false;
  const parts = token.split(".");

  if (parts.length !== 5 || parts[0] !== "v1") return false;
  const issuedAt = Number(parts[1]);
  const expiresAt = Number(parts[2]);

  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) return false;

  if (Date.now() > expiresAt) return false;

  if (issuedAt > Date.now() + 60_000) return false;
  const expected = createHmac("sha256", secret).update(parts.slice(0, 4).join(".")).digest("hex");

  if (parts[4].length !== expected.length) return false;

  return timingSafeEqual(Buffer.from(parts[4], "utf8"), Buffer.from(expected, "utf8"));
}

// trace:v1 id=impl.preview-auth.session-cookie work=WORK-PHO-MB4M5AH6 satisfies=REQ-PHO-EM6MDMQA
export function buildSessionCookie(token: string, requestUrl?: string): string {
  const name = previewCookieName(requestUrl ?? null);
  const secure = name === PREVIEW_COOKIE_NAME;

  // `__Host-` prefix: browsers enforce Secure + Path=/ + no Domain.
  // http://localhost rejects Secure cookies, so dev gets the plain name without it.
  return (
    `${name}=${encodeURIComponent(token)}; Path=/; ` +
    `Max-Age=${String(PREVIEW_SESSION_MAX_AGE_SECONDS)}; HttpOnly;${secure ? " Secure;" : ""} SameSite=Strict`
  );
}
