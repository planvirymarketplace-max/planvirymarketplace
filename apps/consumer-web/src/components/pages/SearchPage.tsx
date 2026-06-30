'use client'

import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { SiteSearch } from "@/components/site/SiteSearch";
import { getHashQueryParams } from "@/lib/router-utils";
import { Loader2 } from "lucide-react";

interface VendorResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string | null;
  bio: string | null;
  priceRange: string;
  serviceAreas: string[];
  tags: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isClaimed: boolean;
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-[1px] w-6 bg-ember" />
        <p className="font-utility text-[10px] text-ember tracking-widest">{eyebrow}</p>
      </div>
      <h2 className="font-display text-2xl md:text-3xl font-bold leading-[1.08]">{title}</h2>
    </div>
  );
}

function formatCategory(cat: string): string {
  return cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function SearchPage({ navigate }: { navigate: (path: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VendorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Read initial query from hash params
  useEffect(() => {
    const params = getHashQueryParams();
    if (params.q) {
      setQuery(params.q);
      performSearch(params.q);
    }
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/vendors?search=${encodeURIComponent(searchQuery)}&limit=24&published=true`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.vendors || []);
        setTotalResults(data.pagination?.total || 0);
      }
    } catch {
      // handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    performSearch(q);
  };

  return (
    <SiteShell navigate={navigate}>
      {/* Hero */}
      <div className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-ember" />
            <p className="font-utility text-[10px] text-ember tracking-widest">Search</p>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Find Vendors
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg">
            Search Milwaukee&apos;s best event vendors - DJs, venues, photographers, caterers, and more.
          </p>
          <div className="mt-8">
            <SiteSearch
              navigate={navigate}
              variant="standalone"
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-background">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-16">
          {/* Search state: not yet searched */}
          {!searched && !loading && (
            <div className="text-center py-20">
              <p className="font-display text-2xl font-bold">Start Searching</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a keyword above to find vendors
              </p>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          )}

          {/* No results */}
          {searched && !loading && results.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl font-bold">No Results Found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We couldn&apos;t find any vendors matching &ldquo;{query}&rdquo;. Try a different search term.
              </p>
              <button
                onClick={() => navigate("/directory")}
                className="mt-6 font-utility bg-ember text-ember-foreground px-6 py-3 text-[11px] hover:bg-ink hover:text-background transition-colors"
              >
                Browse All Vendors
              </button>
            </div>
          )}

          {/* Results grid */}
          {searched && !loading && results.length > 0 && (
            <div>
              <SectionHeader
                eyebrow={`${totalResults} result${totalResults !== 1 ? 's' : ''}`}
                title={`Results for "${query}"`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((vendor) => (
                  <button
                    key={vendor.id}
                    onClick={() => navigate(`/vendor?slug=${vendor.slug}`)}
                    className="text-left group bg-background border border-border p-5 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="font-display text-lg font-bold truncate">
                        {vendor.name}
                      </p>
                      {vendor.isVerified && (
                        <span className="font-utility text-[8px] tracking-wider px-2 py-0.5 bg-teal/15 text-teal group-hover:text-teal shrink-0">
                          Verified
                        </span>
                      )}
                      {vendor.isFeatured && (
                        <span className="font-utility text-[8px] tracking-wider px-2 py-0.5 bg-ember/15 text-ember group-hover:text-ember shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground group-hover:text-ink-foreground/60">
                      {formatCategory(vendor.category)}
                      {vendor.address ? ` · ${vendor.address}` : ''}
                    </p>
                    {vendor.bio && (
                      <p className="mt-2 text-xs text-muted-foreground group-hover:text-ink-foreground/50 line-clamp-2">
                        {vendor.bio}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50">
                        {vendor.priceRange}
                      </span>
                      {vendor.serviceAreas.length > 0 && (
                        <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 truncate">
                          {vendor.serviceAreas.slice(0, 3).join(', ')}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
