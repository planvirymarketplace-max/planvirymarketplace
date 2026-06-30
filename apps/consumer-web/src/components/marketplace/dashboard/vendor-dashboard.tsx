'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  Package,
  ShoppingCart,
  Star,
  Users,
  Settings,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardLayout, type NavItem } from './dashboard-layout'
import { AnalyticsOverview } from './analytics-overview'
import { ProductsManagement } from './products-management'
import { OrdersManagement } from './orders-management'
import { ReviewsPanel } from './reviews-panel'
import { LeadsPanel } from './leads-panel'

const navItems: NavItem[] = [
  { icon: BarChart3, label: 'Overview', view: 'overview' },
  { icon: Package, label: 'Products', view: 'products' },
  { icon: ShoppingCart, label: 'Orders', view: 'orders' },
  { icon: Star, label: 'Reviews', view: 'reviews' },
  { icon: Users, label: 'Leads', view: 'leads' },
  { icon: Settings, label: 'Settings', view: 'settings' },
]

function VendorSettings({ vendorId }: { vendorId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['vendor-settings', vendorId],
    queryFn: async () => {
      const res = await fetch(`/api/vendors/${vendorId}`)
      if (!res.ok) throw new Error('Failed to fetch vendor')
      return res.json()
    },
    enabled: !!vendorId,
  })

  const vendor = data?.vendor

  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [website, setWebsite] = React.useState('')

  React.useEffect(() => {
    if (vendor) {
      setName(vendor.name || '')
      setDescription(vendor.description || '')
      setEmail(vendor.email || '')
      setPhone(vendor.phone || '')
      setAddress(vendor.address || '')
      setWebsite(vendor.website || '')
    }
  }, [vendor])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your business profile</p>
      </div>

      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="v-name">Business Name</Label>
            <Input
              id="v-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="v-desc">Description</Label>
            <Textarea
              id="v-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="v-email">Email</Label>
              <Input
                id="v-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-phone">Phone</Label>
              <Input
                id="v-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="v-address">Address</Label>
              <Input
                id="v-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="v-website">Website</Label>
              <Input
                id="v-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function VendorDashboard() {
  const [activeView, setActiveView] = React.useState('overview')
  const [vendorId, setVendorId] = React.useState<string | null>(null)

  // Fetch the first vendor for demo purposes
  const { data: vendorsData } = useQuery({
    queryKey: ['vendors-for-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?limit=1')
      if (!res.ok) throw new Error('Failed to fetch vendors')
      return res.json()
    },
  })

  React.useEffect(() => {
    if (vendorsData?.vendors?.[0]?.id && !vendorId) {
      setVendorId(vendorsData.vendors[0].id)
    }
  }, [vendorsData, vendorId])

  const breadcrumbs = [
    { label: 'Dashboard' },
    { label: navItems.find((i) => i.view === activeView)?.label || 'Overview' },
  ]

  const renderContent = () => {
    if (!vendorId) {
      return (
        <div className="flex items-center justify-center py-24">
          <Skeleton className="h-8 w-64" />
        </div>
      )
    }

    switch (activeView) {
      case 'overview':
        return <AnalyticsOverview vendorId={vendorId} />
      case 'products':
        return <ProductsManagement vendorId={vendorId} />
      case 'orders':
        return <OrdersManagement vendorId={vendorId} />
      case 'reviews':
        return <ReviewsPanel vendorId={vendorId} />
      case 'leads':
        return <LeadsPanel vendorId={vendorId} />
      case 'settings':
        return <VendorSettings vendorId={vendorId} />
      default:
        return <AnalyticsOverview vendorId={vendorId} />
    }
  }

  return (
    <DashboardLayout
      items={navItems}
      activeView={activeView}
      onNavigate={setActiveView}
      title="Vendor Portal"
      breadcrumbs={breadcrumbs}
      userName="Vendor User"
    >
      {renderContent()}
    </DashboardLayout>
  )
}
