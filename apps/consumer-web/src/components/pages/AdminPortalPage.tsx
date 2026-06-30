'use client'

import { useState, useEffect, useCallback } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────

interface AdminStats {
  totalVendors: number;
  totalUsers: number;
  totalBookings: number;
  pendingClaims: number;
  totalReviews: number;
  publishedVendors: number;
  featuredVendors: number;
  verifiedVendors: number;
  approvedReviews: number;
  pendingReviews: number;
}

interface ClaimRequest {
  id: string;
  vendorId: string;
  userId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  adminNote: string | null;
  vendor: {
    id: string;
    name: string;
    slug: string;
    phone: string | null;
    address: string | null;
    isClaimed: boolean;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface VendorItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  address: string | null;
  phone: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isClaimed: boolean;
  createdAt: string;
}

interface UserItem {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    bookings: number;
    reviews: number;
    savedVendors: number;
    claimRequests: number;
  };
  vendorProfile: {
    id: string;
    vendorId: string;
    plan: string;
  } | null;
}

interface ReviewItem {
  id: string;
  vendorId: string;
  reviewerId: string;
  rating: number;
  body: string | null;
  isApproved: boolean;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// ─── Shared Components ────────────────────────────────────────────

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

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    pending: "bg-ember/15 text-ember",
    approved: "bg-teal/15 text-teal",
    rejected: "bg-muted text-muted-foreground",
    confirmed: "bg-teal/15 text-teal",
    cancelled: "bg-muted text-muted-foreground",
    completed: "bg-green-100 text-green-700",
  };
  return (
    <span className={`font-utility text-[9px] tracking-wider px-2.5 py-1 ${config[status] || config.pending}`}>
      {status}
    </span>
  );
}

function ToggleButton({
  active,
  onClick,
  loading,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  onClick: () => void;
  loading?: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`font-utility text-[9px] tracking-wider px-3 py-1.5 transition-colors disabled:opacity-50 ${
        active
          ? "bg-teal/15 text-teal hover:bg-teal/25"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      }`}
    >
      {loading ? "..." : active ? activeLabel : inactiveLabel}
    </button>
  );
}

// ─── Tab Definitions ──────────────────────────────────────────────

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "claims", label: "Claims" },
  { key: "vendors", label: "Vendors" },
  { key: "users", label: "Users" },
  { key: "reviews", label: "Reviews" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ─── Overview Tab ─────────────────────────────────────────────────

function OverviewTab({
  stats,
  loading,
  onNavigate,
}: {
  stats: AdminStats | null;
  loading: boolean;
  onNavigate: (tab: TabKey) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div>
        <p className="font-utility text-[11px] text-ember">Administration</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">Dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor and manage the Planviry marketplace.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Vendors", value: stats.totalVendors, tab: "vendors" as TabKey },
          { label: "Total Users", value: stats.totalUsers, tab: "users" as TabKey },
          { label: "Total Bookings", value: stats.totalBookings, tab: null },
          { label: "Pending Claims", value: stats.pendingClaims, tab: "claims" as TabKey, highlight: stats.pendingClaims > 0 },
          { label: "Total Reviews", value: stats.totalReviews, tab: "reviews" as TabKey },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => stat.tab && onNavigate(stat.tab)}
            className={`text-left bg-background border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors ${stat.tab ? "cursor-pointer" : "cursor-default"}`}
          >
            <p className={`font-display text-3xl font-bold ${stat.highlight ? "text-ember group-hover:text-ink-foreground" : ""}`}>
              {stat.value}
            </p>
            <p className="mt-1 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider">
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors">
          <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider mb-3">
            Vendor Breakdown
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Published</span>
              <span className="font-display font-bold">{stats.publishedVendors}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Featured</span>
              <span className="font-display font-bold">{stats.featuredVendors}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Verified</span>
              <span className="font-display font-bold">{stats.verifiedVendors}</span>
            </div>
          </div>
        </div>
        <div className="bg-background border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors">
          <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider mb-3">
            Review Status
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Approved</span>
              <span className="font-display font-bold text-teal group-hover:text-ink-foreground">{stats.approvedReviews}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pending Approval</span>
              <span className="font-display font-bold text-ember group-hover:text-ink-foreground">{stats.pendingReviews}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span className="font-display font-bold">{stats.totalReviews}</span>
            </div>
          </div>
        </div>
        <div className="bg-background border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors">
          <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider mb-3">
            Claims Pipeline
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pending Review</span>
              <span className="font-display font-bold text-ember group-hover:text-ink-foreground">{stats.pendingClaims}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Bookings</span>
              <span className="font-display font-bold">{stats.totalBookings}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Users</span>
              <span className="font-display font-bold">{stats.totalUsers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Claims Tab ───────────────────────────────────────────────────

function ClaimsTab({
  claims,
  loading,
  onApprove,
  onReject,
  claimActionLoading,
}: {
  claims: ClaimRequest[];
  loading: boolean;
  onApprove: (claimId: string) => void;
  onReject: (claimId: string) => void;
  claimActionLoading: string | null;
}) {
  const [filter, setFilter] = useState<string>("pending");

  const filteredClaims = filter === "all"
    ? claims
    : claims.filter((c) => c.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Verification" title="Claim Requests" />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-utility text-[9px] tracking-wider px-4 py-2 transition-colors ${
              filter === f
                ? "bg-ink text-ink-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filteredClaims.length === 0 ? (
        <div className="text-center py-16 border border-border bg-cream/50">
          <p className="font-display text-2xl font-bold">No {filter} claims</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {filter === "pending"
              ? "All claim requests have been reviewed."
              : `No ${filter} claims found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-bold truncate">
                      {claim.vendor.name}
                    </p>
                    <StatusBadge status={claim.status} />
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-ink-foreground/60">
                    Claimed by <span className="font-medium">{claim.contactName}</span> ({claim.contactEmail})
                  </p>
                  {claim.contactPhone && (
                    <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      Phone: {claim.contactPhone}
                    </p>
                  )}
                  {claim.vendor.address && (
                    <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      Address: {claim.vendor.address}
                    </p>
                  )}
                  {claim.vendor.phone && (
                    <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      Listed Phone: {claim.vendor.phone}
                    </p>
                  )}
                  {claim.adminNote && (
                    <p className="text-xs text-muted-foreground group-hover:text-ink-foreground/60 mt-1">
                      Note: {claim.adminNote}
                    </p>
                  )}
                  <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                    Submitted {new Date(claim.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {claim.status === "pending" && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onApprove(claim.id)}
                      disabled={claimActionLoading === claim.id}
                      className="font-utility bg-teal/15 text-teal px-4 py-2 text-[9px] tracking-wider hover:bg-teal/25 transition-colors disabled:opacity-50"
                    >
                      {claimActionLoading === claim.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => onReject(claim.id)}
                      disabled={claimActionLoading === claim.id}
                      className="font-utility bg-ember/15 text-ember px-4 py-2 text-[9px] tracking-wider hover:bg-ember/25 transition-colors disabled:opacity-50"
                    >
                      {claimActionLoading === claim.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Vendors Tab ──────────────────────────────────────────────────

function VendorsTab({
  vendors,
  loading,
  onToggleVendor,
  vendorActionLoading,
}: {
  vendors: VendorItem[];
  loading: boolean;
  onToggleVendor: (vendorId: string, field: "isPublished" | "isFeatured" | "isVerified", value: boolean) => void;
  vendorActionLoading: string | null;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.category.toLowerCase().includes(search.toLowerCase())
      )
    : vendors;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Directory" title="Vendors" />

      {/* Search */}
      <div>
        <input
          className="w-full md:w-80 border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
          placeholder="Search vendors by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-border bg-cream/50">
          <p className="font-display text-2xl font-bold">No vendors found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {filtered.map((vendor) => (
            <div
              key={vendor.id}
              className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-display text-lg font-bold truncate">
                      {vendor.name}
                    </p>
                    {vendor.isClaimed && (
                      <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-teal/15 text-teal group-hover:text-ink-foreground">
                        Claimed
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                    {vendor.category}
                  </p>
                  {vendor.address && (
                    <p className="mt-1 text-xs text-muted-foreground group-hover:text-ink-foreground/60">
                      {vendor.address}
                    </p>
                  )}
                  <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider mt-1">
                    Created {new Date(vendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <ToggleButton
                    active={vendor.isPublished}
                    onClick={() => onToggleVendor(vendor.id, "isPublished", !vendor.isPublished)}
                    loading={vendorActionLoading === vendor.id}
                    activeLabel="Published"
                    inactiveLabel="Unpublished"
                  />
                  <ToggleButton
                    active={vendor.isFeatured}
                    onClick={() => onToggleVendor(vendor.id, "isFeatured", !vendor.isFeatured)}
                    loading={vendorActionLoading === vendor.id}
                    activeLabel="Featured"
                    inactiveLabel="Not Featured"
                  />
                  <ToggleButton
                    active={vendor.isVerified}
                    onClick={() => onToggleVendor(vendor.id, "isVerified", !vendor.isVerified)}
                    loading={vendorActionLoading === vendor.id}
                    activeLabel="Verified"
                    inactiveLabel="Not Verified"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────

function UsersTab({
  users,
  loading,
}: {
  users: UserItem[];
  loading: boolean;
}) {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = users
    .filter((u) => roleFilter === "all" || u.role === roleFilter)
    .filter(
      (u) =>
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Accounts" title="Users" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          className="w-full md:w-80 border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {["all", "customer", "vendor", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`font-utility text-[9px] tracking-wider px-4 py-2 transition-colors ${
                roleFilter === r
                  ? "bg-ink text-ink-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-border bg-cream/50">
          <p className="font-display text-2xl font-bold">No users found</p>
          <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-display text-lg font-bold truncate">
                      {user.name}
                    </p>
                    <span className={`font-utility text-[9px] tracking-wider px-2.5 py-1 ${
                      user.role === "admin"
                        ? "bg-ember/15 text-ember"
                        : user.role === "vendor"
                        ? "bg-teal/15 text-teal"
                        : "bg-muted text-muted-foreground"
                    } group-hover:text-ink-foreground`}>
                      {user.role}
                    </span>
                    {user.vendorProfile && (
                      <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-ember/10 text-ember/80 group-hover:text-ink-foreground">
                        {user.vendorProfile.plan} plan
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground group-hover:text-ink-foreground/60">
                    {user.email}
                  </p>
                  <div className="mt-1 flex items-center gap-4 flex-wrap">
                    <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      {user._count.bookings} bookings
                    </span>
                    <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      {user._count.reviews} reviews
                    </span>
                    <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      {user._count.savedVendors} saved
                    </span>
                    <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {user.emailVerified ? (
                    <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-teal/15 text-teal group-hover:text-ink-foreground">
                      Verified
                    </span>
                  ) : (
                    <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-ember/15 text-ember group-hover:text-ink-foreground">
                      Unverified
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────

function ReviewsTab({
  reviews,
  loading,
  onApproveReview,
  onDeleteReview,
  reviewActionLoading,
}: {
  reviews: ReviewItem[];
  loading: boolean;
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (reviewId: string) => void;
  reviewActionLoading: string | null;
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "pending"
    ? reviews.filter((r) => !r.isApproved)
    : filter === "approved"
    ? reviews.filter((r) => r.isApproved)
    : reviews;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Feedback" title="Reviews" />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-utility text-[9px] tracking-wider px-4 py-2 transition-colors ${
              filter === f
                ? "bg-ink text-ink-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-border bg-cream/50">
          <p className="font-display text-2xl font-bold">No reviews found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {filter === "pending"
              ? "All reviews have been reviewed."
              : `No ${filter} reviews found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-1">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-display text-lg font-bold truncate">
                      {review.vendor.name}
                    </p>
                    {!review.isApproved ? (
                      <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-ember/15 text-ember group-hover:text-ink-foreground">
                        Pending
                      </span>
                    ) : (
                      <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-teal/15 text-teal group-hover:text-ink-foreground">
                        Approved
                      </span>
                    )}
                  </div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${star <= review.rating ? "text-ember group-hover:text-ink-foreground" : "text-muted-foreground/30 group-hover:text-ink-foreground/30"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      {review.rating}/5
                    </span>
                  </div>
                  {review.body && (
                    <p className="text-sm text-muted-foreground group-hover:text-ink-foreground/60">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  )}
                  <p className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                    By {review.user.name} ({review.user.email}) &middot; {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!review.isApproved && (
                    <button
                      onClick={() => onApproveReview(review.id)}
                      disabled={reviewActionLoading === review.id}
                      className="font-utility bg-teal/15 text-teal px-4 py-2 text-[9px] tracking-wider hover:bg-teal/25 transition-colors disabled:opacity-50"
                    >
                      {reviewActionLoading === review.id ? "..." : "Approve"}
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteReview(review.id)}
                    disabled={reviewActionLoading === review.id}
                    className="font-utility bg-ember/15 text-ember px-4 py-2 text-[9px] tracking-wider hover:bg-ember/25 transition-colors disabled:opacity-50"
                  >
                    {reviewActionLoading === review.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Portal Page ───────────────────────────────────────

export function AdminPortalPage({ navigate }: { navigate: (path: string) => void }) {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [claims, setClaims] = useState<ClaimRequest[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Action loading states
  const [claimActionLoading, setClaimActionLoading] = useState<string | null>(null);
  const [vendorActionLoading, setVendorActionLoading] = useState<string | null>(null);
  const [reviewActionLoading, setReviewActionLoading] = useState<string | null>(null);

  // Auth check - verify user has role=admin
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      navigate("/login");
    }
  }, [sessionStatus, navigate]);

  // Fetch stats
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (!cancelled && data.stats) setStats(data.stats);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch claims (all statuses)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/claims?status=all&limit=100");
        const data = await res.json();
        if (!cancelled && data.claimRequests) setClaims(data.claimRequests);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setClaimsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch vendors (all, including unpublished - for admin)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/vendors?limit=100&published=");
        const data = await res.json();
        if (!cancelled && data.vendors) setVendors(data.vendors);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setVendorsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch users
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/users?limit=100");
        const data = await res.json();
        if (!cancelled && data.users) setUsers(data.users);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch reviews
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/reviews?all=true&limit=100");
        const data = await res.json();
        if (!cancelled && data.reviews) setReviews(data.reviews);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Actions ───────────────────────────────────────────────────

  const handleApproveClaim = useCallback(async (claimId: string) => {
    setClaimActionLoading(claimId);
    try {
      const res = await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "approved" }),
      });
      if (res.ok) {
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: "approved" } : c))
        );
        fetchStats();
        toast.success("Claim approved");
      } else {
        toast.error("Failed to approve claim");
      }
    } catch {
      toast.error("Failed to approve claim");
    } finally {
      setClaimActionLoading(null);
    }
  }, []);

  const handleRejectClaim = useCallback(async (claimId: string) => {
    setClaimActionLoading(claimId);
    try {
      const res = await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimId, status: "rejected" }),
      });
      if (res.ok) {
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: "rejected" } : c))
        );
        fetchStats();
        toast.success("Claim rejected");
      } else {
        toast.error("Failed to reject claim");
      }
    } catch {
      toast.error("Failed to reject claim");
    } finally {
      setClaimActionLoading(null);
    }
  }, []);

  const handleToggleVendor = useCallback(async (vendorId: string, field: "isPublished" | "isFeatured" | "isVerified", value: boolean) => {
    setVendorActionLoading(vendorId);
    try {
      const res = await fetch(`/api/vendors/${vendorId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        setVendors((prev) =>
          prev.map((v) => (v.id === vendorId ? { ...v, [field]: value } : v))
        );
        fetchStats();
        toast.success(`Vendor ${field.replace("is", "").toLowerCase()} ${value ? "enabled" : "disabled"}`);
      } else {
        toast.error("Failed to update vendor");
      }
    } catch {
      toast.error("Failed to update vendor");
    } finally {
      setVendorActionLoading(null);
    }
  }, []);

  const handleApproveReview = useCallback(async (reviewId: string) => {
    setReviewActionLoading(reviewId);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved: true }),
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, isApproved: true } : r))
        );
        fetchStats();
        toast.success("Review approved");
      } else {
        toast.error("Failed to approve review");
      }
    } catch {
      toast.error("Failed to approve review");
    } finally {
      setReviewActionLoading(null);
    }
  }, []);

  const handleDeleteReview = useCallback(async (reviewId: string) => {
    setReviewActionLoading(reviewId);
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        fetchStats();
        toast.success("Review deleted");
      } else {
        toast.error("Failed to delete review");
      }
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setReviewActionLoading(null);
    }
  }, []);

  const fetchStats = useCallback(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  const handleTabNavigate = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  // Loading / unauthenticated
  if (sessionStatus === "loading") {
    return (
      <SiteShell navigate={navigate} showAboveFooterVideo={false} showGlobalFooter={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </SiteShell>
    );
  }

  if (sessionStatus === "authenticated" && (session?.user as Record<string, unknown>)?.role !== "admin") {
    return (
      <SiteShell navigate={navigate} showAboveFooterVideo={false} showGlobalFooter={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-6">
            <p className="font-display text-2xl font-bold">Access Denied</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You do not have permission to access the admin portal. Only administrators can view this page.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 font-utility bg-ember text-ember-foreground px-6 py-3 text-[11px] hover:bg-ink hover:text-background transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell navigate={navigate} showAboveFooterVideo={false} showGlobalFooter={false}>
      <div className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
          <div className="flex items-center gap-3">
            <p className="font-utility text-[11px] text-ember">Admin Portal</p>
            <span className="font-utility text-[9px] tracking-wider px-2.5 py-1 bg-ember/15 text-ember">
              Admin
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold">
            Planviry
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage vendors, users, claims, and reviews across the marketplace.
          </p>
        </div>
      </div>

      {/* Tab Navigation - Mobile (horizontal scroll) */}
      <div className="md:hidden border-b border-border bg-background">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`font-utility text-[10px] tracking-wider px-5 py-4 whitespace-nowrap transition-colors shrink-0 ${
                activeTab === tab.key
                  ? "text-ember border-b-2 border-ember"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-background min-h-[60vh]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-16">
          <div className="flex gap-10">
            {/* Sidebar - Desktop */}
            <aside className="hidden md:block w-56 shrink-0">
              <nav className="space-y-1 sticky top-28">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`block w-full text-left font-utility text-[10px] tracking-wider px-4 py-3 transition-colors ${
                      activeTab === tab.key
                        ? "bg-ink text-ink-foreground"
                        : "text-muted-foreground hover:bg-cream hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {activeTab === "overview" && (
                <OverviewTab
                  stats={stats}
                  loading={statsLoading}
                  onNavigate={handleTabNavigate}
                />
              )}
              {activeTab === "claims" && (
                <ClaimsTab
                  claims={claims}
                  loading={claimsLoading}
                  onApprove={handleApproveClaim}
                  onReject={handleRejectClaim}
                  claimActionLoading={claimActionLoading}
                />
              )}
              {activeTab === "vendors" && (
                <VendorsTab
                  vendors={vendors}
                  loading={vendorsLoading}
                  onToggleVendor={handleToggleVendor}
                  vendorActionLoading={vendorActionLoading}
                />
              )}
              {activeTab === "users" && (
                <UsersTab users={users} loading={usersLoading} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab
                  reviews={reviews}
                  loading={reviewsLoading}
                  onApproveReview={handleApproveReview}
                  onDeleteReview={handleDeleteReview}
                  reviewActionLoading={reviewActionLoading}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
