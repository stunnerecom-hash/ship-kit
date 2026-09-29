import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

// Review workflow shared by supplier and installer applications.
// REJECTED can be reopened for a second look.
export const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED:   ["REVIEWING", "REJECTED"],
  REVIEWING: ["APPROVED", "REJECTED"],
  APPROVED:  ["REJECTED"],
  REJECTED:  ["REVIEWING"],
};

export const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((v) => v || undefined);

export const optionalUrl = (message: string) =>
  z.union([z.string().trim().url(message), z.literal("")]).optional().transform((v) => v || undefined);

export const StatusSchema = z.object({
  status:      z.nativeEnum(ApplicationStatus),
  reviewNotes: optionalText(2000),
});

// Only rejected applicants may re-apply. Returns the 409 message, or null if applying is allowed.
export function duplicateError(existing: { status: ApplicationStatus } | null, kind: string): string | null {
  if (!existing) return null;
  return existing.status === "APPROVED"
    ? `This email already belongs to an approved ${kind}`
    : "An application from this email is already under review";
}

export function statusCounts(rows: { status: ApplicationStatus; _count: { _all: number } }[]) {
  const counts = Object.fromEntries(Object.values(ApplicationStatus).map((s) => [s, 0])) as Record<ApplicationStatus, number>;
  for (const r of rows) counts[r.status] = r._count._all;
  return counts;
}
