export interface CategoryGroup {
  id: string
  slug: string
  name: string
  icon: string
  sort_order: number
  categories: Category[]
}

export interface Category {
  id: string
  slug: string
  name: string
  plural_name: string | null
  filter_schema_key: string
  is_top_level: boolean
  icon: string | null
  group_id?: string
  group_slug?: string
  group_name?: string
}

export interface FilterDefinition {
  id: string
  filter_key: string
  label: string
  ui_type: string // double_slider, star_select, multi_select, toggle, visual_grid, searchable_multi, single_select, toggle_with_fee, toggle_with_cost, range_tiers, time_range, autocomplete_zip, tag_input, percentage_slider, date_picker, date_range, single_slider
  options_json: unknown[] | null
  range_min: number | null
  range_max: number | null
  range_step: number | null
  range_unit: string | null
  is_universal: boolean
  is_sensitive: boolean
  category_key: string
  sort_order: number
}

export interface FilterInput {
  filter_key: string
  value_text?: string | null
  value_bool?: boolean | null
  value_min?: number | null
  value_max?: number | null
}

export interface VendorCard {
  vendor_id: string
  business_name: string
  slug: string
  category_slug: string | null
  category_name: string | null
  group_slug: string | null
  group_name: string | null
  tagline: string | null
  logo_url: string | null
  cover_url: string | null
  neighborhood: string | null
  address_city: string | null
  price_range: string | null
  price_starting_at: number | null
  avg_rating: number | null
  review_count: number | null
  is_featured: boolean
  is_verified: boolean
  instant_booking: boolean
  is_premium: boolean
  photo_count: number
  starting_price_cents: number | null
  completion_score: number
  badge_keys: string[]
}
