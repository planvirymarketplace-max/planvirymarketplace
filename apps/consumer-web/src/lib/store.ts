'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewName =
  | 'home'
  | 'directory'
  | 'detail'
  | 'claim'
  | 'login'
  | 'dashboard'
  | 'admin'

export type SidebarSection =
  | 'explore'
  | 'featured'
  | 'cart-booking'
  | 'categories'
  | 'nearby'
  | 'neighborhoods'

export interface AppUser {
  id: string
  email: string
  name: string
  role: 'customer' | 'vendor' | 'admin'
  avatar?: string
}

interface AppState {
  currentView: ViewName
  selectedVendorId: string | null
  selectedCategory: string | null
  searchQuery: string
  user: AppUser | null
  sidebarOpen: boolean
  activeSidebarSection: SidebarSection
  viewAs: 'customer' | 'vendor'

  // Actions
  setView: (view: ViewName) => void
  selectVendor: (vendorId: string | null) => void
  selectCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setUser: (user: AppUser | null) => void
  goHome: () => void
  navigateToVendor: (vendorId: string) => void
  navigateToCategory: (category: string) => void
  navigateToSearch: (query: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setActiveSidebarSection: (section: SidebarSection) => void
  setViewAs: (role: 'customer' | 'vendor') => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'home',
  selectedVendorId: null,
  selectedCategory: null,
  searchQuery: '',
  user: null,
  sidebarOpen: false,
  activeSidebarSection: 'explore',
  viewAs: 'customer',

  setView: (view) => set({ currentView: view }),
  selectVendor: (vendorId) => set({ selectedVendorId: vendorId }),
  selectCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUser: (user) => set({ user }),
  goHome: () => set({ currentView: 'home', selectedVendorId: null, selectedCategory: null, searchQuery: '', activeSidebarSection: 'explore' }),
  navigateToVendor: (vendorId) => set({ currentView: 'detail', selectedVendorId: vendorId }),
  navigateToCategory: (category) => set({ currentView: 'directory', selectedCategory: category, searchQuery: '', activeSidebarSection: 'categories' }),
  navigateToSearch: (query) => set({ currentView: 'directory', searchQuery: query, selectedCategory: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveSidebarSection: (section) => set({ activeSidebarSection: section, sidebarOpen: true }),
  setViewAs: (role) => set({ viewAs: role }),
}))

// ── Location Store (persisted to localStorage) ──────────────────────────────

interface LocationState {
  location: string
  setLocation: (location: string) => void
  lat: number | null
  lng: number | null
  setCoords: (lat: number, lng: number) => void
  clearLocation: () => void
  confirmed: boolean
  confirmLocation: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: '',
      setLocation: (location) => set({ location }),
      lat: null,
      lng: null,
      setCoords: (lat, lng) => set({ lat, lng }),
      clearLocation: () => set({ location: '', lat: null, lng: null, confirmed: false }),
      confirmed: false,
      confirmLocation: () => set({ confirmed: true }),
    }),
    { name: 'planviry-location' }
  )
)
