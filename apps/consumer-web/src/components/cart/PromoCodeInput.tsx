'use client'

import { useState } from 'react'
import { Tag, Check, X } from 'lucide-react'

export function PromoCodeInput({ onApply }: { onApply: (code: string, discountCents: number) => void }) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')
  const [discount, setDiscount] = useState(0)
  const [error, setError] = useState('')

  const handleApply = async () => {
    if (!code.trim()) return
    setStatus('validating')
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_items: [], promo_code: code }),
      })
      const data = await res.json()
      // If we get a discount back, it's valid
      if (data.discount_code) {
        setStatus('valid')
        setDiscount(data.discount_cents || 0)
        onApply(data.discount_code, data.discount_cents || 0)
      } else {
        setStatus('invalid')
        setError('Invalid promo code')
      }
    } catch {
      setStatus('invalid')
      setError('Failed to validate code')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="Promo code"
          disabled={status === 'valid'}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-50"
        />
      </div>
      {status === 'valid' ? (
        <div className="flex items-center gap-1 text-green-600">
          <Check className="w-4 h-4" />
          <span className="text-xs font-bold">-${(discount / 100).toFixed(2)}</span>
          <button onClick={() => { setStatus('idle'); setCode(''); setDiscount(0) }} className="ml-1">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleApply}
          disabled={status === 'validating' || !code.trim()}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          {status === 'validating' ? '...' : 'Apply'}
        </button>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
