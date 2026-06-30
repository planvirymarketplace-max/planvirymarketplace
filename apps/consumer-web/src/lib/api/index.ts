/**
 * @planviry/api — shared API infrastructure barrel.
 *
 * Part XI §11.2 — Global API Standards. Every route handler imports from here.
 */

export { ok, noContent, error, requestId, type ApiSuccessResponse, type ApiErrorResponse, type ApiMeta } from "./envelope";
export * as Errors from "./errors";
export { getAuthContext, requireAuth, type AuthContext } from "./auth";
export { checkRateLimit, RATE_LIMITS, getClientIp } from "./rate-limit";
export * as Schemas from "./schemas";

/**
 * Parse + validate query params against a Zod schema.
 * Returns { success: true, data } or { success: false, error }.
 */
export function parseQuery<T>(
  schema: { safeParse: (d: unknown) => { success: true; data: T } | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } } },
  params: Record<string, string | string[] | undefined>,
): { success: true; data: T } | { success: false; error: ReturnType<typeof import("./errors").zodErrors> } {
  const result = schema.safeParse(params);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: require_zodErrors(result.error) };
}

// Lazy import to avoid circular dep at module load.
function require_zodErrors(err: { issues: { path: (string | number)[]; message: string }[] }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { zodErrors } = require("./errors") as typeof import("./errors");
  return zodErrors(err);
}
