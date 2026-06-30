import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vendor Portal - Planviry',
  description: 'Manage your business listing on Planviry',
}

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {children}
    </div>
  )
}
