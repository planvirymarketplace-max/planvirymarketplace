/**
 * Breadcrumb - required on every ISR page (JSON-LD + visible nav)
 *
 * Per Planviry Build Specification v3 §26.9.3:
 *   Required on: /[state], /[state]/[city], /[state]/[city]/[category], /vendors/[slug]
 *
 * URL pattern: /[state]/[city]/[vertical]
 * Example: /tennessee/memphis/production-tech
 *
 * Vendor profile breadcrumb:
 *   Home → [State] → [City] → [Category] → [Vendor Name]
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Current page label (rendered as non-linked text) */
  currentPage?: string;
}

// ─── JSON-LD Component ──────────────────────────────────────────────────────

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `https://planviry.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Visible Nav Component ──────────────────────────────────────────────────

export function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-2.5">
        <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold tracking-wide text-gray-400">
          {/* Home link */}
          <li className="inline-flex items-center gap-1">
            <Link href="/" className="hover:text-teal-600 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Home</span>
            </Link>
          </li>

          {/* Breadcrumb items */}
          {items.map((item, i) => (
            <li key={item.href} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="text-gray-300">
                <ChevronRight className="w-3 h-3" />
              </span>
              <Link
                href={item.href}
                className="hover:text-teal-600 transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Current page (non-linked) */}
          {currentPage && (
            <li className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="text-gray-300">
                <ChevronRight className="w-3 h-3" />
              </span>
              <span className="text-gray-800 font-bold truncate max-w-[200px] md:max-w-none">
                {currentPage}
              </span>
            </li>
          )}
        </ol>
      </div>
    </nav>
  );
}
