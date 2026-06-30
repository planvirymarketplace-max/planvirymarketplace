'use client'

import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
