'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import * as Icons from 'lucide-react'
import { SURFACES_TAXONOMY_GROUPS, OCCASIONS_TAXONOMY_GROUPS } from '@/components/pages/ExplorePage'
import { getCategoryForService } from '@/data/prototype-data'
import { useApp } from '@/context/AppContext'

interface MegaMenuProps {
  type: 'occasions' | 'categories'
  children: React.ReactNode
  isActive?: boolean
}

export function MegaMenu({ type, children, isActive }: MegaMenuProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { setSearchWhat, setSearchWhere, searchWhere } = useApp()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setStep(1)
        setSelectedItem(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navigateWithIntent = (path: string, what: string) => {
    setSearchWhat(what)
    const params = new URLSearchParams()
    params.set('what', what)
    params.set('where', searchWhere || 'Savannah, GA')
    router.push(`${path}?${params.toString()}`)
    setOpen(false)
    setStep(1)
    setSelectedItem(null)
  }

  const groups = type === 'occasions' ? OCCASIONS_TAXONOMY_GROUPS : SURFACES_TAXONOMY_GROUPS

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setStep(1); setSelectedItem(null) }}
        className={`text-xs uppercase tracking-[0.2em] font-bold hover:text-champagne-gold transition-colors cursor-pointer py-3 border-b-2 ${
          isActive || open
            ? 'text-champagne-gold border-champagne-gold'
            : 'text-midnight-slate border-transparent'
        }`}
      >
        {children}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-0 bg-white rounded-b-xl shadow-2xl border border-midnight-slate/10 z-50 w-[700px] max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-midnight-slate/5 bg-gray-50/50">
            <span className="text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40">
              {step === 1
                ? (type === 'occasions' ? 'Browse by Occasion' : 'Browse by Category')
                : selectedItem?.name}
            </span>
            {step === 2 && (
              <button
                onClick={() => { setStep(1); setSelectedItem(null) }}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-midnight-slate/40 hover:text-midnight-slate transition-colors"
              >
                <Icons.ChevronLeft className="w-3 h-3" />
                Back
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {step === 1 ? (
              <div className="grid grid-cols-3 gap-3">
                {groups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-midnight-slate/40 px-1">
                      {group.groupName}
                    </div>
                    {group.items.map((item: any) => {
                      const ItemIcon = (Icons as any)[item.icon] || Icons.Sparkles
                      return (
                        <button
                          key={item.id}
                          onClick={() => { setSelectedItem(item); setStep(2) }}
                          className="w-full flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-midnight-slate/5 flex items-center justify-center shrink-0 group-hover:bg-champagne-gold/10 group-hover:text-champagne-gold transition-colors">
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-midnight-slate truncate">{item.name}</div>
                            <div className="text-[10px] text-midnight-slate/40 line-clamp-1">{item.desc}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              /* Step 2: Show subtypes/subcategories */
              <div className="space-y-3">
                {type === 'occasions' && selectedItem?.subtypes ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.subtypes.map((sub: any, idx: number) => {
                      const firstService = sub.services[0] || ''
                      const categoryLens = getCategoryForService(firstService)
                      const routeMap: Record<string, string> = {
                        'spaces': '/spaces', 'food-drink': '/food-drink', 'live-shows': '/live-shows',
                        'vendors': '/vendors', 'plan': '/plan', 'services': '/services',
                        'things-to-do': '/things-to-do', 'travel': '/travel', 'party': '/party'
                      }
                      const route = routeMap[categoryLens] || '/vendors'
                      return (
                        <button
                          key={idx}
                          onClick={() => navigateWithIntent(route, sub.name)}
                          className="flex items-center justify-between p-3 rounded-lg border border-midnight-slate/10 hover:border-champagne-gold/30 hover:bg-gray-50/50 text-left transition-all group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-midnight-slate group-hover:text-champagne-gold transition-colors">
                              {sub.name}
                            </div>
                            <div className="text-[10px] text-midnight-slate/40 line-clamp-1">
                              {sub.services.slice(0, 4).join(', ')}
                              {sub.services.length > 4 ? '...' : ''}
                            </div>
                          </div>
                          <Icons.ArrowUpRight className="w-3 h-3 text-midnight-slate/20 group-hover:text-champagne-gold transition-colors shrink-0 ml-2" />
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem?.subcategories?.map((sub: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => navigateWithIntent(selectedItem.route, sub)}
                        className="flex items-center justify-between p-3 rounded-lg border border-midnight-slate/10 hover:border-champagne-gold/30 hover:bg-gray-50/50 text-left transition-all group"
                      >
                        <span className="text-xs font-bold text-midnight-slate group-hover:text-champagne-gold transition-colors">
                          {sub}
                        </span>
                        <Icons.ArrowUpRight className="w-3 h-3 text-midnight-slate/20 group-hover:text-champagne-gold transition-colors shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
                {/* View entire directory */}
                <button
                  onClick={() => navigateWithIntent(selectedItem.route || '/vendors', selectedItem.name)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-midnight-slate hover:bg-champagne-gold hover:text-black text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-all"
                >
                  View Entire {selectedItem?.name} Directory
                  <Icons.ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
