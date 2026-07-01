import { AppLayoutShell } from '@/components/AppLayoutShell'

/**
 * SIDEBAR-4: Wraps ALL `/tickets/*` routes (customer + admin) in the Planviry
 * AppLayoutShell so the sidebar nav-rail + global header + SiteFooter render
 * around the ported EventSeats ticketing flow. Previously every tickets page
 * rendered its own standalone EventSeats chrome (own <header>/<nav>/<footer>),
 * which broke orchestration (user couldn't jump hotel → dinner → tickets
 * without losing the sidebar). Now the layout provides the shell once, and
 * individual pages render only their content.
 *
 * Note: the 4 already-wrapped pages (/tickets, /tickets/search,
 * /tickets/[group], /tickets/[group]/[subcategory]) had their per-page
 * <AppLayoutShell> wrapper removed to avoid double-chrome.
 */
export default function TicketsLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutShell>{children}</AppLayoutShell>
}
