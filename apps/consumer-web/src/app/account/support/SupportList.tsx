'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  Inbox,
  LifeBuoy,
  Loader2,
  Plus,
  Send,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { ServiceTicket } from './page'

// ─── Types ────────────────────────────────────────────────────────────────
type VendorAccount = { id: string; name: string; slug: string }
type Reservation = { id: string; inventory_items: { title: string | null } | null }

// ─── Display helpers ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  OPEN: 'bg-sky-100 text-sky-700 border-sky-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  BLOCKED: 'bg-red-100 text-red-700 border-red-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

const PRIORITY_STYLES: Record<string, string> = {
  URGENT: 'bg-red-100 text-red-700 border-red-200',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
  MEDIUM: 'bg-sky-100 text-sky-700 border-sky-200',
  LOW: 'bg-gray-100 text-gray-600 border-gray-200',
}

function formatRelative(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const diffMs = Date.now() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatFull(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const TICKET_CATEGORIES = [
  'RESERVATION',
  'BILLING',
  'TECHNICAL',
  'FEEDBACK',
  'OTHER',
] as const

// ─── Ticket card ───────────────────────────────────────────────────────────

function TicketCard({ ticket }: { ticket: ServiceTicket }) {
  const status = ticket.status ?? 'OPEN'
  const priority = ticket.priority ?? 'MEDIUM'
  const category = ticket.category ?? 'OTHER'

  return (
    <Card className="gap-3 py-4 hover:shadow-md transition-shadow">
      <CardHeader className="gap-1.5 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <Badge
              variant="outline"
              className={`text-[10px] uppercase ${
                STATUS_STYLES[status] ?? STATUS_STYLES.OPEN
              }`}
            >
              {status.replace(/_/g, ' ')}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] uppercase ${
                PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.MEDIUM
              }`}
            >
              {priority}
            </Badge>
            <span className="text-[10px] text-gray-400 font-mono uppercase">
              {category}
            </span>
          </div>
          <span
            className="text-[11px] text-gray-400 shrink-0"
            title={formatFull(ticket.created_at)}
          >
            {formatRelative(ticket.created_at)}
          </span>
        </div>
        <CardTitle className="text-sm font-bold text-black">
          {ticket.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {ticket.description && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3">
            {ticket.description}
          </p>
        )}
        <div className="mt-3 flex items-center gap-3 flex-wrap text-[11px] text-gray-400">
          <span className="font-mono">
            #{ticket.id.slice(0, 8)}
          </span>
          {ticket.reservation_id && (
            <span>
              Reservation: <span className="font-mono">{ticket.reservation_id.slice(0, 8)}</span>
            </span>
          )}
          {ticket.assigned_to && (
            <span>
              Assigned: <span className="font-mono">{ticket.assigned_to.slice(0, 8)}</span>
            </span>
          )}
          {ticket.due_at && (
            <span title={`Due ${formatFull(ticket.due_at)}`}>
              Due {formatRelative(ticket.due_at)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── New ticket dialog ─────────────────────────────────────────────────────

function NewTicketDialog({
  vendors,
  reservations,
  open,
  onOpenChange,
  onCreated,
}: {
  vendors: VendorAccount[]
  reservations: Reservation[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}) {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<string>('RESERVATION')
  const [vendorId, setVendorId] = useState<string>('')
  const [reservationId, setReservationId] = useState<string>('')
  const [priority, setPriority] = useState<string>('MEDIUM')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canSubmit =
    subject.trim().length > 0 &&
    message.trim().length > 0 &&
    vendorId.length > 0 &&
    !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const payload: Record<string, string> = {
        subject: subject.trim(),
        category,
        vendor_id: vendorId,
        message: message.trim(),
        priority,
      }
      if (reservationId) payload.reservation_id = reservationId

      const res = await fetch('/api/service-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Failed (${res.status})`)
      }
      toast.success('Support ticket created')
      // Reset form
      setSubject('')
      setCategory('RESERVATION')
      setVendorId('')
      setReservationId('')
      setPriority('MEDIUM')
      setMessage('')
      onOpenChange(false)
      onCreated()
      router.refresh()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to create ticket',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-gray-500" />
            New support ticket
          </DialogTitle>
          <DialogDescription>
            Tell us what&apos;s going on. Our team will respond via email.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-subject" className="text-xs uppercase font-bold text-gray-500">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ticket-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your issue"
              maxLength={200}
              required
              autoFocus
            />
          </div>

          {/* Vendor + Category + Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="ticket-vendor"
                className="text-xs uppercase font-bold text-gray-500"
              >
                Vendor <span className="text-red-500">*</span>
              </Label>
              <select
                id="ticket-vendor"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                required
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Choose vendor…</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="ticket-category"
                className="text-xs uppercase font-bold text-gray-500"
              >
                Category
              </Label>
              <select
                id="ticket-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {TICKET_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reservation + Priority row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="ticket-reservation"
                className="text-xs uppercase font-bold text-gray-500"
              >
                Related reservation
              </Label>
              <select
                id="ticket-reservation"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">None</option>
                {reservations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.inventory_items?.title ?? 'Untitled'} · #{r.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="ticket-priority"
                className="text-xs uppercase font-bold text-gray-500"
              >
                Priority
              </Label>
              <select
                id="ticket-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <Label
              htmlFor="ticket-message"
              className="text-xs uppercase font-bold text-gray-500"
            >
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="ticket-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail. Include any relevant dates, confirmation numbers, or screenshots."
              rows={5}
              required
              className="resize-y"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? 'Submitting…' : 'Submit ticket'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── List (with New ticket button + dialog) ────────────────────────────────

export function SupportList({
  tickets,
  vendors,
  reservations,
}: {
  tickets: ServiceTicket[]
  vendors: VendorAccount[]
  reservations: Reservation[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleCreated = () => {
    router.refresh()
  }

  // If no vendors are available (vendor_accounts empty/missing), we can't
  // create tickets — surface a friendly notice instead of the form.
  const canCreateNew = vendors.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          {tickets.length > 0
            ? `Showing ${tickets.length} ticket${tickets.length === 1 ? '' : 's'}.`
            : 'Open a ticket to get help from our team.'}
        </p>
        {canCreateNew && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                New ticket
              </Button>
            </DialogTrigger>
            <NewTicketDialog
              vendors={vendors}
              reservations={reservations}
              open={open}
              onOpenChange={setOpen}
              onCreated={handleCreated}
            />
          </Dialog>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center flex flex-col items-center gap-3">
          <Inbox className="w-12 h-12 text-gray-200" />
          <p className="text-gray-500 font-semibold">No support tickets yet</p>
          <p className="text-sm text-gray-400 max-w-md">
            Need help with a reservation, billing, or a vendor? Open a ticket
            and our team will get back to you.
          </p>
          {canCreateNew ? (
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="gap-1.5 mt-2"
            >
              <Plus className="w-4 h-4" />
              Open your first ticket
            </Button>
          ) : (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" />
              Ticket creation is temporarily unavailable.
            </p>
          )}
        </div>
      ) : (
        tickets.map((t) => <TicketCard key={t.id} ticket={t} />)
      )}
    </div>
  )
}
