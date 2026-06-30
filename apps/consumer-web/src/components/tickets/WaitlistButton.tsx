'use client'

import { useState } from 'react'
import { Users, Check, Loader2 } from 'lucide-react'

export function WaitlistButton({ itemId }: { itemId: string }) {
  const [status, setStatus] = useState<'idle' | 'joining' | 'joined' | 'error'>('idle')

  const handleJoin = async () => {
    setStatus('joining')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity: 1 }),
      })
      if (res.ok) {
        setStatus('joined')
      } else {
        const data = await res.json()
        if (data.error?.includes('Already')) setStatus('joined')
        else setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'joined') {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
        <Check className="w-4 h-4" /> On waitlist
      </div>
    )
  }

  return (
    <button
      onClick={handleJoin}
      disabled={status === 'joining'}
      className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 font-bold text-sm rounded-lg border border-orange-200 hover:bg-orange-100 disabled:opacity-50"
    >
      {status === 'joining' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
      Join Waitlist
    </button>
  )
}
