/** Best-effort in-process request limiter.
 *
 *  Deliberately a tripwire, not a control: Vercel runs many isolates and each
 *  keeps its own map, so a determined attacker spread across isolates gets
 *  more than the nominal budget, and a restart clears the state. The durable
 *  answer is the platform WAF rule (spec §37). This exists so the login gate
 *  is not completely unthrottled when that rule is absent — which is the state
 *  the repository is actually in, since no WAF configuration is checked in.
 *
 *  Entries are pruned on read, so the map cannot grow without bound. */

// trace:v1 id=impl.rate-limit work=WORK-PHO-18KENMFK satisfies=REQ-PHO-EM6MDMQA
export interface RateLimit {
  windowMs: number;
  max: number;
}

const buckets = new Map<string, Map<string, number[]>>();

/** Identifies the caller. `x-forwarded-for` is set by the platform edge; it is
 *  spoofable in principle, which is another reason this is a tripwire. */
// trace:exempt reason=internal-helper
export function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** Records an attempt and reports whether the caller is now over budget. */
// trace:exempt reason=internal-helper
export function rateLimited(scope: string, key: string, limit: RateLimit, now = Date.now()): boolean {
  let bucket = buckets.get(scope);

  if (!bucket) {
    bucket = new Map<string, number[]>();
    buckets.set(scope, bucket);
  }

  const windowStart = now - limit.windowMs;

  // Drop keys whose entire window has aged out, so an attacker cycling source
  // addresses cannot grow this map indefinitely.
  for (const [entryKey, hits] of bucket) {
    if (hits.length === 0 || hits[hits.length - 1] <= windowStart) bucket.delete(entryKey);
  }

  const recent = (bucket.get(key) ?? []).filter((at) => at > windowStart);

  recent.push(now);
  bucket.set(key, recent);

  return recent.length > limit.max;
}

// trace:exempt reason=test-helper
export function resetRateLimits() {
  buckets.clear();
}

/** Whether this key is already over budget, without recording an attempt.
 *
 *  Paired with `recordFailure`, this throttles brute force by counting only
 *  failed attempts. Counting successes too would lock out a shared office IP
 *  for legitimate repeated logins, which is a denial of service against the
 *  people the gate exists to admit. */
// trace:exempt reason=internal-helper
export function overBudget(scope: string, key: string, limit: RateLimit, now = Date.now()): boolean {
  const windowStart = now - limit.windowMs;
  const recent = (buckets.get(scope)?.get(key) ?? []).filter((at) => at > windowStart);

  return recent.length >= limit.max;
}

// trace:exempt reason=internal-helper
export function recordFailure(scope: string, key: string, limit: RateLimit, now = Date.now()): void {
  rateLimited(scope, key, limit, now);
}

/** A success clears the key: the point is to slow guessing, not to punish
 *  someone who then authenticated correctly. */
// trace:exempt reason=internal-helper
export function clearFailures(scope: string, key: string): void {
  buckets.get(scope)?.delete(key);
}
