'use client'

import * as React from 'react'
import {
  Eye,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { ChartContainer, type ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const CHART_COLORS = ['#10b981', '#14b8a6', '#f59e0b', '#f43f5e', '#8b5cf6']

interface AnalyticsOverviewProps {
  vendorId: string
}

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
    color: '#10b981',
  },
}

const ordersChartConfig: ChartConfig = {
  orders: {
    label: 'Orders',
    color: '#14b8a6',
  },
}

const sourceChartConfig: ChartConfig = {
  direct: { label: 'Direct', color: '#10b981' },
  google: { label: 'Google', color: '#14b8a6' },
  social: { label: 'Social', color: '#f59e0b' },
  referral: { label: 'Referral', color: '#f43f5e' },
  email: { label: 'Email', color: '#8b5cf6' },
}

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

function KPICard({
  title,
  value,
  growth,
  icon: Icon,
  prefix = '',
  loading,
}: {
  title: string
  value: number
  growth: number
  icon: React.ElementType
  prefix?: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="mt-2 h-8 w-28" />
          <Skeleton className="mt-2 h-4 w-16" />
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
        <div className="mt-2">
          <GrowthBadge value={growth} />
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsOverview({ vendorId }: AnalyticsOverviewProps) {
  const [period, setPeriod] = React.useState<'7d' | '30d' | '90d'>('30d')

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', vendorId, period],
    queryFn: async () => {
      const res = await fetch(`/api/analytics?vendorId=${vendorId}&period=${period}`)
      if (!res.ok) throw new Error('Failed to fetch analytics')
      return res.json()
    },
    enabled: !!vendorId,
  })

  const summary = data?.summary
  const dailyBreakdown = data?.dailyBreakdown || []
  const sourceBreakdown = data?.sourceBreakdown || {}

  // Format daily data for charts
  const chartData = dailyBreakdown.map((d: { date: string; views: number; leads: number; orders: number; revenue: number }) => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  // Format source data for pie chart
  const sourceData = Object.entries(sourceBreakdown).map(([source, data], i) => ({
    name: source.charAt(0).toUpperCase() + source.slice(1),
    value: (data as { views: number; leads: number; orders: number; revenue: number }).revenue,
    leads: (data as { views: number; leads: number; orders: number; revenue: number }).leads,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }))

  // Recent activity mock (derived from daily data)
  const recentActivity = dailyBreakdown.slice(-5).reverse().map((d: { date: string; orders: number; leads: number; revenue: number }, i: number) => ({
    id: i,
    date: d.date,
    orders: d.orders,
    leads: d.leads,
    revenue: d.revenue,
  }))

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Track your performance metrics</p>
        </div>
        <div className="flex gap-1 rounded-lg border bg-muted p-1">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? 'default' : 'ghost'}
              className={
                period === p
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : ''
              }
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Views"
          value={summary?.views || 0}
          growth={summary?.growth?.views || 0}
          icon={Eye}
          loading={isLoading}
        />
        <KPICard
          title="Leads"
          value={summary?.leads || 0}
          growth={summary?.growth?.leads || 0}
          icon={Users}
          loading={isLoading}
        />
        <KPICard
          title="Orders"
          value={summary?.orders || 0}
          growth={summary?.growth?.orders || 0}
          icon={ShoppingCart}
          loading={isLoading}
        />
        <KPICard
          title="Revenue"
          value={summary?.revenue || 0}
          growth={summary?.growth?.revenue || 0}
          icon={DollarSign}
          prefix="$"
          loading={isLoading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue Trend</CardTitle>
            <CardDescription className="text-xs">
              Daily revenue over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : chartData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ChartContainer config={revenueChartConfig} className="h-[250px] w-full">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    tickFormatter={(v) => `$${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Orders</CardTitle>
            <CardDescription className="text-xs">
              Daily orders over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : chartData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <ChartContainer config={ordersChartConfig} className="h-[250px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    className="fill-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="orders"
                    fill="#14b8a6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Breakdown */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Revenue by Source</CardTitle>
            <CardDescription className="text-xs">
              Where your revenue is coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : sourceData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                No data available
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <ChartContainer config={sourceChartConfig} className="h-[200px] w-[200px]">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex-1 space-y-2 w-full">
                  {sourceData.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between rounded-lg border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        ${s.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            <CardDescription className="text-xs">
              Latest metrics from the past days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
                No recent activity
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {recentActivity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(a.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.orders} orders &middot; {a.leads} leads
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      ${a.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
