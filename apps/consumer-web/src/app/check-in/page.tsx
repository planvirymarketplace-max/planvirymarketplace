'use client'

import { useState } from 'react'
import { QrCode, CheckCircle2, XCircle, Camera } from 'lucide-react'
import { AppLayoutShell } from '@/components/AppLayoutShell'

export default function CheckInPage() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState<{ valid: boolean; attendee_name?: string; event_title?: string; error?: string } | null>(null)
  const [scanning, setScanning] = useState(false)

  const handleCheckIn = async () => {
    if (!token.trim()) return
    setScanning(true)
    setResult(null)
    try {
      const listToken = new URLSearchParams(window.location.search).get('token') || ''
      const res = await fetch(`/api/public/check-in?token=${listToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_token: token }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ valid: false, error: 'Network error' })
    } finally {
      setScanning(false)
    }
  }

  return (
    <AppLayoutShell>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-black text-black mb-2">Check-in Scanner</h1>
          <p className="text-sm text-gray-500 mb-6">Scan or enter the QR code to check in attendees.</p>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="font-bold text-black">Manual Entry</p>
                <p className="text-xs text-gray-500">Type or paste the QR code</p>
              </div>
            </div>

            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheckIn()}
              placeholder="QR code value..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono"
            />

            <button
              onClick={handleCheckIn}
              disabled={scanning || !token.trim()}
              className="w-full mt-3 bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {scanning ? 'Checking...' : 'Check In'}
            </button>

            {result && (
              <div className={`mt-4 p-4 rounded-lg border ${result.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {result.valid ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-bold text-green-800">Checked in!</p>
                      <p className="text-sm text-green-700">{result.attendee_name}</p>
                      {result.event_title && <p className="text-xs text-green-600">{result.event_title}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="font-bold text-red-800">Denied</p>
                      <p className="text-sm text-red-700">{result.error || 'Invalid ticket'}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayoutShell>
  )
}
