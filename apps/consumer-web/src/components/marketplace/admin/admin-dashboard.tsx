'use client'

import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard,
  Store,
  FileCheck,
  ShoppingCart,
  Tags,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  Eye,
  ShieldCheck,
  ShieldBan,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DashboardLayout, type NavItem } from '../dashboard/dashboard-layout'

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Overview', view: 'overview' },
  { icon: Store, label: 'Vendors', view: 'vendors' },
  { icon: FileCheck, label: 'Claims', view: 'claims' },
  { icon: ShoppingCart, label: 'Orders', view: 'orders' },
  { icon: Tags, label: 'Categories', view: 'categories' },
]

function GrowthBadge({ value }: { value: number }) {
  const isPositive = value >= 0
  return (
    <Badge
      variant="secondary"
      className={`text-xs font-medium ${
        isPositive
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-rose-50 text-rose-700 border-rose-200'
      }`}
    >
      {isPositive ? (
        <TrendingUp className="mr-1 h-3 w-3" />
      ) : (
        <TrendingDown className="mr-1 h-3 w-3" />
      )}
      {isPositive ? '+' : ''}
      {value.toFixed(1)}%
    </Badge>
  )
}

function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  prefix = '',
  loading,
}: {
  title: string
  value: number
  growth?: number
  icon: React.ElementType
  prefix?: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-2 h-8 w-28" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border border-border rounded-xl">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
            <Icon className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-foreground">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        {growth !== undefined && (
          <div className="mt-2">
            <GrowthBadge value={growth} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    },
  })

  const totals = data?.totals
  const growth = data?.growth

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Platform Overview</h2>
        <p className="text-sm text-muted-foreground">Platform-wide statistics and metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vendors"
          value={totals?.vendors || 0}
          growth={growth?.vendors}
          icon={Store}
          loading={isLoading}
        />
        <StatCard
          title="Total Products"
          value={totals?.products || 0}
          icon={Package}
          loading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={totals?.orders || 0}
          growth={growth?.orders}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <StatCard
          title="Total Revenue"
          value={totals?.revenue || 0}
          growth={growth?.revenue}
          icon={DollarSign}
          prefix="$"
          loading={isLoading}
        />
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vendor Breakdown */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Vendor Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              <>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border">
                  <span className="text-sm">Verified</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-0">
                    {data?.vendorBreakdown?.verified || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border">
                  <span className="text-sm">Featured</span>
                  <Badge className="bg-amber-50 text-amber-700 border-0">
                    {data?.vendorBreakdown?.featured || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border">
                  <span className="text-sm">Claimed</span>
                  <Badge className="bg-teal-50 text-teal-700 border-0">
                    {data?.vendorBreakdown?.claimed || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg border">
                  <span className="text-sm">Avg Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold">{data?.avgVendorRating || 0}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Breakdown */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))
            ) : (
              Object.entries(data?.orderBreakdown || {}).map(([status, count]) => {
                const statusColors: Record<string, string> = {
                  pending: 'bg-amber-50 text-amber-700',
                  confirmed: 'bg-teal-50 text-teal-700',
                  processing: 'bg-emerald-50 text-emerald-700',
                  completed: 'bg-green-50 text-green-700',
                  cancelled: 'bg-rose-50 text-rose-700',
                }
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border"
                  >
                    <span className="text-sm capitalize">{status}</span>
                    <Badge className={`${statusColors[status] || 'bg-gray-50 text-gray-700'} border-0`}>
                      {count as number}
                    </Badge>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function VendorManagement() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const res = await fetch('/api/vendors?limit=50')
      if (!res.ok) throw new Error('Failed to fetch vendors')
      return res.json()
    },
  })

  const vendors = data?.vendors || []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Vendor Management</h2>
        <p className="text-sm text-muted-foreground">Manage all vendors on the platform</p>
      </div>

      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Store className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No vendors found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor: {
                    id: string
                    name: string
                    status: string
                    rating: number
                    productCount?: number
                    isVerified: boolean
                    isFeatured: boolean
                  }) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium text-sm">
                        {vendor.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            vendor.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          } border-0`}
                        >
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-sm">{vendor.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {vendor.productCount || 0}
                      </TableCell>
                      <TableCell>
                        {vendor.isVerified ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-300" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
                              }
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-rose-600"
                              onClick={() =>
                                queryClient.invalidateQueries({ queryKey: ['admin-vendors'] })
                              }
                            >
                              <ShieldBan className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ClaimRequests() {
  const queryClient = useQueryClient()
  const [selectedClaim, setSelectedClaim] = React.useState<{
    id: string
    vendor?: { name: string }
    user?: { name: string; email: string }
    message?: string
    status: string
  } | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = React.useState(false)
  const [actionType, setActionType] = React.useState<'approve' | 'reject'>('approve')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-claims'],
    queryFn: async () => {
      const res = await fetch('/api/claim-requests?status=pending&limit=50')
      if (!res.ok) throw new Error('Failed to fetch claims')
      return res.json()
    },
  })

  const claims = data?.claimRequests || []

  const handleAction = (claim: typeof selectedClaim, type: 'approve' | 'reject') => {
    setSelectedClaim(claim)
    setActionType(type)
    setActionDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Claim Requests</h2>
        <p className="text-sm text-muted-foreground">Review and manage vendor claim requests</p>
      </div>

      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : claims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileCheck className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No pending claims</p>
              <p className="text-xs">All claim requests have been reviewed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Claimant</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim: {
                    id: string
                    vendor?: { name: string }
                    user?: { name: string; email: string }
                    message?: string
                    status: string
                    createdAt: string
                  }) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium text-sm">
                        {claim.vendor?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{claim.user?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground">{claim.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {claim.message ? (
                          <p className="text-xs text-muted-foreground truncate">
                            {claim.message}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No message</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-amber-50 text-amber-700 border-0 text-xs"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(claim.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8"
                            onClick={() => handleAction(claim, 'approve')}
                          >
                            <ShieldCheck className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
                            onClick={() => handleAction(claim, 'reject')}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve Claim' : 'Reject Claim'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? `Are you sure you want to approve the claim for "${selectedClaim?.vendor?.name}" by ${selectedClaim?.user?.name}?`
                : `Are you sure you want to reject the claim for "${selectedClaim?.vendor?.name}" by ${selectedClaim?.user?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className={
                actionType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }
              onClick={() => {
                setActionDialogOpen(false)
                queryClient.invalidateQueries({ queryKey: ['admin-claims'] })
              }}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function RecentOrders() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders?limit=20')
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    },
  })

  const orders = data?.orders || []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
        <p className="text-sm text-muted-foreground">All recent platform orders</p>
      </div>

      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: {
                    id: string
                    orderNumber: string
                    total: number
                    status: string
                    createdAt: string
                    vendor?: { name: string }
                    customer?: { name: string }
                  }) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-sm">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.vendor?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.customer?.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        ${order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-xs border-0 ${
                            order.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : order.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CategoryManagement() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      return res.json()
    },
  })

  const categories = data?.categories || []

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Categories</h2>
        <p className="text-sm text-muted-foreground">Manage marketplace categories</p>
      </div>

      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Tags className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No categories found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Subcategories</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories
                    .filter((c: { parentId?: string }) => !c.parentId)
                    .map((category: {
                      id: string
                      name: string
                      slug: string
                      productCount?: number
                      children?: Array<{
                        id: string
                        name: string
                        slug: string
                        productCount?: number
                      }>
                    }) => (
                    <React.Fragment key={category.id}>
                      <TableRow className="bg-muted/30">
                        <TableCell className="font-semibold text-sm">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {category.slug}
                        </TableCell>
                        <TableCell className="text-sm">
                          {category.productCount || 0}
                        </TableCell>
                        <TableCell className="text-sm">
                          {category.children?.length || 0}
                        </TableCell>
                      </TableRow>
                      {category.children?.map((child) => (
                        <TableRow key={child.id}>
                          <TableCell className="text-sm pl-8">
                            ↳ {child.name}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono">
                            {child.slug}
                          </TableCell>
                          <TableCell className="text-sm">
                            {child.productCount || 0}
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminDashboard() {
  const [activeView, setActiveView] = React.useState('overview')

  const breadcrumbs = [
    { label: 'Admin' },
    { label: navItems.find((i) => i.view === activeView)?.label || 'Overview' },
  ]

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverview />
      case 'vendors':
        return <VendorManagement />
      case 'claims':
        return <ClaimRequests />
      case 'orders':
        return <RecentOrders />
      case 'categories':
        return <CategoryManagement />
      default:
        return <AdminOverview />
    }
  }

  return (
    <DashboardLayout
      items={navItems}
      activeView={activeView}
      onNavigate={setActiveView}
      title="Admin Portal"
      breadcrumbs={breadcrumbs}
      userName="Admin User"
    >
      {renderContent()}
    </DashboardLayout>
  )
}
