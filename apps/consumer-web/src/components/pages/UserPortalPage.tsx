'use client'

import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────

interface Booking {
  id: string;
  bookingNumber: string;
  eventType: string;
  eventDate: string;
  venueName: string;
  status: string;
  totalAmount: number;
  servicesRequested: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
}

interface SavedVendorItem {
  id: string;
  savedAt: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
    category: string;
    address: string | null;
    phone: string | null;
    logoUrl: string | null;
    isVerified: boolean;
    isFeatured: boolean;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
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

// ─── Tab Definitions ──────────────────────────────────────────────

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "bookings", label: "My Bookings" },
  { key: "saved", label: "Saved Vendors" },
  { key: "profile", label: "Profile" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

// ─── Overview Tab ─────────────────────────────────────────────────

function OverviewTab({
  user,
  bookings,
  savedCount,
  navigate,
}: {
  user: UserProfile;
  bookings: Booking[];
  savedCount: number;
  navigate: (path: string) => void;
}) {
  const upcomingBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div>
        <p className="font-utility text-[11px] text-ember">Welcome back</p>
        <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold">
          {user.name}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your bookings and discover vendors for your next event.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Upcoming Bookings", value: upcomingBookings.length },
          { label: "Total Bookings", value: bookings.length },
          { label: "Saved Vendors", value: savedCount },
          { label: "Member Since", value: new Date().getFullYear().toString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-background border border-border p-5 group hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
          >
            <p className="font-display text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/60 tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div>
          <SectionHeader eyebrow="Recent" title="Recent Bookings" />
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-background border border-border p-5 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold truncate">
                      {booking.eventType}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground group-hover:text-ink-foreground/60">
                      {booking.venueName} &middot; {booking.eventDate}
                    </p>
                    <p className="mt-0.5 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                      {booking.bookingNumber}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={booking.status} />
                    <span className="font-utility text-[10px] text-muted-foreground group-hover:text-ink-foreground/50">
                      ${booking.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/booking")}
          className="group bg-ember text-ember-foreground p-6 text-left transition-all hover:bg-ink hover:text-ink-foreground"
        >
          <p className="font-display text-lg font-bold">Book an Event</p>
          <p className="mt-1 text-xs text-ember-foreground/75 group-hover:text-ink-foreground/60">
            Reserve your date now
          </p>
        </button>
        <button
          onClick={() => navigate("/directory")}
          className="group border border-border bg-background p-6 text-left transition-all hover:bg-ink hover:text-ink-foreground hover:border-ink"
        >
          <p className="font-display text-lg font-bold">Browse Vendors</p>
          <p className="mt-1 text-xs text-muted-foreground group-hover:text-ink-foreground/60">
            Find the perfect vendor
          </p>
        </button>
        <button
          onClick={() => navigate("/services")}
          className="group border border-border bg-background p-6 text-left transition-all hover:bg-ink hover:text-ink-foreground hover:border-ink"
        >
          <p className="font-display text-lg font-bold">Our Services</p>
          <p className="mt-1 text-xs text-muted-foreground group-hover:text-ink-foreground/60">
            DJ, photo booth & more
          </p>
        </button>
      </div>
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────

function BookingsTab({ bookings, loading }: { bookings: Booking[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl font-bold">No bookings yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Ready to plan your event? Start by reserving a date.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionHeader eyebrow="Your Events" title="All Bookings" />
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="font-display text-lg font-bold truncate">
                  {booking.eventType}
                </p>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground group-hover:text-ink-foreground/60">
                {booking.venueName} &middot; {booking.eventDate}
              </p>
              <div className="mt-1 flex items-center gap-4">
                <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                  {booking.bookingNumber}
                </span>
                <span className="font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                  {booking.servicesRequested}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="font-display text-xl font-bold">
                ${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Saved Vendors Tab ────────────────────────────────────────────

function SavedVendorsTab({
  vendors,
  loading,
  navigate,
  onRemove,
}: {
  vendors: SavedVendorItem[];
  loading: boolean;
  navigate: (path: string) => void;
  onRemove: (vendorId: string) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl font-bold">No saved vendors yet</p>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Browse the directory to find vendors for your event. Save the ones you like and they&apos;ll appear here.
        </p>
        <button
          onClick={() => navigate("/directory")}
          className="mt-6 font-utility bg-ember text-ember-foreground px-6 py-3 text-[11px] hover:bg-ink hover:text-background transition-colors"
        >
          Browse Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <SectionHeader eyebrow="Favorites" title="Saved Vendors" />
      {vendors.map((sv) => (
        <div
          key={sv.id}
          className="group bg-background border border-border p-5 md:p-6 hover:bg-ink hover:text-ink-foreground hover:border-ink transition-colors"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-lg font-bold truncate">
                {sv.vendor.name}
              </p>
              <p className="mt-0.5 font-utility text-[9px] text-muted-foreground group-hover:text-ink-foreground/50 tracking-wider">
                {sv.vendor.category}
              </p>
              {sv.vendor.address && (
                <p className="mt-1 text-xs text-muted-foreground group-hover:text-ink-foreground/60">
                  {sv.vendor.address}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onRemove(sv.vendor.id)}
                className="font-utility text-[9px] text-muted-foreground hover:text-ember transition-colors tracking-wider"
              >
                Remove
              </button>
              <button
                onClick={() => navigate("/directory")}
                className="font-utility bg-ember text-ember-foreground px-4 py-2 text-[9px] hover:bg-ink hover:text-background transition-colors tracking-wider"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────

function ProfileTab({
  user,
  onUpdate,
}: {
  user: UserProfile;
  onUpdate: (data: { name?: string; phone?: string }) => Promise<void>;
}) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await onUpdate({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled silently
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <SectionHeader eyebrow="Account" title="Your Profile" />

      {/* Read-only info */}
      <div className="space-y-4 mb-10">
        <div className="bg-background border border-border p-5">
          <p className="font-utility text-[9px] text-muted-foreground tracking-wider">Email</p>
          <p className="mt-1 font-display text-lg">{user.email}</p>
        </div>
        <div className="bg-background border border-border p-5">
          <p className="font-utility text-[9px] text-muted-foreground tracking-wider">Role</p>
          <p className="mt-1 font-display text-lg capitalize">{user.role}</p>
        </div>
      </div>

      {/* Edit form */}
      <SectionHeader eyebrow="Edit" title="Update Info" />
      <form onSubmit={handleSave} className="grid gap-4">
        <div>
          <label className="font-utility text-[9px] text-muted-foreground tracking-wider block mb-2">
            Full Name
          </label>
          <input
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="font-utility text-[9px] text-muted-foreground tracking-wider block mb-2">
            Phone
          </label>
          <input
            className="w-full border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(414) 555-0000"
            disabled={saving}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="font-utility bg-ember text-ember-foreground py-3 text-[11px] hover:bg-ink hover:text-background transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Saving...
            </>
          ) : saved ? (
            "Saved"
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main Portal Page ─────────────────────────────────────────────

export function UserPortalPage({ navigate }: { navigate: (path: string) => void }) {
  const { data: session, status: sessionStatus } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [savedVendors, setSavedVendors] = useState<SavedVendorItem[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);

  // Auth check
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      navigate("/login");
    }
  }, [sessionStatus, navigate]);

  // Fetch user profile
  useEffect(() => {
    if (session?.user) {
      const userId = (session.user as Record<string, unknown>).id as string;
      fetch(`/api/user/profile?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, [session]);

  // Fetch bookings
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/bookings?userId=${user.id}`);
        const data = await res.json();
        if (!cancelled && data.bookings) setBookings(data.bookings);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setBookingsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // Fetch saved vendors
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/saved-vendors?userId=${user.id}`);
        const data = await res.json();
        if (!cancelled && data.savedVendors) setSavedVendors(data.savedVendors);
      } catch {
        // handled silently
      } finally {
        if (!cancelled) setSavedLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const handleUpdateProfile = async (data: { name?: string; phone?: string }) => {
    if (!user) return;
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, ...data }),
    });
    const result = await res.json();
    if (result.user) setUser(result.user);
  };

  const handleRemoveSavedVendor = async (vendorId: string) => {
    if (!user) return;
    try {
      await fetch("/api/saved-vendors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, vendorId }),
      });
      setSavedVendors((prev) => prev.filter((sv) => sv.vendor.id !== vendorId));
    } catch {
      // handled silently
    }
  };

  // Loading / unauthenticated
  if (sessionStatus === "loading" || (!user && sessionStatus === "authenticated")) {
    return (
      <SiteShell navigate={navigate} showAboveFooterVideo={false} showGlobalFooter={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-muted-foreground" size={32} />
        </div>
      </SiteShell>
    );
  }

  if (!user) return null;

  return (
    <SiteShell navigate={navigate} showAboveFooterVideo={false} showGlobalFooter={false}>
      <div className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
          <p className="font-utility text-[11px] text-ember">Your Portal</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold">
            Welcome, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your bookings, save vendors, and plan your next event.
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
                  user={user}
                  bookings={bookings}
                  savedCount={savedVendors.length}
                  navigate={navigate}
                />
              )}
              {activeTab === "bookings" && (
                <BookingsTab bookings={bookings} loading={bookingsLoading} />
              )}
              {activeTab === "saved" && (
                <SavedVendorsTab
                  vendors={savedVendors}
                  loading={savedLoading}
                  navigate={navigate}
                  onRemove={handleRemoveSavedVendor}
                />
              )}
              {activeTab === "profile" && (
                <ProfileTab user={user} onUpdate={handleUpdateProfile} />
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
