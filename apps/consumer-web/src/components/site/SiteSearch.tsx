'use client'

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string | null;
}

interface SiteSearchProps {
  navigate: (path: string) => void;
  variant?: "nav" | "standalone";
  onSearch?: (query: string) => void;
}

export function SiteSearch({ navigate, variant = "nav", onSearch }: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/vendors?search=${encodeURIComponent(query)}&limit=5&published=true`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.vendors || []);
          setIsOpen(true);
        }
      } catch {
        // handled silently
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/vendor?slug=${result.slug}`);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      e.preventDefault();
      handleViewAll();
    }
  };

  if (variant === "standalone") {
    return (
      <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            placeholder="Search vendors, services, categories..."
            className="w-full border border-border bg-background pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="h-3 w-3 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
            </div>
          )}
        </div>
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border shadow-lg z-50 max-h-80 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-cream transition-colors border-b border-border last:border-b-0"
              >
                <p className="font-display text-sm font-bold">{result.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {result.address ? ` · ${result.address}` : ''}
                </p>
              </button>
            ))}
            <button
              onClick={handleViewAll}
              className="w-full text-left px-4 py-3 font-utility text-[10px] text-ember tracking-wider hover:bg-cream transition-colors"
            >
              View All Results →
            </button>
          </div>
        )}
      </div>
    );
  }

  // Nav variant - compact
  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          placeholder="Search..."
          className="border border-border bg-background pl-9 pr-3 py-2 text-[11px] w-40 md:w-56 focus:outline-none focus:border-ember transition-colors focus:w-56 md:focus:w-72"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-2.5 w-2.5 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
          </div>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full right-0 mt-1 bg-background border border-border shadow-lg z-50 w-72 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full text-left px-4 py-3 hover:bg-cream transition-colors border-b border-border last:border-b-0"
            >
              <p className="font-display text-sm font-bold">{result.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {result.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                {result.address ? ` · ${result.address}` : ''}
              </p>
            </button>
          ))}
          <button
            onClick={handleViewAll}
            className="w-full text-left px-4 py-3 font-utility text-[10px] text-ember tracking-wider hover:bg-cream transition-colors"
          >
            View All Results →
          </button>
        </div>
      )}
    </div>
  );
}
