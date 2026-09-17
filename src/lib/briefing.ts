import { z } from "zod";

const MAX_LENGTHS = { name: 120, agency: 160, email: 254, role: 120, message: 4000 } as const;

/** Server-side briefing qualification: named domain object, no unknown inputs. */
const BriefingSchema = z.object({
  name: z.string().trim().min(2).max(MAX_LENGTHS.name),
  agency: z.string().trim().min(2).max(MAX_LENGTHS.agency),
  email: z.email().trim().max(MAX_LENGTHS.email),
  role: z.string().trim().min(2).max(MAX_LENGTHS.role),
  useCase: z.enum(["incident-command", "ops-planning", "utility", "research", "other"]),
  message: z.string().trim().min(20).max(MAX_LENGTHS.message),
  website: z.string().max(200).optional(),
  startedAt: z.coerce.number().int().nonnegative(),
});

// trace:exempt reason=internal-detail -- briefing result shapes
export type BriefingInput = z.infer<typeof BriefingSchema>;

// trace:exempt reason=internal-detail -- briefing failure shape
export interface BriefingFailure {
  ok: false;
  fields: Record<string, string>;
}

// trace:exempt reason=internal-detail -- briefing accepted shape
export interface BriefingAccepted {
  ok: true;
  input: BriefingInput;
  botLike: boolean;
}

const MIN_DWELL_MS = 4000;

/** Validate one briefing submission; bot-like passes validation but never sends. */
// trace:v1 id=impl.briefing-validation work=WORK-PHO-18KENMFK satisfies=REQ-PHO-9Q311JSZ
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- unknown request payload IS the input; safeParse below is the decoder.
export function validateBriefing(payload: unknown, now = Date.now()): BriefingAccepted | BriefingFailure {
  const parsed = BriefingSchema.safeParse(payload);

  if (!parsed.success) {
    const fields: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");

      if (!fields[key]) fields[key] = issue.message;
    }

    return { ok: false, fields };
  }

  const botLike = parsed.data.website !== undefined && parsed.data.website !== ""
    || now - parsed.data.startedAt < MIN_DWELL_MS;

  return { ok: true, input: parsed.data, botLike };
}
