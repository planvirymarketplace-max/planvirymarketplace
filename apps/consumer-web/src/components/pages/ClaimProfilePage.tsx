'use client'

import { useState, useEffect, useCallback } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Search,
  Shield,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────

interface VendorListItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  isClaimed: boolean;
  isVerified: boolean;
  isFeatured: boolean;
}

interface ValidationAnswers {
  phoneNumberConfirm: string;
  neighborhood: string;
  operatingYears: string;
  businessRole: string;
}

interface ClaimFormData {
  selectedVendor: VendorListItem | null;
  validationAnswers: ValidationAnswers;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  password: string;
}

const initialFormData: ClaimFormData = {
  selectedVendor: null,
  validationAnswers: {
    phoneNumberConfirm: "",
    neighborhood: "",
    operatingYears: "",
    businessRole: "",
  },
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  password: "",
};

// ─── Constants ──────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Find Business" },
  { number: 2, label: "Verify" },
  { number: 3, label: "Contact" },
  { number: 4, label: "Review" },
];

const MILWAUKEE_NEIGHBORHOODS = [
  "Bay View",
  "Brady Street",
  "Brewers Hill",
  "Bronzeville",
  "Bucktown",
  "Cooper Park",
  "East Side",
  "East Town",
  "Enderis Park",
  "Franklin Heights",
  "Grandview",
  "Granville",
  "Halyard Park",
  "Harambee",
  "Hillside",
  "Historic Third Ward",
  "Jackson Park",
  "Juneau Town",
  "Kilbourn Town",
  "Layton Park",
  "Lincoln Village",
  "Martin Drive",
  "Metcalfe Park",
  "Murray Hill",
  "Northpoint",
  "Riverwest",
  "Roosevelt Grove",
  "Saint Joseph",
  "Sherman Park",
  "Shorewood",
  "South Side",
  "Story Hill",
  "Sunrise",
  "Tippecanoe",
  "University Hill",
  "Uptown",
  "Walker's Point",
  "Washington Heights",
  "Washington Park",
  "West Side",
  "West Town",
  "Wickers Park",
  "Williamsburg Heights",
];

const OPERATING_YEARS = [
  { value: "under-1", label: "Under 1 year" },
  { value: "1-3", label: "1–3 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "5-10", label: "5–10 years" },
  { value: "10+", label: "10+ years" },
];

const BUSINESS_ROLES = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
  { value: "other", label: "Other" },
];

// ─── Step Indicator ─────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => (
          <div key={step.number} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-utility font-semibold transition-all duration-300",
                  currentStep > step.number
                    ? "bg-ember text-ember-foreground"
                    : currentStep === step.number
                    ? "bg-ember text-ember-foreground ring-2 ring-ember/30 ring-offset-2 ring-offset-background"
                    : "bg-foreground/10 text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 font-utility text-[9px] tracking-wider hidden sm:block transition-colors",
                  currentStep >= step.number ? "text-ember" : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-[2px] mx-2 transition-colors duration-300",
                  currentStep > step.number ? "bg-ember" : "bg-foreground/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Find Your Business ─────────────────────────────────

function StepFindBusiness({
  formData,
  onSelectVendor,
}: {
  formData: ClaimFormData;
  onSelectVendor: (vendor: VendorListItem) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState<VendorListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchVendors = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setVendors([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/vendors?search=${encodeURIComponent(query)}&limit=20`);
      if (!res.ok) throw new Error("Failed to search vendors");
      const data = await res.json();
      // Filter to unclaimed vendors only
      const unclaimed = data.vendors.filter((v: VendorListItem) => !v.isClaimed);
      setVendors(unclaimed);
    } catch {
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchVendors(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchVendors]);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 1 of 4
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Find your business.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Search for your business in our directory. Only unclaimed businesses are shown.
        </p>
      </div>

      <div className="max-w-lg space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, address, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="font-display text-lg h-12 pl-10"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-ember" />
          </div>
        )}

        {!isLoading && hasSearched && vendors.length === 0 && searchQuery.trim().length >= 2 && (
          <div className="rounded-md border border-border bg-card p-6 text-center">
            <p className="font-display font-bold text-sm">No unclaimed businesses found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term, or contact us to add your business.
            </p>
          </div>
        )}

        {!isLoading && vendors.length > 0 && (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {vendors.map((vendor) => {
              const isSelected = formData.selectedVendor?.id === vendor.id;
              return (
                <button
                  key={vendor.id}
                  onClick={() => onSelectVendor(vendor)}
                  className={cn(
                    "w-full text-left rounded-md border-2 p-4 transition-all duration-200",
                    isSelected
                      ? "border-ember bg-ember/5"
                      : "border-border bg-card hover:border-ember/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn(
                        "font-display font-bold text-sm",
                        isSelected ? "text-ember" : "text-foreground"
                      )}>
                        {vendor.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {vendor.category.replace(/_/g, " ")}
                        {vendor.address && ` · ${vendor.address}`}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ember">
                        <Check size={12} className="text-ember-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {formData.selectedVendor && (
          <div className="rounded-md border border-teal/30 bg-teal/5 p-4 flex items-start gap-3">
            <Check size={16} className="text-teal shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-sm font-bold text-teal">
                {formData.selectedVendor.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Selected. Click another to change.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Verify Your Connection ─────────────────────────────

function StepVerify({
  formData,
  onValidationChange,
}: {
  formData: ClaimFormData;
  onValidationChange: (field: keyof ValidationAnswers, value: string) => void;
}) {
  const vendor = formData.selectedVendor;
  const ans = formData.validationAnswers;

  // Pre-fill phone from vendor data if available
  const phonePlaceholder = vendor?.phone || "e.g., 414-555-0123";

  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 2 of 4
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Verify your connection.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Answer these questions to confirm you&apos;re authorized to claim this business. Only the real owner would know these details.
        </p>
      </div>

      <div className="rounded-md border border-ember/20 bg-ember/5 p-4">
        <p className="font-utility text-[10px] text-ember tracking-widest">Claiming</p>
        <p className="font-display font-bold mt-1">{vendor?.name}</p>
        {vendor?.address && (
          <p className="text-xs text-muted-foreground mt-0.5">{vendor.address}</p>
        )}
      </div>

      <div className="space-y-6 max-w-lg">
        {/* Question 1: Phone Number */}
        <div className="space-y-2">
          <Label className="font-utility text-[10px] text-ember tracking-widest">
            What is the business phone number listed on your profile?
          </Label>
          <Input
            placeholder={phonePlaceholder}
            value={ans.phoneNumberConfirm}
            onChange={(e) => onValidationChange("phoneNumberConfirm", e.target.value)}
            className="font-display h-11"
          />
          <p className="text-[10px] text-muted-foreground">
            Enter the phone number exactly as it appears on the listing.
          </p>
        </div>

        {/* Question 2: Neighborhood */}
        <div className="space-y-2">
          <Label className="font-utility text-[10px] text-ember tracking-widest">
            What neighborhood is your business located in?
          </Label>
          <Select
            value={ans.neighborhood}
            onValueChange={(v) => onValidationChange("neighborhood", v)}
          >
            <SelectTrigger className="font-display h-11">
              <SelectValue placeholder="Select a neighborhood" />
            </SelectTrigger>
            <SelectContent>
              {MILWAUKEE_NEIGHBORHOODS.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question 3: Operating Years */}
        <div className="space-y-2">
          <Label className="font-utility text-[10px] text-ember tracking-widest">
            How long has your business been operating?
          </Label>
          <Select
            value={ans.operatingYears}
            onValueChange={(v) => onValidationChange("operatingYears", v)}
          >
            <SelectTrigger className="font-display h-11">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {OPERATING_YEARS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Question 4: Business Role */}
        <div className="space-y-2">
          <Label className="font-utility text-[10px] text-ember tracking-widest">
            What is your role with this business?
          </Label>
          <Select
            value={ans.businessRole}
            onValueChange={(v) => onValidationChange("businessRole", v)}
          >
            <SelectTrigger className="font-display h-11">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_ROLES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Contact Info ───────────────────────────────────────

function StepContact({
  formData,
  onFieldChange,
}: {
  formData: ClaimFormData;
  onFieldChange: (field: "contactName" | "contactEmail" | "contactPhone" | "password", value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">
          Step 3 of 4
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Your contact info.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          This will create your vendor account. Your email will be your login.
        </p>
      </div>

      <div className="space-y-5 max-w-lg">
        <div>
          <Label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
            Full Name
          </Label>
          <Input
            placeholder="Your full name"
            value={formData.contactName}
            onChange={(e) => onFieldChange("contactName", e.target.value)}
            className="font-display h-12"
          />
        </div>

        <div>
          <Label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
            Email Address
          </Label>
          <Input
            type="email"
            placeholder="you@business.com"
            value={formData.contactEmail}
            onChange={(e) => onFieldChange("contactEmail", e.target.value)}
            className="font-display h-12"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            This will be your login for the vendor portal.
          </p>
        </div>

        <div>
          <Label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
            Phone Number
          </Label>
          <Input
            type="tel"
            placeholder="(414) 555-0123"
            value={formData.contactPhone}
            onChange={(e) => onFieldChange("contactPhone", e.target.value)}
            className="font-display h-12"
          />
        </div>

        <div>
          <Label className="font-utility text-[10px] text-ember tracking-widest block mb-2">
            Create Password
          </Label>
          <Input
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => onFieldChange("password", e.target.value)}
            className="font-display h-12"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Minimum 6 characters. You&apos;ll use this to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review & Submit ────────────────────────────────────

function StepReview({
  formData,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  formData: ClaimFormData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const vendor = formData.selectedVendor;
  const ans = formData.validationAnswers;

  const roleLabel = BUSINESS_ROLES.find((r) => r.value === ans.businessRole)?.label || ans.businessRole;
  const yearsLabel = OPERATING_YEARS.find((o) => o.value === ans.operatingYears)?.label || ans.operatingYears;

  const canSubmit =
    formData.contactName.trim() !== "" &&
    formData.contactEmail.trim() !== "" &&
    formData.password.length >= 6;

  return (
    <div className="space-y-8">
      <div>
        <p className="font-utility text-[10px] text-ember tracking-widest">Review</p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
          Look it over.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
          Make sure everything checks out before submitting your claim.
        </p>
      </div>

      {/* Business */}
      <div className="space-y-3">
        <p className="font-utility text-[10px] text-ember tracking-widest">Business</p>
        <div className="rounded-md border border-border bg-card p-5 space-y-2">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Name</p>
            <p className="font-display font-bold text-sm">{vendor?.name}</p>
          </div>
          {vendor?.address && (
            <div>
              <p className="text-[10px] text-muted-foreground tracking-wider">Address</p>
              <p className="font-display text-sm">{vendor.address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Validation Answers */}
      <div className="space-y-3">
        <p className="font-utility text-[10px] text-ember tracking-widest">Verification Answers</p>
        <div className="rounded-md border border-border bg-card p-5 space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Business Phone Number</p>
            <p className="font-display text-sm">{ans.phoneNumberConfirm || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Neighborhood</p>
            <p className="font-display text-sm">{ans.neighborhood || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Operating Duration</p>
            <p className="font-display text-sm">{yearsLabel || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Your Role</p>
            <p className="font-display text-sm">{roleLabel || "-"}</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3">
        <p className="font-utility text-[10px] text-ember tracking-widest">Contact Info</p>
        <div className="rounded-md border border-border bg-card p-5 space-y-2">
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Name</p>
            <p className="font-display text-sm">{formData.contactName}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Email</p>
            <p className="font-display text-sm">{formData.contactEmail}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground tracking-wider">Phone</p>
            <p className="font-display text-sm">{formData.contactPhone || "-"}</p>
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="rounded-md border border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4 flex items-start gap-3">
        <Shield size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700 dark:text-amber-400">
          By submitting, you confirm that the information provided is accurate and you are authorized to claim this business on behalf of the owner.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onBack}
          className="font-utility inline-flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] transition-all hover:bg-ink hover:text-ink-foreground",
            (!canSubmit || isSubmitting) && "opacity-50 cursor-not-allowed hover:bg-ember hover:text-ember-foreground"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit Claim
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Success State ──────────────────────────────────────────────

function SuccessState({
  isAutoApproved,
  navigate,
}: {
  isAutoApproved: boolean;
  navigate: (path: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ember/10 mb-6">
        <Check size={40} className="text-ember" />
      </div>
      <p className="font-utility text-[10px] text-ember tracking-widest">
        {isAutoApproved ? "Claim Approved" : "Claim Under Review"}
      </p>
      <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-[1.02]">
        {isAutoApproved ? "You&apos;re verified." : "We&apos;re reviewing your claim."}
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed max-w-md">
        {isAutoApproved
          ? "Your claim has been auto-approved. You now have full access to manage your business profile."
          : "We verify claims within 24–48 hours. You'll receive an email when your claim is approved."}
      </p>

      <button
        onClick={() => navigate("/vendor-portal")}
        className="font-utility mt-10 inline-flex items-center gap-2 bg-ink text-ink-foreground px-7 py-4 text-[11px] transition-all hover:bg-ember hover:text-ember-foreground"
      >
        Go to Vendor Portal
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

// ─── Main Claim Profile Page ────────────────────────────────────

export function ClaimProfilePage({ navigate }: { navigate: (path: string) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ClaimFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAutoApproved, setIsAutoApproved] = useState(false);

  const selectVendor = (vendor: VendorListItem) => {
    setFormData((prev) => ({
      ...prev,
      selectedVendor: vendor,
      // Pre-fill phone from vendor data
      validationAnswers: {
        ...prev.validationAnswers,
        phoneNumberConfirm: vendor.phone || "",
      },
    }));
  };

  const updateValidation = (field: keyof ValidationAnswers, value: string) => {
    setFormData((prev) => ({
      ...prev,
      validationAnswers: { ...prev.validationAnswers, [field]: value },
    }));
  };

  const updateField = (field: "contactName" | "contactEmail" | "contactPhone" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.selectedVendor !== null;
      case 2:
        return (
          formData.validationAnswers.phoneNumberConfirm.trim() !== "" &&
          formData.validationAnswers.neighborhood !== "" &&
          formData.validationAnswers.operatingYears !== "" &&
          formData.validationAnswers.businessRole !== ""
        );
      case 3:
        return (
          formData.contactName.trim() !== "" &&
          formData.contactEmail.trim() !== "" &&
          formData.password.length >= 6
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < 4 && canGoNext()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        vendorId: formData.selectedVendor!.id,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        password: formData.password,
        validationAnswers: JSON.stringify(formData.validationAnswers),
        businessProof: `Role: ${formData.validationAnswers.businessRole}, Operating: ${formData.validationAnswers.operatingYears}`,
      };

      const res = await fetch("/api/claim-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit claim");
      }

      const result = await res.json();
      setIsAutoApproved(result.claimRequest?.status === "approved");
      setShowSuccess(true);
    } catch (error) {
      console.error("Claim submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteShell showAboveFooterVideo={false} showGlobalFooter={false} showDedicatedCTA={false} navigate={navigate}>
      {/* Hero */}
      <section className="bg-cream border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <p className="font-utility text-[11px] text-ember">Claim</p>
          <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.02] text-foreground max-w-4xl">
            Own your listing.{" "}
            <span className="italic font-normal text-teal">Take control.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Verify your business and unlock full access to your profile, reviews, and customer connections.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="bg-background">
        <div className="mx-auto max-w-[900px] px-6 md:px-10 py-12 md:py-16">
          {showSuccess ? (
            <SuccessState isAutoApproved={isAutoApproved} navigate={navigate} />
          ) : (
            <>
              {/* Step Indicator */}
              <div className="mb-12">
                <StepIndicator currentStep={currentStep} />
              </div>

              {/* Step Content with Transition */}
              <div className="relative min-h-[400px]">
                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 1 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 1 && (
                    <StepFindBusiness
                      formData={formData}
                      onSelectVendor={selectVendor}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 2 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 2 && (
                    <StepVerify
                      formData={formData}
                      onValidationChange={updateValidation}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 3 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 3 && (
                    <StepContact
                      formData={formData}
                      onFieldChange={updateField}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "transition-all duration-300",
                    currentStep === 4 ? "opacity-100 translate-x-0" : "absolute inset-0 opacity-0 translate-x-8 pointer-events-none"
                  )}
                >
                  {currentStep === 4 && (
                    <StepReview
                      formData={formData}
                      onBack={() => setCurrentStep(3)}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </div>
              </div>

              {/* Navigation Buttons (not shown on review step) */}
              {currentStep <= 3 && (
                <div className="flex items-center justify-between pt-8 mt-8 border-t border-border">
                  <button
                    onClick={goBack}
                    className={cn(
                      "font-utility inline-flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-4 py-3",
                      currentStep === 1 && "invisible"
                    )}
                  >
                    <ArrowLeft size={14} />
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!canGoNext()}
                    className={cn(
                      "font-utility inline-flex items-center gap-2 bg-ember text-ember-foreground px-7 py-4 text-[11px] transition-all hover:bg-ink hover:text-ink-foreground",
                      !canGoNext() && "opacity-50 cursor-not-allowed hover:bg-ember hover:text-ember-foreground"
                    )}
                  >
                    {currentStep === 3 ? "Review Claim" : "Next"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
