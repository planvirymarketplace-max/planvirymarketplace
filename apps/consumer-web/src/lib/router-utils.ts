/**
 * Router utilities for Next.js App Router.
 * Previously used hash-based routing - now uses standard URL paths.
 */

/** Read query params from the current URL search string (client-side). */
export function getUrlQueryParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/** Navigate using the app router, optionally appending query params. */
export function navigateWithQuery(
  navigate: (path: string) => void,
  path: string,
  params?: Record<string, string>,
) {
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    navigate(`${path}?${searchParams.toString()}`);
  } else {
    navigate(path);
  }
}

/** Extract the path portion (before `?`) from a URL string. */
export function getPathOnly(url: string): string {
  const queryIndex = url.indexOf("?");
  return queryIndex === -1 ? url : url.slice(0, queryIndex);
}

// Legacy compat aliases (these used to work with hash URLs)
export const getHashQueryParams = getUrlQueryParams;
export const getHashPathOnly = getPathOnly;
