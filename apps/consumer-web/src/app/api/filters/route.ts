import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-marketplace/admin'

/**
 * GET /api/filters?category_key=venues_wedding
 *
 * Returns resolved filter definitions for a given category_key.
 * Walks up the filter_inheritance chain to collect all applicable filters
 * from parent categories and UNIVERSAL. Handles exclusions so child
 * categories can override or remove inherited filters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryKey = searchParams.get('category_key')

    if (!categoryKey) {
      return NextResponse.json(
        { error: 'category_key query parameter is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Step 1: Build the inheritance chain by walking up from category_key
    const chain: string[] = [categoryKey]
    const exclusionMap = new Map<string, Set<string>>()

    let currentKey = categoryKey

    // Fetch ALL inheritance rows at once for efficiency
    const { data: allInheritance, error: inhError } = await supabase
      .from('filter_inheritance')
      .select('child_key, parent_key, excludes_keys, sort_order')
      .order('sort_order', { ascending: true })

    if (inhError || !allInheritance) {
      console.error('Supabase error fetching inheritance:', inhError)
      return NextResponse.json(
        { error: 'Failed to fetch inheritance chain' },
        { status: 500 }
      )
    }

    // Build a map: child_key -> [{ parent_key, excludes_keys, sort_order }]
    const inheritanceMap = new Map<string, { parent_key: string; excludes_keys: any }[]>()
    for (const row of allInheritance) {
      const r = row as any
      if (!inheritanceMap.has(r.child_key)) {
        inheritanceMap.set(r.child_key, [])
      }
      inheritanceMap.get(r.child_key)!.push({ parent_key: r.parent_key, excludes_keys: r.excludes_keys })
    }

    // Walk up the chain from category_key
    while (currentKey !== 'UNIVERSAL') {
      const parents = inheritanceMap.get(currentKey)
      if (!parents || parents.length === 0) {
        break
      }

      // Process all parents of this child (in sort_order)
      for (const parent of parents) {
        const parentKey = parent.parent_key

        // Record exclusions from this level
        if (
          parent.excludes_keys &&
          Array.isArray(parent.excludes_keys) &&
          parent.excludes_keys.length > 0
        ) {
          const existing = exclusionMap.get(parentKey) ?? new Set<string>()
          for (const key of parent.excludes_keys) {
            existing.add(key)
          }
          exclusionMap.set(parentKey, existing)
        }

        if (parentKey && parentKey !== currentKey && !chain.includes(parentKey)) {
          chain.push(parentKey)
        }
      }

      // Move to the first parent that isn't UNIVERSAL for next iteration
      const nextKey = parents.find(p => p.parent_key !== 'UNIVERSAL')?.parent_key
      if (!nextKey || nextKey === currentKey) {
        break
      }
      currentKey = nextKey
    }

    // Ensure UNIVERSAL is always in the chain
    if (!chain.includes('UNIVERSAL')) {
      chain.push('UNIVERSAL')
    }

    // Reverse so root comes first: ['UNIVERSAL', ..., 'venues_wedding']
    chain.reverse()

    // Deduplicate while preserving order, and sort so UNIVERSAL is first and category_key is last
    const seen = new Set<string>()
    const dedupedChain: string[] = []
    for (const key of chain) {
      if (!seen.has(key)) {
        seen.add(key)
        dedupedChain.push(key)
      }
    }
    // Sort: UNIVERSAL first, then base, then specific (category_key last)
    dedupedChain.sort((a, b) => {
      if (a === 'UNIVERSAL') return -1
      if (b === 'UNIVERSAL') return 1
      if (a === categoryKey) return 1
      if (b === categoryKey) return -1
      // Base keys come before specific keys
      if (a.includes('_base')) return -1
      if (b.includes('_base')) return 1
      return 0
    })
    chain.length = 0
    chain.push(...dedupedChain)

    // Step 2: Fetch all filter_definitions for every key in the chain
    const { data: allFilters, error: filtersError } = await supabase
      .from('filter_definitions')
      .select(
        'id, category_key, filter_key, label, ui_type, sort_order, is_universal, is_active, options_json, range_min, range_max, range_step, range_unit, is_sensitive'
      )
      .in('category_key', chain)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (filtersError) {
      console.error('Supabase error fetching filters:', filtersError)
      return NextResponse.json(
        { error: 'Failed to fetch filters' },
        { status: 500 }
      )
    }

    if (!allFilters || allFilters.length === 0) {
      return NextResponse.json({
        category_key: categoryKey,
        inheritance_chain: chain,
        filters: [],
      })
    }

    // Step 3: Merge filters respecting inheritance order and exclusions
    // More specific (later in chain) entries override less specific ones
    const seenKeys = new Set<string>()
    const merged: any[] = []

    for (const chainKey of chain) {
      const exclusions = exclusionMap.get(chainKey) ?? new Set<string>()
      const keyFilters = allFilters.filter(
        (f: any) => f.category_key === chainKey
      )

      for (const filter of keyFilters) {
        const filterDef = filter as any

        // Skip if this filter_key is excluded at this level
        if (exclusions.has(filterDef.filter_key)) {
          continue
        }

        // Let later (more specific) entries replace earlier ones
        if (seenKeys.has(filterDef.filter_key)) {
          const existingIndex = merged.findIndex(
            (m) => m.filter_key === filterDef.filter_key
          )
          if (existingIndex !== -1) {
            merged[existingIndex] = filterDef
          }
        } else {
          merged.push(filterDef)
          seenKeys.add(filterDef.filter_key)
        }
      }
    }

    // Step 4: Sort final merged list - universal first, then by chain level, then sort_order
    merged.sort((a: any, b: any) => {
      if (a.is_universal && !b.is_universal) return -1
      if (!a.is_universal && b.is_universal) return 1

      const aChainIndex = chain.indexOf(a.category_key)
      const bChainIndex = chain.indexOf(b.category_key)
      if (aChainIndex !== bChainIndex) return aChainIndex - bChainIndex

      return a.sort_order - b.sort_order
    })

    // Map to the output shape specified in the spec
    const filters = merged.map((f: any) => ({
      id: f.id,
      filter_key: f.filter_key,
      label: f.label,
      ui_type: f.ui_type,
      options_json: f.options_json,
      range_min: f.range_min,
      range_max: f.range_max,
      range_step: f.range_step,
      range_unit: f.range_unit,
      is_universal: f.is_universal,
      is_sensitive: f.is_sensitive,
      category_key: f.category_key,
      sort_order: f.sort_order,
    }))

    return NextResponse.json({
      category_key: categoryKey,
      inheritance_chain: chain,
      filters,
    })
  } catch (error) {
    console.error('Error fetching filters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    )
  }
}
