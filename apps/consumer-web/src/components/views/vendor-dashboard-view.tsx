'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign, ShoppingCart, Users, Star, TrendingUp,
  TrendingDown, ArrowUpRight, Package, Eye, Plus
} from 'lucide-react'
import { AdminLayout } from '@/components/admin/admin-layout'
import { mockOrders, mockRevenueData, mockSourceData, mockLeads } from '@/lib/mock-data'
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

const chartConfig = {
  revenue: { label: 'Revenue', color: '#2563EB' },
  orders: { label: 'Orders', color: '#F97316' },
}

export function VendorDashboardView() {
  const stats = [
    { title: 'Total Bookings', value: '156', change: '+12.5%', trend: 'up' as const, icon: ShoppingCart, color: '#2563EB' },
    { title: 'Revenue', value: '$12,450', change: '+8.2%', trend: 'up' as const, icon: DollarSign, color: '#F97316' },
    { title: 'New Leads', value: '24', change: '+5.1%', trend: 'up' as const, icon: Users, color: '#0EA5E9' },
    { title: 'Rating', value: '4.8', change: '+0.2', trend: 'up' as const, icon: Star, color: '#FBBF24' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-sky-100 text-sky-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here&apos;s your business overview.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer border-gray-200">
              <Plus className="size-4 mr-1" /> Add Service
            </Button>
            <Button size="sm" className="cursor-pointer bg-blue-600 hover:bg-blue-700">
              <Eye className="size-4 mr-1" /> View Profile
            </Button>
          </div>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <AreaChart data={mockRevenueData}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#fillRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={mockRevenueData}>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources + Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Source Pie Chart */}
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-900">Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={mockSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                  >
                    {mockSourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="space-y-2 mt-2">
                {mockSourceData.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: source.fill }} />
                      <span className="text-gray-500">{source.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{source.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="lg:col-span-2 border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-gray-900">Recent Bookings</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs cursor-pointer text-blue-600">
                  View All <ArrowUpRight className="size-3 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.slice(0, 5).map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-sm text-gray-900">{order.orderNumber}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-[10px] ${statusColors[order.status] || ''}`}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-gray-900">${order.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Recent Leads */}
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-gray-900">Recent Leads</CardTitle>
              <Badge variant="secondary">{mockLeads.length} total</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{lead.name}</div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize border-gray-200">{lead.source}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize">{lead.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
