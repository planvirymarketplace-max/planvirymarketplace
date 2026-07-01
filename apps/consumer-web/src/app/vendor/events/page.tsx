'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { AppLayoutShell } from '@/components/AppLayoutShell'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Plus, Ticket, Pencil } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-amber-100 text-amber-700',
  ARCHIVED: 'bg-red-100 text-red-700',
  DELETED: 'bg-red-100 text-red-700',
}

type EventItem = {
  id: string
  title: string
  slug: string | null
  status: string | null
  base_price_cents: number | null
  currency: string | null
  created_at: string | null
  published_at: string | null
}

function formatPrice(cents: number | null | undefined, currency: string | null | undefined) {
  if (!cents) return 'Free'
  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  })
}

function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '—'
  }
}

export default function EventsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<EventItem[]>([])
  const [vendorName, setVendorName] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login?returnTo=/vendor/events'); return }
      const { data: staff } = await supabase
        .from('vendor_staff')
        .select('vendor_id, vendor_accounts!inner(name)')
        .eq('user_id', user.id)
        .eq('status', 'ACTIVE')
        .maybeSingle()
      if (!staff) { router.push('/onboarding/vendor'); return }

      setVendorName(
        (staff.vendor_accounts as { name?: string } | null)?.name ?? null,
      )

      try {
        const { data: items, error: itemsErr } = await supabase
          .from('inventory_items')
          .select(`
            id, title, slug, status, base_price_cents, currency,
            created_at, published_at
          `)
          .eq('vendor_id', staff.vendor_id)
          .eq('category', 'EVENT_TICKET')
          .order('created_at', { ascending: false })

        if (itemsErr) {
          setError(itemsErr.message)
          setEvents([])
        } else {
          setEvents((items as EventItem[] | null) ?? [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
        setEvents([])
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <AppLayoutShell>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </AppLayoutShell>
    )
  }

  return (
    <AppLayoutShell>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>

          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-black text-black mb-1">Events</h1>
              <p className="text-sm text-gray-500">
                {vendorName
                  ? `Event-ticket inventory for ${vendorName}.`
                  : 'Event-ticket inventory for your vendor account.'}
                {' '}
                Manage shows, performances, and seating via the EventSeats admin.
              </p>
            </div>
            <Button asChild>
              <Link href="/tickets/admin/shows">
                <Plus className="w-4 h-4" /> Create event
              </Link>
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 mb-4">
              {error}
            </div>
          )}

          {events.length === 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Ticket className="w-5 h-5" />
                  <CardTitle>No event tickets yet</CardTitle>
                </div>
                <CardDescription>
                  You haven&apos;t listed any event-ticket inventory. Create your
                  first show with performances, tiers, and reserved seating via
                  the EventSeats admin.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/tickets/admin/shows">
                    <Plus className="w-4 h-4" /> Create your first event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Event ticket listings</CardTitle>
                <CardDescription>
                  {events.length} event{events.length === 1 ? '' : 's'} ·
                  click Edit to manage show details, performances, and seating.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((ev) => (
                      <TableRow key={ev.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="truncate max-w-[320px]">{ev.title}</span>
                            {ev.slug && (
                              <span className="text-xs text-gray-400 font-mono truncate max-w-[320px]">
                                {ev.slug}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <span
                              className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                                STATUS_STYLES[ev.status ?? 'DRAFT'] ?? 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {ev.status ?? 'DRAFT'}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(ev.base_price_cents, ev.currency)}
                        </TableCell>
                        <TableCell className="text-right text-gray-500">
                          {formatDate(ev.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/vendor/listings/${ev.id}/edit`}>
                                <Pencil className="w-3.5 h-3.5" /> Edit
                              </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                              <Link href="/tickets/admin/shows">
                                <Ticket className="w-3.5 h-3.5" /> Shows
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayoutShell>
  )
}
