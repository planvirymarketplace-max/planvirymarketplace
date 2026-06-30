'use client'

import * as React from 'react'
import {
  BarChart3,
  Package,
  ShoppingCart,
  Star,
  Users,
  Settings,
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAppStore } from '@/lib/store'

export interface NavItem {
  icon: React.ElementType
  label: string
  view: string
}

interface DashboardLayoutProps {
  items: NavItem[]
  activeView: string
  onNavigate: (view: string) => void
  title: string
  breadcrumbs?: { label: string; view?: string }[]
  userName?: string
  userAvatar?: string
  children: React.ReactNode
}

function SidebarContent({
  items,
  activeView,
  onNavigate,
  title,
  collapsed,
  mobile = false,
  onNavClick,
}: {
  items: NavItem[]
  activeView: string
  onNavigate: (view: string) => void
  title: string
  collapsed: boolean
  mobile?: boolean
  onNavClick?: () => void
}) {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
          M
        </div>
        {(!collapsed || mobile) && (
          <span className="font-semibold text-foreground text-sm">{title}</span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.view
          return (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view)
                if (onNavClick) onNavClick()
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-emerald-50 hover:text-emerald-700',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Back to Marketplace */}
      <div className="border-t p-2">
        <button
          onClick={() => navigate('home')}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
            'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span>Back to Marketplace</span>}
        </button>
      </div>
    </div>
  )
}

export function DashboardLayout({
  items,
  activeView,
  onNavigate,
  title,
  breadcrumbs = [],
  userName = 'Vendor',
  userAvatar,
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const navigate = useAppStore((s) => s.navigate)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r bg-card transition-all duration-300',
          collapsed ? 'w-16' : 'w-56'
        )}
      >
        <SidebarContent
          items={items}
          activeView={activeView}
          onNavigate={onNavigate}
          title={title}
          collapsed={collapsed}
        />
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent
            items={items}
            activeView={activeView}
            onNavigate={onNavigate}
            title={title}
            collapsed={collapsed}
            mobile
            onNavClick={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 shrink-0">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Breadcrumb */}
          <Breadcrumb className="hidden sm:flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer"
                  onClick={() => navigate('home')}
                >
                  Marketplace
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {crumb.view ? (
                      <BreadcrumbLink
                        className="cursor-pointer"
                        onClick={() => onNavigate(crumb.view!)}
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-3">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                      {userName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">vendor@example.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('home')}>
                  <Home className="mr-2 h-4 w-4" />
                  Back to Marketplace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
