/**
 * UnifiedGrid — THE one grid layout for card results.
 *
 * Wraps UnifiedCard in a responsive grid.
 */

export function UnifiedGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  )
}
