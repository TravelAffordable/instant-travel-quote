/**
 * The hand-picking circles on hotel cards are only for the site owner while
 * working inside the Lovable editor preview (or local development).
 * They never render on the live/published website.
 */
export function isPickMode(): boolean {
  if (typeof window === 'undefined') return false;

  const { hostname, search } = window.location;

  // Explicit escape hatch for the owner: ?pick=1
  if (new URLSearchParams(search).get('pick') === '1') return true;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') return true;

  // Lovable editor preview sandboxes (never the published domain)
  if (hostname.endsWith('.lovableproject.com')) return true;
  if (hostname.startsWith('id-preview--') && hostname.endsWith('.lovable.app')) return true;

  return false;
}
