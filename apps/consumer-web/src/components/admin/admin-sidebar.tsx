'use client'

import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingCart,
  CalendarDays,
  Megaphone,
  Users,
  Settings,
  MapPin,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const mainNavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, view: 'vendor-dashboard' as const, badge: null },
  { title: 'Analytics', icon: BarChart3, view: 'vendor-dashboard' as const, badge: null },
]

const commerceItems = [
  { title: 'Products', icon: Package, view: 'vendor-dashboard' as const, badge: '12' },
  { title: 'Orders', icon: ShoppingCart, view: 'vendor-dashboard' as const, badge: '3' },
  { title: 'Bookings', icon: CalendarDays, view: 'vendor-dashboard' as const, badge: null },
]

const marketingItems = [
  { title: 'Promotions', icon: Megaphone, view: 'vendor-dashboard' as const, badge: null },
  { title: 'Leads', icon: Users, view: 'vendor-dashboard' as const, badge: '5' },
]

const settingsItems = [
  { title: 'Settings', icon: Settings, view: 'vendor-dashboard' as const, badge: null },
]

export function AdminSidebar() {
  const { currentView, user, setView } = useAppStore()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => setView('home')}
              className="cursor-pointer"
            >
              <div className="bg-blue-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg font-bold text-[10px]">
                MKE
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-blue-600">Planviry</span>
                <span className="truncate text-xs text-gray-500">Vendor Portal</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={currentView === item.view}
                    onClick={() => setView(item.view)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Commerce</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commerceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Marketing</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {marketingItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={false}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="cursor-default">
              <Avatar className="size-8">
                <AvatarFallback className="bg-blue-50 text-blue-600 text-xs">
                  {user?.name?.charAt(0) || 'V'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name || 'Vendor User'}</span>
                <span className="truncate text-xs text-gray-500">{user?.email || 'vendor@planviry.com'}</span>
              </div>
              <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                {user?.role || 'vendor'}
              </Badge>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
