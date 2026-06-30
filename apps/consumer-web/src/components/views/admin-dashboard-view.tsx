'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Store, ShoppingCart, DollarSign, Users, TrendingUp,
  TrendingDown, ArrowUpRight, CheckCircle2, XCircle,
  Eye, MoreHorizontal
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { mockVendors, mockOrders, mockRevenueData } from '@/lib/mock-data'
import { CATEGORY_LABELS } from '@/lib/medusa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Area, AreaChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  revenue: { label: 'Revenue', color: '#2563EB' },
}

const mockClaims = [
  { id: 'cl-1', vendorName: '5 Card Studs', userName: 'Mike Johnson', userEmail: 'mike@5cardstuds.com', status: 'pending', date: '2025-01-28' },
  { id: 'cl-2', vendorName: 'Cruise-A-Palooza Party Bus', userName: 'Sarah Chen', userEmail: 'sarah@cruiseapalooza.com', status: 'pending', date: '2025-01-27' },
  { id: 'cl-3', vendorName: 'The Pixel Booth', userName: 'Tom Wilson', userEmail: 'tom@pixelbooth.com', status: 'approved', date: '2025-01-20' },
]

const mockActivity = [
  { action: 'New vendor registered', detail: 'MKE Floral Design', time: '2 hours ago' },
  { action: 'Booking completed', detail: 'MKE-001 - $15,000.00', time: '4 hours ago' },
  { action: 'Claim request submitted', detail: '5 Card Studs', time: '6 hours ago' },
  { action: 'New review posted', detail: '5 stars for The Atrium', time: '8 hours ago' },
  { action: 'Vendor suspended', detail: 'Violated terms of service', time: '1 day ago' },
  { action: 'Payment processed', detail: '$4,500.00 - Films By Design', time: '1 day ago' },
]

export function AdminDashboardView() {
  const stats = [
    { title: 'Total Vendors', value: '547', change: '+12.5%', trend: 'up' as const, icon: Store, color: '#2563EB' },
    { title: 'Total Bookings', value: '1,423', change: '+8.2%', trend: 'up' as const, icon: ShoppingCart, color: '#F97316' },
    { title: 'Total Revenue', value: '$420K', change: '+15.3%', trend: 'up' as const, icon: DollarSign, color: '#0EA5E9' },
    { title: 'Pending Claims', value: '8', change: '-5.1%', trend: 'down' as const, icon: Users, color: '#FBBF24' },
  ]

  const vendorStatusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Planviry platform overview and management.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{stat.title}</span>
                    <div
                      className="size-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
                    >
                      <stat.icon className="size-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {stat.trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {stat.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-900">Platform Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <AreaChart data={mockRevenueData}>
                <defs>
                  <linearGradient id="fillAdminRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  fill="url(#fillAdminRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Vendors Table */}
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-gray-900">Vendors</CardTitle>
                <Badge variant="secondary">{mockVendors.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockVendors.slice(0, 6).map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {vendor.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">{vendor.name}</div>
                            <div className="text-xs text-gray-500">{CATEGORY_LABELS[vendor.category]}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] ${vendorStatusColors[vendor.status] || ''}`}>
                          {vendor.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-900">{vendor.rating}</span>
                          <span className="text-gray-500">({vendor.reviewCount})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="size-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <CheckCircle2 className="size-4 mr-2" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              <XCircle className="size-4 mr-2" /> Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Claims Queue */}
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-gray-900">Claims Queue</CardTitle>
                <Badge variant="secondary">{mockClaims.filter((c) => c.status === 'pending').length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockClaims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{claim.vendorName}</div>
                      <div className="text-xs text-gray-500">
                        Claimed by {claim.userName} ({claim.userEmail})
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={`text-[10px] ${
                        claim.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {claim.status}
                      </Badge>
                      {claim.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="size-7 text-green-600 cursor-pointer">
                            <CheckCircle2 className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 text-red-500 cursor-pointer">
                            <XCircle className="size-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900">{item.action}</span>
                    <span className="text-sm text-gray-500 ml-1">- {item.detail}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
