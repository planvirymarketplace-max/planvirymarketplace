'use client'

import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Phone,
  Mail,
  MessageSquare,
  Search,
  MoreHorizontal,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LeadsPanelProps {
  vendorId: string
}

interface LeadItem {
  id: string
  vendorId: string
  name: string
  email: string
  phone?: string
  message?: string
  source?: string
  status: string
  createdAt: string
  vendor?: { id: string; name: string; slug: string }
}

function LeadStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    new: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    contacted: { bg: 'bg-teal-50', text: 'text-teal-700' },
    qualified: { bg: 'bg-amber-50', text: 'text-amber-700' },
    lost: { bg: 'bg-rose-50', text: 'text-rose-700' },
  }
  const c = config[status] || config.new
  return (
    <Badge variant="secondary" className={`${c.bg} ${c.text} border-0 text-xs`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

function StatusSummaryCard({
  label,
  count,
  icon: Icon,
  color,
}: {
  label: string
  count: number
  icon: React.ElementType
  color: string
}) {
  return (
    <Card className="bg-card border border-border rounded-xl">
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function LeadsPanel({ vendorId }: LeadsPanelProps) {
  const queryClient = useQueryClient()
  const [search, setSearch] = React.useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['leads', vendorId],
    queryFn: async () => {
      const res = await fetch(`/api/leads?vendorId=${vendorId}&limit=100`)
      if (!res.ok) throw new Error('Failed to fetch leads')
      return res.json()
    },
    enabled: !!vendorId,
  })

  const leads: LeadItem[] = data?.leads ?? []

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  )

  // Count by status
  const statusCounts: Record<string, number> = { new: 0, contacted: 0, qualified: 0, lost: 0 }
  for (const l of leads) {
    if (statusCounts[l.status] !== undefined) statusCounts[l.status]++
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Leads</h2>
          <p className="text-sm text-muted-foreground">
            Track and manage potential customers
          </p>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusSummaryCard
          label="New"
          count={statusCounts.new}
          icon={UserPlus}
          color="bg-emerald-500"
        />
        <StatusSummaryCard
          label="Contacted"
          count={statusCounts.contacted}
          icon={Phone}
          color="bg-teal-500"
        />
        <StatusSummaryCard
          label="Qualified"
          count={statusCounts.qualified}
          icon={UserCheck}
          color="bg-amber-500"
        />
        <StatusSummaryCard
          label="Lost"
          count={statusCounts.lost}
          icon={UserX}
          color="bg-rose-500"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Leads Table */}
      <Card className="bg-card border border-border rounded-xl">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No leads found</p>
              <p className="text-xs">Leads will appear when customers inquire about your services</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium text-sm">
                        {lead.name}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        {lead.message ? (
                          <p className="text-xs text-muted-foreground truncate">
                            {lead.message}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No message</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {lead.source || 'direct'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <LeadStatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(lead.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
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
                              onClick={() => {
                                // Placeholder for status update
                                queryClient.invalidateQueries({ queryKey: ['leads', vendorId] })
                              }}
                            >
                              Mark Contacted
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                queryClient.invalidateQueries({ queryKey: ['leads', vendorId] })
                              }}
                            >
                              Mark Qualified
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-rose-600"
                              onClick={() => {
                                queryClient.invalidateQueries({ queryKey: ['leads', vendorId] })
                              }}
                            >
                              Mark Lost
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
