'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import type { NotificationPrefs, Profile } from './page'

interface Props {
  profile: Profile
  authEmail: string | null
}

export function ProfileForm({ profile, authEmail }: Props) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [email, setEmail] = useState(profile.email ?? authEmail ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [locale, setLocale] = useState(profile.locale ?? 'en')
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    profile.notification_prefs ?? { email: true, push: true, sms: false },
  )
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        display_name: displayName.trim() || undefined,
        phone: phone.trim() || undefined,
        locale: locale.trim() || undefined,
        notification_prefs: {
          email: !!prefs.email,
          push: !!prefs.push,
          sms: !!prefs.sms,
        },
      }
      const res = await fetch('/api/v1/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json?.error?.message ?? 'Failed to save profile')
      }
      toast.success('Profile updated')
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Identity */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-black text-black uppercase tracking-wider">
            Identity
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            How you appear across Planviry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Display name"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Your name"
          />
          <Field
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            disabled
            hint="Email is managed by your auth provider."
          />
          <Field
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="+1 555 555 5555"
          />
          <Field
            label="Locale"
            value={locale}
            onChange={setLocale}
            placeholder="en"
          />
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-black text-black uppercase tracking-wider">
            Notification preferences
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Choose how Planviry may contact you.
          </p>
        </div>

        <div className="space-y-3">
          <ToggleRow
            label="Email"
            description="Booking confirmations, reminders, and product updates."
            checked={!!prefs.email}
            onChange={(v) => setPrefs({ ...prefs, email: v })}
          />
          <ToggleRow
            label="Push"
            description="Real-time alerts on your devices."
            checked={!!prefs.push}
            onChange={(v) => setPrefs({ ...prefs, push: v })}
          />
          <ToggleRow
            label="SMS"
            description="Time-sensitive messages (rates may apply)."
            checked={!!prefs.sms}
            onChange={(v) => setPrefs({ ...prefs, sms: v })}
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-black px-4 py-2.5 rounded-lg hover:bg-coral disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

// ─── Field ─────────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  hint?: string
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 block w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      />
      {hint && <span className="text-[10px] text-gray-400 mt-1 block">{hint}</span>}
    </label>
  )
}

// ─── Toggle row ────────────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer">
      <div className="flex-1">
        <p className="text-sm font-bold text-black">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-11 h-6 rounded-full transition-colors relative ${
          checked ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}
