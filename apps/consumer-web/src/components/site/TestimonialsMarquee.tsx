'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, X, Loader2 } from "lucide-react";

interface ReviewData {
  id: string;
  quote: string;
  author: string;
  event: string;
  rating: number;
  accent: "ember" | "teal";
}

function ReviewCard({ review }: { review: ReviewData }) {
  const accentColor = review.accent === "ember" ? "text-ember" : "text-teal";

  return (
    <div
      className="relative shrink-0 px-4 py-3 border border-white/10"
      style={{ backgroundColor: '#0a0a0a', width: '380px' }}
    >
      <p className="text-sm font-body italic leading-snug text-white/70 line-clamp-2">
        {review.quote}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40">{review.author}</span>
          <span className={`text-[10px] font-utility tracking-wider ${accentColor}`}>
            {review.event}
          </span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < review.rating ? "text-ember fill-ember" : "text-white/10 fill-none"}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="relative shrink-0 px-4 py-3 border border-white/10 animate-pulse"
      style={{ backgroundColor: '#0a0a0a', width: '380px' }}
    >
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-3/4" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-3 bg-white/10 rounded w-16" />
          <div className="h-3 bg-white/10 rounded w-12" />
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-white/10 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TestimonialsMarquee({ navigate }: { navigate: (path: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", event: "", review: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      const mapped: ReviewData[] = data.map((item: Record<string, unknown>, index: number) => ({
        id: item.id as string,
        quote: item.content as string,
        author: item.reviewerName as string,
        event: item.eventType as string,
        rating: item.rating as number,
        accent: index % 2 === 0 ? "ember" : "teal",
      }));
      setReviews(mapped);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName: form.name,
          eventType: form.event,
          rating: form.rating,
          content: form.review,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (submitted) {
      setSubmitted(false);
      setForm({ name: "", event: "", review: "", rating: 5 });
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: '#00a3a3' }}
      >
        {/* Header */}
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-8 md:pt-10 pb-4">
          <div
            className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div>
              <h2 className="font-display text-5xl md:text-7xl font-bold leading-[1.02]" style={{ color: '#0a0a0a' }}>
                What they <span className="italic font-normal text-ember">say</span>.
              </h2>
              <div className="mt-2 flex items-center gap-3">
                <p className="text-sm md:text-base" style={{ color: 'rgba(10,10,10,0.5)' }}>
                  Real events. Real reviews. No fluff.
                </p>
                {!loading && reviews.length > 0 && (
                  <span className="font-utility text-xs tracking-wider" style={{ color: 'rgba(10,10,10,0.3)' }}>
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => { setModalOpen(true); setSubmitted(false); setError(null); }}
              className="font-utility inline-flex items-center gap-2 bg-ink text-ink-foreground px-6 py-3 text-sm tracking-wider transition-all hover:bg-ember hover:text-ember-foreground shrink-0 self-start md:self-auto group"
            >
              <Plus size={14} strokeWidth={2} className="transition-transform duration-300 group-hover:rotate-90" />
              Leave a Review
            </button>
          </div>
        </div>

        {/* Single-row infinite scroll marquee */}
        {loading ? (
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={`sk-${i}`} />
            ))}
          </div>
        ) : error && reviews.length === 0 ? (
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-6">
            <div className="border border-white/10 py-8 text-center" style={{ backgroundColor: '#0a0a0a' }}>
              <p className="font-display text-lg font-bold text-white/80">Something went wrong.</p>
              <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">{error}</p>
              <button
                onClick={fetchReviews}
                className="mt-4 font-utility inline-flex items-center gap-2 bg-ember px-5 py-2 text-[10px] text-ember-foreground tracking-wider transition-all hover:bg-white hover:text-ink"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="group flex overflow-hidden">
            <div className="flex animate-marquee-left gap-2 hover:[animation-play-state:paused]">
              {reviews.map((r) => (<ReviewCard key={`a-${r.id}`} review={r} />))}
              {reviews.map((r) => (<ReviewCard key={`b-${r.id}`} review={r} />))}
              {reviews.map((r) => (<ReviewCard key={`c-${r.id}`} review={r} />))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 pb-6">
            <div className="border border-white/10 py-8 text-center" style={{ backgroundColor: '#0a0a0a' }}>
              <p className="font-display text-lg font-bold text-white/80">No reviews yet.</p>
              <p className="mt-2 text-sm text-white/50 max-w-sm mx-auto">Be the first to share your experience.</p>
              <button
                onClick={() => { setModalOpen(true); setSubmitted(false); setError(null); }}
                className="mt-4 font-utility inline-flex items-center gap-2 bg-ember px-5 py-2 text-[10px] text-ember-foreground tracking-wider transition-all hover:bg-white hover:text-ink"
              >
                <Plus size={14} strokeWidth={2} />
                Leave a Review
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Modal overlay */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className="relative w-full max-w-lg bg-background border border-foreground/15 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="h-10 w-10 rounded-full border-2 border-teal flex items-center justify-center mx-auto mb-4">
                    <span className="text-teal text-lg">&#10003;</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">Thank you.</h3>
                  <p className="mt-2 text-xs text-muted-foreground">Your review has been submitted and will appear after verification.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", event: "", review: "", rating: 5 }); }}
                    className="mt-4 font-utility text-[9px] text-ember hover:text-teal transition-colors tracking-wider"
                  >
                    Write Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    Leave a <span className="italic font-normal text-teal">review</span>.
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">Real events. Real words. All reviews are verified before publishing.</p>

                  {error && (
                    <p className="mt-3 text-xs text-ember">{error}</p>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-0">
                    <div className="border-t border-foreground/15 pt-4 pb-4">
                      <label className="font-utility text-[8px] text-muted-foreground tracking-widest block mb-2">Your Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="First name or couple name"
                        required
                        disabled={submitting}
                        className="w-full border-b border-foreground/25 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    <div className="border-t border-foreground/15 pt-4 pb-4">
                      <label className="font-utility text-[8px] text-muted-foreground tracking-widest block mb-2">Event Type</label>
                      <select
                        name="event"
                        value={form.event}
                        onChange={handleChange}
                        required
                        disabled={submitting}
                        className="w-full border-b border-foreground/25 bg-transparent py-2 text-sm text-foreground/80 focus:border-foreground focus:outline-none transition-colors appearance-none disabled:opacity-50"
                      >
                        <option value="" className="bg-background">Select event type</option>
                        <option value="wedding" className="bg-background">Wedding</option>
                        <option value="corporate" className="bg-background">Corporate Event</option>
                        <option value="nightclub" className="bg-background">Nightclub / Bar</option>
                        <option value="festival" className="bg-background">Festival</option>
                        <option value="birthday" className="bg-background">Birthday</option>
                        <option value="gala" className="bg-background">Gala / Fundraiser</option>
                        <option value="community" className="bg-background">Community Event</option>
                        <option value="other" className="bg-background">Other</option>
                      </select>
                    </div>

                    <div className="border-t border-foreground/15 pt-4 pb-4">
                      <label className="font-utility text-[8px] text-muted-foreground tracking-widest block mb-2">Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm({ ...form, rating: star })}
                            disabled={submitting}
                            className="transition-transform hover:scale-110 disabled:opacity-50"
                          >
                            <svg
                              className={`w-7 h-7 ${star <= form.rating ? "text-ember fill-ember" : "text-foreground/15 fill-none"}`}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </button>
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">{form.rating}/5</span>
                      </div>
                    </div>

                    <div className="border-t border-foreground/15 pt-4 pb-4">
                      <label className="font-utility text-[8px] text-muted-foreground tracking-widest block mb-2">Your Review</label>
                      <textarea
                        name="review"
                        value={form.review}
                        onChange={handleChange}
                        placeholder="Tell us about your experience..."
                        required
                        rows={4}
                        disabled={submitting}
                        className="w-full border-b border-foreground/25 bg-transparent py-2 text-sm text-foreground placeholder:text-foreground/25 focus:border-foreground focus:outline-none transition-colors resize-none disabled:opacity-50"
                      />
                    </div>

                    <div className="border-t border-foreground/15 pt-5 flex items-center justify-between">
                      <p className="text-[9px] text-muted-foreground">Verified before publishing.</p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="font-utility inline-flex items-center gap-2 bg-ember px-6 py-2.5 text-[9px] text-ember-foreground tracking-wider transition-all hover:bg-ink hover:text-ink-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
