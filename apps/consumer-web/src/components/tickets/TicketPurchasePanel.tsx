'use client'

import { useState, useEffect } from 'react'
import { Ticket, Users, ChevronDown, ChevronUp, Check, Clock } from 'lucide-react'

interface Tier {
  id: string
  name: string
  description?: string
  price_cents: number
  capacity: number
  sold_count: number
  available: number
  is_sold_out: boolean
  sort_order: number
}

export function TicketPurchasePanel({ eventId, eventTitle }: { eventId: string; eventTitle: string }) {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ url: string } | null>(null)

  useEffect(() => {
    fetch(`/api/tickets/tiers/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setTiers(data.tiers ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [eventId])

  const handlePurchase = async () => {
    if (!selectedTier) return
    setPurchasing(true)
    setError(null)
    try {
      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier_id: selectedTier, event_id: eventId, quantity }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Purchase failed')
        return
      }
      if (data.stripe_session_url) {
        setSuccess({ url: data.stripe_session_url })
        window.location.href = data.stripe_session_url
      }
    } catch (err) {
      setError('Purchase failed. Please try again.')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) return <div className="animate-pulse h-48 bg-gray-100 rounded-xl" />
  if (tiers.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-xl font-black text-black mb-4 flex items-center gap-2">
        <Ticket className="w-5 h-5" /> Tickets
      </h2>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Redirecting to payment...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-3">
        {tiers.map(tier => (
          <button
            key={tier.id}
            onClick={() => !tier.is_sold_out && setSelectedTier(tier.id)}
            disabled={tier.is_sold_out}
            className={`w-full text-left p-4 border-2 rounded-xl transition-all ${
              selectedTier === tier.id
                ? 'border-black bg-black/5'
                : tier.is_sold_out
                ? 'border-gray-100 opacity-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-black">{tier.name}</p>
                {tier.description && <p className="text-xs text-gray-500 mt-1">{tier.description}</p>}
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs ${tier.available <= 10 ? 'text-orange-600' : 'text-gray-400'}`}>
                    {tier.is_sold_out ? 'Sold out' : `${tier.available} left`}
                  </span>
                  {!tier.is_sold_out && tier.available <= 10 && (
                    <span className="flex items-center gap-1 text-xs text-orange-600"><Clock className="w-3 h-3" /> Selling fast</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-black">${(tier.price_cents / 100).toFixed(2)}</p>
              </div>
            </div>
            {selectedTier === tier.id && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <label className="text-xs font-bold text-gray-600 uppercase">Quantity</label>
                <select
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="ml-2 border border-gray-300 rounded-lg px-3 py-1 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].filter(n => n <= tier.available).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="ml-3 text-sm font-bold text-black">
                  Total: ${((tier.price_cents * quantity) / 100).toFixed(2)}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedTier && (
        <button
          onClick={handlePurchase}
          disabled={purchasing}
          className="w-full mt-4 bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {purchasing ? 'Processing...' : `Buy ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
