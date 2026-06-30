/**
 * Planviry - Taxonomy Route Resolver
 *
 * Resolves slug paths from the 6 browse dimensions in taxonomy.ts
 * so that /categories/[...slugs] can serve pages for ALL dimensions.
 *
 * Dimensions and their slug patterns:
 *   By Service:   /categories/service/{group-slug}  or  /categories/service/{group-slug}/{subcategory-slug}
 *   By Category:  /categories/category/{cat-slug}  or  /categories/category/{cat-slug}/{subgroup-slug}/{item-slug}
 *   By Event:     /categories/event/{group-slug}  or  /categories/event/{group-slug}/{subcategory-slug}
 *   By Activity:  /categories/activity/{group-slug}  or  /categories/activity/{group-slug}/{sub-slug}  or  /categories/activity/{group-slug}/{sub-slug}/{item-slug}
 *   By Role:      /categories/role/{group-slug}  or  /categories/role/{group-slug}/{role-slug}
 *   By Location:  NOT handled here - locations use /{state}/{city} routes directly
 *
 * Also resolves the existing categories.ts hierarchy:
 *   /categories/{l1-slug}  or  /categories/{l1-slug}/{l2-slug}  or  /categories/{l1-slug}/{l2-slug}/{l3-slug}
 */

import {
  serviceCategories,
  categoryByOverture,
  eventCategories,
  activityCategories,
  roleCategories,
  slugify,
} from '@/data/taxonomy';
import { categories, type CategoryLevel1, type CategoryLevel2, type CategoryLevel3 } from '@/data/categories';

// ── Types ──────────────────────────────────────────────────────────────────

export type TaxonomyDimension = 'service' | 'category' | 'event' | 'activity' | 'role';

export interface ResolvedTaxonomyPage {
  dimension: TaxonomyDimension | 'hierarchy';
  /** Display name for the current page */
  title: string;
  /** Meta description */
  description: string;
  /** Breadcrumb segments: [{label, href}] */
  breadcrumbs: { label: string; href: string }[];
  /** Child items (subcategories) to display on this page */
  children: { label: string; slug: string; href: string; count?: number; description?: string }[];
  /** The full slug path for canonical URL */
  canonicalPath: string;
  /** Whether this is a leaf/subcategory page */
  isLeaf: boolean;
  /** Parent dimension group name, if applicable */
  groupName?: string;
  /** Sibling subcategories (for self-excluding grid on subcategory pages) */
  siblings: { label: string; slug: string; href: string; count?: number; description?: string }[];
  /** Parent category slug (for looking up category-specific filters) */
  parentCategorySlug?: string;
  /** Current subcategory slug (if on a leaf page) */
  currentSubSlug?: string;
}

// ── Resolvers ──────────────────────────────────────────────────────────────

/** Resolve a slug path from the categories.ts hierarchy (original L1/L2/L3) */
function resolveHierarchy(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length === 0) return null;

  const l1 = categories.find(c => c.slug === slugs[0]);
  if (!l1) return null;

  if (slugs.length === 1) {
    return {
      dimension: 'hierarchy',
      title: l1.name,
      description: `Browse ${l1.name} vendors on Planviry. Find, compare, and book the best vendors for your event.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: l1.name, href: `/categories/${l1.slug}` },
      ],
      children: l1.level2.map(l2 => ({
        label: l2.name,
        slug: l2.slug,
        href: `/categories/${l1.slug}/${l2.slug}`,
        count: l2.level3.length,
      })),
      canonicalPath: `/categories/${l1.slug}`,
      isLeaf: false,
      siblings: [],
    };
  }

  const l2 = l1.level2.find(c => c.slug === slugs[1]);
  if (!l2) return null;

  if (slugs.length === 2) {
    return {
      dimension: 'hierarchy',
      title: l2.name,
      description: `Browse ${l2.name} in ${l1.name}. Find the perfect vendor for your event.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Categories', href: '/categories' },
        { label: l1.name, href: `/categories/${l1.slug}` },
        { label: l2.name, href: `/categories/${l1.slug}/${l2.slug}` },
      ],
      children: l2.level3.map(l3 => ({
        label: l3.name,
        slug: l3.slug,
        href: `/categories/${l1.slug}/${l2.slug}/${l3.slug}`,
        count: l3.level4?.length,
      })),
      canonicalPath: `/categories/${l1.slug}/${l2.slug}`,
      isLeaf: false,
      siblings: l1.level2.filter(c => c.slug !== l2.slug).map(c => ({
        label: c.name, slug: c.slug, href: `/categories/${l1.slug}/${c.slug}`, count: c.level3.length,
      })),
      parentCategorySlug: l1.slug,
      currentSubSlug: l2.slug,
    };
  }

  const l3 = l2.level3.find(c => c.slug === slugs[2]);
  if (!l3) return null;

  return {
    dimension: 'hierarchy',
    title: l3.name,
    description: `Find the best ${l3.name} vendors. Compare prices, read reviews, and book instantly on Planviry.`,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: l1.name, href: `/categories/${l1.slug}` },
      { label: l2.name, href: `/categories/${l1.slug}/${l2.slug}` },
      { label: l3.name, href: `/categories/${l1.slug}/${l2.slug}/${l3.slug}` },
    ],
    children: l3.level4?.map(l4 => ({
      label: l4.name,
      slug: l4.slug,
      href: `/categories/${l1.slug}/${l2.slug}/${l3.slug}/${l4.slug}`,
    })) ?? [],
    siblings: l2.level3.filter(c => c.slug !== l3.slug).map(c => ({
      label: c.name, slug: c.slug, href: `/categories/${l1.slug}/${l2.slug}/${c.slug}`,
    })),
    canonicalPath: `/categories/${l1.slug}/${l2.slug}/${l3.slug}`,
    isLeaf: !l3.level4 || l3.level4.length === 0,
    parentCategorySlug: l1.slug,
    currentSubSlug: l3.slug,
  };
}

/** Resolve By Service: /categories/service/{group-slug} or /categories/service/{group-slug}/{sub-slug} */
function resolveService(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length < 1) return null;

  const group = serviceCategories.find(c => c.slug === slugs[0]);
  if (!group) return null;

  if (slugs.length === 1) {
    return {
      dimension: 'service',
      title: group.name,
      description: `Browse ${group.name} for your event. Find and book top-rated service providers on Planviry.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Service', href: '/categories/service' },
        { label: group.name, href: `/categories/service/${group.slug}` },
      ],
      children: group.subcategories.map(sub => ({
        label: sub,
        slug: slugify(sub),
        href: `/categories/service/${group.slug}/${slugify(sub)}`,
      })),
      canonicalPath: `/categories/service/${group.slug}`,
      isLeaf: false,
      groupName: 'By Service',
      siblings: [],
    };
  }

  const subName = group.subcategories.find(s => slugify(s) === slugs[1]);
  if (!subName) return null;

  // Build siblings (other subcategories in same group, excluding self)
  const subSlug = slugify(subName);
  const siblingSubs = group.subcategories
    .filter(s => slugify(s) !== subSlug)
    .map(s => ({
      label: s,
      slug: slugify(s),
      href: `/categories/service/${group.slug}/${slugify(s)}`,
    }));

  return {
    dimension: 'service',
    title: subName,
    description: `Find the best ${subName} for your event. Compare prices, read reviews, and book instantly on Planviry.`,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'By Service', href: '/categories/service' },
      { label: group.name, href: `/categories/service/${group.slug}` },
      { label: subName, href: `/categories/service/${group.slug}/${slugify(subName)}` },
    ],
    children: [],
    siblings: siblingSubs,
    canonicalPath: `/categories/service/${group.slug}/${slugify(subName)}`,
    isLeaf: true,
    groupName: group.name,
    parentCategorySlug: group.slug,
    currentSubSlug: subSlug,
  };
}

/** Resolve By Category (Overture): /categories/category/{cat-slug} or /categories/category/{cat-slug}/{subgroup-slug}/{item-slug} */
function resolveCategory(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length < 1) return null;

  const cat = categoryByOverture.find(c => c.slug === slugs[0]);
  if (!cat) return null;

  if (slugs.length === 1) {
    const items: { label: string; slug: string; href: string; count?: number }[] = [];
    for (const sg of cat.subGroups) {
      for (const item of sg.items) {
        items.push({
          label: item.name,
          slug: item.slug,
          href: `/categories/category/${cat.slug}/${sg.slug}/${item.slug}`,
          count: item.count,
        });
      }
    }
    return {
      dimension: 'category',
      title: cat.name,
      description: `Browse ${cat.name} vendors on Planviry. Find, compare, and book the best providers for your event.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Category', href: '/categories/category' },
        { label: cat.name, href: `/categories/category/${cat.slug}` },
      ],
      children: items,
      canonicalPath: `/categories/category/${cat.slug}`,
      isLeaf: false,
      groupName: 'By Category',
      siblings: [],
      parentCategorySlug: cat.slug,
    };
  }

  // /categories/category/{cat-slug}/{subgroup-slug}/{item-slug}
  if (slugs.length >= 3) {
    const sg = cat.subGroups.find(s => s.slug === slugs[1]);
    if (!sg) return null;
    const item = sg.items.find(i => i.slug === slugs[2]);
    if (!item) return null;

    // Build all sibling items across all subGroups (excluding current item)
    const allSiblingItems: { label: string; slug: string; href: string; count?: number }[] = [];
    for (const subG of cat.subGroups) {
      for (const it of subG.items) {
        if (it.slug !== item.slug) {
          allSiblingItems.push({
            label: it.name,
            slug: it.slug,
            href: `/categories/category/${cat.slug}/${subG.slug}/${it.slug}`,
            count: it.count,
          });
        }
      }
    }

    // Build breadcrumbs - skip 'Main' subGroup label (it 404s), go straight from cat to item
    const bc: { label: string; href: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'By Category', href: '/categories/category' },
      { label: cat.name, href: `/categories/category/${cat.slug}` },
    ];
    // Only include subGroup in breadcrumb if it's NOT 'Main' and has a meaningful label
    if (sg.label !== 'Main' && sg.slug !== 'main') {
      bc.push({ label: sg.label, href: '' });
    }
    bc.push({ label: item.name, href: `/categories/category/${cat.slug}/${sg.slug}/${item.slug}` });

    return {
      dimension: 'category',
      title: item.name,
      description: `Find the best ${item.name} vendors. ${item.count ? `${item.count.toLocaleString()} listings available.` : ''} Compare prices, read reviews, and book on Planviry.`,
      breadcrumbs: bc,
      children: [],
      siblings: allSiblingItems,
      canonicalPath: `/categories/category/${cat.slug}/${sg.slug}/${item.slug}`,
      isLeaf: true,
      groupName: cat.name,
      parentCategorySlug: cat.slug,
      currentSubSlug: item.slug,
    };
  }

  return null;
}

/** Resolve By Event: /categories/event/{group-slug} or /categories/event/{group-slug}/{sub-slug} */
function resolveEvent(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length < 1) return null;

  const group = eventCategories.find(c => c.slug === slugs[0]);
  if (!group) return null;

  if (slugs.length === 1) {
    return {
      dimension: 'event',
      title: group.name,
      description: `Browse vendors for ${group.name}. Find and book top-rated service providers on Planviry.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Event', href: '/categories/event' },
        { label: group.name, href: `/categories/event/${group.slug}` },
      ],
      children: group.subcategories.map(sub => ({
        label: sub,
        slug: slugify(sub),
        href: `/categories/event/${group.slug}/${slugify(sub)}`,
      })),
      canonicalPath: `/categories/event/${group.slug}`,
      isLeaf: false,
      groupName: 'By Event',
      siblings: [],
    };
  }

  const subName = group.subcategories.find(s => slugify(s) === slugs[1]);
  if (!subName) return null;

  return {
    dimension: 'event',
    title: subName,
    description: `Find the best vendors for ${subName}. Compare prices, read reviews, and book instantly on Planviry.`,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'By Event', href: '/categories/event' },
      { label: group.name, href: `/categories/event/${group.slug}` },
      { label: subName, href: `/categories/event/${group.slug}/${slugify(subName)}` },
    ],
    children: [],
    siblings: group.subcategories.filter(s => slugify(s) !== slugify(subName)).map(s => ({
      label: s, slug: slugify(s), href: `/categories/event/${group.slug}/${slugify(s)}`,
    })),
    canonicalPath: `/categories/event/${group.slug}/${slugify(subName)}`,
    isLeaf: true,
    groupName: group.name,
    parentCategorySlug: group.slug,
    currentSubSlug: slugify(subName),
  };
}

/** Resolve By Activity: /categories/activity/{group-slug} or /categories/activity/{group-slug}/{sub-slug} or /categories/activity/{group-slug}/{sub-slug}/{item-slug} */
function resolveActivity(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length < 1) return null;

  const group = activityCategories.find(c => c.slug === slugs[0]);
  if (!group) return null;

  if (slugs.length === 1) {
    return {
      dimension: 'activity',
      title: group.name,
      description: `Browse ${group.name} on Planviry. Find and book top-rated events and activities.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Activity', href: '/categories/activity' },
        { label: group.name, href: `/categories/activity/${group.slug}` },
      ],
      children: group.activities.map(act => ({
        label: act.name,
        slug: act.slug,
        href: `/categories/activity/${group.slug}/${act.slug}`,
        count: act.items.length,
      })),
      canonicalPath: `/categories/activity/${group.slug}`,
      isLeaf: false,
      groupName: 'By Activity',
      siblings: [],
    };
  }

  const sub = group.activities.find(a => a.slug === slugs[1]);
  if (!sub) return null;

  if (slugs.length === 2) {
    return {
      dimension: 'activity',
      title: sub.name,
      description: `Browse ${sub.name} activities under ${group.name}. Find and book top-rated events on Planviry.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Activity', href: '/categories/activity' },
        { label: group.name, href: `/categories/activity/${group.slug}` },
        { label: sub.name, href: `/categories/activity/${group.slug}/${sub.slug}` },
      ],
      children: sub.items.map(item => ({
        label: item,
        slug: slugify(item),
        href: `/categories/activity/${group.slug}/${sub.slug}/${slugify(item)}`,
      })),
      canonicalPath: `/categories/activity/${group.slug}/${sub.slug}`,
      isLeaf: false,
      groupName: group.name,
      siblings: [],
    };
  }

  const itemName = sub.items.find(i => slugify(i) === slugs[2]);
  if (!itemName) return null;

  return {
    dimension: 'activity',
    title: itemName,
    description: `Find the best ${itemName} in ${sub.name}. Book instantly on Planviry.`,
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'By Activity', href: '/categories/activity' },
      { label: group.name, href: `/categories/activity/${group.slug}` },
      { label: sub.name, href: `/categories/activity/${group.slug}/${sub.slug}` },
      { label: itemName, href: `/categories/activity/${group.slug}/${sub.slug}/${slugify(itemName)}` },
    ],
    children: [],
    siblings: sub.items.filter(i => slugify(i) !== slugify(itemName)).map(i => ({
      label: i, slug: slugify(i), href: `/categories/activity/${group.slug}/${sub.slug}/${slugify(i)}`,
    })),
    canonicalPath: `/categories/activity/${group.slug}/${sub.slug}/${slugify(itemName)}`,
    isLeaf: true,
    groupName: `${group.name} › ${sub.name}`,
    parentCategorySlug: group.slug,
    currentSubSlug: slugify(itemName),
  };
}

/** Resolve By Role: /categories/role/{group-slug} or /categories/role/{group-slug}/{role-slug} */
function resolveRole(slugs: string[]): ResolvedTaxonomyPage | null {
  if (slugs.length < 1) return null;

  const group = roleCategories.find(c => c.slug === slugs[0]);
  if (!group) return null;

  if (slugs.length === 1) {
    return {
      dimension: 'role',
      title: group.name,
      description: `Browse ${group.name} professionals on Planviry. Find and book experienced event professionals.`,
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'By Role', href: '/categories/role' },
        { label: group.name, href: `/categories/role/${group.slug}` },
      ],
      children: group.roles.map(role => ({
        label: role.name,
        slug: role.slug,
        href: `/categories/role/${group.slug}/${role.slug}`,
        description: role.description,
      })),
      canonicalPath: `/categories/role/${group.slug}`,
      isLeaf: false,
      groupName: 'By Role',
      siblings: [],
    };
  }

  const role = group.roles.find(r => r.slug === slugs[1]);
  if (!role) return null;

  return {
    dimension: 'role',
    title: role.name,
    description: role.description + ' Find and book on Planviry.',
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'By Role', href: '/categories/role' },
      { label: group.name, href: `/categories/role/${group.slug}` },
      { label: role.name, href: `/categories/role/${group.slug}/${role.slug}` },
    ],
    children: [],
    siblings: group.roles.filter(r => r.slug !== role.slug).map(r => ({
      label: r.name, slug: r.slug, href: `/categories/role/${group.slug}/${r.slug}`, description: r.description,
    })),
    canonicalPath: `/categories/role/${group.slug}/${role.slug}`,
    isLeaf: true,
    groupName: group.name,
    parentCategorySlug: group.slug,
    currentSubSlug: role.slug,
  };
}

// ── Main Resolver ──────────────────────────────────────────────────────────

/**
 * Resolve a slug path to a taxonomy page.
 * 
 * The first slug segment determines the dimension:
 *   "service"  → By Service
 *   "category" → By Category (Overture)
 *   "event"    → By Event
 *   "activity" → By Activity
 *   "role"     → By Role
 *   anything else → Try categories.ts hierarchy (L1/L2/L3)
 */
export function resolveTaxonomyPath(slugs: string[]): ResolvedTaxonomyPage | null {
  if (!slugs || slugs.length === 0) return null;

  const first = slugs[0];
  const rest = slugs.slice(1);

  switch (first) {
    case 'service':
      return rest.length > 0 ? resolveService(rest) : {
        dimension: 'service' as TaxonomyDimension,
        title: 'Browse by Service',
        description: 'Find event service providers by category. Browse beauty, entertainment, catering, photography, and more.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'By Service', href: '/categories/service' }],
        children: serviceCategories.map(c => ({
          label: c.name,
          slug: c.slug,
          href: `/categories/service/${c.slug}`,
          count: c.subcategories.length,
        })),
        canonicalPath: '/categories/service',
        isLeaf: false,
        siblings: [],
      };

    case 'category':
      return rest.length > 0 ? resolveCategory(rest) : {
        dimension: 'category' as TaxonomyDimension,
        title: 'Browse by Category',
        description: 'Browse vendors by Overture category. Find venues, caterers, entertainers, and more with real listing counts.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'By Category', href: '/categories/category' }],
        children: categoryByOverture.map(c => {
          const totalItems = c.subGroups.reduce((sum, sg) => sum + sg.items.length, 0);
          return {
            label: c.name,
            slug: c.slug,
            href: `/categories/category/${c.slug}`,
            count: totalItems,
          };
        }),
        canonicalPath: '/categories/category',
        isLeaf: false,
        siblings: [],
      };

    case 'event':
      return rest.length > 0 ? resolveEvent(rest) : {
        dimension: 'event' as TaxonomyDimension,
        title: 'Browse by Event',
        description: 'Find vendors by event type. Weddings, birthdays, corporate events, festivals, and more.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'By Event', href: '/categories/event' }],
        children: eventCategories.map(c => ({
          label: c.name,
          slug: c.slug,
          href: `/categories/event/${c.slug}`,
          count: c.subcategories.length,
        })),
        canonicalPath: '/categories/event',
        isLeaf: false,
        siblings: [],
      };

    case 'activity':
      return rest.length > 0 ? resolveActivity(rest) : {
        dimension: 'activity' as TaxonomyDimension,
        title: 'Browse by Activity',
        description: 'Find activities by type. Adult activities, children activities, family-friendly, team building, and trip planning.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'By Activity', href: '/categories/activity' }],
        children: activityCategories.map(c => ({
          label: c.name,
          slug: c.slug,
          href: `/categories/activity/${c.slug}`,
          count: c.activities.reduce((sum, a) => sum + a.items.length, 0),
        })),
        canonicalPath: '/categories/activity',
        isLeaf: false,
        siblings: [],
      };

    case 'role':
      return rest.length > 0 ? resolveRole(rest) : {
        dimension: 'role' as TaxonomyDimension,
        title: 'Browse by Role',
        description: 'Find event professionals by role. Planners, promoters, coordinators, and more.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'By Role', href: '/categories/role' }],
        children: roleCategories.map(c => ({
          label: c.name,
          slug: c.slug,
          href: `/categories/role/${c.slug}`,
          count: c.roles.length,
        })),
        canonicalPath: '/categories/role',
        isLeaf: false,
        siblings: [],
      };

    default:
      // Fall back to categories.ts hierarchy
      return resolveHierarchy(slugs);
  }
}

// ── Static Params Generator ────────────────────────────────────────────────

/** Generate all slug paths for ISR pre-build (L1 and L1/L2 only) */
export function generateTaxonomyStaticParams(): { slugs: string[] }[] {
  const params: { slugs: string[] }[] = [];

  // Dimension root pages
  params.push({ slugs: ['service'] });
  params.push({ slugs: ['category'] });
  params.push({ slugs: ['event'] });
  params.push({ slugs: ['activity'] });
  params.push({ slugs: ['role'] });

  // By Service: group pages + subcategory pages
  for (const group of serviceCategories) {
    params.push({ slugs: ['service', group.slug] });
    for (const sub of group.subcategories) {
      params.push({ slugs: ['service', group.slug, slugify(sub)] });
    }
  }

  // By Category: category pages + item pages
  for (const cat of categoryByOverture) {
    params.push({ slugs: ['category', cat.slug] });
    for (const sg of cat.subGroups) {
      for (const item of sg.items) {
        params.push({ slugs: ['category', cat.slug, sg.slug, item.slug] });
      }
    }
  }

  // By Event: group pages + subcategory pages
  for (const group of eventCategories) {
    params.push({ slugs: ['event', group.slug] });
    for (const sub of group.subcategories) {
      params.push({ slugs: ['event', group.slug, slugify(sub)] });
    }
  }

  // By Activity: group pages + sub pages + item pages
  for (const group of activityCategories) {
    params.push({ slugs: ['activity', group.slug] });
    for (const sub of group.activities) {
      params.push({ slugs: ['activity', group.slug, sub.slug] });
      for (const item of sub.items) {
        params.push({ slugs: ['activity', group.slug, sub.slug, slugify(item)] });
      }
    }
  }

  // By Role: group pages + role pages
  for (const group of roleCategories) {
    params.push({ slugs: ['role', group.slug] });
    for (const role of group.roles) {
      params.push({ slugs: ['role', group.slug, role.slug] });
    }
  }

  // Also include the categories.ts hierarchy (L1 and L1/L2)
  for (const l1 of categories) {
    params.push({ slugs: [l1.slug] });
    for (const l2 of l1.level2) {
      params.push({ slugs: [l1.slug, l2.slug] });
    }
  }

  return params;
}
