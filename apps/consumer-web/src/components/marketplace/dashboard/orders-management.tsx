'use client'

import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ShoppingCart,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface OrdersManagementProps {
  vendorId: string
}

interface OrderItem {
  id: string
  orderNumber: string
  customerId: string
  vendorId: string
  status: string
  total: number
  subtotal: number
  tax: number
  paymentStatus: string
  createdAt: string
  customer?: { id: string; name: string; email: string; avatar?: string }
  items?: Array<{
    id: string
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product?: { id: string; name: string; type: string; images?: string }
  }>
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    confirmed: { bg: 'bg-teal-50', text: 'text-teal-700', icon: CheckCircle2 },
    processing: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Truck },
    completed: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', icon: XCircle },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle },
  }
  const c = config[status] || config.pending
  const Icon = c.icon
  return (
    <Badge variant="secondary" className={`${c.bg} ${c.text} border-0 text-xs gap-1`}>
      <Icon className="h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function PaymentBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
    failed: { bg: 'bg-rose-50', text: 'text-rose-700' },
    refunded: { bg: 'bg-gray-100', text: 'text-gray-600' },
  }
  const c = config[status] || config.pending
  return (
    <Badge variant="outline" className={`${c.bg} ${c.text} border-0 text-xs`}>
      <CreditCard className="mr-1 h-3 w-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function OrdersManagement({ vendorId }: OrdersManagementProps) {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')
  const [selectedOrder, setSelectedOrder] = React.useState<OrderItem | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['orders', vendorId, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ vendorId, limit: '50' })
      if (statusFilter && statusFilter !== 'all') {
        params.set('status', statusFilter)
      }
      const res = await fetch(`/api/orders?${params}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      return res.json()
    },
    enabled: !!vendorId,
  })

  const orders: OrderItem[] = data?.orders || []

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase())
  )

  const openDetail = (order: OrderItem) => {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Orders</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Orders Table */}
      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-sm">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.customer?.name || 'Unknown'}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        ${order.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={order.paymentStatus} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetail(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
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

      {/* Order Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Order details and items
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{selectedOrder.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <OrderStatusBadge status={selectedOrder.status} />
                  <div className="mt-1">
                    <PaymentBadge status={selectedOrder.paymentStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} &times; ${item.unitPrice}
                        </p>
                      </div>
                      <span className="text-sm font-semibold">
                        ${item.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${selectedOrder.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
