'use client'

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getHashQueryParams, navigateWithQuery } from "@/lib/router-utils";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ExternalLink,
  Loader2,
  MapPin,
  Phone,
  Star,
  Globe,
  Mail,
  Shield,
  MessageSquare,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface VendorSocial {
  platform: string;
  url: string;
}

interface VendorGalleryItem {
  id: string;
  url: string;
  caption: string | null;
}

interface VendorReview {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  reviewerId?: string;
  user?: { id: string; name: string; email: string } | null;
}

interface SimilarVendor {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string | null;
  averageRating: number;
  reviewCount: number;
  priceRange: string;
  isVerified: boolean;
}

interface VendorDetail {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  bio: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  priceRange: string;
  serviceAreas: string[];
  tags: string[];
  capacity: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  isClaimed: boolean;
  isPublished: boolean;
  averageRating: number;
  reviewCount: number;
  gallery: VendorGalleryItem[];
  socials: VendorSocial[];
  reviews: VendorReview[];
  plan?: string; // free, verified, premium - from vendorProfile
}

// ─── Star Rating ────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={cn(
            star <= Math.round(rating)
              ? "fill-ember text-ember"
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

// ─── Review Form ────────────────────────────────────────────────

function ReviewForm({
  vendorId,
  reviewerId,
  reviewerName,
  onSubmitted,
  onCancel,
}: {
  vendorId: string;
  reviewerId: string;
  reviewerName: string;
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorId,
          reviewerId,
          rating,
          body: body.trim() || null,
          reviewerName,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setRating(0);
      setBody("");
      toast.success("Review submitted", { description: "Your review has been submitted and is pending approval." });
      onSubmitted();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit review";
      setError(msg);
      toast.error("Review failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-md border border-teal/30 bg-teal/5 p-6 text-center">
        <Check size={24} className="text-teal mx-auto mb-3" />
        <p className="font-display font-bold text-sm text-teal">
          Review submitted
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Your review is pending approval and will appear once verified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest block mb-3">
          Your Rating
        </p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={cn(
                  (hoverRating || rating) >= star
                    ? "fill-ember text-ember"
                    : "fill-transparent text-muted-foreground/30"
                )}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 font-utility text-[10px] text-ember tracking-wider">
              {rating}/5
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest block mb-2">
          Your Review (optional)
        </p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-display placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
        />
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="font-utility text-[11px] bg-ember text-ember-foreground hover:bg-ink hover:text-ink-foreground px-6 py-3"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
        <Button
          onClick={onCancel}
          variant="ghost"
          className="font-utility text-[11px] text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Star Distribution ──────────────────────────────────────────

function StarDistribution({ reviews }: { reviews: VendorReview[] }) {
  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count };
  });
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div className="space-y-1.5">
      {dist.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2">
          <span className="font-utility text-[10px] text-muted-foreground w-4 text-right">{star}</span>
          <Star size={10} className="fill-ember text-ember shrink-0" />
          <div className="flex-1 h-2 bg-foreground/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-ember rounded-full transition-all duration-500"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="font-utility text-[10px] text-muted-foreground w-5">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main VendorDetailPage ──────────────────────────────────────

export function VendorDetailPage({ navigate }: { navigate: (path: string) => void }) {
  const { data: session, status: sessionStatus } = useSession();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [similarVendors, setSimilarVendors] = useState<SimilarVendor[]>([]);

  // Fetch vendor based on query params
  const fetchVendor = useCallback(async () => {
    const params = getHashQueryParams();
    const id = params.id;
    const slug = params.slug;

    if (!id && !slug) {
      setError("No vendor ID or slug provided");
      setLoading(false);
      return;
    }

    // Reset state for new vendor
    setVendor(null);
    setSimilarVendors([]);
    setIsSaved(false);
    setShowReviewForm(false);
    setError("");
    setLoading(true);

    try {
      let url: string;
      if (id) {
        url = `/api/vendors/${encodeURIComponent(id)}`;
      } else {
        url = `/api/vendors/slug/${encodeURIComponent(slug!)}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Vendor not found");
        } else {
          setError("Failed to load vendor details");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setVendor(data.vendor);

      // Fetch similar vendors in same category
      if (data.vendor?.category) {
        try {
          const simRes = await fetch(
            `/api/vendors?category=${encodeURIComponent(data.vendor.category)}&limit=5`
          );
          if (simRes.ok) {
            const simData = await simRes.json();
            const filtered = (simData.vendors || []).filter(
              (v: SimilarVendor) => v.id !== data.vendor.id
            );
            setSimilarVendors(filtered.slice(0, 3));
          }
        } catch {
          // silently fail
        }
      }

      // Check if vendor is already saved by user
      if (session?.user && data.vendor) {
        try {
          const savedRes = await fetch(
            `/api/saved-vendors?userId=${(session.user as any).id}`
          );
          if (savedRes.ok) {
            const savedData = await savedRes.json();
            const isAlreadySaved = (savedData.savedVendors || []).some(
              (sv: { vendor: { id: string } }) => sv.vendor.id === data.vendor.id
            );
            setIsSaved(isAlreadySaved);
          }
        } catch {
          // silently fail
        }
      }
    } catch {
      setError("Failed to load vendor details");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  // Re-fetch when hash changes (e.g. clicking similar vendor)
  useEffect(() => {
    const onHashChange = () => {
      const path = window.location.hash.slice(1).split("?")[0];
      if (path === "/vendor") {
        fetchVendor();
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [fetchVendor]);

  const requireAuth = (action: string): boolean => {
    if (sessionStatus === "loading") return false;
    if (!session?.user) {
      toast.error("Sign in required", { description: `Please sign in to ${action}.` });
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleSaveVendor = async () => {
    if (!vendor) return;
    if (!requireAuth("save vendors")) return;

    const userId = (session!.user as any).id;

    if (isSaved) {
      // Unsave
      setIsSaving(true);
      try {
        const res = await fetch("/api/saved-vendors", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, vendorId: vendor.id }),
        });
        if (res.ok) {
          setIsSaved(false);
          toast.success("Vendor removed from saved list");
        }
      } catch {
        toast.error("Failed to remove vendor");
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/saved-vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vendorId: vendor.id }),
      });

      if (res.ok) {
        setIsSaved(true);
        toast.success("Vendor saved", { description: `${vendor.name} added to your saved vendors.` });
      } else if (res.status === 409) {
        setIsSaved(true);
      } else {
        const data = await res.json();
        toast.error("Failed to save vendor", { description: data.error });
      }
    } catch {
      toast.error("Failed to save vendor");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookNow = () => {
    if (!vendor) return;
    if (!requireAuth("book vendors")) return;
    navigateWithQuery(navigate, "/booking", {
      vendor: vendor.slug,
    });
  };

  const handleSendMessage = () => {
    if (!vendor) return;
    if (!requireAuth("contact vendors")) return;
    // For free-tier vendors, send a lead/contact request
    navigateWithQuery(navigate, "/booking", { vendor: vendor.slug });
  };

  // Determine vendor tier
  const isPremiumOrVerified = vendor?.isVerified || vendor?.isFeatured;
  const isFreeTier = !isPremiumOrVerified;

  // ─── Loading State ──────────────────────────────────────────────
  if (loading) {
    return (
      <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} showDedicatedCTA={false} navigate={navigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={32} className="animate-spin text-ember" />
        </div>
      </SiteShell>
    );
  }

  // ─── Error State ────────────────────────────────────────────────
  if (error || !vendor) {
    return (
      <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} showDedicatedCTA={false} navigate={navigate}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <h1 className="font-display text-5xl font-bold text-foreground">404</h1>
            <p className="mt-4 text-muted-foreground">
              {error || "Vendor not found"}
            </p>
            <button
              onClick={() => navigate("/directory")}
              className="mt-6 font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-6 py-3 text-[11px] hover:bg-ink hover:text-ink-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Directory
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  // ─── Helper ─────────────────────────────────────────────────────
  const categoryDisplay = vendor.category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const socialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return "IG";
      case "facebook": return "FB";
      case "twitter": return "X";
      case "tiktok": return "TK";
      case "youtube": return "YT";
      default: return platform.slice(0, 2).toUpperCase();
    }
  };

  // Determine what contact info to show
  const showPhone = vendor.phone && isPremiumOrVerified;
  const showWebsite = vendor.website && isPremiumOrVerified;
  const showEmail = vendor.email && isPremiumOrVerified;

  return (
    <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} showDedicatedCTA={false} navigate={navigate}>
      {/* Unclaimed Profile Banner */}
      {!vendor.isClaimed && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-b border-amber-500/20">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                This profile is unclaimed. Are you the business owner?
              </p>
            </div>
            <button
              onClick={() => navigate("/claim-profile")}
              className="font-utility text-[10px] text-amber-700 dark:text-amber-400 hover:text-foreground border border-amber-500/30 px-3 py-1.5 transition-colors whitespace-nowrap"
            >
              Claim This Profile
            </button>
          </div>
        </div>
      )}

      {/* Hero / Cover */}
      <section className="bg-cream border-b border-border">
        {/* Cover Photo Area */}
        {vendor.coverUrl ? (
          <div className="w-full h-48 md:h-72 overflow-hidden relative">
            <img
              src={vendor.coverUrl}
              alt={`${vendor.name} cover`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
          </div>
        ) : (
          <div className="w-full h-32 md:h-44 bg-foreground/5 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-6xl md:text-8xl font-bold text-foreground/5">
                {vendor.name.charAt(0)}
              </span>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-8 md:pt-12 pb-16 md:pb-24">
          {/* Back navigation */}
          <button
            onClick={() => navigate("/directory")}
            className="font-utility text-[9px] text-muted-foreground hover:text-ember tracking-wider transition-colors inline-flex items-center gap-1.5 mb-8"
          >
            <ArrowLeft size={14} />
            Back to Directory
          </button>

          {/* Category eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-6 bg-ember" />
            <p className="font-utility text-[10px] text-ember tracking-widest">
              {categoryDisplay}
            </p>
            {vendor.isVerified && (
              <>
                <span className="text-muted-foreground/30">&middot;</span>
                <span className="font-utility text-[10px] text-teal tracking-widest">Verified</span>
              </>
            )}
            {vendor.isFeatured && (
              <>
                <span className="text-muted-foreground/30">&middot;</span>
                <span className="font-utility text-[10px] text-ember tracking-widest">Featured</span>
              </>
            )}
          </div>

          {/* Vendor Name */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
            {vendor.name}
          </h1>

          {/* Address */}
          {vendor.address && (
            <div className="mt-4 flex items-center gap-2">
              <MapPin size={14} className="text-ember shrink-0" />
              <span className="text-sm text-muted-foreground">{vendor.address}</span>
            </div>
          )}

          {/* Rating + Price */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {vendor.reviewCount > 0 && (
              <div className="flex items-center gap-2">
                <StarRating rating={vendor.averageRating} size={18} />
                <span className="font-utility text-[11px] text-muted-foreground tracking-wider">
                  {vendor.averageRating} ({vendor.reviewCount} {vendor.reviewCount === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
            {vendor.priceRange && (
              <span className="font-utility text-[11px] text-muted-foreground tracking-wider">
                {vendor.priceRange}
              </span>
            )}
            {vendor.capacity && (
              <span className="font-utility text-[11px] text-muted-foreground tracking-wider">
                Capacity: {vendor.capacity}
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {isPremiumOrVerified ? (
              <button
                onClick={handleBookNow}
                className="font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] hover:bg-ink hover:text-ink-foreground transition-colors"
              >
                Book Now
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSendMessage}
                className="font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] hover:bg-ink hover:text-ink-foreground transition-colors"
              >
                <MessageSquare size={14} />
                Send Message
              </button>
            )}
            <button
              onClick={handleSaveVendor}
              disabled={isSaving || sessionStatus === "loading"}
              className={cn(
                "font-utility inline-flex items-center gap-2 border border-border px-6 py-4 text-[11px] transition-colors",
                isSaved
                  ? "bg-ember/5 border-ember/30 text-ember"
                  : "bg-background hover:bg-ink hover:text-ink-foreground hover:border-ink"
              )}
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isSaved ? (
                <Bookmark size={14} className="fill-ember" />
              ) : (
                <Bookmark size={14} />
              )}
              {isSaved ? "Saved" : "Save Vendor"}
            </button>
            <button
              onClick={() => {
                if (!requireAuth("write a review")) return;
                setShowReviewForm(!showReviewForm);
              }}
              className="font-utility inline-flex items-center gap-2 border border-border px-6 py-4 text-[11px] bg-background hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
            >
              <Star size={14} />
              Write a Review
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Main Content */}
            <div className="lg:col-span-7 space-y-12">
              {/* About */}
              {vendor.bio && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">About</p>
                  </div>
                  <p className="text-base leading-[1.8] text-muted-foreground whitespace-pre-line">
                    {vendor.bio}
                  </p>
                </div>
              )}

              {/* Gallery */}
              {vendor.gallery.length > 0 ? (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Gallery</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vendor.gallery.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className="aspect-square bg-foreground/5 border border-border overflow-hidden group hover:border-ember/30 transition-colors"
                      >
                        {item.url ? (
                          <img
                            src={item.url}
                            alt={item.caption || vendor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                            <Star size={24} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Gallery</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-foreground/5 border border-border flex items-center justify-center"
                      >
                        <span className="text-muted-foreground/20 font-display text-2xl font-bold">{i}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">No photos uploaded yet</p>
                </div>
              )}

              {/* Service Areas */}
              {vendor.serviceAreas.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Service Areas</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.serviceAreas.map((area, i) => (
                      <span
                        key={i}
                        className="font-utility text-[10px] tracking-wider px-3 py-1.5 border border-border hover:border-ember/30 hover:bg-ember/5 transition-colors"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {vendor.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vendor.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="font-utility text-[10px] tracking-wider px-3 py-1.5 border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">
                      Reviews ({vendor.reviewCount})
                    </p>
                  </div>
                </div>

                {/* Review Form */}
                {showReviewForm && session?.user && (
                  <div className="mb-8 rounded-md border border-border bg-cream p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-display font-bold text-sm">Write a Review</p>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <ReviewForm
                      vendorId={vendor.id}
                      reviewerId={(session.user as any).id}
                      reviewerName={session.user.name || "Anonymous"}
                      onSubmitted={() => {
                        setShowReviewForm(false);
                        fetchVendor();
                      }}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                {/* Star Distribution + Reviews */}
                {vendor.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {/* Star Distribution */}
                    <div className="rounded-md border border-border p-5">
                      <div className="flex items-start gap-6">
                        <div className="text-center">
                          <p className="font-display text-4xl font-bold text-ember">{vendor.averageRating}</p>
                          <StarRating rating={vendor.averageRating} size={14} />
                          <p className="font-utility text-[9px] text-muted-foreground mt-1 tracking-wider">
                            {vendor.reviewCount} {vendor.reviewCount === 1 ? "review" : "reviews"}
                          </p>
                        </div>
                        <div className="flex-1">
                          <StarDistribution reviews={vendor.reviews} />
                        </div>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                      {vendor.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <StarRating rating={review.rating} size={14} />
                              {review.user?.name && (
                                <span className="font-utility text-[10px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider">
                                  {review.user.name}
                                </span>
                              )}
                            </div>
                            <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {review.body && (
                            <p className="text-sm text-muted-foreground group-hover:text-ink-foreground/75 leading-relaxed">
                              {review.body}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-border p-8 text-center">
                    <p className="font-display text-sm font-bold">No reviews yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Be the first to share your experience with this vendor.
                    </p>
                    {session?.user && (
                      <button
                        onClick={() => setShowReviewForm(true)}
                        className="mt-4 font-utility text-[10px] text-ember hover:text-foreground tracking-wider transition-colors"
                      >
                        + Write a Review
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 lg:col-start-9 space-y-6">
              {/* Contact Info Card */}
              <div className="border border-border p-6 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-[1px] w-6 bg-ember" />
                  <p className="font-utility text-[10px] text-ember tracking-widest">Contact</p>
                </div>

                {vendor.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-ember shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{vendor.address}</span>
                  </div>
                )}

                {showPhone && vendor.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-ember shrink-0" />
                    <a href={`tel:${vendor.phone}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {vendor.phone}
                    </a>
                  </div>
                )}

                {showEmail && vendor.email && (
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-ember shrink-0" />
                    <a href={`mailto:${vendor.email}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {vendor.email}
                    </a>
                  </div>
                )}

                {showWebsite && vendor.website && (
                  <div className="flex items-center gap-3">
                    <Globe size={16} className="text-ember shrink-0" />
                    <a
                      href={vendor.website.startsWith("http") ? vendor.website : `https://${vendor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Free tier - show contact CTA instead of direct info */}
                {isFreeTier && !showPhone && !showEmail && !showWebsite && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">
                      Contact details available for verified vendors.
                    </p>
                    <button
                      onClick={handleSendMessage}
                      className="w-full font-utility text-[10px] bg-ember text-ember-foreground px-4 py-2.5 hover:bg-ink hover:text-ink-foreground transition-colors"
                    >
                      Contact This Vendor
                    </button>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {vendor.socials.length > 0 && (
                <div className="border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Social</p>
                  </div>
                  <div className="space-y-2">
                    {vendor.socials.map((social, i) => (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 border border-border hover:border-ember/30 hover:bg-ember/5 transition-colors group/social"
                      >
                        <span className="font-utility text-[9px] tracking-wider text-ember font-bold">
                          {socialIcon(social.platform)}
                        </span>
                        <span className="text-sm text-muted-foreground group-hover/social:text-foreground transition-colors capitalize">
                          {social.platform}
                        </span>
                        <ExternalLink size={12} className="ml-auto text-muted-foreground/40 group-hover/social:text-foreground transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Claim Profile CTA */}
              {!vendor.isClaimed && (
                <div className="border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-5">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-sm font-bold text-amber-700 dark:text-amber-400">
                        Are you the owner?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Claim this profile to manage your listing and connect with customers.
                      </p>
                      <button
                        onClick={() => navigate("/claim-profile")}
                        className="mt-3 font-utility inline-flex items-center gap-2 bg-ink text-ink-foreground px-5 py-2.5 text-[10px] hover:bg-ember hover:text-ember-foreground transition-colors"
                      >
                        Claim This Profile
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Book CTA */}
              <div className="bg-ink text-ink-foreground p-6">
                <p className="font-utility text-[10px] text-white/40 tracking-widest">Interested?</p>
                <p className="font-display text-xl font-bold mt-2">
                  {isPremiumOrVerified ? "Book" : "Message"} {vendor.name.split(" ").slice(0, 2).join(" ")}.
                </p>
                <p className="text-xs text-white/50 mt-2">
                  Tell us about your event and we&apos;ll connect you.
                </p>
                <button
                  onClick={isPremiumOrVerified ? handleBookNow : handleSendMessage}
                  className="mt-5 w-full font-utility inline-flex items-center justify-center gap-2 bg-ember text-ember-foreground px-6 py-3.5 text-[11px] hover:bg-white hover:text-ink transition-colors"
                >
                  {isPremiumOrVerified ? "Book Now" : "Send Message"}
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Similar Vendors */}
              {similarVendors.length > 0 && (
                <div className="border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-[1px] w-6 bg-ember" />
                    <p className="font-utility text-[10px] text-ember tracking-widest">Similar Vendors</p>
                  </div>
                  <div className="space-y-3">
                    {similarVendors.map((sv) => (
                      <button
                        key={sv.id}
                        onClick={() => {
                          navigateWithQuery(navigate, "/vendor", { slug: sv.slug });
                          // Re-fetch vendor data by reloading the page
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full text-left p-3 border border-border hover:border-ember/30 hover:bg-ember/5 transition-colors group/sim"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-display text-sm font-bold group-hover/sim:text-ember transition-colors">
                            {sv.name}
                          </p>
                          {sv.isVerified && (
                            <Check size={12} className="text-teal" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {sv.reviewCount > 0 && (
                            <span className="font-utility text-[9px] text-muted-foreground tracking-wider">
                              {sv.averageRating} ({sv.reviewCount})
                            </span>
                          )}
                          {sv.priceRange && (
                            <span className="font-utility text-[9px] text-muted-foreground tracking-wider">
                              {sv.priceRange}
                            </span>
                          )}
                        </div>
                        {sv.address && (
                          <p className="font-utility text-[9px] text-muted-foreground mt-1">{sv.address}</p>
                        )}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => navigateWithQuery(navigate, "/explore", { slug: vendor.category.replace(/_/g, "-") })}
                    className="mt-4 w-full font-utility inline-flex items-center justify-center gap-2 border border-border px-5 py-2.5 text-[10px] hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
                  >
                    View All {categoryDisplay}
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
