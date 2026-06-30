// Planviry Filter Schemas
// Source: Planviry FILTER SPECIFICATION.docx
//
// Structure:
//   universalFilters  - apply to ALL pages within an L1 category
//   dynamicFilters    - apply to specific L3 pages (key = "l1/l2/l3")
//   l4DynamicFilters  - apply to specific L4 sub-categories (key = "l1/l2/l3/l4")

export type FilterUiType =
  | "toggle"
  | "slider-dollar"
  | "slider-presets"
  | "slider-zip"
  | "slider-numeric"
  | "star-select"
  | "multi-select"
  | "dropdown"
  | "numeric"
  | "numeric-presets"
  | "date-picker"
  | "radius-zip"
  | "toggle-fee"
  | "toggle-amount";

export interface FilterDefinition {
  name: string;
  slug: string;
  uiType: FilterUiType;
  options: string[];
}

// ─── Universal Filters (apply to ALL pages within an L1) ───
export const universalFilters: Record<string, FilterDefinition[]> = {
  "beauty-attire": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $100)", "$$ ($100-$250)", "$$$ ($250-$500)", "$$$$ ($500-$1", "000)", "$$$$$ ($1", "000+)"]
    },
    {
      name: "Price Model",
      slug: "price-model",
      uiType: "dropdown",
      options: ["Per person", "Per service", "Package only", "Travel fee separate"]
    },
    {
      name: "Travel / Service Location",
      slug: "travel-service-location",
      uiType: "radius-zip",
      options: ["Studio only (client travels)", "Travel to client (onsite)", "Both"]
    },
    {
      name: "Travel Radius",
      slug: "travel-radius",
      uiType: "slider-zip",
      options: ["0 (studio only)", "10 miles", "25 miles", "50 miles", "100 miles"]
    },
    {
      name: "Travel Fee",
      slug: "travel-fee",
      uiType: "toggle-amount",
      options: ["Included", "$25-$75", "$76-$150", "$150+"]
    },
    {
      name: "Years of Experience",
      slug: "years-of-experience",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Number of Reviews",
      slug: "number-of-reviews",
      uiType: "slider-numeric",
      options: ["0-10", "11-25", "26-50", "51-100", "100+"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Licensed / Certified",
      slug: "licensed-certified",
      uiType: "toggle",
      options: ["State license", "National certification", "Specialized training"]
    },
    {
      name: "Insurance & Bonded",
      slug: "insurance-and-bonded",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Consultation Available",
      slug: "consultation-available",
      uiType: "toggle-fee",
      options: ["Free", "Paid ($)", "Applied to service"]
    },
    {
      name: "Deposit Required",
      slug: "deposit-required",
      uiType: "slider-numeric",
      options: ["0%", "25%", "50%", "100%"]
    },
    {
      name: "Cancellation Policy",
      slug: "cancellation-policy",
      uiType: "dropdown",
      options: ["Free (48h+)", "50% refund", "Non-refundable", "Deposit forfeit"]
    },
    {
      name: "Languages Spoken",
      slug: "languages-spoken",
      uiType: "multi-select",
      options: ["English", "Spanish", "French", "Polish", "Mandarin", "Hindi", "Tagalog", "Vietnamese"]
    }
  ],
  "catering-food": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "slider-numeric",
      options: ["$5-$25", "$26-$50", "$51-$75", "$76-$100", "$101-$150", "$150+"]
    },
    {
      name: "Minimum Order",
      slug: "minimum-order",
      uiType: "numeric-presets",
      options: ["$0 (no minimum)", "$250", "$500", "$1", "000", "$2", "500", "$5", "000+"]
    },
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "slider-zip",
      options: ["0 (pickup only)", "5 miles", "10 miles", "15 miles", "25 miles", "50 miles"]
    },
    {
      name: "Delivery Fee",
      slug: "delivery-fee",
      uiType: "toggle-amount",
      options: ["Included", "$25-$75", "$76-$150", "$151-$300", "$300+"]
    },
    {
      name: "Setup & Cleanup",
      slug: "setup-and-cleanup",
      uiType: "dropdown",
      options: ["No setup (drop-off)", "Basic setup", "Full setup", "Takedown included"]
    },
    {
      name: "Tasting Available",
      slug: "tasting-available",
      uiType: "toggle-fee",
      options: ["Free", "Paid ($)", "Applied to booking", "Not available"]
    },
    {
      name: "Dietary Accommodations",
      slug: "dietary-accommodations",
      uiType: "multi-select",
      options: ["Gluten-Free", "Dairy-Free", "Nut-Free", "Vegan", "Vegetarian", "Kosher", "Halal", "Low-Sodium", "Keto", "Paleo"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Years in Business",
      slug: "years-in-business",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Licensed & Insured",
      slug: "licensed-and-insured",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Staff Provided",
      slug: "staff-provided",
      uiType: "toggle",
      options: ["Yes (servers/ bartenders/ chefs included)"]
    },
    {
      name: "Equipment Included",
      slug: "equipment-included",
      uiType: "multi-select",
      options: ["Tables", "Chairs", "Linens", "China", "Glassware", "Flatware", "Chafing Dishes"]
    }
  ],
  "decor-rentals": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $500)", "$$ ($500-$1", "500)", "$$$ ($1", "500-$3", "500)", "$$$$ ($3", "500-$7", "000)", "$$$$$ ($7", "000+)"]
    },
    {
      name: "Price Model",
      slug: "price-model",
      uiType: "dropdown",
      options: ["Per item", "Per hour", "Per day", "Per event", "Package only"]
    },
    {
      name: "Rental Duration",
      slug: "rental-duration",
      uiType: "dropdown",
      options: ["4 hours (half day)", "8 hours (full day)", "24 hours (overnight)", "48 hours (weekend)", "1 week"]
    },
    {
      name: "Delivery Available",
      slug: "delivery-available",
      uiType: "toggle-fee",
      options: ["Free delivery (within X miles)", "Fee ($25-$150)", "Pickup only"]
    },
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "slider-zip",
      options: ["0 (pickup only)", "10 miles", "20 miles", "30 miles", "50 miles"]
    },
    {
      name: "Setup & Installation",
      slug: "setup-and-installation",
      uiType: "dropdown",
      options: ["No setup (client handles)", "Basic setup (drop-off)", "Full setup (professional install)", "Takedown included"]
    },
    {
      name: "Setup Fee",
      slug: "setup-fee",
      uiType: "toggle-amount",
      options: ["Included", "Flat fee ($50-$500)", "Percentage of rental (15-25%)"]
    },
    {
      name: "Damage / Security Deposit",
      slug: "damage-security-deposit",
      uiType: "toggle-amount",
      options: ["$0", "$50-$200", "$201-$500", "$501-$1", "000", "$1", "000+"]
    },
    {
      name: "Damage Waiver Available",
      slug: "damage-waiver-available",
      uiType: "toggle-fee",
      options: ["$5-$25 (covers accidental damage)"]
    },
    {
      name: "Cleaning Fee",
      slug: "cleaning-fee",
      uiType: "toggle-amount",
      options: ["Included", "Extra fee ($25-$200)"]
    },
    {
      name: "Cancellation Policy",
      slug: "cancellation-policy",
      uiType: "dropdown",
      options: ["Free (30+ days)", "50% refund (14-29 days)", "25% refund (7-13 days)", "Non-refundable (<7 days)"]
    },
    {
      name: "Lead Time Required",
      slug: "lead-time-required",
      uiType: "dropdown",
      options: ["Same day (if available)", "48 hours", "1 week", "2 weeks", "1 month"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Years in Business",
      slug: "years-in-business",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Licensed & Insured",
      slug: "licensed-and-insured",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Eco-Friendly / Sustainable",
      slug: "eco-friendly-sustainable",
      uiType: "toggle",
      options: ["Yes (compostable/reusable/locally sourced)"]
    }
  ],
  "entertainment": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $500)", "$$ ($500-$1", "500)", "$$$ ($1", "500-$3", "000)", "$$$$ ($3", "000-$6", "000)", "$$$$$ ($6", "000+)"]
    },
    {
      name: "Price Model",
      slug: "price-model",
      uiType: "dropdown",
      options: ["Hourly rate", "Flat fee (event)", "Package only", "Per person"]
    },
    {
      name: "Performance Duration",
      slug: "performance-duration",
      uiType: "slider-presets",
      options: ["1 hour", "2 hours", "3 hours", "4 hours", "5+ hours"]
    },
    {
      name: "Travel Radius",
      slug: "travel-radius",
      uiType: "slider-zip",
      options: ["Local only", "25 miles", "50 miles", "100 miles", "Nationwide"]
    },
    {
      name: "Travel Fee",
      slug: "travel-fee",
      uiType: "toggle-amount",
      options: ["Included", "$50-$150", "$151-$300", "$300+"]
    },
    {
      name: "Years of Experience",
      slug: "years-of-experience",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Insurance & Bonded",
      slug: "insurance-and-bonded",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Sound System Included",
      slug: "sound-system-included",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Setup Time Required",
      slug: "setup-time-required",
      uiType: "dropdown",
      options: ["15 min", "30 min", "1 hour", "2+ hours"]
    },
    {
      name: "Response Time",
      slug: "response-time",
      uiType: "dropdown",
      options: ["<1 hour", "<4 hours", "<24 hours", ">24 hours"]
    }
  ],
  "event-planning-services": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $1k)", "$$ ($1k-$3k)", "$$$ ($3k-$7k)", "$$$$ ($7k-$15k)", "$$$$$ ($15k+)"]
    },
    {
      name: "Years of Experience",
      slug: "years-of-experience",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Travel Radius",
      slug: "travel-radius",
      uiType: "slider-zip",
      options: ["Local only", "25 miles", "50 miles", "100 miles", "Nationwide"]
    },
    {
      name: "Languages Spoken",
      slug: "languages-spoken",
      uiType: "multi-select",
      options: ["English", "Spanish", "French", "German", "Polish", "Mandarin", "Hindi", "Tagalog", "Vietnamese", "Arabic", "Russian", "Italian", "Portuguese"]
    },
    {
      name: "LGBTQ+ Friendly",
      slug: "lgbtqplus-friendly",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Virtual Consultations",
      slug: "virtual-consultations",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Free Consultation",
      slug: "free-consultation",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Insurance & Bonded",
      slug: "insurance-and-bonded",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Response Time",
      slug: "response-time",
      uiType: "dropdown",
      options: ["<1 hour", "<4 hours", "<24 hours", ">24 hours"]
    }
  ],
  "production-tech": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $500)", "$$ ($500-$1", "500)", "$$$ ($1", "500-$3", "500)", "$$$$ ($3", "500-$7", "000)", "$$$$$ ($7", "000+)"]
    },
    {
      name: "Price Model",
      slug: "price-model",
      uiType: "dropdown",
      options: ["Hourly rate", "Flat fee (event)", "Package only", "Per image/video", "Per hour"]
    },
    {
      name: "Coverage Hours",
      slug: "coverage-hours",
      uiType: "slider-presets",
      options: ["1-2 hours", "3-4 hours", "5-6 hours", "7-8 hours", "8-10 hours", "10+ hours"]
    },
    {
      name: "Travel Radius",
      slug: "travel-radius",
      uiType: "slider-zip",
      options: ["Local only", "25 miles", "50 miles", "100 miles", "Nationwide"]
    },
    {
      name: "Travel Fee",
      slug: "travel-fee",
      uiType: "toggle-amount",
      options: ["Included", "$50-$150", "$151-$300", "$300+"]
    },
    {
      name: "Years of Experience",
      slug: "years-of-experience",
      uiType: "slider-presets",
      options: ["0-2", "3-5", "6-10", "11-20", "20+"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Number of Reviews",
      slug: "number-of-reviews",
      uiType: "slider-numeric",
      options: ["0-10", "11-25", "26-50", "51-100", "100+"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Insurance & Bonded",
      slug: "insurance-and-bonded",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Backup Equipment",
      slug: "backup-equipment",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Delivery Time (Edited Photos/Video)",
      slug: "delivery-time",
      uiType: "dropdown",
      options: ["Same-day preview", "1 week", "2 weeks", "1 month", "2+ months"]
    },
    {
      name: "Number of Edited Deliverables",
      slug: "number-of-edited-deliverables",
      uiType: "slider-numeric",
      options: ["50-100", "101-250", "251-500", "501-750", "750+"]
    },
    {
      name: "Print Rights / Release",
      slug: "print-rights-release",
      uiType: "toggle",
      options: ["Yes (client can print)", "No"]
    },
    {
      name: "RAW Files Available",
      slug: "raw-files-available",
      uiType: "toggle",
      options: ["Yes (included/extra fee)", "No"]
    }
  ],
  "travel-lodging": [
    {
      name: "Price Per Night",
      slug: "price-per-night",
      uiType: "slider-dollar",
      options: ["$ (under $100)", "$$ ($100-$200)", "$$$ ($200-$350)", "$$$$ ($350-$600)", "$$$$$ ($600+)"]
    },
    {
      name: "Guest Rating",
      slug: "guest-rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Star Rating",
      slug: "star-rating",
      uiType: "star-select",
      options: ["1-star", "2-star", "3-star", "4-star", "5-star"]
    },
    {
      name: "Number of Guests",
      slug: "number-of-guests",
      uiType: "numeric",
      options: ["1", "2", "3", "4", "5", "6+"]
    },
    {
      name: "Number of Rooms",
      slug: "number-of-rooms",
      uiType: "numeric",
      options: ["1", "2", "3", "4", "5", "6-10", "11-20", "20+"]
    },
    {
      name: "Number of Nights",
      slug: "number-of-nights",
      uiType: "numeric",
      options: ["1", "2", "3", "4", "5", "6", "7", "7+"]
    },
    {
      name: "Check-in Date",
      slug: "check-in-date",
      uiType: "date-picker",
      options: ["Specific date"]
    },
    {
      name: "Check-out Date",
      slug: "check-out-date",
      uiType: "date-picker",
      options: ["Based on nights selected"]
    },
    {
      name: "Location / Proximity",
      slug: "location-proximity",
      uiType: "radius-zip",
      options: ["Near venue", "Near airport", "Near downtown", "Near attractions"]
    },
    {
      name: "Distance to Venue",
      slug: "distance-to-venue",
      uiType: "slider-zip",
      options: ["<1 mile", "1-3", "4-6", "7-10", "11-15", "15+"]
    },
    {
      name: "Cancellation Policy",
      slug: "cancellation-policy",
      uiType: "dropdown",
      options: ["Free (24h)", "Free (48h)", "Free (7 days)", "Non-refundable", "Varies by rate"]
    },
    {
      name: "Deposit Required",
      slug: "deposit-required",
      uiType: "dropdown",
      options: ["No deposit", "First night", "50%", "Full stay"]
    },
    {
      name: "Payment at Property",
      slug: "payment-at-property",
      uiType: "toggle",
      options: ["Yes (pay at hotel)", "No (prepaid online)"]
    },
    {
      name: "Pet Policy",
      slug: "pet-policy",
      uiType: "dropdown",
      options: ["Pets allowed (fee)", "Service animals only", "No pets"]
    },
    {
      name: "Smoking Policy",
      slug: "smoking-policy",
      uiType: "dropdown",
      options: ["Non-smoking (all rooms)", "Smoking rooms available", "Property-wide ban"]
    },
    {
      name: "Accessibility",
      slug: "accessibility",
      uiType: "multi-select",
      options: ["Wheelchair accessible rooms", "Roll-in shower", "Grab bars", "Visual alarms", "Hearing-impaired kits", "Service animal welcome"]
    },
    {
      name: "Family Friendly",
      slug: "family-friendly",
      uiType: "toggle",
      options: ["Yes (kids stay free under X", "kids club", "babysitting available)"]
    },
    {
      name: "Check-in Time",
      slug: "check-in-time",
      uiType: "dropdown",
      options: ["Standard (3pm/4pm)", "Early check-in available (fee)", "24-hour front desk"]
    },
    {
      name: "Check-out Time",
      slug: "check-out-time",
      uiType: "dropdown",
      options: ["Standard (11am/12pm)", "Late check-out available (fee)"]
    },
    {
      name: "Languages Spoken",
      slug: "languages-spoken",
      uiType: "multi-select",
      options: ["English", "Spanish", "French", "German", "Polish", "Mandarin", "Hindi"]
    },
    {
      name: "Loyalty Program Eligible",
      slug: "loyalty-program-eligible",
      uiType: "toggle",
      options: ["Yes (Marriott Bonvoy", "Hilton Honors", "IHG Rewards", "etc.)"]
    }
  ],
  "venues-spaces": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "slider-dollar",
      options: ["$ (under $1k)", "$$ ($1k-$3k)", "$$$ ($3k-$7k)", "$$$$ ($7k-$15k)", "$$$$$ ($15k+)"]
    },
    {
      name: "Guest Capacity",
      slug: "guest-capacity",
      uiType: "slider-presets",
      options: ["0-50", "51-100", "101-150", "151-200", "201-300", "301-500", "500+"]
    },
    {
      name: "Neighborhood",
      slug: "neighborhood",
      uiType: "multi-select",
      options: ["Bay View", "Walker's Point", "Historic Third Ward", "Downtown", "East Side", "Riverwest", "Deer District", "Wauwatosa", "South Side", "Brookfield", "Waukesha", "West Allis", "Greenfield", "Oak Creek", "Franklin", "Greendale", "Cudahy", "St. Francis", "Shorewood", "Whitefish Bay", "Glendale", "Brown Deer", "Menomonee Falls", "Germantown", "Mequon", "Cedarburg", "Grafton", "Port Washington", "West Bend", "Hartford", "Oconomowoc", "Delafield", "Pewaukee", "Muskego", "New Berlin", "Elm Grove"]
    },
    {
      name: "Distance",
      slug: "distance",
      uiType: "radius-zip",
      options: ["1 mile", "5 miles", "10 miles", "15 miles", "25 miles", "50 miles"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "date-picker",
      options: ["Check venue calendar for specific event date"]
    },
    {
      name: "Rating",
      slug: "rating",
      uiType: "star-select",
      options: ["3.0+", "3.5+", "4.0+", "4.5+", "5.0"]
    },
    {
      name: "Verified Only",
      slug: "verified-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Featured Only",
      slug: "featured-only",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "On-Site Parking",
      slug: "on-site-parking",
      uiType: "multi-select",
      options: ["Free lot", "Paid lot", "Street parking", "Valet", "Garage", "None"]
    },
    {
      name: "Wheelchair Accessible",
      slug: "wheelchair-accessible",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Outdoor Space",
      slug: "outdoor-space",
      uiType: "toggle",
      options: ["Yes (patio/garden/rooftop)"]
    },
    {
      name: "Pet Friendly",
      slug: "pet-friendly",
      uiType: "toggle",
      options: ["Yes / No"]
    },
    {
      name: "Kid Friendly",
      slug: "kid-friendly",
      uiType: "toggle",
      options: ["Yes / No"]
    }
  ]
};

// ─── Dynamic L3 Filters (apply to specific L3 category pages) ───
// Key format: "l1-slug/l2-slug/l3-slug"
export const dynamicFilters: Record<string, FilterDefinition[]> = {
  "beauty-attire/tailors-alterations/everyday-clothing-alterations": [
    {
      name: "Jeans Hemming",
      slug: "jeans-hemming",
      uiType: "toggle",
      options: []
    },
    {
      name: "Waist Adjustment",
      slug: "waist-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Taper",
      slug: "taper",
      uiType: "toggle",
      options: []
    },
    {
      name: "Patch Repair",
      slug: "patch-repair",
      uiType: "toggle",
      options: []
    },
    {
      name: "Turnaround",
      slug: "turnaround",
      uiType: "multi-select",
      options: ["2-5 days"]
    }
  ],
  "beauty-attire/tailors-alterations/formal-gown-alterations": [
    {
      name: "Hemming",
      slug: "hemming",
      uiType: "toggle",
      options: []
    },
    {
      name: "Taking In/Out",
      slug: "taking-in-out",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bust Adjustment",
      slug: "bust-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pageant-Specific",
      slug: "pageant-specific",
      uiType: "multi-select",
      options: ["walk slit/parade fit"]
    }
  ],
  "beauty-attire/tailors-alterations/leather-and-suede-alterations": [
    {
      name: "Leather Type",
      slug: "leather-type",
      uiType: "multi-select",
      options: ["cowhide/lamb/nubuck"]
    },
    {
      name: "Special Machine Required",
      slug: "special-machine-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seam Re-taping",
      slug: "seam-re-taping",
      uiType: "toggle",
      options: []
    },
    {
      name: "Expert Rating",
      slug: "expert-rating",
      uiType: "multi-select",
      options: ["years experience"]
    }
  ],
  "beauty-attire/tailors-alterations/on-site-fittings": [
    {
      name: "Travel Radius",
      slug: "travel-radius",
      uiType: "multi-select",
      options: ["10/25/50 miles"]
    },
    {
      name: "Minimum Party Size",
      slug: "minimum-party-size",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Travel Fee",
      slug: "travel-fee",
      uiType: "multi-select",
      options: ["included/extra"]
    },
    {
      name: "Fitting Duration",
      slug: "fitting-duration",
      uiType: "multi-select",
      options: ["minutes per person"]
    }
  ],
  "beauty-attire/tailors-alterations/prom-dress-alterations": [
    {
      name: "Hemming",
      slug: "hemming",
      uiType: "toggle",
      options: []
    },
    {
      name: "Taking In",
      slug: "taking-in",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bust Adjustment",
      slug: "bust-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rush Available",
      slug: "rush-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Turnaround Time",
      slug: "turnaround-time",
      uiType: "multi-select",
      options: ["1/2/3 weeks"]
    }
  ],
  "beauty-attire/tailors-alterations/quinceaera-dress-alterations": [
    {
      name: "Multiple Layers",
      slug: "multiple-layers",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Hoop Skirt Adjustment",
      slug: "hoop-skirt-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bustle Added",
      slug: "bustle-added",
      uiType: "toggle",
      options: []
    },
    {
      name: "Court Dresses",
      slug: "court-dresses",
      uiType: "multi-select",
      options: ["group discount"]
    }
  ],
  "beauty-attire/tailors-alterations/rush-alterations": [
    {
      name: "Rush Window",
      slug: "rush-window",
      uiType: "multi-select",
      options: ["24h/48h/72h/1 week"]
    },
    {
      name: "Rush Fee Percentage",
      slug: "rush-fee-percentage",
      uiType: "multi-select",
      options: ["25%/50%/100%"]
    },
    {
      name: "Pickup/Delivery",
      slug: "pickup-delivery",
      uiType: "multi-select",
      options: ["in-person/shipped"]
    },
    {
      name: "Success Guarantee",
      slug: "success-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/virtual-fitting-consultations": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["Zoom/FaceTime/WhatsApp"]
    },
    {
      name: "Measurement Guide Provided",
      slug: "measurement-guide-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Garment Return Policy",
      slug: "garment-return-policy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Final Fit Guarantee",
      slug: "final-fit-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/bridal-party-wardrobe-stylists": [
    {
      name: "Group Size",
      slug: "group-size",
      uiType: "multi-select",
      options: ["2-4/5-8/9-12/12+"]
    },
    {
      name: "Color Palette Selection",
      slug: "color-palette-selection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Body Type Diversity",
      slug: "body-type-diversity",
      uiType: "toggle",
      options: []
    },
    {
      name: "Budget Per Person",
      slug: "budget-per-person",
      uiType: "numeric",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/bridal-wardrobe-stylists": [
    {
      name: "Wedding Dress Consultation",
      slug: "wedding-dress-consultation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Accessory Sourcing",
      slug: "accessory-sourcing",
      uiType: "multi-select",
      options: ["veil/jewelry/shoes"]
    },
    {
      name: "Multiple Looks",
      slug: "multiple-looks",
      uiType: "multi-select",
      options: ["ceremony/reception/after-party"]
    },
    {
      name: "Gown Transportation",
      slug: "gown-transportation",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/corporate-wardrobe-stylists": [
    {
      name: "Industry Type",
      slug: "industry-type",
      uiType: "multi-select",
      options: ["corporate/creative/tech/legal"]
    },
    {
      name: "Budget",
      slug: "budget",
      uiType: "numeric",
      options: []
    },
    {
      name: "Headshot Styling",
      slug: "headshot-styling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Capsule Wardrobe",
      slug: "capsule-wardrobe",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/event-wardrobe-stylists": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["wedding/gala/prom/photoshoot/date night"]
    },
    {
      name: "Outfit Count",
      slug: "outfit-count",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Accessories Included",
      slug: "accessories-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hair/Makeup Coordination",
      slug: "hair-makeup-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/groom-and-groomsmen-wardrobe-stylists": [
    {
      name: "Group Size",
      slug: "group-size",
      uiType: "multi-select",
      options: ["1/2-4/5-8/9-12"]
    },
    {
      name: "Rental vs Purchase",
      slug: "rental-vs-purchase",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Color Coordination",
      slug: "color-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fitting Coordination",
      slug: "fitting-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/personal-wardrobe-stylists": [
    {
      name: "Session Length",
      slug: "session-length",
      uiType: "multi-select",
      options: ["2/3/4 hours"]
    },
    {
      name: "Closet Audit",
      slug: "closet-audit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shopping Service",
      slug: "shopping-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Budget Management",
      slug: "budget-management",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/photoshoot-wardrobe-stylists": [
    {
      name: "Shoot Type",
      slug: "shoot-type",
      uiType: "multi-select",
      options: ["engagement/family/branding/editorial"]
    },
    {
      name: "Outfit Changes",
      slug: "outfit-changes",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Prop Coordination",
      slug: "prop-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "On-Site Styling",
      slug: "on-site-styling",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/prom-wardrobe-stylists": [
    {
      name: "Dress/Suit Consultation",
      slug: "dress-suit-consultation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Accessory Sourcing",
      slug: "accessory-sourcing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Group Coordination",
      slug: "group-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Alteration Coordination",
      slug: "alteration-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/quinceaera-wardrobe-stylists": [
    {
      name: "Court Size",
      slug: "court-size",
      uiType: "multi-select",
      options: ["5/7/9/11/13+"]
    },
    {
      name: "Gown Selection",
      slug: "gown-selection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Court Dress Coordination",
      slug: "court-dress-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/rental-wardrobe-services": [
    {
      name: "Rental Duration",
      slug: "rental-duration",
      uiType: "multi-select",
      options: ["3/5/7 days"]
    },
    {
      name: "Shipping Included",
      slug: "shipping-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Try-On Period",
      slug: "try-on-period",
      uiType: "toggle",
      options: []
    },
    {
      name: "Damage Protection",
      slug: "damage-protection",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/sustainable-wardrobe-stylists": [
    {
      name: "Sustainability Focus",
      slug: "sustainability-focus",
      uiType: "multi-select",
      options: ["second-hand/rental/upcycled/all"]
    },
    {
      name: "Carbon Footprint Reduction",
      slug: "carbon-footprint-reduction",
      uiType: "toggle",
      options: []
    },
    {
      name: "Local Sourcing",
      slug: "local-sourcing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Budget Friendly",
      slug: "budget-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/wardrobe-stylists/sweet-16-wardrobe-stylists": [
    {
      name: "Outfit Count",
      slug: "outfit-count",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Party Dress",
      slug: "party-dress",
      uiType: "toggle",
      options: []
    },
    {
      name: "Accessories",
      slug: "accessories",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shoes",
      slug: "shoes",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/cake-delivery-and-setup-only": [
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "multi-select",
      options: ["miles"]
    },
    {
      name: "Setup Included",
      slug: "setup-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Display Table Included",
      slug: "display-table-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Stand Rental",
      slug: "cake-stand-rental",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/cake-pops": [
    {
      name: "Flavor Options",
      slug: "flavor-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Decor Options",
      slug: "decor-options",
      uiType: "multi-select",
      options: ["sprinkles/drizzle/character"]
    },
    {
      name: "Stick Color",
      slug: "stick-color",
      uiType: "multi-select",
      options: ["white/black/custom"]
    },
    {
      name: "Display Stand Included",
      slug: "display-stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/chocolate-fountains": [
    {
      name: "Fountain Size",
      slug: "fountain-size",
      uiType: "multi-select",
      options: ["12\"/18\"/24\"/30\"/36\""]
    },
    {
      name: "Chocolate Type",
      slug: "chocolate-type",
      uiType: "multi-select",
      options: ["milk/dark/white/caramel"]
    },
    {
      name: "Dipping Items Included",
      slug: "dipping-items-included",
      uiType: "multi-select",
      options: ["yes/no count"]
    },
    {
      name: "Attendant Included",
      slug: "attendant-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/cookies": [
    {
      name: "Design Complexity",
      slug: "design-complexity",
      uiType: "multi-select",
      options: ["simple/moderate/intricate"]
    },
    {
      name: "Icing Type",
      slug: "icing-type",
      uiType: "multi-select",
      options: ["royal/buttercream/fondant"]
    },
    {
      name: "Minimum Order",
      slug: "minimum-order",
      uiType: "multi-select",
      options: ["dozen: 1/2/3/6+"]
    },
    {
      name: "Gift Boxes Included",
      slug: "gift-boxes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/cupcakes": [
    {
      name: "Flavor Count",
      slug: "flavor-count",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Mini vs Regular",
      slug: "mini-vs-regular",
      uiType: "multi-select",
      options: ["both/regular only/mini only"]
    },
    {
      name: "Custom Toppers",
      slug: "custom-toppers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Display Stand Included",
      slug: "display-stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/dessert-tables-and-candy-buffets": [
    {
      name: "Candy Types",
      slug: "candy-types",
      uiType: "multi-select",
      options: ["10/15/20/30+"]
    },
    {
      name: "Display Rentals",
      slug: "display-rentals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Take-Home Bags Included",
      slug: "take-home-bags-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Theme Matching",
      slug: "theme-matching",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/donuts": [
    {
      name: "Donut Wall Rental",
      slug: "donut-wall-rental",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Sprinkles",
      slug: "custom-sprinkles",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fillings",
      slug: "fillings",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Gluten-Free Option",
      slug: "gluten-free-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/macarons": [
    {
      name: "Color Match",
      slug: "color-match",
      uiType: "multi-select",
      options: ["Pantone/RGB/HEX"]
    },
    {
      name: "Flavor Options",
      slug: "flavor-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Gift Boxes Included",
      slug: "gift-boxes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Minimum Order",
      slug: "minimum-order",
      uiType: "multi-select",
      options: ["dozen"]
    }
  ],
  "catering-food/bakeries-desserts/pastries": [
    {
      name: "Pastry Types",
      slug: "pastry-types",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Fillings",
      slug: "fillings",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Bulk Pricing",
      slug: "bulk-pricing",
      uiType: "multi-select",
      options: ["dozen"]
    },
    {
      name: "Breakfast Catering Available",
      slug: "breakfast-catering-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/pies": [
    {
      name: "Crust Type",
      slug: "crust-type",
      uiType: "multi-select",
      options: ["traditional/graham/gluten-free/vegan"]
    },
    {
      name: "Flavor Options",
      slug: "flavor-options",
      uiType: "multi-select",
      options: ["apple/cherry/pumpkin/pecan/berry"]
    },
    {
      name: "Lattice Top",
      slug: "lattice-top",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mini Pies Available",
      slug: "mini-pies-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/beer-and-wine-bartenders": [
    {
      name: "Tap Handles",
      slug: "tap-handles",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Wine by Glass Options",
      slug: "wine-by-glass-options",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Bottle Service",
      slug: "bottle-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Corkage Fee",
      slug: "corkage-fee",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/byob-bartenders": [
    {
      name: "Alcohol Handling",
      slug: "alcohol-handling",
      uiType: "multi-select",
      options: ["serve only/inventory management/restocking"]
    },
    {
      name: "Ice Provided",
      slug: "ice-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mixers Provided",
      slug: "mixers-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Glassware Provided",
      slug: "glassware-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/cash-bartenders": [
    {
      name: "Pricing Display",
      slug: "pricing-display",
      uiType: "toggle",
      options: []
    },
    {
      name: "Change Provided",
      slug: "change-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "POS System",
      slug: "pos-system",
      uiType: "multi-select",
      options: ["square/cash only"]
    },
    {
      name: "Tip Jar",
      slug: "tip-jar",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/cocktail-bartenders": [
    {
      name: "Signature Cocktail Count",
      slug: "signature-cocktail-count",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "House Infusions",
      slug: "house-infusions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Garnish Quality",
      slug: "garnish-quality",
      uiType: "multi-select",
      options: ["basic/elaborate"]
    },
    {
      name: "Special Glassware",
      slug: "special-glassware",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/corporate-event-bartenders": [
    {
      name: "Bar Style",
      slug: "bar-style",
      uiType: "multi-select",
      options: ["open/cash/ticket"]
    },
    {
      name: "Speed of Service",
      slug: "speed-of-service",
      uiType: "multi-select",
      options: ["fast/standard"]
    },
    {
      name: "Uniform Attire",
      slug: "uniform-attire",
      uiType: "multi-select",
      options: ["casual/formal/branded"]
    },
    {
      name: "POS System",
      slug: "pos-system",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/flair-bartenders": [
    {
      name: "Bottle Flips",
      slug: "bottle-flips",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fire Tricks",
      slug: "fire-tricks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Insurance Required",
      slug: "insurance-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Performance Duration",
      slug: "performance-duration",
      uiType: "multi-select",
      options: ["30/60/90 minutes"]
    }
  ],
  "catering-food/bartending/mobile-bars": [
    {
      name: "Bar Size",
      slug: "bar-size",
      uiType: "multi-select",
      options: ["4ft/6ft/8ft/10ft"]
    },
    {
      name: "Backlit Bar",
      slug: "backlit-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ice Included",
      slug: "ice-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Glassware Included",
      slug: "glassware-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/mocktail-bartenders": [
    {
      name: "Mocktail Menu",
      slug: "mocktail-menu",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Syrup Options",
      slug: "syrup-options",
      uiType: "multi-select",
      options: ["house-made/premium/basic"]
    },
    {
      name: "Fresh Juices",
      slug: "fresh-juices",
      uiType: "toggle",
      options: []
    },
    {
      name: "Garnish Quality",
      slug: "garnish-quality",
      uiType: "multi-select",
      options: ["basic/elaborate"]
    }
  ],
  "catering-food/bartending/open-bar-bartenders": [
    {
      name: "Unlimited Service",
      slug: "unlimited-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Premium Brands",
      slug: "premium-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shot Service",
      slug: "shot-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Last Call Management",
      slug: "last-call-management",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/party-bartenders": [
    {
      name: "Bar Style",
      slug: "bar-style",
      uiType: "multi-select",
      options: ["open/cash/BYOB"]
    },
    {
      name: "Party Games Integration",
      slug: "party-games-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Cocktails",
      slug: "themed-cocktails",
      uiType: "toggle",
      options: []
    },
    {
      name: "Self-Serve Options",
      slug: "self-serve-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/specialty-cocktail-bartenders": [
    {
      name: "Custom Menu Design",
      slug: "custom-menu-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Named Cocktails",
      slug: "named-cocktails",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Drinks",
      slug: "themed-drinks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dehydrated Garnishes",
      slug: "dehydrated-garnishes",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/tasting-event-bartenders": [
    {
      name: "Tasting Pours",
      slug: "tasting-pours",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Education Included",
      slug: "education-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Glassware Rentals",
      slug: "glassware-rentals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spittoons Provided",
      slug: "spittoons-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bartending/wedding-bartenders": [
    {
      name: "Bar Style",
      slug: "bar-style",
      uiType: "multi-select",
      options: ["open/cash/ticket"]
    },
    {
      name: "Signature Cocktails",
      slug: "signature-cocktails",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Champagne Toast Service",
      slug: "champagne-toast-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night Coffee Service",
      slug: "late-night-coffee-service",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/aperol-spritz-brunch-bars": [
    {
      name: "Prosecco Type",
      slug: "prosecco-type",
      uiType: "multi-select",
      options: ["brut/extra dry"]
    },
    {
      name: "Soda Water",
      slug: "soda-water",
      uiType: "toggle",
      options: []
    },
    {
      name: "Orange Slice Garnish",
      slug: "orange-slice-garnish",
      uiType: "toggle",
      options: []
    },
    {
      name: "Batch Preparation",
      slug: "batch-preparation",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/bellini-bars": [
    {
      name: "Puree Options",
      slug: "puree-options",
      uiType: "multi-select",
      options: ["peach/strawberry/mango/raspberry"]
    },
    {
      name: "Prosecco Type",
      slug: "prosecco-type",
      uiType: "multi-select",
      options: ["brut/extra dry/dry"]
    },
    {
      name: "Fruit Garnishes",
      slug: "fruit-garnishes",
      uiType: "multi-select",
      options: ["fresh/frozen"]
    },
    {
      name: "Non-Alcoholic Option",
      slug: "non-alcoholic-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/bloody-mary-bars": [
    {
      name: "Vodka Options",
      slug: "vodka-options",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Mix Options",
      slug: "mix-options",
      uiType: "multi-select",
      options: ["spicy/mild/classic"]
    },
    {
      name: "Toppings",
      slug: "toppings",
      uiType: "multi-select",
      options: ["10/15/20+"]
    },
    {
      name: "Garnishes",
      slug: "garnishes",
      uiType: "multi-select",
      options: ["celery/olives/bacon/shrimp/pickles"]
    }
  ],
  "catering-food/bottomless-brunch/drag-brunch": [
    {
      name: "Drag Performers",
      slug: "drag-performers",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Performance Duration",
      slug: "performance-duration",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Ticket Price",
      slug: "ticket-price",
      uiType: "numeric",
      options: []
    },
    {
      name: "Reservations Required",
      slug: "reservations-required",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/family-friendly-brunch": [
    {
      name: "Kids Menu",
      slug: "kids-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "High Chairs",
      slug: "high-chairs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Activity Sheets",
      slug: "activity-sheets",
      uiType: "toggle",
      options: []
    },
    {
      name: "Juice Bar",
      slug: "juice-bar",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/jazz-brunch": [
    {
      name: "Jazz Trio/Quartet/Band",
      slug: "jazz-trio-quartet-band",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Performance Duration",
      slug: "performance-duration",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Brunch Buffet",
      slug: "brunch-buffet",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cover Charge",
      slug: "cover-charge",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/margarita-brunch-bars": [
    {
      name: "Tequila Options",
      slug: "tequila-options",
      uiType: "multi-select",
      options: ["blanco/reposado/anejo"]
    },
    {
      name: "Mix Options",
      slug: "mix-options",
      uiType: "multi-select",
      options: ["lime/mango/strawberry/spicy"]
    },
    {
      name: "Salt Rim",
      slug: "salt-rim",
      uiType: "toggle",
      options: []
    },
    {
      name: "Frozen Option",
      slug: "frozen-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/mimosa-bars": [
    {
      name: "Juice Options",
      slug: "juice-options",
      uiType: "multi-select",
      options: ["orange/grapefruit/pineapple/cranberry/mango"]
    },
    {
      name: "Champagne Type",
      slug: "champagne-type",
      uiType: "multi-select",
      options: ["sparkling/prosecco/cava"]
    },
    {
      name: "Fruit Garnishes",
      slug: "fruit-garnishes",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Time Limit",
      slug: "time-limit",
      uiType: "multi-select",
      options: ["90min/2hr/unlimited"]
    }
  ],
  "catering-food/bottomless-brunch/mocktail-brunch-bars": [
    {
      name: "Mocktail Menu",
      slug: "mocktail-menu",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Fresh Juices",
      slug: "fresh-juices",
      uiType: "toggle",
      options: []
    },
    {
      name: "Herbal Infusions",
      slug: "herbal-infusions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Zero-Proof Spirits",
      slug: "zero-proof-spirits",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bottomless-brunch/rooftop-brunch": [
    {
      name: "Rooftop View",
      slug: "rooftop-view",
      uiType: "multi-select",
      options: ["city/lake/river"]
    },
    {
      name: "Heated Rooftop",
      slug: "heated-rooftop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Covered Area",
      slug: "covered-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bottomless Duration",
      slug: "bottomless-duration",
      uiType: "multi-select",
      options: ["90min/2hr/unlimited"]
    }
  ],
  "catering-food/food-trucks/asian-fusion-food-trucks": [
    {
      name: "Base Options",
      slug: "base-options",
      uiType: "multi-select",
      options: ["rice/noodles/lettuce wrap"]
    },
    {
      name: "Protein Options",
      slug: "protein-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Sauce Options",
      slug: "sauce-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Kimchi Side",
      slug: "kimchi-side",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/bbq-food-trucks": [
    {
      name: "Meat Options",
      slug: "meat-options",
      uiType: "multi-select",
      options: ["brisket/pulled pork/ribs/chicken/sausage"]
    },
    {
      name: "Sauce Varieties",
      slug: "sauce-varieties",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Sides",
      slug: "sides",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Cornbread Included",
      slug: "cornbread-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/breakfast-food-trucks": [
    {
      name: "Breakfast Sandwich",
      slug: "breakfast-sandwich",
      uiType: "toggle",
      options: []
    },
    {
      name: "Burrito Options",
      slug: "burrito-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Avocado Toast",
      slug: "avocado-toast",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fresh Juice",
      slug: "fresh-juice",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/burger-and-sandwich-food-trucks": [
    {
      name: "Burger Options",
      slug: "burger-options",
      uiType: "multi-select",
      options: ["beef/turkey/veggie/plant-based"]
    },
    {
      name: "Fry Types",
      slug: "fry-types",
      uiType: "multi-select",
      options: ["standard/sweet potato/curly/loaded"]
    },
    {
      name: "Custom Build",
      slug: "custom-build",
      uiType: "toggle",
      options: []
    },
    {
      name: "Combo Meals",
      slug: "combo-meals",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/carnival-and-fair-food-trucks": [
    {
      name: "Funnel Cake Toppings",
      slug: "funnel-cake-toppings",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Corn Dogs",
      slug: "corn-dogs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cotton Candy",
      slug: "cotton-candy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lemonade",
      slug: "lemonade",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/coffee-and-donut-food-trucks": [
    {
      name: "Espresso Drinks",
      slug: "espresso-drinks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cold Brew",
      slug: "cold-brew",
      uiType: "toggle",
      options: []
    },
    {
      name: "Donut Types",
      slug: "donut-types",
      uiType: "multi-select",
      options: ["glazed/filled/cake/vegan"]
    },
    {
      name: "Gluten-Free Donuts",
      slug: "gluten-free-donuts",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/gluten-free-food-trucks": [
    {
      name: "Dedicated GF Kitchen",
      slug: "dedicated-gf-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "GF Bun Options",
      slug: "gf-bun-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "GF Fryer",
      slug: "gf-fryer",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cross-Contamination Protocol",
      slug: "cross-contamination-protocol",
      uiType: "multi-select",
      options: ["strict/moderate"]
    }
  ],
  "catering-food/food-trucks/grilled-cheese-food-trucks": [
    {
      name: "Cheese Options",
      slug: "cheese-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Bread Options",
      slug: "bread-options",
      uiType: "multi-select",
      options: ["white/sourdough/rye/gluten-free"]
    },
    {
      name: "Tomato Soup Included",
      slug: "tomato-soup-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Add-Ons",
      slug: "add-ons",
      uiType: "multi-select",
      options: ["bacon/tomato/avocado"]
    }
  ],
  "catering-food/food-trucks/ice-cream-and-dessert-food-trucks": [
    {
      name: "Ice Cream Type",
      slug: "ice-cream-type",
      uiType: "multi-select",
      options: ["scoop/soft serve/rolled/vegan"]
    },
    {
      name: "Toppings Bar",
      slug: "toppings-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sundae Options",
      slug: "sundae-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dairy-Free Options",
      slug: "dairy-free-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/late-night-food-trucks": [
    {
      name: "Hours",
      slug: "hours",
      uiType: "multi-select",
      options: ["10pm-2am/11pm-3am/midnight-4am"]
    },
    {
      name: "Delivery Available",
      slug: "delivery-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cash Only",
      slug: "cash-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "ATM On-Site",
      slug: "atm-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/latin-food-trucks": [
    {
      name: "Cuisine Type",
      slug: "cuisine-type",
      uiType: "multi-select",
      options: ["Puerto Rican/Dominican/Cuban/Colombian"]
    },
    {
      name: "Empanadas",
      slug: "empanadas",
      uiType: "toggle",
      options: []
    },
    {
      name: "Plantains",
      slug: "plantains",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tres Leches Cake",
      slug: "tres-leches-cake",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/lobster-and-seafood-food-trucks": [
    {
      name: "Lobster Roll Options",
      slug: "lobster-roll-options",
      uiType: "multi-select",
      options: ["Connecticut/Maine"]
    },
    {
      name: "Crab Cakes",
      slug: "crab-cakes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Clam Chowder",
      slug: "clam-chowder",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shrimp Tacos",
      slug: "shrimp-tacos",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/mexican-food-trucks": [
    {
      name: "Horchata Service",
      slug: "horchata-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Churros",
      slug: "churros",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tamales",
      slug: "tamales",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/pizza-food-trucks": [
    {
      name: "Pizza Sizes",
      slug: "pizza-sizes",
      uiType: "multi-select",
      options: ["10\"/12\"/14\"/16\""]
    },
    {
      name: "Crust Types",
      slug: "crust-types",
      uiType: "multi-select",
      options: ["thin/thick/gluten-free/cauliflower"]
    },
    {
      name: "Topping Count",
      slug: "topping-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Wood-Fired Oven",
      slug: "wood-fired-oven",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/taco-food-trucks": [
    {
      name: "Taco Types",
      slug: "taco-types",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Salsa Varieties",
      slug: "salsa-varieties",
      uiType: "multi-select",
      options: ["mild/medium/hot"]
    },
    {
      name: "Veggie Options",
      slug: "veggie-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guacamole Included",
      slug: "guacamole-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/food-trucks/vegan-and-vegetarian-food-trucks": [
    {
      name: "Vegan Only",
      slug: "vegan-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vegetarian Only",
      slug: "vegetarian-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Both",
      slug: "both",
      uiType: "toggle",
      options: []
    },
    {
      name: "Plant-Based Meat Options",
      slug: "plant-based-meat-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/celebrity-private-chefs": [
    {
      name: "Celebrity Status",
      slug: "celebrity-status",
      uiType: "multi-select",
      options: ["TV/famous restaurant/James Beard/competition win"]
    },
    {
      name: "Minimum Budget",
      slug: "minimum-budget",
      uiType: "multi-select",
      options: ["$5k/$10k/$15k/$25k+"]
    },
    {
      name: "Travel Included",
      slug: "travel-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Media Release",
      slug: "media-release",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/cooking-class-chefs": [
    {
      name: "Class Type",
      slug: "class-type",
      uiType: "multi-select",
      options: ["hands-on/demonstration/hybrid"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["2/3/4/5+ hours"]
    },
    {
      name: "Recipe Cards Included",
      slug: "recipe-cards-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Participants Cook",
      slug: "participants-cook",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/cultural-cuisine-private-chefs": [
    {
      name: "Cuisine Type",
      slug: "cuisine-type",
      uiType: "multi-select",
      options: ["Italian/Mexican/Asian/Indian/Mediterranean/French"]
    },
    {
      name: "Authentic Recipes",
      slug: "authentic-recipes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Specialty Ingredients",
      slug: "specialty-ingredients",
      uiType: "multi-select",
      options: ["imported/local"]
    },
    {
      name: "Cultural Presentation",
      slug: "cultural-presentation",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/dietary-specific-private-chefs": [
    {
      name: "Diet Type",
      slug: "diet-type",
      uiType: "multi-select",
      options: ["vegan/vegetarian/keto/paleo/gluten-free/whole30"]
    },
    {
      name: "Meal Prep",
      slug: "meal-prep",
      uiType: "toggle",
      options: []
    },
    {
      name: "On-Site Cooking",
      slug: "on-site-cooking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ingredient Sourcing",
      slug: "ingredient-sourcing",
      uiType: "multi-select",
      options: ["local/organic/conventional"]
    }
  ],
  "catering-food/private-chefs/in-home-private-chefs": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["2-6/7-12/13-20/20+"]
    },
    {
      name: "Kitchen Requirements",
      slug: "kitchen-requirements",
      uiType: "multi-select",
      options: ["professional/home/commercial"]
    },
    {
      name: "Grocery Shopping Included",
      slug: "grocery-shopping-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cleanup Included",
      slug: "cleanup-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/intimate-dinner-chefs": [
    {
      name: "Courses",
      slug: "courses",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Wine Pairing",
      slug: "wine-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dietary Accommodation",
      slug: "dietary-accommodation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Interactive Experience",
      slug: "interactive-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/meal-prep-private-chefs": [
    {
      name: "Meals Per Week",
      slug: "meals-per-week",
      uiType: "multi-select",
      options: ["5/10/15/20+"]
    },
    {
      name: "Dietary Preferences",
      slug: "dietary-preferences",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reheating Instructions",
      slug: "reheating-instructions",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/small-party-chefs": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["plated/buffet/family style"]
    },
    {
      name: "Assistant Count",
      slug: "assistant-count",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Rental Equipment Provided",
      slug: "rental-equipment-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Menu Design",
      slug: "custom-menu-design",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-chefs/tasting-menu-chefs": [
    {
      name: "Course Count",
      slug: "course-count",
      uiType: "multi-select",
      options: ["5/7/10/12+"]
    },
    {
      name: "Amuse Bouche",
      slug: "amuse-bouche",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wine Pairing",
      slug: "wine-pairing",
      uiType: "multi-select",
      options: ["optional/included"]
    },
    {
      name: "Dietary Options",
      slug: "dietary-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/american-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Burger Bar",
      slug: "burger-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Craft Beer Selection",
      slug: "craft-beer-selection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Bar",
      slug: "private-bar",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/asian-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Sushi Counter",
      slug: "sushi-counter",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hibachi Table",
      slug: "hibachi-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Karaoke Room",
      slug: "private-karaoke-room",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/brewery-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Beer Tasting",
      slug: "beer-tasting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Brewery Tour Included",
      slug: "brewery-tour-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Beer Garden",
      slug: "outdoor-beer-garden",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/budget-private-dining": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$15-20/$20-25/$25-30"]
    },
    {
      name: "Prix Fixe Only",
      slug: "prix-fixe-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "BYOB",
      slug: "byob",
      uiType: "toggle",
      options: []
    },
    {
      name: "Room Rental Fee",
      slug: "room-rental-fee",
      uiType: "multi-select",
      options: ["$0/$50/$100+"]
    }
  ],
  "catering-food/private-dining/farm-to-table-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Seasonal Menu",
      slug: "seasonal-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chef's Table",
      slug: "chefs-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Garden View",
      slug: "garden-view",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/french-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Wine Cellar",
      slug: "wine-cellar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cheese Cart",
      slug: "cheese-cart",
      uiType: "toggle",
      options: []
    },
    {
      name: "Table-side Flambé",
      slug: "table-side-flamb",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/italian-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Prix Fixe Menu",
      slug: "prix-fixe-menu",
      uiType: "multi-select",
      options: ["yes/no price per person"]
    },
    {
      name: "Wine Pairing",
      slug: "wine-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Family Style Service",
      slug: "family-style-service",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/luxury-private-dining": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$75-100/$100-150/$150+"]
    },
    {
      name: "Sommelier Included",
      slug: "sommelier-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Menu Design",
      slug: "custom-menu-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Entrance",
      slug: "private-entrance",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/mediterranean-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Hummus Bar",
      slug: "hummus-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Patio",
      slug: "outdoor-patio",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mezze Platters",
      slug: "mezze-platters",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/mexican-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Tequila Tasting",
      slug: "tequila-tasting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guacamole Prepared Tableside",
      slug: "guacamole-prepared-tableside",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Patio",
      slug: "outdoor-patio",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/mid-range-private-dining": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$30-45/$45-60/$60-75"]
    },
    {
      name: "Menu Options",
      slug: "menu-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Beer/Wine Included",
      slug: "beer-wine-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "AV Equipment",
      slug: "av-equipment",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/rooftop-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Skyline View",
      slug: "skyline-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heated Rooftop",
      slug: "heated-rooftop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Retractable Roof",
      slug: "retractable-roof",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/seafood-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Oyster Bar",
      slug: "oyster-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Raw Bar",
      slug: "raw-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water View",
      slug: "water-view",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/steakhouse-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Dry-Aged Steaks",
      slug: "dry-aged-steaks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sommelier Available",
      slug: "sommelier-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Bar",
      slug: "private-bar",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/waterfront-restaurant-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Lake/River View",
      slug: "lake-river-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Deck",
      slug: "outdoor-deck",
      uiType: "toggle",
      options: []
    },
    {
      name: "Boat Dock",
      slug: "boat-dock",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/private-dining/wine-bar-private-dining": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Wine Flight",
      slug: "wine-flight",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cheese Board",
      slug: "cheese-board",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sommelier Available",
      slug: "sommelier-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/rehearsal-dinner-venues/casual-rehearsal-dinner-venues": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$15-25/$25-35/$35-45"]
    },
    {
      name: "Beer/Wine Included",
      slug: "beer-wine-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Room",
      slug: "private-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Seating",
      slug: "outdoor-seating",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/rehearsal-dinner-venues/formal-rehearsal-dinner-venues": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$45-65/$65-85/$85+"]
    },
    {
      name: "Plated Service",
      slug: "plated-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wine Pairing",
      slug: "wine-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Dining Room",
      slug: "private-dining-room",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/rehearsal-dinner-venues/outdoor-rehearsal-dinner-venues": [
    {
      name: "Rain Backup",
      slug: "rain-backup",
      uiType: "multi-select",
      options: ["indoor space/tent/none"]
    },
    {
      name: "Heated Patio",
      slug: "heated-patio",
      uiType: "toggle",
      options: []
    },
    {
      name: "String Lighting",
      slug: "string-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "numeric",
      options: []
    }
  ],
  "catering-food/rehearsal-dinner-venues/private-room-rehearsal-dinners": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "AV Equipment",
      slug: "av-equipment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prix Fixe Menu",
      slug: "prix-fixe-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Room Rental Fee",
      slug: "room-rental-fee",
      uiType: "multi-select",
      options: ["$0/$100/$250/$500+"]
    }
  ],
  "catering-food/rehearsal-dinner-venues/rehearsal-dinner-at-wedding-venue": [
    {
      name: "Venue Coordination",
      slug: "venue-coordination",
      uiType: "multi-select",
      options: ["included"]
    },
    {
      name: "Setup/Takedown",
      slug: "setup-takedown",
      uiType: "multi-select",
      options: ["included"]
    },
    {
      name: "Menu Tasting",
      slug: "menu-tasting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rehearsal Space Included",
      slug: "rehearsal-space-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/beer-suppliers": [
    {
      name: "Keg Sizes",
      slug: "keg-sizes",
      uiType: "multi-select",
      options: ["1/6 barrel", "1/4 barrel", "1/2 barrel"]
    },
    {
      name: "Craft Selection",
      slug: "craft-selection",
      uiType: "multi-select",
      options: ["local/regional/national"]
    },
    {
      name: "Glassware Rental",
      slug: "glassware-rental",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tap Rental",
      slug: "tap-rental",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/beer-tasting-event-services": [
    {
      name: "Beers Tasted",
      slug: "beers-tasted",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Cicerone Led",
      slug: "cicerone-led",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Pairing",
      slug: "food-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tasting Notes Provided",
      slug: "tasting-notes-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/cicerone-services": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["dinner/reception/tasting/class"]
    },
    {
      name: "Beer Selection Curation",
      slug: "beer-selection-curation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Pairing",
      slug: "food-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Staff Training",
      slug: "staff-training",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/liquor-suppliers": [
    {
      name: "Brands Carried",
      slug: "brands-carried",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Bulk Pricing",
      slug: "bulk-pricing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mixers Included",
      slug: "mixers-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ice Included",
      slug: "ice-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/mixologist-services": [
    {
      name: "Custom Cocktail Menu",
      slug: "custom-cocktail-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Staff Training",
      slug: "staff-training",
      uiType: "toggle",
      options: []
    },
    {
      name: "Glassware Recommendations",
      slug: "glassware-recommendations",
      uiType: "toggle",
      options: []
    },
    {
      name: "Batch Cocktail Preparation",
      slug: "batch-cocktail-preparation",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/sommelier-services": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["dinner/reception/tasting/class"]
    },
    {
      name: "Bottles Managed",
      slug: "bottles-managed",
      uiType: "numeric",
      options: []
    },
    {
      name: "Cellar Consultation",
      slug: "cellar-consultation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Staff Training",
      slug: "staff-training",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/spirits-tasting-event-services": [
    {
      name: "Spirits Tasted",
      slug: "spirits-tasted",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Distiller Led",
      slug: "distiller-led",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cocktail Demonstration",
      slug: "cocktail-demonstration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tasting Notes Provided",
      slug: "tasting-notes-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/wine-suppliers": [
    {
      name: "Price Per Bottle",
      slug: "price-per-bottle",
      uiType: "multi-select",
      options: ["$10-20/$20-35/$35-50/$50+"]
    },
    {
      name: "Case Discount",
      slug: "case-discount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tasting Available",
      slug: "tasting-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/wine-beer-spirits/wine-tasting-event-services": [
    {
      name: "Wines Tasted",
      slug: "wines-tasted",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Sommelier Led",
      slug: "sommelier-led",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Pairing",
      slug: "food-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tasting Notes Provided",
      slug: "tasting-notes-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-arches": [
    {
      name: "Arch Size",
      slug: "arch-size",
      uiType: "multi-select",
      options: ["4ft/5ft/6ft/7ft/8ft+"]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["2/3/4/5+ colors"]
    },
    {
      name: "Organic vs Standard",
      slug: "organic-vs-standard",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-bouquets": [
    {
      name: "Bouquet Count",
      slug: "bouquet-count",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Helium Filled",
      slug: "helium-filled",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weights Included",
      slug: "weights-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-ceilings": [
    {
      name: "Ceiling Coverage",
      slug: "ceiling-coverage",
      uiType: "multi-select",
      options: ["25%/50%/75%/100%"]
    },
    {
      name: "Helium Required",
      slug: "helium-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Installation Time",
      slug: "installation-time",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Removal Included",
      slug: "removal-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-centerpieces": [
    {
      name: "Centerpiece Height",
      slug: "centerpiece-height",
      uiType: "multi-select",
      options: ["12\"/18\"/24\"/30\"+"]
    },
    {
      name: "Weighted Base",
      slug: "weighted-base",
      uiType: "toggle",
      options: []
    },
    {
      name: "Table Count",
      slug: "table-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-columns": [
    {
      name: "Column Height",
      slug: "column-height",
      uiType: "multi-select",
      options: ["3ft/4ft/5ft/6ft+"]
    },
    {
      name: "Weighted Base",
      slug: "weighted-base",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["2/3/4 colors"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-delivery-only": [
    {
      name: "Balloon Count",
      slug: "balloon-count",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Helium Included",
      slug: "helium-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "multi-select",
      options: ["miles"]
    },
    {
      name: "DIY Instructions",
      slug: "diy-instructions",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-drops": [
    {
      name: "Drop Size",
      slug: "drop-size",
      uiType: "multi-select",
      options: ["8x8/10x10/12x12/15x15 ft"]
    },
    {
      name: "Balloon Count",
      slug: "balloon-count",
      uiType: "multi-select",
      options: ["100/200/300/500+"]
    },
    {
      name: "Net Included",
      slug: "net-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Release Mechanism",
      slug: "release-mechanism",
      uiType: "multi-select",
      options: ["manual/remote"]
    }
  ],
  "decor-rentals/balloon-artists/balloon-garlands": [
    {
      name: "Garland Length",
      slug: "garland-length",
      uiType: "multi-select",
      options: ["4ft/6ft/8ft/10ft+"]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["2/3/4/5+ colors"]
    },
    {
      name: "Filler Type",
      slug: "filler-type",
      uiType: "multi-select",
      options: ["dots/leaves"]
    },
    {
      name: "Installation Included",
      slug: "installation-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/balloon-walls": [
    {
      name: "Wall Size",
      slug: "wall-size",
      uiType: "multi-select",
      options: ["6x6/6x8/8x8/8x10 ft"]
    },
    {
      name: "Balloon Density",
      slug: "balloon-density",
      uiType: "multi-select",
      options: ["light/medium/full"]
    },
    {
      name: "Color Gradient",
      slug: "color-gradient",
      uiType: "toggle",
      options: []
    },
    {
      name: "Backdrop Included",
      slug: "backdrop-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/confetti-balloons": [
    {
      name: "Confetti Color",
      slug: "confetti-color",
      uiType: "multi-select",
      options: ["match palette"]
    },
    {
      name: "Balloon Size",
      slug: "balloon-size",
      uiType: "multi-select",
      options: ["12\"/16\"/24\""]
    },
    {
      name: "Helium or Air",
      slug: "helium-or-air",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    }
  ],
  "decor-rentals/balloon-artists/giant-number-balloons": [
    {
      name: "Number Size",
      slug: "number-size",
      uiType: "multi-select",
      options: ["16\"/24\"/32\"/40\""]
    },
    {
      name: "Number",
      slug: "number",
      uiType: "multi-select",
      options: ["0-9"]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["available"]
    },
    {
      name: "Helium or Air",
      slug: "helium-or-air",
      uiType: "multi-select",
      options: ["both"]
    }
  ],
  "decor-rentals/balloon-artists/letter-balloons": [
    {
      name: "Letter Size",
      slug: "letter-size",
      uiType: "multi-select",
      options: ["16\"/24\"/32\"/40\""]
    },
    {
      name: "Word Spelling",
      slug: "word-spelling",
      uiType: "multi-select",
      options: ["custom"]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["available"]
    },
    {
      name: "Helium or Air",
      slug: "helium-or-air",
      uiType: "multi-select",
      options: ["both"]
    }
  ],
  "decor-rentals/balloon-artists/light-up-led-balloons": [
    {
      name: "LED Color",
      slug: "led-color",
      uiType: "multi-select",
      options: ["white/RGB"]
    },
    {
      name: "Battery Life",
      slug: "battery-life",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "On/Off Switch",
      slug: "on-off-switch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    }
  ],
  "decor-rentals/balloon-artists/organic-balloon-arches": [
    {
      name: "Arch Size",
      slug: "arch-size",
      uiType: "multi-select",
      options: ["6ft/8ft/10ft/12ft+"]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["2/3/4/5+ colors"]
    },
    {
      name: "Filler Density",
      slug: "filler-density",
      uiType: "multi-select",
      options: ["light/medium/full"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/balloon-artists/standard-balloon-arches": [
    {
      name: "Arch Size",
      slug: "arch-size",
      uiType: "multi-select",
      options: ["6ft/8ft/10ft/12ft+"]
    },
    {
      name: "Uniform Size",
      slug: "uniform-size",
      uiType: "multi-select",
      options: ["9\"/11\"/12\""]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["2/3/4 colors"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/budget-florists": [
    {
      name: "Price Cap",
      slug: "price-cap",
      uiType: "multi-select",
      options: ["$50/$75/$100/$150"]
    },
    {
      name: "Grocery Store Quality",
      slug: "grocery-store-quality",
      uiType: "toggle",
      options: []
    },
    {
      name: "Simple Arrangements",
      slug: "simple-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pickup Discount",
      slug: "pickup-discount",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/diy-flower-suppliers": [
    {
      name: "Bulk Pricing",
      slug: "bulk-pricing",
      uiType: "multi-select",
      options: ["by stem/by dozen"]
    },
    {
      name: "Wholesale Access Required",
      slug: "wholesale-access-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Available",
      slug: "delivery-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flower Condition Guarantee",
      slug: "flower-condition-guarantee",
      uiType: "multi-select",
      options: ["days"]
    }
  ],
  "decor-rentals/florists/dried-and-preserved-flower-florists": [
    {
      name: "Preservation Method",
      slug: "preservation-method",
      uiType: "multi-select",
      options: ["air-dried/silica/freeze-dried"]
    },
    {
      name: "Color Retention",
      slug: "color-retention",
      uiType: "toggle",
      options: []
    },
    {
      name: "Longevity",
      slug: "longevity",
      uiType: "multi-select",
      options: ["months/years"]
    },
    {
      name: "Custom Designs",
      slug: "custom-designs",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/eco-friendly-and-sustainable-florists": [
    {
      name: "Foam-Free",
      slug: "foam-free",
      uiType: "toggle",
      options: []
    },
    {
      name: "Local Grown",
      slug: "local-grown",
      uiType: "multi-select",
      options: ["percentage 50%/75%/100%"]
    },
    {
      name: "Compostable After Event",
      slug: "compostable-after-event",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seasonal Only",
      slug: "seasonal-only",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/everyday-florists": [
    {
      name: "Same-Day Delivery",
      slug: "same-day-delivery",
      uiType: "multi-select",
      options: ["yes/no cutoff time"]
    },
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "multi-select",
      options: ["miles"]
    },
    {
      name: "Flower Types",
      slug: "flower-types",
      uiType: "multi-select",
      options: ["standard/premium"]
    },
    {
      name: "Vase Included",
      slug: "vase-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/flower-delivery-only": [
    {
      name: "Delivery Radius",
      slug: "delivery-radius",
      uiType: "multi-select",
      options: ["miles"]
    },
    {
      name: "Same-Day Available",
      slug: "same-day-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Refrigerated Truck",
      slug: "refrigerated-truck",
      uiType: "toggle",
      options: []
    },
    {
      name: "White Glove Setup",
      slug: "white-glove-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/luxury-florists": [
    {
      name: "Premium Blooms",
      slug: "premium-blooms",
      uiType: "multi-select",
      options: ["peonies/orchids/lilies/gardenias"]
    },
    {
      name: "Custom Consultation",
      slug: "custom-consultation",
      uiType: "toggle",
      options: []
    },
    {
      name: "White Glove Delivery",
      slug: "white-glove-delivery",
      uiType: "toggle",
      options: []
    },
    {
      name: "High-End Vessels",
      slug: "high-end-vessels",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/silk-and-artificial-flower-florists": [
    {
      name: "Realistic Quality",
      slug: "realistic-quality",
      uiType: "multi-select",
      options: ["basic/good/excellent"]
    },
    {
      name: "Outdoor Rated",
      slug: "outdoor-rated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reusable",
      slug: "reusable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Arrangements",
      slug: "custom-arrangements",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/black-gray-silver-gold-rose-gold": [
    {
      name: "Shades",
      slug: "shades",
      uiType: "multi-select",
      options: ["black/charcoal/silver/gold/rose gold"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["in stock"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/blush-dusty-rose-burgundy": [
    {
      name: "Shades",
      slug: "shades",
      uiType: "multi-select",
      options: ["blush/dusty rose/burgundy/mauve"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["in stock"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/burlap": [
    {
      name: "Roughness Level",
      slug: "roughness-level",
      uiType: "multi-select",
      options: ["light/standard"]
    },
    {
      name: "Fraying Concern",
      slug: "fraying-concern",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["natural/dyed"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/cotton": [
    {
      name: "Breathable",
      slug: "breathable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ironing Required",
      slug: "ironing-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["limited"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lace": [
    {
      name: "Lace Pattern",
      slug: "lace-pattern",
      uiType: "multi-select",
      options: ["floral/geometric"]
    },
    {
      name: "Overlay Only",
      slug: "overlay-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["white/ivory/blush"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen": [
    {
      name: "Texture Level",
      slug: "texture-level",
      uiType: "multi-select",
      options: ["light/medium/heavy"]
    },
    {
      name: "Ironing Required",
      slug: "ironing-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["natural/dyed"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/navy-emerald-sage-dusty-blue": [
    {
      name: "Shades",
      slug: "shades",
      uiType: "multi-select",
      options: ["navy/emerald/sage/dusty blue/teal"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["in stock"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/patterned": [
    {
      name: "Pattern Type",
      slug: "pattern-type",
      uiType: "multi-select",
      options: ["floral/stripe/checkered/plaid/paisley"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["in stock"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/polyester": [
    {
      name: "Wrinkle-Resistant",
      slug: "wrinkle-resistant",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["full"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/satin": [
    {
      name: "Shine Level",
      slug: "shine-level",
      uiType: "multi-select",
      options: ["high/medium"]
    },
    {
      name: "Wrinkle Concern",
      slug: "wrinkle-concern",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["full"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/sequin": [
    {
      name: "Sequin Coverage",
      slug: "sequin-coverage",
      uiType: "multi-select",
      options: ["full/patterned"]
    },
    {
      name: "Comfort Rating",
      slug: "comfort-rating",
      uiType: "multi-select",
      options: ["may scratch"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["metallic"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/spandex": [
    {
      name: "Stretch Level",
      slug: "stretch-level",
      uiType: "multi-select",
      options: ["4-way/2-way"]
    },
    {
      name: "Fit Type",
      slug: "fit-type",
      uiType: "multi-select",
      options: ["snug"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["full"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/velvet": [
    {
      name: "Velvet Quality",
      slug: "velvet-quality",
      uiType: "multi-select",
      options: ["standard/premium"]
    },
    {
      name: "Crush Concern",
      slug: "crush-concern",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["deep"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/white-ivory-champagne": [
    {
      name: "Shades",
      slug: "shades",
      uiType: "multi-select",
      options: ["bright white/off-white/ivory/champagne"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["in stock"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/packages/all-inclusive-tent-packages": [
    {
      name: "Tent Size",
      slug: "tent-size",
      uiType: "multi-select",
      options: ["20x20/20x30/30x30/40x40/40x60 ft"]
    },
    {
      name: "Season",
      slug: "season",
      uiType: "multi-select",
      options: ["summer/fall/winter"]
    },
    {
      name: "Flooring Included",
      slug: "flooring-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heat Included",
      slug: "heat-included",
      uiType: "multi-select",
      options: ["yes/no winter"]
    }
  ],
  "decor-rentals/packages/baby-shower-decor-packages": [
    {
      name: "Gender",
      slug: "gender",
      uiType: "multi-select",
      options: ["boy/girl/neutral/surprise"]
    },
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Centerpieces Included",
      slug: "centerpieces-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Balloons Included",
      slug: "balloons-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/birthday-party-decor-packages": [
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["kids/teen/adult/milestone"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Balloons Included",
      slug: "balloons-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/bridal-shower-decor-packages": [
    {
      name: "Bride's Style",
      slug: "brides-style",
      uiType: "multi-select",
      options: ["traditional/modern/floral"]
    },
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Floral Included",
      slug: "floral-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Backdrop Included",
      slug: "backdrop-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/corporate-event-decor-packages": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["conference/gala/holiday/meeting"]
    },
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Branded Elements",
      slug: "branded-elements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/diy-decor-kits": [
    {
      name: "Kit Type",
      slug: "kit-type",
      uiType: "multi-select",
      options: ["wedding/birthday/baby/bridal"]
    },
    {
      name: "Components Included",
      slug: "components-included",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Setup Instructions",
      slug: "setup-instructions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Discount",
      slug: "discount",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/full-service-decor-packages": [
    {
      name: "Service Included",
      slug: "service-included",
      uiType: "multi-select",
      options: ["setup/takedown/both"]
    },
    {
      name: "Lead Time Required",
      slug: "lead-time-required",
      uiType: "multi-select",
      options: ["days"]
    },
    {
      name: "Staff Count",
      slug: "staff-count",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "White Glove Service",
      slug: "white-glove-service",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/packages/wedding-decor-packages": [
    {
      name: "Guest Count Range",
      slug: "guest-count-range",
      uiType: "multi-select",
      options: ["50-100/101-150/151-200/200+"]
    },
    {
      name: "Style Options",
      slug: "style-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Full Service",
      slug: "full-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Price Per Guest",
      slug: "price-per-guest",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/party-decorators/backdrop-and-photo-wall-decorators": [
    {
      name: "Backdrop Type",
      slug: "backdrop-type",
      uiType: "multi-select",
      options: ["step-and-repeat/floral wall/ sequin/fabric/wood"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["6x6/6x8/8x8/8x10 ft"]
    },
    {
      name: "Custom Print",
      slug: "custom-print",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/ceiling-decorators": [
    {
      name: "Ceiling Height",
      slug: "ceiling-height",
      uiType: "multi-select",
      options: ["ft"]
    },
    {
      name: "Fabric Type",
      slug: "fabric-type",
      uiType: "multi-select",
      options: ["chiffon/satin/organza/sheer"]
    },
    {
      name: "Lighting Integration",
      slug: "lighting-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Installation Time",
      slug: "installation-time",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "decor-rentals/party-decorators/dessert-table-and-candy-buffet-decorators": [
    {
      name: "Backdrop Included",
      slug: "backdrop-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Signage Included",
      slug: "signage-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Containers Provided",
      slug: "containers-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tablecloth Included",
      slug: "tablecloth-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/entrance-and-walkway-decorators": [
    {
      name: "Welcome Sign",
      slug: "welcome-sign",
      uiType: "toggle",
      options: []
    },
    {
      name: "Balloon Arch",
      slug: "balloon-arch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Floral Arch",
      slug: "floral-arch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/gift-table-and-card-box-decorators": [
    {
      name: "Card Box Included",
      slug: "card-box-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Signage Included",
      slug: "signage-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Floral Accents",
      slug: "floral-accents",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coordinating Theme",
      slug: "coordinating-theme",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/table-decorators": [
    {
      name: "Table Count",
      slug: "table-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Centerpiece Included",
      slug: "centerpiece-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Runner Included",
      slug: "runner-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Place Setting Styling",
      slug: "place-setting-styling",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/anniversary-party-supplies": [
    {
      name: "Milestone Year",
      slug: "milestone-year",
      uiType: "multi-select",
      options: ["1/5/10/25/50+"]
    },
    {
      name: "Gold/Silver Accents",
      slug: "gold-silver-accents",
      uiType: "toggle",
      options: []
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/baby-shower-supplies": [
    {
      name: "Gender",
      slug: "gender",
      uiType: "multi-select",
      options: ["boy/girl/neutral/surprise"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/bachelor-party-supplies": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Groom Sash",
      slug: "groom-sash",
      uiType: "toggle",
      options: []
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/bachelorette-party-supplies": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sashes Included",
      slug: "sashes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/birthday-party-supplies": [
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["1-12/13-17/18+"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/bridal-shower-supplies": [
    {
      name: "Bride's Theme",
      slug: "brides-theme",
      uiType: "multi-select",
      options: ["traditional/modern/floral"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/graduation-party-supplies": [
    {
      name: "School Colors",
      slug: "school-colors",
      uiType: "multi-select",
      options: ["matching"]
    },
    {
      name: "Class Year",
      slug: "class-year",
      uiType: "multi-select",
      options: ["2024/2025/etc."]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/holiday-party-supplies": [
    {
      name: "Holiday Specific",
      slug: "holiday-specific",
      uiType: "multi-select",
      options: ["Christmas/Halloween/Thanksgiving/NYE/4th of July"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/retirement-party-supplies": [
    {
      name: "\"Happy Retirement\" Theme",
      slug: "happy-retirement-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hobby Focus",
      slug: "hobby-focus",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/party-supplies/wedding-supplies": [
    {
      name: "Wedding Colors",
      slug: "wedding-colors",
      uiType: "multi-select",
      options: ["matching"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Complete Kit",
      slug: "complete-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    }
  ],
  "decor-rentals/stationery/acrylic-signs": [
    {
      name: "Finish",
      slug: "finish",
      uiType: "multi-select",
      options: ["clear/frosted/colored"]
    },
    {
      name: "Thickness",
      slug: "thickness",
      uiType: "multi-select",
      options: ["1/8\"/1/4\"/1/2\""]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Double-Sided",
      slug: "double-sided",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/chalkboard-signs": [
    {
      name: "Frame Material",
      slug: "frame-material",
      uiType: "multi-select",
      options: ["wood/metal"]
    },
    {
      name: "Chalk Included",
      slug: "chalk-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weather Resistant",
      slug: "weather-resistant",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/digital-printing": [
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["2-3 days/1 week"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["25"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["full"]
    },
    {
      name: "Budget Friendly",
      slug: "budget-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/enclosure-cards": [
    {
      name: "Type",
      slug: "type",
      uiType: "multi-select",
      options: ["accommodations/directions/registry/website"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["matching invite count"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/envelope-addressing": [
    {
      name: "Method",
      slug: "method",
      uiType: "multi-select",
      options: ["printed/calligraphy/label"]
    },
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["printed: 3 days/calligraphy: 2-3 weeks"]
    },
    {
      name: "Return Address Included",
      slug: "return-address-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Addressing",
      slug: "guest-addressing",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/foam-board-signs": [
    {
      name: "Thickness",
      slug: "thickness",
      uiType: "multi-select",
      options: ["1/4\"/1/2\""]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Double-Sided",
      slug: "double-sided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Indoor Only",
      slug: "indoor-only",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/foil-stamping": [
    {
      name: "Foil Color",
      slug: "foil-color",
      uiType: "multi-select",
      options: ["gold/silver/rose gold/copper"]
    },
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["2-3 weeks"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["50"]
    },
    {
      name: "Shiny Finish",
      slug: "shiny-finish",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/laser-cutting": [
    {
      name: "Cutout Complexity",
      slug: "cutout-complexity",
      uiType: "multi-select",
      options: ["simple/moderate/intricate"]
    },
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["2-3 weeks"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["50"]
    },
    {
      name: "Custom Shapes",
      slug: "custom-shapes",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/led-neon-signs": [
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["pink/blue/white/RGB"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["12x12/16x16/24x24 inches"]
    },
    {
      name: "Remote Control",
      slug: "remote-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Indoor Only",
      slug: "indoor-only",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/letterpress": [
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["2-3 weeks/1 month"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["50"]
    },
    {
      name: "Paper Weight",
      slug: "paper-weight",
      uiType: "multi-select",
      options: ["110lb+/130lb+"]
    },
    {
      name: "Premium Cost",
      slug: "premium-cost",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/menus": [
    {
      name: "Menu Type",
      slug: "menu-type",
      uiType: "multi-select",
      options: ["place card/table menu/bar menu/dessert menu"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Tent Card",
      slug: "tent-card",
      uiType: "toggle",
      options: []
    },
    {
      name: "Envelopes",
      slug: "envelopes",
      uiType: "multi-select",
      options: ["no"]
    }
  ],
  "decor-rentals/stationery/place-cards-and-escort-cards": [
    {
      name: "Card Type",
      slug: "card-type",
      uiType: "multi-select",
      options: ["folded/tent/acrylic"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Table Number Notation",
      slug: "table-number-notation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Envelopes",
      slug: "envelopes",
      uiType: "multi-select",
      options: ["no"]
    }
  ],
  "decor-rentals/stationery/programs": [
    {
      name: "Page Count",
      slug: "page-count",
      uiType: "multi-select",
      options: ["2/4/6/8+ pages"]
    },
    {
      name: "Folded or Flat",
      slug: "folded-or-flat",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Ribbon Binding",
      slug: "ribbon-binding",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/rsvp-cards": [
    {
      name: "Meal Option Checkboxes",
      slug: "meal-option-checkboxes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Online RSVP Option",
      slug: "online-rsvp-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["matching invite count"]
    }
  ],
  "decor-rentals/stationery/save-the-dates": [
    {
      name: "Style",
      slug: "style",
      uiType: "multi-select",
      options: ["magnetic/postcard/photo"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["50/75/100/150+"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Photo",
      slug: "custom-photo",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/table-numbers": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["cardboard/acrylic/wood/metal"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["1-30+"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Double-Sided",
      slug: "double-sided",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/thank-you-cards": [
    {
      name: "Pre-Printed Message",
      slug: "pre-printed-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Blank Inside",
      slug: "blank-inside",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["25/50/75/100+"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/thermography": [
    {
      name: "Raised Ink",
      slug: "raised-ink",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lead Time",
      slug: "lead-time",
      uiType: "multi-select",
      options: ["1-2 weeks"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["50"]
    },
    {
      name: "Cost",
      slug: "cost",
      uiType: "multi-select",
      options: ["moderate"]
    }
  ],
  "decor-rentals/stationery/vinyl-banner-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["2x3/2x4/3x4/3x5/4x6 ft"]
    },
    {
      name: "Grommets Included",
      slug: "grommets-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Rated",
      slug: "outdoor-rated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Double-Sided",
      slug: "double-sided",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/wood-signs": [
    {
      name: "Wood Type",
      slug: "wood-type",
      uiType: "multi-select",
      options: ["plywood/reclaimed/birch"]
    },
    {
      name: "Stain Color",
      slug: "stain-color",
      uiType: "multi-select",
      options: ["natural/dark/white"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Rated",
      slug: "outdoor-rated",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/clear-top-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/30x30/40x40/40x60 ft"]
    },
    {
      name: "Clear Panels",
      slug: "clear-panels",
      uiType: "multi-select",
      options: ["roof only/roof+walls"]
    },
    {
      name: "UV Protection",
      slug: "uv-protection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Star Gazing",
      slug: "star-gazing",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/frame-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/20x30/30x30/40x40/40x60/40x80 ft"]
    },
    {
      name: "Peak Height",
      slug: "peak-height",
      uiType: "multi-select",
      options: ["ft"]
    },
    {
      name: "Clear Span",
      slug: "clear-span",
      uiType: "toggle",
      options: []
    },
    {
      name: "Any Surface",
      slug: "any-surface",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/high-peak-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/30x30/40x40 ft"]
    },
    {
      name: "Peak Height",
      slug: "peak-height",
      uiType: "multi-select",
      options: ["15ft/20ft/25ft+"]
    },
    {
      name: "Center Pole Height",
      slug: "center-pole-height",
      uiType: "multi-select",
      options: ["dramatic"]
    },
    {
      name: "Elegant Appearance",
      slug: "elegant-appearance",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/marquee-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/20x30/30x30/40x40 ft"]
    },
    {
      name: "Sidewalls Included",
      slug: "sidewalls-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Frame Construction",
      slug: "frame-construction",
      uiType: "toggle",
      options: []
    },
    {
      name: "Traditional Look",
      slug: "traditional-look",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/pagoda-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/30x30/40x40 ft"]
    },
    {
      name: "Tiered Roof",
      slug: "tiered-roof",
      uiType: "toggle",
      options: []
    },
    {
      name: "Asian-Inspired Design",
      slug: "asian-inspired-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Peak Height",
      slug: "peak-height",
      uiType: "multi-select",
      options: ["dramatic"]
    }
  ],
  "decor-rentals/tent-rentals/pole-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/20x30/30x30/40x40/40x60/40x80/40x100 ft"]
    },
    {
      name: "Peak Height",
      slug: "peak-height",
      uiType: "multi-select",
      options: ["ft"]
    },
    {
      name: "Center Poles",
      slug: "center-poles",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Staking Required",
      slug: "staking-required",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/pop-up-canopies": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["10x10/10x15/10x20 ft"]
    },
    {
      name: "Instant Setup",
      slug: "instant-setup",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Portable",
      slug: "portable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sidewalls Included",
      slug: "sidewalls-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/sailcloth-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["30x30/30x45/30x60/40x60 ft"]
    },
    {
      name: "Translucent",
      slug: "translucent",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pole Type",
      slug: "pole-type",
      uiType: "multi-select",
      options: ["wood/aluminum"]
    },
    {
      name: "Elegant Appearance",
      slug: "elegant-appearance",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/sidewalls": [
    {
      name: "Wall Type",
      slug: "wall-type",
      uiType: "multi-select",
      options: ["clear vinyl/solid/mesh/half-wall"]
    },
    {
      name: "Coverage",
      slug: "coverage",
      uiType: "multi-select",
      options: ["full/partial"]
    },
    {
      name: "Wind Protection",
      slug: "wind-protection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bug Protection",
      slug: "bug-protection",
      uiType: "multi-select",
      options: ["mesh"]
    }
  ],
  "decor-rentals/tent-rentals/stretch-tents": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["20x20/30x30/40x40 ft"]
    },
    {
      name: "Shape Flexibility",
      slug: "shape-flexibility",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pole-Free",
      slug: "pole-free",
      uiType: "toggle",
      options: []
    },
    {
      name: "Modern Appearance",
      slug: "modern-appearance",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/tent-anchoring": [
    {
      name: "Surface Type",
      slug: "surface-type",
      uiType: "multi-select",
      options: ["grass/dirt/pavement/concrete/rooftop"]
    },
    {
      name: "Anchor Type",
      slug: "anchor-type",
      uiType: "multi-select",
      options: ["stakes/weights/screws"]
    },
    {
      name: "Weight per Anchor",
      slug: "weight-per-anchor",
      uiType: "multi-select",
      options: ["lbs"]
    },
    {
      name: "Quantity Needed",
      slug: "quantity-needed",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/tent-cooling": [
    {
      name: "Cooler Type",
      slug: "cooler-type",
      uiType: "multi-select",
      options: ["AC/fans/misters"]
    },
    {
      name: "Cooling Capacity",
      slug: "cooling-capacity",
      uiType: "multi-select",
      options: ["BTU/sq ft"]
    },
    {
      name: "Power Requirement",
      slug: "power-requirement",
      uiType: "multi-select",
      options: ["generator/outlet"]
    },
    {
      name: "Water Supply Required",
      slug: "water-supply-required",
      uiType: "multi-select",
      options: ["misters"]
    }
  ],
  "decor-rentals/tent-rentals/tent-flooring": [
    {
      name: "Floor Type",
      slug: "floor-type",
      uiType: "multi-select",
      options: ["plywood/interlocking tiles/turf"]
    },
    {
      name: "Size Coverage",
      slug: "size-coverage",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "ADA Accessible",
      slug: "ada-accessible",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ramp Included",
      slug: "ramp-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/tent-heating": [
    {
      name: "Heater Type",
      slug: "heater-type",
      uiType: "multi-select",
      options: ["propane/electric"]
    },
    {
      name: "Number of Heaters",
      slug: "number-of-heaters",
      uiType: "numeric",
      options: []
    },
    {
      name: "BTU Output",
      slug: "btu-output",
      uiType: "numeric",
      options: []
    },
    {
      name: "Fuel Included",
      slug: "fuel-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/tent-lighting": [
    {
      name: "Light Type",
      slug: "light-type",
      uiType: "multi-select",
      options: ["string lights/chandeliers/uplighting/LED stars"]
    },
    {
      name: "Light Count",
      slug: "light-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Power Source",
      slug: "power-source",
      uiType: "multi-select",
      options: ["battery/generator/outlet"]
    },
    {
      name: "Installation Included",
      slug: "installation-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/tent-rentals/tent-permitting-assistance": [
    {
      name: "Tent Size",
      slug: "tent-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Permit Assistance Included",
      slug: "permit-assistance-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fire Marshall Approval",
      slug: "fire-marshall-approval",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setback Requirements",
      slug: "setback-requirements",
      uiType: "multi-select",
      options: ["ft"]
    }
  ],
  "entertainment/comedians/black-comedians": [
    {
      name: "Black Comedy Experience",
      slug: "black-comedy-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Urban Venues",
      slug: "urban-venues",
      uiType: "toggle",
      options: []
    },
    {
      name: "HBCU Experience",
      slug: "hbcu-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/comedy-magicians": [
    {
      name: "Magic-to-Jokes Ratio",
      slug: "magic-to-jokes-ratio",
      uiType: "multi-select",
      options: ["slider"]
    },
    {
      name: "Clean vs Adult",
      slug: "clean-vs-adult",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Card Tricks",
      slug: "card-tricks",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/corporate-comedians": [
    {
      name: "Industry Experience",
      slug: "industry-experience",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Custom Material",
      slug: "custom-material",
      uiType: "toggle",
      options: []
    },
    {
      name: "Keynote Length",
      slug: "keynote-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Q&A Included",
      slug: "qanda-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/emcee-comedians": [
    {
      name: "Event Types",
      slug: "event-types",
      uiType: "multi-select",
      options: ["corporate/awards/fundraiser/festival"]
    },
    {
      name: "Transition Skills",
      slug: "transition-skills",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Warm-Up",
      slug: "crowd-warm-up",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timeline Management",
      slug: "timeline-management",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/female-comedians": [
    {
      name: "Women in Comedy",
      slug: "women-in-comedy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Female Perspective",
      slug: "female-perspective",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bookers Seeking Diversity",
      slug: "bookers-seeking-diversity",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/improv-troupes": [
    {
      name: "Troupe Size",
      slug: "troupe-size",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Workshop Available",
      slug: "workshop-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/latin-comedians": [
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Latinx Perspective",
      slug: "latinx-perspective",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spanish Shows",
      slug: "spanish-shows",
      uiType: "toggle",
      options: []
    },
    {
      name: "Code Switching",
      slug: "code-switching",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/lgbtqplus-comedians": [
    {
      name: "LGBTQ+ Perspective",
      slug: "lgbtqplus-perspective",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pride Event Experience",
      slug: "pride-event-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Queer Venues",
      slug: "queer-venues",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ally Inclusive",
      slug: "ally-inclusive",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/roastmasters": [
    {
      name: "Roast Experience",
      slug: "roast-experience",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Target Versatility",
      slug: "target-versatility",
      uiType: "toggle",
      options: []
    },
    {
      name: "Closing Roast",
      slug: "closing-roast",
      uiType: "toggle",
      options: []
    },
    {
      name: "Trophy Presentation",
      slug: "trophy-presentation",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/wedding-comedians": [
    {
      name: "Couple Interview Required",
      slug: "couple-interview-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Roast Style",
      slug: "roast-style",
      uiType: "multi-select",
      options: ["gentle/medium/spicy"]
    },
    {
      name: "Toast Integration",
      slug: "toast-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reception MC",
      slug: "reception-mc",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/comedy-show-promoters": [
    {
      name: "Comedian Tier",
      slug: "comedian-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Clean vs Adult",
      slug: "clean-vs-adult",
      uiType: "multi-select",
      options: ["both/clean only/adult only"]
    },
    {
      name: "Two Drink Minimum",
      slug: "two-drink-minimum",
      uiType: "toggle",
      options: []
    },
    {
      name: "Opener Booking",
      slug: "opener-booking",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/country-concert-promoters": [
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Outdoor Venue",
      slug: "outdoor-venue",
      uiType: "toggle",
      options: []
    },
    {
      name: "Line Dancing",
      slug: "line-dancing",
      uiType: "toggle",
      options: []
    },
    {
      name: "BBQ Coordination",
      slug: "bbq-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/edm-concert-promoters": [
    {
      name: "Production Requirements",
      slug: "production-requirements",
      uiType: "multi-select",
      options: ["LED/Laser/Fog"]
    },
    {
      name: "Late Night License",
      slug: "late-night-license",
      uiType: "toggle",
      options: []
    },
    {
      name: "Genres",
      slug: "genres",
      uiType: "multi-select",
      options: ["house/techno/dubstep"]
    },
    {
      name: "International Bookings",
      slug: "international-bookings",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/family-show-promoters": [
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["2-6/4-8/6-12/all ages"]
    },
    {
      name: "Meet & Greet",
      slug: "meet-and-greet",
      uiType: "toggle",
      options: []
    },
    {
      name: "Merchandise",
      slug: "merchandise",
      uiType: "toggle",
      options: []
    },
    {
      name: "School Show Experience",
      slug: "school-show-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/festival-promoters": [
    {
      name: "Festival Size",
      slug: "festival-size",
      uiType: "multi-select",
      options: ["under 5k/5k-15k/15k-30k/30k+"]
    },
    {
      name: "Multi-Day",
      slug: "multi-day",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stage Management",
      slug: "stage-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Permitting Experience",
      slug: "permitting-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/hip-hop-concert-promoters": [
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Security Requirements",
      slug: "security-requirements",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Meet & Greet",
      slug: "vip-meet-and-greet",
      uiType: "toggle",
      options: []
    },
    {
      name: "Opener Booking",
      slug: "opener-booking",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/jazz-and-blues-concert-promoters": [
    {
      name: "Venue Type",
      slug: "venue-type",
      uiType: "multi-select",
      options: ["club/theater/festival"]
    },
    {
      name: "Dinner Service Coordination",
      slug: "dinner-service-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Listening Room",
      slug: "listening-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Artist Hospitality",
      slug: "artist-hospitality",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/latin-concert-promoters": [
    {
      name: "Genres",
      slug: "genres",
      uiType: "multi-select",
      options: ["reggaeton/salsa/regional/mexican"]
    },
    {
      name: "Bilingual Marketing",
      slug: "bilingual-marketing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Tables",
      slug: "vip-tables",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/local-venue-concert-promoters": [
    {
      name: "Venues Worked",
      slug: "venues-worked",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Show Frequency",
      slug: "show-frequency",
      uiType: "multi-select",
      options: ["weekly/monthly/one-off"]
    },
    {
      name: "Door Deal vs Guarantee",
      slug: "door-deal-vs-guarantee",
      uiType: "multi-select",
      options: ["split"]
    }
  ],
  "entertainment/concert-promoters/national-tour-promoters": [
    {
      name: "Tour Radius",
      slug: "tour-radius",
      uiType: "multi-select",
      options: ["US/North America/International"]
    },
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["arena/theater/club"]
    },
    {
      name: "Routing Support",
      slug: "routing-support",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hospitality",
      slug: "hospitality",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/concert-promoters/rock-concert-promoters": [
    {
      name: "Subgenre Focus",
      slug: "subgenre-focus",
      uiType: "multi-select",
      options: ["indie/metal/punk/alternative"]
    },
    {
      name: "All Ages Shows",
      slug: "all-ages-shows",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Service Coordination",
      slug: "bar-service-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Merch Management",
      slug: "merch-management",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/80s-90s-2000s-throwback-djs": [
    {
      name: "Era Focus",
      slug: "era-focus",
      uiType: "multi-select",
      options: ["80s/90s/00s/mixed"]
    },
    {
      name: "One-Hit Wonders",
      slug: "one-hit-wonders",
      uiType: "toggle",
      options: []
    },
    {
      name: "Decade Attire",
      slug: "decade-attire",
      uiType: "toggle",
      options: []
    },
    {
      name: "Trivia Integration",
      slug: "trivia-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/country-djs": [
    {
      name: "Eras",
      slug: "eras",
      uiType: "multi-select",
      options: ["90s/2000s/2010s/current"]
    },
    {
      name: "Line Dance Songs",
      slug: "line-dance-songs",
      uiType: "multi-select",
      options: ["database size"]
    },
    {
      name: "Two-Step Mixing",
      slug: "two-step-mixing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Country-Pop Crossover",
      slug: "country-pop-crossover",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/edm-djs": [
    {
      name: "Subgenres",
      slug: "subgenres",
      uiType: "multi-select",
      options: ["House/Techno/Dubstep/Trance/Trap"]
    },
    {
      name: "Controller Type",
      slug: "controller-type",
      uiType: "multi-select",
      options: ["CDJ/DDJ/vinyl"]
    },
    {
      name: "Visuals Package",
      slug: "visuals-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Mashups",
      slug: "live-mashups",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/hip-hop-djs": [
    {
      name: "Subgenres",
      slug: "subgenres",
      uiType: "multi-select",
      options: ["Old School/ New School/ Trap/ Conscious"]
    },
    {
      name: "Turntablism",
      slug: "turntablism",
      uiType: "toggle",
      options: []
    },
    {
      name: "Scratching Skills",
      slug: "scratching-skills",
      uiType: "multi-select",
      options: ["basic/intermediate/expert"]
    },
    {
      name: "Freestyle MC",
      slug: "freestyle-mc",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/rock-djs": [
    {
      name: "Subgenres",
      slug: "subgenres",
      uiType: "multi-select",
      options: ["Classic/Alternative/Hard/Punk/Indie"]
    },
    {
      name: "Deep Cuts",
      slug: "deep-cuts",
      uiType: "toggle",
      options: []
    },
    {
      name: "Band T-Shirt",
      slug: "band-t-shirt",
      uiType: "multi-select",
      options: ["attire"]
    },
    {
      name: "Guitar Solo Requests",
      slug: "guitar-solo-requests",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/silent-disco-djs": [
    {
      name: "Channels",
      slug: "channels",
      uiType: "multi-select",
      options: ["2/3/4"]
    },
    {
      name: "Headphone Count",
      slug: "headphone-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "LED Headphones",
      slug: "led-headphones",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple DJs",
      slug: "multiple-djs",
      uiType: "multi-select",
      options: ["1/2/3/4"]
    }
  ],
  "entertainment/djs/top-40-djs": [
    {
      name: "Current Chart Updates",
      slug: "current-chart-updates",
      uiType: "multi-select",
      options: ["weekly"]
    },
    {
      name: "Request Heavy",
      slug: "request-heavy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Clean Edits",
      slug: "clean-edits",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Integration",
      slug: "social-media-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/archery-tag": [
    {
      name: "Player Capacity",
      slug: "player-capacity",
      uiType: "multi-select",
      options: ["6/8/10/12+"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["10/12/14"]
    },
    {
      name: "Safety Gear Provided",
      slug: "safety-gear-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Arena Setup",
      slug: "arena-setup",
      uiType: "multi-select",
      options: ["dimensions"]
    }
  ],
  "entertainment/interactive/axe-throwing": [
    {
      name: "Lanes",
      slug: "lanes",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["12/14/16/18"]
    },
    {
      name: "Coach Included",
      slug: "coach-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Safety Gear Provided",
      slug: "safety-gear-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/bounce-house-and-inflatable-rentals": [
    {
      name: "Inflatable Type",
      slug: "inflatable-type",
      uiType: "multi-select",
      options: ["standard/combo/obstacle/slide"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["dimensions"]
    },
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["2-6/4-10/8-14/teens"]
    },
    {
      name: "Blower Included",
      slug: "blower-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/bubble-soccer": [
    {
      name: "Suit Count",
      slug: "suit-count",
      uiType: "multi-select",
      options: ["6/8/10/12+"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["10/12/14"]
    },
    {
      name: "Field Requirements",
      slug: "field-requirements",
      uiType: "multi-select",
      options: ["dimensions"]
    },
    {
      name: "Referee Included",
      slug: "referee-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/game-truck-parties": [
    {
      name: "Player Capacity",
      slug: "player-capacity",
      uiType: "multi-select",
      options: ["8/12/16/20+"]
    },
    {
      name: "Consoles",
      slug: "consoles",
      uiType: "multi-select",
      options: ["PS5/Xbox/Switch/Retro"]
    },
    {
      name: "Game Library",
      slug: "game-library",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Party Host Included",
      slug: "party-host-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/gel-blaster-parties": [
    {
      name: "Player Capacity",
      slug: "player-capacity",
      uiType: "multi-select",
      options: ["6/8/10/12+"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["8/10/12"]
    },
    {
      name: "Gel Balls Included",
      slug: "gel-balls-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Party Host",
      slug: "party-host",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/laser-tag": [
    {
      name: "Arena Size",
      slug: "arena-size",
      uiType: "multi-select",
      options: ["30x30/40x40/50x50"]
    },
    {
      name: "Player Capacity",
      slug: "player-capacity",
      uiType: "multi-select",
      options: ["10/15/20/30"]
    },
    {
      name: "Vests Included",
      slug: "vests-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Party Packages",
      slug: "party-packages",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/mechanical-bull-rentals": [
    {
      name: "Rider Capacity",
      slug: "rider-capacity",
      uiType: "multi-select",
      options: ["1 at a time"]
    },
    {
      name: "Difficulty Levels",
      slug: "difficulty-levels",
      uiType: "multi-select",
      options: ["1-10"]
    },
    {
      name: "Operator Included",
      slug: "operator-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Safety Mat Included",
      slug: "safety-mat-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/ninja-warrior-courses": [
    {
      name: "Obstacles",
      slug: "obstacles",
      uiType: "multi-select",
      options: ["4/6/8+"]
    },
    {
      name: "Age Groups",
      slug: "age-groups",
      uiType: "multi-select",
      options: ["kids/teens/adults"]
    },
    {
      name: "Competition Format",
      slug: "competition-format",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timer Included",
      slug: "timer-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/obstacle-course-rentals": [
    {
      name: "Course Length",
      slug: "course-length",
      uiType: "multi-select",
      options: ["30/50/75/100 ft"]
    },
    {
      name: "Obstacles",
      slug: "obstacles",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Timers Included",
      slug: "timers-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Relay Format",
      slug: "relay-format",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/paintball": [
    {
      name: "Player Capacity",
      slug: "player-capacity",
      uiType: "multi-select",
      options: ["10/15/20+"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["12/14/16"]
    },
    {
      name: "Rental Gear Included",
      slug: "rental-gear-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Paintballs Included",
      slug: "paintballs-included",
      uiType: "multi-select",
      options: ["count"]
    }
  ],
  "entertainment/interactive/virtual-reality-party-trucks": [
    {
      name: "Headsets",
      slug: "headsets",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Game Library",
      slug: "game-library",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["8/10/12"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["minutes per player"]
    }
  ],
  "entertainment/karaoke-hosts/bilingual-karaoke-hosts": [
    {
      name: "Languages",
      slug: "languages",
      uiType: "multi-select",
      options: ["Spanish/English/Polish/Korean/Japanese/Tagalog"]
    },
    {
      name: "Song Libraries per Language",
      slug: "song-libraries-per-language",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Pronunciation Help",
      slug: "pronunciation-help",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/karaoke-hosts/competition-karaoke-hosts": [
    {
      name: "Round Structure",
      slug: "round-structure",
      uiType: "multi-select",
      options: ["2/3/4 rounds"]
    },
    {
      name: "Judging Panel",
      slug: "judging-panel",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prize Support",
      slug: "prize-support",
      uiType: "toggle",
      options: []
    },
    {
      name: "Scoring Transparency",
      slug: "scoring-transparency",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/karaoke-hosts/kid-friendly-karaoke-hosts": [
    {
      name: "Song Library Filtered",
      slug: "song-library-filtered",
      uiType: "toggle",
      options: []
    },
    {
      name: "Age Appropriate",
      slug: "age-appropriate",
      uiType: "multi-select",
      options: ["5-12"]
    },
    {
      name: "Group Singing Encouraged",
      slug: "group-singing-encouraged",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Adult Songs",
      slug: "no-adult-songs",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/karaoke-hosts/mobile-karaoke": [
    {
      name: "Equipment Included",
      slug: "equipment-included",
      uiType: "multi-select",
      options: ["speakers/mics/screen/stand/tablet"]
    },
    {
      name: "Setup Time",
      slug: "setup-time",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Wireless Mics",
      slug: "wireless-mics",
      uiType: "multi-select",
      options: ["count"]
    }
  ],
  "entertainment/karaoke-hosts/private-room-karaoke-hosts": [
    {
      name: "Rooms Available",
      slug: "rooms-available",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Tablet Controllers",
      slug: "tablet-controllers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food/Drink Service",
      slug: "food-drink-service",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/karaoke-hosts/public-stage-karaoke-hosts": [
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "multi-select",
      options: ["5k/10k/20k/30k+"]
    },
    {
      name: "Rotation Management",
      slug: "rotation-management",
      uiType: "multi-select",
      options: ["fair"]
    },
    {
      name: "Scoring System",
      slug: "scoring-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Singer Encouragement",
      slug: "singer-encouragement",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/karaoke-hosts/theme-karaoke-hosts": [
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["80s/90s/Disney/Broadway/Country/Rock"]
    },
    {
      name: "Costume Encouragement",
      slug: "costume-encouragement",
      uiType: "toggle",
      options: []
    },
    {
      name: "Theme Prizes",
      slug: "theme-prizes",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/card-magic-specialists": [
    {
      name: "Deck Types",
      slug: "deck-types",
      uiType: "multi-select",
      options: ["bicycle/custom/borrowed"]
    },
    {
      name: "Flourishes",
      slug: "flourishes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Gambling Demo",
      slug: "gambling-demo",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mentalism Mix",
      slug: "mentalism-mix",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/close-up-magicians": [
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["hourly"]
    },
    {
      name: "Max Guests",
      slug: "max-guests",
      uiType: "multi-select",
      options: ["per hour"]
    },
    {
      name: "Sleight of Hand",
      slug: "sleight-of-hand",
      uiType: "toggle",
      options: []
    },
    {
      name: "Card Tricks",
      slug: "card-tricks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coin Tricks",
      slug: "coin-tricks",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/comedy-magicians": [
    {
      name: "Clean Comedy",
      slug: "clean-comedy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Adult Comedy",
      slug: "adult-comedy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Roasting",
      slug: "audience-roasting",
      uiType: "multi-select",
      options: ["light/medium/none"]
    },
    {
      name: "Show Length",
      slug: "show-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    }
  ],
  "entertainment/magicians/corporate-event-magicians": [
    {
      name: "Clean Material",
      slug: "clean-material",
      uiType: "toggle",
      options: []
    },
    {
      name: "Brand Integration",
      slug: "brand-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Size",
      slug: "audience-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Testimonial Video",
      slug: "testimonial-video",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/escape-artists": [
    {
      name: "Escape Type",
      slug: "escape-type",
      uiType: "multi-select",
      options: ["straightjacket/water tank/ropes/chains"]
    },
    {
      name: "Time Limit",
      slug: "time-limit",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Medical Standby",
      slug: "medical-standby",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/grand-illusionists": [
    {
      name: "Illusions Count",
      slug: "illusions-count",
      uiType: "multi-select",
      options: ["3/5/7+"]
    },
    {
      name: "Assistant Count",
      slug: "assistant-count",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Truck Space Required",
      slug: "truck-space-required",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Stage Size Required",
      slug: "stage-size-required",
      uiType: "multi-select",
      options: ["dimensions"]
    }
  ],
  "entertainment/magicians/kid-magicians": [
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["3-6/4-8/6-12"]
    },
    {
      name: "Balloon Animals",
      slug: "balloon-animals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Participation Level",
      slug: "participation-level",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Show Length",
      slug: "show-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    }
  ],
  "entertainment/magicians/kids-birthday-magicians": [
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["3-5/4-8/6-12"]
    },
    {
      name: "Show Length",
      slug: "show-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Balloons Included",
      slug: "balloons-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Goody Bags",
      slug: "goody-bags",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/mentalists": [
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "multi-select",
      options: ["light/medium/heavy"]
    },
    {
      name: "Prediction Size",
      slug: "prediction-size",
      uiType: "multi-select",
      options: ["envelope/board/screen"]
    },
    {
      name: "Show Length",
      slug: "show-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    }
  ],
  "entertainment/magicians/parlor-magicians": [
    {
      name: "Room Size",
      slug: "room-size",
      uiType: "multi-select",
      options: ["small/medium"]
    },
    {
      name: "Audience Capacity",
      slug: "audience-capacity",
      uiType: "multi-select",
      options: ["20-50"]
    },
    {
      name: "Close-Up Mix",
      slug: "close-up-mix",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mentalism Mix",
      slug: "mentalism-mix",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/magicians/stage-magicians": [
    {
      name: "Show Length",
      slug: "show-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Audience Capacity",
      slug: "audience-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Assistant Included",
      slug: "assistant-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grand Illusions",
      slug: "grand-illusions",
      uiType: "multi-select",
      options: ["size"]
    }
  ],
  "entertainment/magicians/virtual-magicians": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["Zoom/Teams/Webex"]
    },
    {
      name: "Interactive Tricks",
      slug: "interactive-tricks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Home Delivery Props",
      slug: "home-delivery-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Cameras",
      slug: "audience-cameras",
      uiType: "multi-select",
      options: ["required"]
    }
  ],
  "entertainment/magicians/wedding-magicians": [
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["1/2/3 hours"]
    },
    {
      name: "Guest Capacity",
      slug: "guest-capacity",
      uiType: "multi-select",
      options: ["per hour"]
    },
    {
      name: "Photo Integration",
      slug: "photo-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Material",
      slug: "custom-material",
      uiType: "multi-select",
      options: ["couple names"]
    }
  ],
  "entertainment/party-characters/animal-mascots": [
    {
      name: "Animal Type",
      slug: "animal-type",
      uiType: "multi-select",
      options: ["bunny/bear/monkey/dog/cat"]
    },
    {
      name: "Easter Availability",
      slug: "easter-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hugs Allowed",
      slug: "hugs-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dancing",
      slug: "dancing",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/balloon-twisters": [
    {
      name: "Balloons Per Hour",
      slug: "balloons-per-hour",
      uiType: "multi-select",
      options: ["10/15/20+"]
    },
    {
      name: "Complex Shapes",
      slug: "complex-shapes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Balloon Hats",
      slug: "balloon-hats",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sword Fights",
      slug: "sword-fights",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/bluey-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Bluey/Bingo/Bandit/Chilli"]
    },
    {
      name: "Keepy Uppy Game",
      slug: "keepy-uppy-game",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Mode",
      slug: "dance-mode",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grannies Act",
      slug: "grannies-act",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/clowns": [
    {
      name: "Clown Style",
      slug: "clown-style",
      uiType: "multi-select",
      options: ["classic/modern/minimal"]
    },
    {
      name: "Face Painting",
      slug: "face-painting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Balloon Animals",
      slug: "balloon-animals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Non-Scary Guarantee",
      slug: "non-scary-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/cowboys-cowgirls": [
    {
      name: "Lasso Tricks",
      slug: "lasso-tricks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sheriff Badge",
      slug: "sheriff-badge",
      uiType: "toggle",
      options: []
    },
    {
      name: "Horse Stick",
      slug: "horse-stick",
      uiType: "toggle",
      options: []
    },
    {
      name: "Line Dance Teaching",
      slug: "line-dance-teaching",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/dc-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Batman/Superman/Wonder Woman/Joker/Harley Quinn"]
    },
    {
      name: "Cape",
      slug: "cape",
      uiType: "toggle",
      options: []
    },
    {
      name: "Utility Belt",
      slug: "utility-belt",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pose Coaching",
      slug: "pose-coaching",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/dinosaur-characters": [
    {
      name: "Dinosaur Type",
      slug: "dinosaur-type",
      uiType: "multi-select",
      options: ["T-Rex/ Triceratops/ Velociraptor"]
    },
    {
      name: "Roar Sound Effects",
      slug: "roar-sound-effects",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stomping",
      slug: "stomping",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kid Riding",
      slug: "kid-riding",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/disney-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Mickey/Minnie/Donald/Goofy"]
    },
    {
      name: "Non-Licensed",
      slug: "non-licensed",
      uiType: "multi-select",
      options: ["generic"]
    },
    {
      name: "Autograph Book",
      slug: "autograph-book",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hugs",
      slug: "hugs",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/face-painters": [
    {
      name: "Designs Per Hour",
      slug: "designs-per-hour",
      uiType: "multi-select",
      options: ["10/15/20+"]
    },
    {
      name: "Face vs Arm",
      slug: "face-vs-arm",
      uiType: "multi-select",
      options: ["both/face only/arm only"]
    },
    {
      name: "Glitter Included",
      slug: "glitter-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stencils Available",
      slug: "stencils-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/fairy-characters": [
    {
      name: "Fairy Dust",
      slug: "fairy-dust",
      uiType: "toggle",
      options: []
    },
    {
      name: "Face Painting",
      slug: "face-painting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wings Included",
      slug: "wings-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wand Included",
      slug: "wand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/glitter-tattoo-artists": [
    {
      name: "Tattoos Per Hour",
      slug: "tattoos-per-hour",
      uiType: "multi-select",
      options: ["10/15/20+"]
    },
    {
      name: "Stencils Available",
      slug: "stencils-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Colors Available",
      slug: "colors-available",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["3-7 days"]
    }
  ],
  "entertainment/party-characters/mad-scientists": [
    {
      name: "Experiments Included",
      slug: "experiments-included",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Safety Goggles",
      slug: "safety-goggles",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dry Ice",
      slug: "dry-ice",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kid Volunteers",
      slug: "kid-volunteers",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/marvel-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Spider-Man/Captain America/Thor/Iron Man/Black Panther"]
    },
    {
      name: "Prop Weapons",
      slug: "prop-weapons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Poses",
      slug: "poses",
      uiType: "toggle",
      options: []
    },
    {
      name: "Group Photo",
      slug: "group-photo",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/mermaids": [
    {
      name: "Mermaid Tail",
      slug: "mermaid-tail",
      uiType: "multi-select",
      options: ["swimmable/photo only"]
    },
    {
      name: "Shell Accessories",
      slug: "shell-accessories",
      uiType: "toggle",
      options: []
    },
    {
      name: "Underwater Basket Weaving",
      slug: "underwater-basket-weaving",
      uiType: "multi-select",
      options: ["no"]
    },
    {
      name: "Trident",
      slug: "trident",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/ninja-turtles": [
    {
      name: "Turtle Type",
      slug: "turtle-type",
      uiType: "multi-select",
      options: ["Leonardo/Donatello/Raphael/Michelangelo"]
    },
    {
      name: "Nunchucks",
      slug: "nunchucks",
      uiType: "multi-select",
      options: ["prop"]
    },
    {
      name: "Pizza Party Add-on",
      slug: "pizza-party-add-on",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sewer Lid Prop",
      slug: "sewer-lid-prop",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/paw-patrol-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Chase/Marshall/Skye/Rubble"]
    },
    {
      name: "Non-Licensed",
      slug: "non-licensed",
      uiType: "multi-select",
      options: ["generic"]
    },
    {
      name: "Rescue Mission Game",
      slug: "rescue-mission-game",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pup Pack Prop",
      slug: "pup-pack-prop",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/peppa-pig-characters": [
    {
      name: "Muddy Puddles Game",
      slug: "muddy-puddles-game",
      uiType: "toggle",
      options: []
    },
    {
      name: "Snort Laugh",
      slug: "snort-laugh",
      uiType: "toggle",
      options: []
    },
    {
      name: "Non-Licensed",
      slug: "non-licensed",
      uiType: "multi-select",
      options: ["generic"]
    },
    {
      name: "Little Brother George",
      slug: "little-brother-george",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/pirates": [
    {
      name: "Treasure Hunt",
      slug: "treasure-hunt",
      uiType: "toggle",
      options: []
    },
    {
      name: "Temporary Tattoos",
      slug: "temporary-tattoos",
      uiType: "toggle",
      options: []
    },
    {
      name: "Eye Patch",
      slug: "eye-patch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parrot Prop",
      slug: "parrot-prop",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/princess-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["generic princess/Elsa style/Anna style/Cinderella style"]
    },
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["2-6/3-8/4-10"]
    },
    {
      name: "Singing Included",
      slug: "singing-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Story Time",
      slug: "story-time",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/sesame-street-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Big Bird/Elmo/Cookie Monster/Oscar"]
    },
    {
      name: "Non-Licensed",
      slug: "non-licensed",
      uiType: "multi-select",
      options: ["generic"]
    },
    {
      name: "Sing Along",
      slug: "sing-along",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hugs",
      slug: "hugs",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/star-wars-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Darth Vader/Stormtrooper/Princess Leia/Jedi"]
    },
    {
      name: "Light Saber",
      slug: "light-saber",
      uiType: "toggle",
      options: []
    },
    {
      name: "Breathe Sound",
      slug: "breathe-sound",
      uiType: "multi-select",
      options: ["Vader"]
    },
    {
      name: "Imperial March",
      slug: "imperial-march",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/superhero-characters": [
    {
      name: "Character Type",
      slug: "character-type",
      uiType: "multi-select",
      options: ["Spider-Man style/Batman style/Wonder Woman style/generic superhero"]
    },
    {
      name: "Web Shooting",
      slug: "web-shooting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Poses",
      slug: "poses",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Ops",
      slug: "photo-ops",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/party-characters/unicorn-characters": [
    {
      name: "Horn",
      slug: "horn",
      uiType: "multi-select",
      options: ["light-up/glitter/standard"]
    },
    {
      name: "Mane Color",
      slug: "mane-color",
      uiType: "multi-select",
      options: ["rainbow/pink/purple/blue"]
    },
    {
      name: "Hooves",
      slug: "hooves",
      uiType: "multi-select",
      options: ["sound effects"]
    },
    {
      name: "Photo Friendly",
      slug: "photo-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/beyonc-trivia": [
    {
      name: "Era",
      slug: "era",
      uiType: "multi-select",
      options: ["Destiny's Child/Dangerously in Love/B'Day/I Am/Sasha/4/Beyoncé/Lemonade/Renaissance/Cowboy Carter"]
    },
    {
      name: "Live Performance Questions",
      slug: "live-performance-questions",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/corporate-trivia-hosts": [
    {
      name: "Team Size",
      slug: "team-size",
      uiType: "multi-select",
      options: ["2-4/4-6/6-8"]
    },
    {
      name: "Company Trivia Included",
      slug: "company-trivia-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Professional vs Fun",
      slug: "professional-vs-fun",
      uiType: "multi-select",
      options: ["balance slider"]
    },
    {
      name: "Prizes Included",
      slug: "prizes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/disney-trivia": [
    {
      name: "Era",
      slug: "era",
      uiType: "multi-select",
      options: ["classic/renaissance/modern/pixar"]
    },
    {
      name: "Song Identification",
      slug: "song-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Character Voicelines",
      slug: "character-voicelines",
      uiType: "toggle",
      options: []
    },
    {
      name: "Park Trivia",
      slug: "park-trivia",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/friends-trivia": [
    {
      name: "Seasons",
      slug: "seasons",
      uiType: "multi-select",
      options: ["1-10"]
    },
    {
      name: "Quote Identification",
      slug: "quote-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Central Perk Questions",
      slug: "central-perk-questions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Stars",
      slug: "guest-stars",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/general-knowledge-trivia-hosts": [
    {
      name: "Round Count",
      slug: "round-count",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Team Size Limit",
      slug: "team-size-limit",
      uiType: "multi-select",
      options: ["2/4/6/8"]
    },
    {
      name: "Visual Rounds",
      slug: "visual-rounds",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audio Rounds",
      slug: "audio-rounds",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/harry-potter-trivia": [
    {
      name: "Book vs Movie",
      slug: "book-vs-movie",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "House Points System",
      slug: "house-points-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spell Identification",
      slug: "spell-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Character Quotes",
      slug: "character-quotes",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/history-trivia": [
    {
      name: "Eras Covered",
      slug: "eras-covered",
      uiType: "multi-select",
      options: ["ancient/medieval/modern/20th century"]
    },
    {
      name: "Difficulty",
      slug: "difficulty",
      uiType: "multi-select",
      options: ["easy/medium/hard"]
    },
    {
      name: "Primary Sources",
      slug: "primary-sources",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/marvel-trivia": [
    {
      name: "MCU Phase",
      slug: "mcu-phase",
      uiType: "multi-select",
      options: ["1/2/3/4/5"]
    },
    {
      name: "Comic vs Movie",
      slug: "comic-vs-movie",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Post-Credits Scenes",
      slug: "post-credits-scenes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stan Lee Cameos",
      slug: "stan-lee-cameos",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/movie-trivia": [
    {
      name: "Franchise Focus",
      slug: "franchise-focus",
      uiType: "multi-select",
      options: ["Marvel/Harry Potter/Star Wars/Disney"]
    },
    {
      name: "Screenshot Rounds",
      slug: "screenshot-rounds",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quote Identification",
      slug: "quote-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Soundtrack Rounds",
      slug: "soundtrack-rounds",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/music-bingo-hosts": [
    {
      name: "Bingo Card Size",
      slug: "bingo-card-size",
      uiType: "multi-select",
      options: ["3x3/4x4/5x5"]
    },
    {
      name: "Clip Length",
      slug: "clip-length",
      uiType: "multi-select",
      options: ["10/15/20 seconds"]
    },
    {
      name: "Multiple Winners",
      slug: "multiple-winners",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prize Support",
      slug: "prize-support",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/music-trivia": [
    {
      name: "Era Focus",
      slug: "era-focus",
      uiType: "multi-select",
      options: ["70s/80s/90s/00s/current"]
    },
    {
      name: "Genre Focus",
      slug: "genre-focus",
      uiType: "multi-select",
      options: ["rock/pop/hip hop/country"]
    },
    {
      name: "Song Clips",
      slug: "song-clips",
      uiType: "toggle",
      options: []
    },
    {
      name: "Name That Tune",
      slug: "name-that-tune",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/pop-culture-trivia": [
    {
      name: "Year Focus",
      slug: "year-focus",
      uiType: "multi-select",
      options: ["current/2000s/90s/80s"]
    },
    {
      name: "Celebrity Gossip",
      slug: "celebrity-gossip",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Trends",
      slug: "social-media-trends",
      uiType: "toggle",
      options: []
    },
    {
      name: "Viral Moments",
      slug: "viral-moments",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/speed-trivia-hosts": [
    {
      name: "Questions Per Hour",
      slug: "questions-per-hour",
      uiType: "multi-select",
      options: ["30/40/50+"]
    },
    {
      name: "Instant Scoring",
      slug: "instant-scoring",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Team Deliberation",
      slug: "no-team-deliberation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Leaderboard",
      slug: "leaderboard",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/sports-trivia": [
    {
      name: "Sports Covered",
      slug: "sports-covered",
      uiType: "multi-select",
      options: ["NFL/NBA/MLB/NHL/NCAA/Soccer"]
    },
    {
      name: "Team Focus",
      slug: "team-focus",
      uiType: "multi-select",
      options: ["homer"]
    },
    {
      name: "Player Stats",
      slug: "player-stats",
      uiType: "toggle",
      options: []
    },
    {
      name: "Highlight Clips",
      slug: "highlight-clips",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/star-wars-trivia": [
    {
      name: "Trilogy",
      slug: "trilogy",
      uiType: "multi-select",
      options: ["original/prequel/sequel/solo"]
    },
    {
      name: "Expanded Universe",
      slug: "expanded-universe",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quote Identification",
      slug: "quote-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lightsaber Sounds",
      slug: "lightsaber-sounds",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/taylor-swift-trivia": [
    {
      name: "Era",
      slug: "era",
      uiType: "multi-select",
      options: ["Taylor/Fearless/Speak Now/Red/1989/Reputation/Lover/Folklore/Evermore/Midnights/TTPD"]
    },
    {
      name: "Secret Songs",
      slug: "secret-songs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Easter Eggs",
      slug: "easter-eggs",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/the-office-trivia": [
    {
      name: "Seasons",
      slug: "seasons",
      uiType: "multi-select",
      options: ["1-9"]
    },
    {
      name: "Quote Identification",
      slug: "quote-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Scene Recreation",
      slug: "scene-recreation",
      uiType: "toggle",
      options: []
    },
    {
      name: "\"That's What She Said\"",
      slug: "thats-what-she-said",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/tv-show-trivia": [
    {
      name: "Show Focus",
      slug: "show-focus",
      uiType: "multi-select",
      options: ["The Office/Friends/Seinfeld/Parks and Rec/Brooklyn 99"]
    },
    {
      name: "Quote Identification",
      slug: "quote-identification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Episode Clips",
      slug: "episode-clips",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/trivia-hosts/virtual-trivia-hosts": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["Zoom/Teams/Webex/Kahoot"]
    },
    {
      name: "Breakout Rooms",
      slug: "breakout-rooms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Screen Share Rounds",
      slug: "screen-share-rounds",
      uiType: "toggle",
      options: []
    },
    {
      name: "Remote Teams",
      slug: "remote-teams",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/club-night-promoters": [
    {
      name: "Night Type",
      slug: "night-type",
      uiType: "multi-select",
      options: ["weekly/ monthly/ one-off"]
    },
    {
      name: "Genre Specialization",
      slug: "genre-specialization",
      uiType: "multi-select",
      options: ["EDM/hip hop/latin/top 40/house"]
    },
    {
      name: "Guest List Management",
      slug: "guest-list-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Promo",
      slug: "social-media-promo",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/comedy-tour-promoters": [
    {
      name: "Comedian Tier",
      slug: "comedian-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Clean Show",
      slug: "clean-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "Adult Show",
      slug: "adult-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "Two Drink Minimum",
      slug: "two-drink-minimum",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/country-concert-promoters": [
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Outdoor Venue",
      slug: "outdoor-venue",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mechanical Bull",
      slug: "mechanical-bull",
      uiType: "toggle",
      options: []
    },
    {
      name: "Line Dancing",
      slug: "line-dancing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/edm-and-dj-concert-promoters": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["house/techno/dubstep/trap/trance"]
    },
    {
      name: "Visual Production",
      slug: "visual-production",
      uiType: "toggle",
      options: []
    },
    {
      name: "Laser Show",
      slug: "laser-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night License",
      slug: "late-night-license",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/festival-promoters": [
    {
      name: "Festival Size",
      slug: "festival-size",
      uiType: "multi-select",
      options: ["under 5k/5k-15k/15k-30k/30k+"]
    },
    {
      name: "Multi-Day Experience",
      slug: "multi-day-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vendor Management",
      slug: "vendor-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Permitting Experience",
      slug: "permitting-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/hip-hop-concert-promoters": [
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Opening Acts",
      slug: "opening-acts",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security Requirements",
      slug: "security-requirements",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Meet & Greet",
      slug: "vip-meet-and-greet",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/jazz-and-blues-concert-promoters": [
    {
      name: "Venue Type",
      slug: "venue-type",
      uiType: "multi-select",
      options: ["club/theater/festival"]
    },
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Dinner Service",
      slug: "dinner-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Listening Room",
      slug: "listening-room",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/latin-concert-promoters": [
    {
      name: "Genre",
      slug: "genre",
      uiType: "multi-select",
      options: ["reggaeton/salsa/bachata/regional Mexican/cumbia"]
    },
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Bilingual Promotion",
      slug: "bilingual-promotion",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/local-concert-promoters": [
    {
      name: "Venues Worked",
      slug: "venues-worked",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Booking Lead Time",
      slug: "booking-lead-time",
      uiType: "multi-select",
      options: ["months"]
    },
    {
      name: "Artist Booking",
      slug: "artist-booking",
      uiType: "multi-select",
      options: ["national/regional/local"]
    },
    {
      name: "Production Coordination",
      slug: "production-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/national-tour-promoters": [
    {
      name: "Tour Radius",
      slug: "tour-radius",
      uiType: "multi-select",
      options: ["US/ North America/ International"]
    },
    {
      name: "Artist Tier",
      slug: "artist-tier",
      uiType: "multi-select",
      options: ["arena/theater/club/festival"]
    },
    {
      name: "Routing Support",
      slug: "routing-support",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hospitality Management",
      slug: "hospitality-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/concert-promoters/rock-concert-promoters": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["indie/metal/punk/alternative/classic rock"]
    },
    {
      name: "All Ages Shows",
      slug: "all-ages-shows",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Merchandise Management",
      slug: "merchandise-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/conference-planners": [
    {
      name: "Attendee Capacity",
      slug: "attendee-capacity",
      uiType: "multi-select",
      options: ["50-200/201-500/501-1000/1000+"]
    },
    {
      name: "Multi-Track Sessions",
      slug: "multi-track-sessions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Exhibitor Management",
      slug: "exhibitor-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Streaming",
      slug: "live-streaming",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/corporate-retreat-planners": [
    {
      name: "Attendee Capacity",
      slug: "attendee-capacity",
      uiType: "multi-select",
      options: ["10-30/31-60/61-100/100+"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["2-3 days/4-5 days/1 week+"]
    },
    {
      name: "Accommodation Booking",
      slug: "accommodation-booking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Team Building Activities",
      slug: "team-building-activities",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/fundraising-and-gala-planners": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["100-250/251-500/501-1000/1000+"]
    },
    {
      name: "Auction Management",
      slug: "auction-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsorship Sales",
      slug: "sponsorship-sales",
      uiType: "toggle",
      options: []
    },
    {
      name: "Donor Stewardship",
      slug: "donor-stewardship",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/holiday-party-planners": [
    {
      name: "Party Size",
      slug: "party-size",
      uiType: "multi-select",
      options: ["20-50/51-100/101-200/200+"]
    },
    {
      name: "Venue Sourcing",
      slug: "venue-sourcing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Entertainment Booking",
      slug: "entertainment-booking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Gift Procurement",
      slug: "gift-procurement",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/incentive-trip-planners": [
    {
      name: "Destination Types",
      slug: "destination-types",
      uiType: "multi-select",
      options: ["beach/city/mountain/resort/adventure"]
    },
    {
      name: "Group Size",
      slug: "group-size",
      uiType: "multi-select",
      options: ["10-25/26-50/51-100/100+"]
    },
    {
      name: "Luxury Accommodations",
      slug: "luxury-accommodations",
      uiType: "toggle",
      options: []
    },
    {
      name: "Activity Planning",
      slug: "activity-planning",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/meeting-and-board-retreat-planners": [
    {
      name: "Meeting Type",
      slug: "meeting-type",
      uiType: "multi-select",
      options: ["board/executive/strategy/training"]
    },
    {
      name: "AV Requirements",
      slug: "av-requirements",
      uiType: "multi-select",
      options: ["basic/premium/custom"]
    },
    {
      name: "Catering Management",
      slug: "catering-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Attendee Travel",
      slug: "attendee-travel",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/product-launch-planners": [
    {
      name: "Launch Type",
      slug: "launch-type",
      uiType: "multi-select",
      options: ["tech/consumer/auto/beauty/entertainment"]
    },
    {
      name: "Media Relations",
      slug: "media-relations",
      uiType: "toggle",
      options: []
    },
    {
      name: "Influencer Management",
      slug: "influencer-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Demo Setup",
      slug: "demo-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/team-building-event-planners": [
    {
      name: "Group Size",
      slug: "group-size",
      uiType: "multi-select",
      options: ["10-30/31-60/61-100/100+"]
    },
    {
      name: "Activity Type",
      slug: "activity-type",
      uiType: "multi-select",
      options: ["escape room/cooking class/outdoor/charity/problem-solving"]
    },
    {
      name: "Facilitator Included",
      slug: "facilitator-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Post-Event Debrief",
      slug: "post-event-debrief",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/trade-show-and-expo-planners": [
    {
      name: "Booth Count",
      slug: "booth-count",
      uiType: "multi-select",
      options: ["20-50/51-100/101-200/200+"]
    },
    {
      name: "Floor Plan Design",
      slug: "floor-plan-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Exhibitor Services",
      slug: "exhibitor-services",
      uiType: "toggle",
      options: []
    },
    {
      name: "Load-In Coordination",
      slug: "load-in-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/corporate-planners/virtual-and-hybrid-event-planners": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["Zoom/Teams/Hopin/ON24/Custom"]
    },
    {
      name: "Attendee Capacity",
      slug: "attendee-capacity",
      uiType: "multi-select",
      options: ["50-250/251-500/501-1000/1000+"]
    },
    {
      name: "Breakout Rooms",
      slug: "breakout-rooms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Recording & Editing",
      slug: "recording-and-editing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/day-of-coordinators/corporate-event-day-of-coordinators": [
    {
      name: "Event Duration",
      slug: "event-duration",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Staff Briefing",
      slug: "staff-briefing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Registration Management",
      slug: "registration-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Speaker Management",
      slug: "speaker-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/day-of-coordinators/independent-day-of-coordinators": [
    {
      name: "Vendor Neutral",
      slug: "vendor-neutral",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outside Vendor Friendly",
      slug: "outside-vendor-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Equipment Kit",
      slug: "equipment-kit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Emergency Backup",
      slug: "emergency-backup",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/day-of-coordinators/party-day-of-coordinators": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Host Interaction",
      slug: "host-interaction",
      uiType: "multi-select",
      options: ["minimal/ moderate/ high"]
    },
    {
      name: "Cleanup Included",
      slug: "cleanup-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setup Included",
      slug: "setup-included",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/day-of-coordinators/wedding-day-of-coordinators": [
    {
      name: "Hours",
      slug: "hours",
      uiType: "multi-select",
      options: ["8/10/12/14+"]
    },
    {
      name: "Rehearsal Attendance",
      slug: "rehearsal-attendance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vendor Confirmations",
      slug: "vendor-confirmations",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timeline Creation",
      slug: "timeline-creation",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/day-of-coordinators/wedding-venue-coordinators": [
    {
      name: "Venue-Specific Only",
      slug: "venue-specific-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Preferred Vendor List",
      slug: "preferred-vendor-list",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setup/Takedown",
      slug: "setup-takedown",
      uiType: "toggle",
      options: []
    },
    {
      name: "Venue Rules Enforcement",
      slug: "venue-rules-enforcement",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/balloon-stylists": [
    {
      name: "Balloon Type",
      slug: "balloon-type",
      uiType: "multi-select",
      options: ["arches/garlands/columns/bouquets/walls/ceiling"]
    },
    {
      name: "Organic Style",
      slug: "organic-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Number Balloons",
      slug: "number-balloons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Letter Balloons",
      slug: "letter-balloons",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/corporate-event-stylists": [
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["minimalist/modern/luxury/branded"]
    },
    {
      name: "Logo Integration",
      slug: "logo-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Brand Colors",
      slug: "brand-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/fabric-and-drapery-stylists": [
    {
      name: "Draping Type",
      slug: "draping-type",
      uiType: "multi-select",
      options: ["ceiling/wall/pipe-and-drape"]
    },
    {
      name: "Fabric Type",
      slug: "fabric-type",
      uiType: "multi-select",
      options: ["polyester/satin/velvet/chiffon/sheer"]
    },
    {
      name: "Lighting Integration",
      slug: "lighting-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Printing",
      slug: "custom-printing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/floral-stylists": [
    {
      name: "Floral Style",
      slug: "floral-style",
      uiType: "multi-select",
      options: ["organic/structured/minimalist/wild"]
    },
    {
      name: "Dried Flowers",
      slug: "dried-flowers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Silk Flowers",
      slug: "silk-flowers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flower Wall",
      slug: "flower-wall",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/lighting-designers": [
    {
      name: "Lighting Type",
      slug: "lighting-type",
      uiType: "multi-select",
      options: ["uplighting/pin spotting/gobo/moonlighting/string lights"]
    },
    {
      name: "Color Changing",
      slug: "color-changing",
      uiType: "toggle",
      options: []
    },
    {
      name: "DMX Control",
      slug: "dmx-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound Activated",
      slug: "sound-activated",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/party-stylists": [
    {
      name: "Theme Expertise",
      slug: "theme-expertise",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Balloon Decor",
      slug: "balloon-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Table Settings",
      slug: "table-settings",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Prop Creation",
      slug: "photo-prop-creation",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/signage-and-stationery-stylists": [
    {
      name: "Signage Type",
      slug: "signage-type",
      uiType: "multi-select",
      options: ["welcome/seating/bar/directional/menu/custom"]
    },
    {
      name: "Materials",
      slug: "materials",
      uiType: "multi-select",
      options: ["acrylic/wood/foam/glass/neon"]
    },
    {
      name: "Calligraphy",
      slug: "calligraphy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Digital Design",
      slug: "digital-design",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/tabletop-and-linens-stylists": [
    {
      name: "Linen Style",
      slug: "linen-style",
      uiType: "multi-select",
      options: ["classic/rustic/modern/luxury"]
    },
    {
      name: "Tableware Style",
      slug: "tableware-style",
      uiType: "multi-select",
      options: ["china/melamine/wood/acrylic"]
    },
    {
      name: "Napkin Folding",
      slug: "napkin-folding",
      uiType: "toggle",
      options: []
    },
    {
      name: "Place Card Design",
      slug: "place-card-design",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/vintage-and-retro-stylists": [
    {
      name: "Era",
      slug: "era",
      uiType: "multi-select",
      options: ["1920s/50s/60s/70s/80s/90s"]
    },
    {
      name: "Authentic Rentals",
      slug: "authentic-rentals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reproductions",
      slug: "reproductions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Props",
      slug: "themed-props",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/event-stylists/wedding-stylists": [
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["modern/rustic/bohemian/vintage/glam/minimalist/eclectic"]
    },
    {
      name: "Color Palette Expertise",
      slug: "color-palette-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mood Board Included",
      slug: "mood-board-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Renderings Provided",
      slug: "renderings-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/budget-wedding-planners": [
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "toggle",
      options: []
    },
    {
      name: "A la Carte Services",
      slug: "a-la-carte-services",
      uiType: "toggle",
      options: []
    },
    {
      name: "DIY Support",
      slug: "diy-support",
      uiType: "toggle",
      options: []
    },
    {
      name: "Micro-Wedding Specialist",
      slug: "micro-wedding-specialist",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/corporate-event-planners": [
    {
      name: "Event Types",
      slug: "event-types",
      uiType: "multi-select",
      options: ["conference/trade show/product launch/retreat/gala/team building"]
    },
    {
      name: "Attendee Capacity",
      slug: "attendee-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "AV & Production Managed",
      slug: "av-and-production-managed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Budget Management",
      slug: "budget-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/destination-wedding-planners": [
    {
      name: "Regions Served",
      slug: "regions-served",
      uiType: "multi-select",
      options: ["Caribbean/Europe/Mexico/Asia/South Pacific/Africa"]
    },
    {
      name: "Site Visit Included",
      slug: "site-visit-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Travel Booking Included",
      slug: "travel-booking-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Local Vendor Network",
      slug: "local-vendor-network",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/elopement-planners": [
    {
      name: "Elopement Types",
      slug: "elopement-types",
      uiType: "multi-select",
      options: ["mountain/beach/courthouse/destination/backyard"]
    },
    {
      name: "Photography Included",
      slug: "photography-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Officiant Coordination",
      slug: "officiant-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Witness Coordination",
      slug: "witness-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/festival-and-large-scale-event-planners": [
    {
      name: "Attendee Capacity",
      slug: "attendee-capacity",
      uiType: "multi-select",
      options: ["500-1k/1k-5k/5k-10k/10k-25k/25k+"]
    },
    {
      name: "Multi-Day Events",
      slug: "multi-day-events",
      uiType: "toggle",
      options: []
    },
    {
      name: "Permitting & Compliance",
      slug: "permitting-and-compliance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vendor Management",
      slug: "vendor-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/lgbtqplus-wedding-planners": [
    {
      name: "Same-Sex Wedding Experience",
      slug: "same-sex-wedding-experience",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Gender-Neutral Terminology",
      slug: "gender-neutral-terminology",
      uiType: "toggle",
      options: []
    },
    {
      name: "Inclusive Vendor Network",
      slug: "inclusive-vendor-network",
      uiType: "toggle",
      options: []
    },
    {
      name: "Legal Documentation Expertise",
      slug: "legal-documentation-expertise",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/luxury-wedding-planners": [
    {
      name: "Minimum Budget",
      slug: "minimum-budget",
      uiType: "multi-select",
      options: ["$50k/$75k/$100k/$150k+"]
    },
    {
      name: "Celebrity Clientele",
      slug: "celebrity-clientele",
      uiType: "toggle",
      options: []
    },
    {
      name: "International Destination Experience",
      slug: "international-destination-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Vendor Network",
      slug: "vip-vendor-network",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/mid-range-wedding-planners": [
    {
      name: "Budget Range",
      slug: "budget-range",
      uiType: "multi-select",
      options: ["$15-25k/$25-35k/$35-50k"]
    },
    {
      name: "Wedding Count",
      slug: "wedding-count",
      uiType: "multi-select",
      options: ["annual"]
    },
    {
      name: "Team Size",
      slug: "team-size",
      uiType: "multi-select",
      options: ["solo/small team/agency"]
    },
    {
      name: "Preferred Vendor Discounts",
      slug: "preferred-vendor-discounts",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/multicultural-event-planners": [
    {
      name: "Cultural Specialization",
      slug: "cultural-specialization",
      uiType: "multi-select",
      options: ["Indian/Latino/Asian/African/Middle Eastern"]
    },
    {
      name: "Religious Ceremony Expertise",
      slug: "religious-ceremony-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multi-Day Event Experience",
      slug: "multi-day-event-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cultural Vendor Network",
      slug: "cultural-vendor-network",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/full-service/nonprofit-and-gala-planners": [
    {
      name: "Donor Stewardship",
      slug: "donor-stewardship",
      uiType: "toggle",
      options: []
    },
    {
      name: "Auction Management",
      slug: "auction-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grant Writing",
      slug: "grant-writing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsor Acquisition",
      slug: "sponsor-acquisition",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/benefit-concert-planners": [
    {
      name: "Artist Booking",
      slug: "artist-booking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ticket Sales",
      slug: "ticket-sales",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsor Management",
      slug: "sponsor-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Production Management",
      slug: "production-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/charity-auction-planners": [
    {
      name: "Auction Type",
      slug: "auction-type",
      uiType: "multi-select",
      options: ["live/silent/virtual/hybrid"]
    },
    {
      name: "Item Procurement",
      slug: "item-procurement",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bidder Management",
      slug: "bidder-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Checkout Services",
      slug: "checkout-services",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/church-fundraising-event-planners": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["dinner/auction/carnival/concert"]
    },
    {
      name: "Congregation Size",
      slug: "congregation-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Volunteer Coordination",
      slug: "volunteer-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Donation Processing",
      slug: "donation-processing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/crowdfunding-event-planners": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["Kickstarter/GoFundMe/Indiegogo/Custom"]
    },
    {
      name: "Campaign Duration",
      slug: "campaign-duration",
      uiType: "multi-select",
      options: ["days"]
    },
    {
      name: "Perk Management",
      slug: "perk-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fulfillment",
      slug: "fulfillment",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/nonprofit-gala-planners": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["100-250/251-500/501-1000/1000+"]
    },
    {
      name: "Donor Stewardship",
      slug: "donor-stewardship",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsor Management",
      slug: "sponsor-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grant Writing",
      slug: "grant-writing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/political-fundraising-event-planners": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["dinner/reception/rally/telethon"]
    },
    {
      name: "Security Requirements",
      slug: "security-requirements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Press Management",
      slug: "press-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "FEC Compliance",
      slug: "fec-compliance",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/school-and-pta-fundraising-planners": [
    {
      name: "Event Type",
      slug: "event-type",
      uiType: "multi-select",
      options: ["carnival/auction/dinner/movie night"]
    },
    {
      name: "Volunteer Management",
      slug: "volunteer-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parent Communication",
      slug: "parent-communication",
      uiType: "toggle",
      options: []
    },
    {
      name: "Student Involvement",
      slug: "student-involvement",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/fundraising-planners/walkathon-and-run-planners": [
    {
      name: "Participant Capacity",
      slug: "participant-capacity",
      uiType: "multi-select",
      options: ["100-500/501-1000/1001-5000/5000+"]
    },
    {
      name: "Route Design",
      slug: "route-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsor Management",
      slug: "sponsor-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timing Services",
      slug: "timing-services",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/bilingual-officiants": [
    {
      name: "Language Pair",
      slug: "language-pair",
      uiType: "multi-select",
      options: ["Spanish/ Polish/ French/ German/ Mandarin/ Tagalog/ Vietnamese"]
    },
    {
      name: "Fluency Level",
      slug: "fluency-level",
      uiType: "multi-select",
      options: ["native/ fluent/ conversational"]
    },
    {
      name: "Dual-Language Script",
      slug: "dual-language-script",
      uiType: "toggle",
      options: []
    },
    {
      name: "Translation Services",
      slug: "translation-services",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/buddhist-officiants": [
    {
      name: "Tradition",
      slug: "tradition",
      uiType: "multi-select",
      options: ["Theravada/Mahayana/Vajrayana/ Zen"]
    },
    {
      name: "Meditation Included",
      slug: "meditation-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Interfaith Ceremonies",
      slug: "interfaith-ceremonies",
      uiType: "toggle",
      options: []
    },
    {
      name: "Blessing Ceremony",
      slug: "blessing-ceremony",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/christian-officiants": [
    {
      name: "Denomination",
      slug: "denomination",
      uiType: "multi-select",
      options: ["Catholic/Protestant/Orthodox/Non-denominational"]
    },
    {
      name: "Pre-Marital Counseling Required",
      slug: "pre-marital-counseling-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Church Ceremony Only",
      slug: "church-ceremony-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Interfaith Experience",
      slug: "interfaith-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/civil-officiants": [
    {
      name: "Legal Authority",
      slug: "legal-authority",
      uiType: "multi-select",
      options: ["state/county/city"]
    },
    {
      name: "Courthouse Ceremony",
      slug: "courthouse-ceremony",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mobile Ceremony",
      slug: "mobile-ceremony",
      uiType: "toggle",
      options: []
    },
    {
      name: "Witnesses Provided",
      slug: "witnesses-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/destination-wedding-officiants": [
    {
      name: "Regions Served",
      slug: "regions-served",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Travel Fee",
      slug: "travel-fee",
      uiType: "multi-select",
      options: ["included/ additional"]
    },
    {
      name: "Legal Marriage Abroad",
      slug: "legal-marriage-abroad",
      uiType: "toggle",
      options: []
    },
    {
      name: "Witness Coordination",
      slug: "witness-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/hindu-officiants": [
    {
      name: "Regional Tradition",
      slug: "regional-tradition",
      uiType: "multi-select",
      options: ["North/South/East/West"]
    },
    {
      name: "Sanskrit Fluency",
      slug: "sanskrit-fluency",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multi-Day Ceremonies",
      slug: "multi-day-ceremonies",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vedic Expertise",
      slug: "vedic-expertise",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/interfaith-officiants": [
    {
      name: "Religions Accommodated",
      slug: "religions-accommodated",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Multi-Faith Ceremony Design",
      slug: "multi-faith-ceremony-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cultural Sensitivity Training",
      slug: "cultural-sensitivity-training",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Vows",
      slug: "custom-vows",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/jewish-officiants": [
    {
      name: "Movement",
      slug: "movement",
      uiType: "multi-select",
      options: ["Reform/Conservative/Orthodox/Renewal"]
    },
    {
      name: "Hebrew Fluency",
      slug: "hebrew-fluency",
      uiType: "toggle",
      options: []
    },
    {
      name: "Interfaith Ceremonies",
      slug: "interfaith-ceremonies",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ketubah Signing",
      slug: "ketubah-signing",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/lgbtqplus-affirming-officiants": [
    {
      name: "Same-Sex Experience",
      slug: "same-sex-experience",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Gender-Neutral Language",
      slug: "gender-neutral-language",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pronoun Accommodation",
      slug: "pronoun-accommodation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Inclusive Vows",
      slug: "inclusive-vows",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/military-officiants": [
    {
      name: "Branch",
      slug: "branch",
      uiType: "multi-select",
      options: ["Army/Navy/Air Force/Marines/Coast Guard/Veteran"]
    },
    {
      name: "Uniform Option",
      slug: "uniform-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Base Access",
      slug: "base-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Deployment Experience",
      slug: "deployment-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/muslim-officiants": [
    {
      name: "Madhab",
      slug: "madhab",
      uiType: "multi-select",
      options: ["Hanafi/Maliki/Shafi'i/Hanbali"]
    },
    {
      name: "Nikah Only",
      slug: "nikah-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Interfaith Marriages",
      slug: "interfaith-marriages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Arabic Recitation",
      slug: "arabic-recitation",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/secular-officiants": [
    {
      name: "Humanist Society Certified",
      slug: "humanist-society-certified",
      uiType: "toggle",
      options: []
    },
    {
      name: "Non-Religious Script",
      slug: "non-religious-script",
      uiType: "toggle",
      options: []
    },
    {
      name: "Personalized Ceremony",
      slug: "personalized-ceremony",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Religious References",
      slug: "no-religious-references",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/sikh-officiants": [
    {
      name: "Gurdwara Ceremony",
      slug: "gurdwara-ceremony",
      uiType: "toggle",
      options: []
    },
    {
      name: "Anand Karaj",
      slug: "anand-karaj",
      uiType: "toggle",
      options: []
    },
    {
      name: "Punjabi Fluency",
      slug: "punjabi-fluency",
      uiType: "toggle",
      options: []
    },
    {
      name: "Langar Arrangement",
      slug: "langar-arrangement",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/officiants/spiritual-officiants": [
    {
      name: "Spirituality Type",
      slug: "spirituality-type",
      uiType: "multi-select",
      options: ["nature-based/ universalist/ new age"]
    },
    {
      name: "Custom Ceremony",
      slug: "custom-ceremony",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ritual Elements",
      slug: "ritual-elements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Energy Work",
      slug: "energy-work",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/adult-birthday-planners": [
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "multi-select",
      options: ["full/cash/BYOB"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night Hours",
      slug: "late-night-hours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/anniversary-party-planners": [
    {
      name: "Years",
      slug: "years",
      uiType: "multi-select",
      options: ["1/5/10/25/50+"]
    },
    {
      name: "Vow Renewal Option",
      slug: "vow-renewal-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Romantic Packages",
      slug: "romantic-packages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Champagne Toast",
      slug: "champagne-toast",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/baby-shower-planners": [
    {
      name: "Theme",
      slug: "theme",
      uiType: "multi-select",
      options: ["gender neutral/ boy/girl/ surprise"]
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Included",
      slug: "cake-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Games Planned",
      slug: "games-planned",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/bachelor-party-planners": [
    {
      name: "Party Type",
      slug: "party-type",
      uiType: "multi-select",
      options: ["bar crawl/golf trip/outdoor adventure/weekend getaway"]
    },
    {
      name: "Transportation Included",
      slug: "transportation-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Activity Booking",
      slug: "activity-booking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Accommodation Booking",
      slug: "accommodation-booking",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/bachelorette-party-planners": [
    {
      name: "Party Type",
      slug: "party-type",
      uiType: "multi-select",
      options: ["bar crawl/spa day/paint and sip/weekend getaway"]
    },
    {
      name: "Transportation Included",
      slug: "transportation-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Goody Bags",
      slug: "goody-bags",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/bridal-shower-planners": [
    {
      name: "Theme",
      slug: "theme",
      uiType: "multi-select",
      options: ["traditional/ brunch/ tea/ destination"]
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Included",
      slug: "cake-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Favors Included",
      slug: "favors-included",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/divorce-party-planners": [
    {
      name: "Theme",
      slug: "theme",
      uiType: "multi-select",
      options: ["\"uncoupling\"/ \"freedom\"/ \"new chapter\""]
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Included",
      slug: "cake-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Games",
      slug: "themed-games",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/graduation-party-planners": [
    {
      name: "Level",
      slug: "level",
      uiType: "multi-select",
      options: ["high school/college/graduate school"]
    },
    {
      name: "AV for Slideshow",
      slug: "av-for-slideshow",
      uiType: "toggle",
      options: []
    },
    {
      name: "Class Photo Area",
      slug: "class-photo-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering",
      slug: "catering",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/kids-birthday-planners": [
    {
      name: "Age Group",
      slug: "age-group",
      uiType: "multi-select",
      options: ["1-4/5-8/9-12"]
    },
    {
      name: "Party Host Included",
      slug: "party-host-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Entertainment",
      slug: "entertainment",
      uiType: "multi-select",
      options: ["character/magician/face painter/bubble show"]
    },
    {
      name: "Goody Bags Included",
      slug: "goody-bags-included",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/milestone-birthday-planners": [
    {
      name: "Themed Decor",
      slug: "themed-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Memory Table",
      slug: "memory-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Special Guest Appearance",
      slug: "special-guest-appearance",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/retirement-party-planners": [
    {
      name: "Memory Table",
      slug: "memory-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "AV for Tribute Video",
      slug: "av-for-tribute-video",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Book",
      slug: "guest-book",
      uiType: "toggle",
      options: []
    },
    {
      name: "Retirement Gifts",
      slug: "retirement-gifts",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/surprise-party-planners": [
    {
      name: "Secrecy Guarantee",
      slug: "secrecy-guarantee",
      uiType: "toggle",
      options: []
    },
    {
      name: "Distraction Management",
      slug: "distraction-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Coordination",
      slug: "guest-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photographer Included",
      slug: "photographer-included",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/party-planners/teen-birthday-planners": [
    {
      name: "Venue Type",
      slug: "venue-type",
      uiType: "multi-select",
      options: ["home/park/rental hall/activity center"]
    },
    {
      name: "DJ Included",
      slug: "dj-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chaperone Coordination",
      slug: "chaperone-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Booth",
      slug: "photo-booth",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/cultural-wedding-planners": [
    {
      name: "Traditions Specialized",
      slug: "traditions-specialized",
      uiType: "multi-select",
      options: ["Jewish/Indian/Chinese/Vietnamese/Nigerian/Persian/Armenian/Greek/Italian"]
    },
    {
      name: "Religious Ceremony Expertise",
      slug: "religious-ceremony-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multi-Day Event Experience",
      slug: "multi-day-event-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cultural Vendor Network",
      slug: "cultural-vendor-network",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/day-of-wedding-coordinators": [
    {
      name: "Ceremony Only",
      slug: "ceremony-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reception Only",
      slug: "reception-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Both",
      slug: "both",
      uiType: "toggle",
      options: []
    },
    {
      name: "Assistant Coordinator",
      slug: "assistant-coordinator",
      uiType: "multi-select",
      options: ["included/ optional/ none"]
    }
  ],
  "event-planning-services/wedding-planners/destination-wedding-planners": [
    {
      name: "Regions Served",
      slug: "regions-served",
      uiType: "multi-select",
      options: ["Caribbean/Europe/Mexico/Asia/South Pacific/Africa"]
    },
    {
      name: "Site Visit Included",
      slug: "site-visit-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Travel Booking Included",
      slug: "travel-booking-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Local Vendor Network",
      slug: "local-vendor-network",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/elopement-planners": [
    {
      name: "Elopement Types",
      slug: "elopement-types",
      uiType: "multi-select",
      options: ["mountain/beach/courthouse/destination/backyard"]
    },
    {
      name: "Photography Included",
      slug: "photography-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Officiant Coordination",
      slug: "officiant-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Witness Coordination",
      slug: "witness-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/full-service-wedding-planners": [
    {
      name: "Wedding Count",
      slug: "wedding-count",
      uiType: "multi-select",
      options: ["annual 10-20/21-40/41-60/60+"]
    },
    {
      name: "Vendor Negotiation",
      slug: "vendor-negotiation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Budget Tracking",
      slug: "budget-tracking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timeline Management",
      slug: "timeline-management",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/micro-wedding-planners": [
    {
      name: "Guest Count Max",
      slug: "guest-count-max",
      uiType: "multi-select",
      options: ["20/30/40/50"]
    },
    {
      name: "Intimate Venue Network",
      slug: "intimate-venue-network",
      uiType: "toggle",
      options: []
    },
    {
      name: "Elopement Packages",
      slug: "elopement-packages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weekday Discount",
      slug: "weekday-discount",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/month-of-wedding-planners": [
    {
      name: "Month-of Coordination Only",
      slug: "month-of-coordination-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Venue Walkthrough Included",
      slug: "venue-walkthrough-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rehearsal Attendance",
      slug: "rehearsal-attendance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Day-of Emergency Kit",
      slug: "day-of-emergency-kit",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/partial-wedding-planners": [
    {
      name: "Hours Per Month",
      slug: "hours-per-month",
      uiType: "multi-select",
      options: ["5-10/11-20/21-30/30+"]
    },
    {
      name: "Starting Point",
      slug: "starting-point",
      uiType: "multi-select",
      options: ["venue selected/ vendors booked/ day only"]
    },
    {
      name: "Vendor Referrals",
      slug: "vendor-referrals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Design Consultation",
      slug: "design-consultation",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/wedding-budget-planners": [
    {
      name: "Budget Management Software",
      slug: "budget-management-software",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vendor Payment Tracking",
      slug: "vendor-payment-tracking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Negotiation Services",
      slug: "negotiation-services",
      uiType: "toggle",
      options: []
    },
    {
      name: "Savings Finder",
      slug: "savings-finder",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/wedding-designers-and-stylists": [
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["modern/rustic/bohemian/vintage/glam/minimalist"]
    },
    {
      name: "Color Palette Expertise",
      slug: "color-palette-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mood Board Included",
      slug: "mood-board-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Renderings Provided",
      slug: "renderings-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "event-planning-services/wedding-planners/wedding-vendor-managers": [
    {
      name: "Vendor Count Managed",
      slug: "vendor-count-managed",
      uiType: "multi-select",
      options: ["3-5/6-10/11-15/15+"]
    },
    {
      name: "Communication Hub",
      slug: "communication-hub",
      uiType: "toggle",
      options: []
    },
    {
      name: "Timeline Management",
      slug: "timeline-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Contract Review",
      slug: "contract-review",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/av-technicians": [
    {
      name: "Experience Level",
      slug: "experience-level",
      uiType: "multi-select",
      options: ["junior/mid/senior"]
    },
    {
      name: "System Design Included",
      slug: "system-design-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Load-In/Load-Out",
      slug: "load-in-load-out",
      uiType: "toggle",
      options: []
    },
    {
      name: "Overtime Rate",
      slug: "overtime-rate",
      uiType: "numeric",
      options: []
    }
  ],
  "production-tech/av-sound/hearing-loop-systems": [
    {
      name: "Coverage Area",
      slug: "coverage-area",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Portable",
      slug: "portable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Permanent",
      slug: "permanent",
      uiType: "toggle",
      options: []
    },
    {
      name: "ADA Compliance Certified",
      slug: "ada-compliance-certified",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/line-array-systems": [
    {
      name: "Boxes Per Side",
      slug: "boxes-per-side",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Subwoofers",
      slug: "subwoofers",
      uiType: "multi-select",
      options: ["4/6/8+"]
    },
    {
      name: "Processing",
      slug: "processing",
      uiType: "multi-select",
      options: ["DSP"]
    },
    {
      name: "Rigging Included",
      slug: "rigging-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/live-sound-mixing": [
    {
      name: "Console Type",
      slug: "console-type",
      uiType: "multi-select",
      options: ["digital/analog"]
    },
    {
      name: "Channel Count",
      slug: "channel-count",
      uiType: "multi-select",
      options: ["16/24/32/48"]
    },
    {
      name: "Effects",
      slug: "effects",
      uiType: "multi-select",
      options: ["reverb/delay/compression"]
    },
    {
      name: "Recording Included",
      slug: "recording-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/live-streaming-setups": [
    {
      name: "Camera Count",
      slug: "camera-count",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Encoder",
      slug: "encoder",
      uiType: "multi-select",
      options: ["hardware/software"]
    },
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["YouTube/Facebook/Custom"]
    },
    {
      name: "CDN Included",
      slug: "cdn-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/monitor-speakers": [
    {
      name: "Wedge Count",
      slug: "wedge-count",
      uiType: "multi-select",
      options: ["2/4/6/8+"]
    },
    {
      name: "Mix Type",
      slug: "mix-type",
      uiType: "multi-select",
      options: ["mono/stereo"]
    },
    {
      name: "Side Fill",
      slug: "side-fill",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drum Fill",
      slug: "drum-fill",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/pa-system-rentals": [
    {
      name: "Speaker Size",
      slug: "speaker-size",
      uiType: "multi-select",
      options: ["10\"/12\"/15\"/line array"]
    },
    {
      name: "Mixer Channels",
      slug: "mixer-channels",
      uiType: "multi-select",
      options: ["4/8/12/16/24+"]
    },
    {
      name: "Mic Count",
      slug: "mic-count",
      uiType: "multi-select",
      options: ["2/4/6/8+"]
    },
    {
      name: "Subwoofer",
      slug: "subwoofer",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/recording-services": [
    {
      name: "Multi-Track Channels",
      slug: "multi-track-channels",
      uiType: "multi-select",
      options: ["8/16/24/32"]
    },
    {
      name: "Format",
      slug: "format",
      uiType: "multi-select",
      options: ["WAV/MP3"]
    },
    {
      name: "Mixdown Included",
      slug: "mixdown-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mastered",
      slug: "mastered",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/sound-system-for-ceremonies": [
    {
      name: "Outdoor Rated",
      slug: "outdoor-rated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Battery Powered",
      slug: "battery-powered",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coverage Area",
      slug: "coverage-area",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Wind Screens",
      slug: "wind-screens",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/sound-system-for-concerts": [
    {
      name: "SPL Max",
      slug: "spl-max",
      uiType: "multi-select",
      options: ["dB"]
    },
    {
      name: "Subwoofer Count",
      slug: "subwoofer-count",
      uiType: "multi-select",
      options: ["2/4/6/8+"]
    },
    {
      name: "Monitor Mixes",
      slug: "monitor-mixes",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Sound Engineer Included",
      slug: "sound-engineer-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/sound-system-for-corporate-events": [
    {
      name: "Wireless Lapel Mics",
      slug: "wireless-lapel-mics",
      uiType: "multi-select",
      options: ["count"]
    },
    {
      name: "Handheld Mic",
      slug: "handheld-mic",
      uiType: "multi-select",
      options: ["count"]
    },
    {
      name: "Presentation Audio",
      slug: "presentation-audio",
      uiType: "multi-select",
      options: ["laptop hookup"]
    },
    {
      name: "Feedback Prevention",
      slug: "feedback-prevention",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/sound-system-for-parties": [
    {
      name: "DJ Booth Included",
      slug: "dj-booth-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Subwoofer",
      slug: "subwoofer",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bluetooth Input",
      slug: "bluetooth-input",
      uiType: "toggle",
      options: []
    },
    {
      name: "iPhone Compatibility",
      slug: "iphone-compatibility",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/teleprompter-rentals": [
    {
      name: "Prompt Type",
      slug: "prompt-type",
      uiType: "multi-select",
      options: ["floor/camera-mounted"]
    },
    {
      name: "Monitor Size",
      slug: "monitor-size",
      uiType: "multi-select",
      options: ["14\"/15\"/17\"/19\""]
    },
    {
      name: "Operator Included",
      slug: "operator-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Script Format",
      slug: "script-format",
      uiType: "multi-select",
      options: ["Word/PDF"]
    }
  ],
  "production-tech/av-sound/video-projection-and-screen-rentals": [
    {
      name: "Projector Lumens",
      slug: "projector-lumens",
      uiType: "multi-select",
      options: ["5k/10k/15k/20k+"]
    },
    {
      name: "Screen Size",
      slug: "screen-size",
      uiType: "multi-select",
      options: ["6x8/8x10/10x12 ft"]
    },
    {
      name: "Ceiling Mount",
      slug: "ceiling-mount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Laptop Included",
      slug: "laptop-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/av-sound/wireless-microphone-rentals": [
    {
      name: "Mic Count",
      slug: "mic-count",
      uiType: "multi-select",
      options: ["2/4/6/8+"]
    },
    {
      name: "Type",
      slug: "type",
      uiType: "multi-select",
      options: ["lapel/handheld/headset"]
    },
    {
      name: "Frequency Coordination",
      slug: "frequency-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Batteries Included",
      slug: "batteries-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/audio-equipment-rentals": [
    {
      name: "Mic Type",
      slug: "mic-type",
      uiType: "multi-select",
      options: ["shotgun/lavalier/handheld/boom"]
    },
    {
      name: "Recorder Channels",
      slug: "recorder-channels",
      uiType: "multi-select",
      options: ["2/4/6/8"]
    },
    {
      name: "Wireless",
      slug: "wireless",
      uiType: "multi-select",
      options: ["UHF/2.4GHz"]
    },
    {
      name: "Timecode Capable",
      slug: "timecode-capable",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/battery-and-charger-rentals": [
    {
      name: "Battery Type",
      slug: "battery-type",
      uiType: "multi-select",
      options: ["camera/drone/v-mount/gold-mount"]
    },
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "multi-select",
      options: ["mAh"]
    },
    {
      name: "Charger Included",
      slug: "charger-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Available",
      slug: "quantity-available",
      uiType: "numeric",
      options: []
    }
  ],
  "production-tech/camera-rental/camera-body-rentals": [
    {
      name: "Brand",
      slug: "brand",
      uiType: "multi-select",
      options: ["Canon/Sony/Nikon/Fuji/Red/Blackmagic"]
    },
    {
      name: "Sensor Size",
      slug: "sensor-size",
      uiType: "multi-select",
      options: ["full-frame/APS-C/MFT"]
    },
    {
      name: "Resolution",
      slug: "resolution",
      uiType: "multi-select",
      options: ["20MP/30MP/45MP/50MP+"]
    },
    {
      name: "Video Capable",
      slug: "video-capable",
      uiType: "multi-select",
      options: ["4K/6K/8K"]
    }
  ],
  "production-tech/camera-rental/drone-rentals": [
    {
      name: "Drone Model",
      slug: "drone-model",
      uiType: "multi-select",
      options: ["Mavic/Inspire/Matrice/Autel"]
    },
    {
      name: "Camera",
      slug: "camera",
      uiType: "multi-select",
      options: ["4K/6K/8K/thermal"]
    },
    {
      name: "Batteries Included",
      slug: "batteries-included",
      uiType: "multi-select",
      options: ["count"]
    },
    {
      name: "Hard Case Included",
      slug: "hard-case-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/grip-and-support-rentals": [
    {
      name: "Support Type",
      slug: "support-type",
      uiType: "multi-select",
      options: ["tripod/monopod/gimbal/slider/jib"]
    },
    {
      name: "Load Capacity",
      slug: "load-capacity",
      uiType: "multi-select",
      options: ["lbs"]
    },
    {
      name: "Fluid Head",
      slug: "fluid-head",
      uiType: "toggle",
      options: []
    },
    {
      name: "Carbon Fiber",
      slug: "carbon-fiber",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/lens-filter-rentals": [
    {
      name: "Filter Type",
      slug: "filter-type",
      uiType: "multi-select",
      options: ["ND/polarizer/mist/UV/IR"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["67/72/77/82/95mm"]
    },
    {
      name: "Variable ND",
      slug: "variable-nd",
      uiType: "toggle",
      options: []
    },
    {
      name: "Case Included",
      slug: "case-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/lens-rentals": [
    {
      name: "Focal Length",
      slug: "focal-length",
      uiType: "multi-select",
      options: ["14-24/24-70/70-200/200-400/400+"]
    },
    {
      name: "Aperture",
      slug: "aperture",
      uiType: "multi-select",
      options: ["f/1.2/f/1.4/f/2.8/f/4"]
    },
    {
      name: "Mount Type",
      slug: "mount-type",
      uiType: "multi-select",
      options: ["EF/RF/E/Z/F/PL"]
    },
    {
      name: "Image Stabilized",
      slug: "image-stabilized",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/lighting-equipment-rentals": [
    {
      name: "Light Type",
      slug: "light-type",
      uiType: "multi-select",
      options: ["strobe/LED/continuous/HMI"]
    },
    {
      name: "Power",
      slug: "power",
      uiType: "multi-select",
      options: ["200Ws/400Ws/600Ws/1200Ws"]
    },
    {
      name: "Battery Powered",
      slug: "battery-powered",
      uiType: "toggle",
      options: []
    },
    {
      name: "Modifiers Included",
      slug: "modifiers-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/memory-card-rentals": [
    {
      name: "Card Type",
      slug: "card-type",
      uiType: "multi-select",
      options: ["SD/CFexpress/CF/SDHC"]
    },
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "multi-select",
      options: ["64/128/256/512GB"]
    },
    {
      name: "Speed Rating",
      slug: "speed-rating",
      uiType: "multi-select",
      options: ["V30/V60/V90"]
    },
    {
      name: "Quantity Available",
      slug: "quantity-available",
      uiType: "numeric",
      options: []
    }
  ],
  "production-tech/camera-rental/professional-camera-backpack-rentals": [
    {
      name: "Backpack Type",
      slug: "backpack-type",
      uiType: "multi-select",
      options: ["daypack/roller/backpack"]
    },
    {
      name: "Laptop Sleeve",
      slug: "laptop-sleeve",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rain Cover",
      slug: "rain-cover",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lockable Zippers",
      slug: "lockable-zippers",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/camera-rental/underwater-housing-rentals": [
    {
      name: "Depth Rating",
      slug: "depth-rating",
      uiType: "multi-select",
      options: ["30/60/100/300 ft"]
    },
    {
      name: "Camera Compatibility",
      slug: "camera-compatibility",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Dome Port Included",
      slug: "dome-port-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Leak Detector",
      slug: "leak-detector",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-concert-coverage": [
    {
      name: "Stage Aerial",
      slug: "stage-aerial",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Shots",
      slug: "crowd-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Performance Footage",
      slug: "performance-footage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audio Sync",
      slug: "audio-sync",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-corporate-event-coverage": [
    {
      name: "Facility Exterior",
      slug: "facility-exterior",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Shots",
      slug: "crowd-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Establishing Shots",
      slug: "establishing-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "B-Roll Package",
      slug: "b-roll-package",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-festival-coverage": [
    {
      name: "Stage Aerial",
      slug: "stage-aerial",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Sweeps",
      slug: "crowd-sweeps",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setup/Takedown Time Lapse",
      slug: "setup-takedown-time-lapse",
      uiType: "toggle",
      options: []
    },
    {
      name: "Media Pass Experience",
      slug: "media-pass-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-only-packages": [
    {
      name: "Aerial Only",
      slug: "aerial-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Ground Camera",
      slug: "no-ground-camera",
      uiType: "toggle",
      options: []
    },
    {
      name: "Editing Included",
      slug: "editing-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Raw Footage Included",
      slug: "raw-footage-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-real-estate-photography": [
    {
      name: "Property Exterior",
      slug: "property-exterior",
      uiType: "toggle",
      options: []
    },
    {
      name: "Neighborhood Context",
      slug: "neighborhood-context",
      uiType: "toggle",
      options: []
    },
    {
      name: "Roof Inspection",
      slug: "roof-inspection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Twilight Shots",
      slug: "twilight-shots",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-sunset-shots": [
    {
      name: "Golden Hour Scheduling",
      slug: "golden-hour-scheduling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Location Scouting",
      slug: "location-scouting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple Batteries",
      slug: "multiple-batteries",
      uiType: "toggle",
      options: []
    },
    {
      name: "Edited Reel",
      slug: "edited-reel",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/drone-wedding-photography": [
    {
      name: "FAA Part 107 Certified",
      slug: "faa-part-107-certified",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flight Time",
      slug: "flight-time",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Drone Type",
      slug: "drone-type",
      uiType: "multi-select",
      options: ["Mavic/Inspire/Matrice"]
    },
    {
      name: "Weather Policy",
      slug: "weather-policy",
      uiType: "multi-select",
      options: ["reschedule/refund"]
    }
  ],
  "production-tech/drone/drone-wedding-videography": [
    {
      name: "Slow Motion",
      slug: "slow-motion",
      uiType: "multi-select",
      options: ["60/120fps"]
    },
    {
      name: "Subject Tracking",
      slug: "subject-tracking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ground Crew",
      slug: "ground-crew",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/drone/faa-part-107-certified-drone-pilots": [
    {
      name: "License Number",
      slug: "license-number",
      uiType: "multi-select",
      options: ["provided"]
    },
    {
      name: "Insurance Included",
      slug: "insurance-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flight Log Available",
      slug: "flight-log-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Recurrent Training",
      slug: "recurrent-training",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/black-light-uv-lighting": [
    {
      name: "Light Count",
      slug: "light-count",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Coverage",
      slug: "coverage",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Wattage",
      slug: "wattage",
      uiType: "multi-select",
      options: ["50/100/200W"]
    },
    {
      name: "Stands Included",
      slug: "stands-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/catwalks-and-runways": [
    {
      name: "Runway Length",
      slug: "runway-length",
      uiType: "multi-select",
      options: ["20/30/40/50+ ft"]
    },
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["12\"/18\"/24\""]
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Curtains",
      slug: "curtains",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/chandelier-and-crystal-lighting": [
    {
      name: "Chandelier Size",
      slug: "chandelier-size",
      uiType: "multi-select",
      options: ["2ft/3ft/4ft/5ft+"]
    },
    {
      name: "Crystal Type",
      slug: "crystal-type",
      uiType: "multi-select",
      options: ["glass/acrylic"]
    },
    {
      name: "Motorized Lift",
      slug: "motorized-lift",
      uiType: "toggle",
      options: []
    },
    {
      name: "Installation Included",
      slug: "installation-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/concert-lighting": [
    {
      name: "Truss Required",
      slug: "truss-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Designer Included",
      slug: "lighting-designer-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Console",
      slug: "console",
      uiType: "multi-select",
      options: ["GrandMA/Chamsys/ONYX"]
    },
    {
      name: "Programming Time",
      slug: "programming-time",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "production-tech/lighting-stage/dance-floor-lighting": [
    {
      name: "Moving Heads",
      slug: "moving-heads",
      uiType: "multi-select",
      options: ["2/4/6/8+"]
    },
    {
      name: "Laser Type",
      slug: "laser-type",
      uiType: "multi-select",
      options: ["red/green/RGB"]
    },
    {
      name: "Strobe Included",
      slug: "strobe-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound Activated",
      slug: "sound-activated",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/gobo-and-monogram-lighting": [
    {
      name: "Custom Gobo Design",
      slug: "custom-gobo-design",
      uiType: "multi-select",
      options: ["included/extra"]
    },
    {
      name: "Projector Type",
      slug: "projector-type",
      uiType: "multi-select",
      options: ["LED/standard"]
    },
    {
      name: "Focus Range",
      slug: "focus-range",
      uiType: "multi-select",
      options: ["distance"]
    },
    {
      name: "Colors Available",
      slug: "colors-available",
      uiType: "multi-select",
      options: ["1/2/3+"]
    }
  ],
  "production-tech/lighting-stage/led-dance-floors": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["10x10/12x12/15x15/20x20 sq ft"]
    },
    {
      name: "Color Changing",
      slug: "color-changing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound Activated",
      slug: "sound-activated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Patterns",
      slug: "custom-patterns",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/mirror-ball-and-disco-lighting": [
    {
      name: "Mirror Ball Size",
      slug: "mirror-ball-size",
      uiType: "multi-select",
      options: ["12\"/16\"/20\"/24\""]
    },
    {
      name: "Motorized",
      slug: "motorized",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spot Light Included",
      slug: "spot-light-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pin Spot",
      slug: "pin-spot",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/moonlighting": [
    {
      name: "Fabric Included",
      slug: "fabric-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Light Dimmers",
      slug: "light-dimmers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stars Effect",
      slug: "stars-effect",
      uiType: "toggle",
      options: []
    },
    {
      name: "Installation Time",
      slug: "installation-time",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "production-tech/lighting-stage/pin-spotting": [
    {
      name: "Spot Count",
      slug: "spot-count",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Focusable",
      slug: "focusable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Battery Operated",
      slug: "battery-operated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Warm White Only",
      slug: "warm-white-only",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/stage-lighting": [
    {
      name: "Front Wash",
      slug: "front-wash",
      uiType: "multi-select",
      options: ["LED/ellipsoidal"]
    },
    {
      name: "Backlight",
      slug: "backlight",
      uiType: "multi-select",
      options: ["LED"]
    },
    {
      name: "Spotlights",
      slug: "spotlights",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Follow Spot",
      slug: "follow-spot",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/stage-risers-and-platforms": [
    {
      name: "Platform Size",
      slug: "platform-size",
      uiType: "multi-select",
      options: ["4x4/4x8/6x8/8x8 ft"]
    },
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["6\"/12\"/18\"/24\"/36\""]
    },
    {
      name: "Carpet Included",
      slug: "carpet-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ramp Available",
      slug: "ramp-available",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/staging-for-bands": [
    {
      name: "Drum Riser",
      slug: "drum-riser",
      uiType: "multi-select",
      options: ["8x8/8x10/10x10"]
    },
    {
      name: "Monitor Mixes",
      slug: "monitor-mixes",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Backline Power",
      slug: "backline-power",
      uiType: "toggle",
      options: []
    },
    {
      name: "Snake Cables",
      slug: "snake-cables",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/string-and-bistro-lighting": [
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["50/100/150/200+ ft"]
    },
    {
      name: "Bulb Type",
      slug: "bulb-type",
      uiType: "multi-select",
      options: ["globe/Edison/vintage"]
    },
    {
      name: "Dimmer Included",
      slug: "dimmer-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pole Rental",
      slug: "pole-rental",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/truss-and-rigging": [
    {
      name: "Truss Type",
      slug: "truss-type",
      uiType: "multi-select",
      options: ["global/square/triangle"]
    },
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["10/20/30/40+ ft"]
    },
    {
      name: "Motors",
      slug: "motors",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Safety Cables",
      slug: "safety-cables",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/lighting-stage/uplighting": [
    {
      name: "Light Count",
      slug: "light-count",
      uiType: "multi-select",
      options: ["6/8/10/12+"]
    },
    {
      name: "Color Range",
      slug: "color-range",
      uiType: "multi-select",
      options: ["RGB/RGBW"]
    },
    {
      name: "DMX Controllable",
      slug: "dmx-controllable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wireless",
      slug: "wireless",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/360-photo-booths": [
    {
      name: "Video Length",
      slug: "video-length",
      uiType: "multi-select",
      options: ["10/15/20 sec"]
    },
    {
      name: "Slow Motion",
      slug: "slow-motion",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Sharing",
      slug: "social-sharing",
      uiType: "multi-select",
      options: ["text/email/QR"]
    },
    {
      name: "Branding Overlay",
      slug: "branding-overlay",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/birthday-party-photo-booths": [
    {
      name: "Age Number Props",
      slug: "age-number-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Birthday Sash/Props",
      slug: "birthday-sash-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Strip Design",
      slug: "custom-strip-design",
      uiType: "multi-select",
      options: ["happy birthday"]
    },
    {
      name: "Themed Backdrops",
      slug: "themed-backdrops",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/corporate-event-photo-booths": [
    {
      name: "Logo Overlay",
      slug: "logo-overlay",
      uiType: "toggle",
      options: []
    },
    {
      name: "Branded Backdrop",
      slug: "branded-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Data Capture",
      slug: "data-capture",
      uiType: "multi-select",
      options: ["email/phone"]
    },
    {
      name: "Enterprise Security",
      slug: "enterprise-security",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/enclosed-photo-booths": [
    {
      name: "Privacy Curtain",
      slug: "privacy-curtain",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seating",
      slug: "seating",
      uiType: "multi-select",
      options: ["stool/bench"]
    },
    {
      name: "Print Quality",
      slug: "print-quality",
      uiType: "multi-select",
      options: ["dye-sub"]
    },
    {
      name: "Strip Design",
      slug: "strip-design",
      uiType: "multi-select",
      options: ["customizable"]
    }
  ],
  "production-tech/photo-booths/gif-photo-booths": [
    {
      name: "GIF Length",
      slug: "gif-length",
      uiType: "multi-select",
      options: ["3/4/5 sec"]
    },
    {
      name: "Loop Style",
      slug: "loop-style",
      uiType: "multi-select",
      options: ["bounce/straight"]
    },
    {
      name: "Text Overlay",
      slug: "text-overlay",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Ready",
      slug: "social-ready",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/glitter-and-confetti-photo-booths": [
    {
      name: "Glitter Type",
      slug: "glitter-type",
      uiType: "multi-select",
      options: ["biodegradable/synthetic"]
    },
    {
      name: "Confetti Cannon",
      slug: "confetti-cannon",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cleanup Included",
      slug: "cleanup-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Only",
      slug: "outdoor-only",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/green-screen-photo-booths": [
    {
      name: "Background Options",
      slug: "background-options",
      uiType: "multi-select",
      options: ["10/20/30+"]
    },
    {
      name: "Custom Background Design",
      slug: "custom-background-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chroma Key Quality",
      slug: "chroma-key-quality",
      uiType: "multi-select",
      options: ["professional"]
    },
    {
      name: "Still Image vs Video",
      slug: "still-image-vs-video",
      uiType: "multi-select",
      options: ["both"]
    }
  ],
  "production-tech/photo-booths/halo-ring-light-photo-booths": [
    {
      name: "Ring Light Size",
      slug: "ring-light-size",
      uiType: "multi-select",
      options: ["14\"/18\"/24\""]
    },
    {
      name: "Dimmable",
      slug: "dimmable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Temp Adjust",
      slug: "color-temp-adjust",
      uiType: "toggle",
      options: []
    },
    {
      name: "Phone Mount",
      slug: "phone-mount",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/ipad-photo-booths": [
    {
      name: "iPad Generation",
      slug: "ipad-generation",
      uiType: "multi-select",
      options: ["included/client provides"]
    },
    {
      name: "Stand Type",
      slug: "stand-type",
      uiType: "multi-select",
      options: ["tripod/floor"]
    },
    {
      name: "App Included",
      slug: "app-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Printer Optional",
      slug: "printer-optional",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/mirror-photo-booths": [
    {
      name: "Touchscreen Size",
      slug: "touchscreen-size",
      uiType: "multi-select",
      options: ["22\"/32\"/43\""]
    },
    {
      name: "Animated Instructions",
      slug: "animated-instructions",
      uiType: "toggle",
      options: []
    },
    {
      name: "Signature Pad",
      slug: "signature-pad",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Sharing",
      slug: "social-sharing",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/open-air-photo-booths": [
    {
      name: "Group Capacity",
      slug: "group-capacity",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Backdrop Options",
      slug: "backdrop-options",
      uiType: "multi-select",
      options: ["solid/sequin/floral/green screen"]
    },
    {
      name: "Lighting",
      slug: "lighting",
      uiType: "multi-select",
      options: ["ring light/strobes"]
    },
    {
      name: "Prop Box",
      slug: "prop-box",
      uiType: "multi-select",
      options: ["size"]
    }
  ],
  "production-tech/photo-booths/slow-motion-video-booths": [
    {
      name: "Frame Rate",
      slug: "frame-rate",
      uiType: "multi-select",
      options: ["120/240/480fps"]
    },
    {
      name: "Video Length",
      slug: "video-length",
      uiType: "multi-select",
      options: ["6/8/10 sec"]
    },
    {
      name: "Music Sync",
      slug: "music-sync",
      uiType: "toggle",
      options: []
    },
    {
      name: "Share Ready",
      slug: "share-ready",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/themed-photo-booths": [
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["Christmas/Halloween/80s/Mardi Gras/Hollywood"]
    },
    {
      name: "Prop Box",
      slug: "prop-box",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Backdrop Matching",
      slug: "backdrop-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Customizable",
      slug: "customizable",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photo-booths/vintage-photo-booths": [
    {
      name: "Print Style",
      slug: "print-style",
      uiType: "multi-select",
      options: ["traditional film strip"]
    },
    {
      name: "Black & White Only",
      slug: "black-and-white-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Strap Included",
      slug: "strap-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Authentic",
      slug: "authentic",
      uiType: "multi-select",
      options: ["analog/digital"]
    }
  ],
  "production-tech/photo-booths/wedding-photo-booths": [
    {
      name: "Guest Book Integration",
      slug: "guest-book-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Strip Design",
      slug: "custom-strip-design",
      uiType: "multi-select",
      options: ["wedding colors/names/date"]
    },
    {
      name: "Attendant Included",
      slug: "attendant-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Sharing",
      slug: "social-sharing",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/food-photographers": [
    {
      name: "Plating Style",
      slug: "plating-style",
      uiType: "multi-select",
      options: ["fine dining/casual/family style"]
    },
    {
      name: "Stylist Included",
      slug: "stylist-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Style",
      slug: "lighting-style",
      uiType: "multi-select",
      options: ["natural/studio"]
    },
    {
      name: "Menu Design Included",
      slug: "menu-design-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Package",
      slug: "social-media-package",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/product-photographers": [
    {
      name: "Product Type",
      slug: "product-type",
      uiType: "multi-select",
      options: ["apparel/food/electronics/beauty/hard goods"]
    },
    {
      name: "White Background",
      slug: "white-background",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lifestyle Shots",
      slug: "lifestyle-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "360° Rotation",
      slug: "360-rotation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Amazon Compliance",
      slug: "amazon-compliance",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/real-estate-and-venue-photographers": [
    {
      name: "HDR Experience",
      slug: "hdr-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drone Available",
      slug: "drone-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Twilight Shots",
      slug: "twilight-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Virtual Tours",
      slug: "virtual-tours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Square Footage Max",
      slug: "square-footage-max",
      uiType: "numeric",
      options: []
    },
    {
      name: "Rooms Covered",
      slug: "rooms-covered",
      uiType: "numeric",
      options: []
    }
  ],
  "production-tech/videography/commercial-and-brand-videographers": [
    {
      name: "Video Type",
      slug: "video-type",
      uiType: "multi-select",
      options: ["brand film/product demo/testimonial/explainer"]
    },
    {
      name: "Scriptwriting Included",
      slug: "scriptwriting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Voiceover Included",
      slug: "voiceover-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Talent Casting",
      slug: "talent-casting",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/drone-videographers": [
    {
      name: "FAA Certified",
      slug: "faa-certified",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drone Type",
      slug: "drone-type",
      uiType: "multi-select",
      options: ["Mavic/Inspire/Matrice"]
    },
    {
      name: "Camera Resolution",
      slug: "camera-resolution",
      uiType: "multi-select",
      options: ["4K/6K/8K"]
    },
    {
      name: "Thermal Imaging",
      slug: "thermal-imaging",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/airport-hotels": [
    {
      name: "Shuttle Frequency",
      slug: "shuttle-frequency",
      uiType: "multi-select",
      options: ["every 15/30/60 min"]
    },
    {
      name: "Parking Included",
      slug: "parking-included",
      uiType: "multi-select",
      options: ["yes/no length"]
    },
    {
      name: "24-Hour Front Desk",
      slug: "24-hour-front-desk",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restaurant On-Site",
      slug: "restaurant-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/boutique-hotels": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["<50/50-100"]
    },
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["modern/vintage/eclectic/art deco"]
    },
    {
      name: "Locally Owned",
      slug: "locally-owned",
      uiType: "toggle",
      options: []
    },
    {
      name: "Unique Amenities",
      slug: "unique-amenities",
      uiType: "multi-select",
      options: ["list"]
    }
  ],
  "travel-lodging/hotels/budget-hotels": [
    {
      name: "Price Cap",
      slug: "price-cap",
      uiType: "multi-select",
      options: ["$100/$150/$200"]
    },
    {
      name: "Basic Amenities",
      slug: "basic-amenities",
      uiType: "multi-select",
      options: ["wi-fi/parking/breakfast"]
    },
    {
      name: "No Resort Fee",
      slug: "no-resort-fee",
      uiType: "toggle",
      options: []
    },
    {
      name: "Location",
      slug: "location",
      uiType: "multi-select",
      options: ["central/outskirts"]
    }
  ],
  "travel-lodging/hotels/business-hotels": [
    {
      name: "Meeting Rooms",
      slug: "meeting-rooms",
      uiType: "multi-select",
      options: ["1-5/6-10/10+"]
    },
    {
      name: "Business Center",
      slug: "business-center",
      uiType: "multi-select",
      options: ["24/7/limited"]
    },
    {
      name: "High-Speed WiFi",
      slug: "high-speed-wifi",
      uiType: "multi-select",
      options: ["included/fee"]
    },
    {
      name: "Airport Shuttle",
      slug: "airport-shuttle",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/casino-hotels": [
    {
      name: "Casino Size",
      slug: "casino-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Table Games",
      slug: "table-games",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Slot Machines",
      slug: "slot-machines",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Entertainment",
      slug: "entertainment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dining Options",
      slug: "dining-options",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Non-Smoking Area",
      slug: "non-smoking-area",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/extended-stay-hotels": [
    {
      name: "Kitchenette",
      slug: "kitchenette",
      uiType: "multi-select",
      options: ["full/partial"]
    },
    {
      name: "Weekly Rate Discount",
      slug: "weekly-rate-discount",
      uiType: "multi-select",
      options: ["percentage"]
    },
    {
      name: "Laundry Facilities",
      slug: "laundry-facilities",
      uiType: "multi-select",
      options: ["in-room/on-site"]
    },
    {
      name: "Grocery Service",
      slug: "grocery-service",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/historic-hotels": [
    {
      name: "Year Built",
      slug: "year-built",
      uiType: "multi-select",
      options: ["pre-1900/1900-1920/1920-1940/1940-1960"]
    },
    {
      name: "Historic Registry",
      slug: "historic-registry",
      uiType: "multi-select",
      options: ["local/state/national"]
    },
    {
      name: "Original Features",
      slug: "original-features",
      uiType: "multi-select",
      options: ["lobby/elevator/ballroom"]
    },
    {
      name: "Ghost Stories",
      slug: "ghost-stories",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/hotel-room-blocks-only": [
    {
      name: "Room Block Size",
      slug: "room-block-size",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Attrition Policy",
      slug: "attrition-policy",
      uiType: "multi-select",
      options: ["percentage"]
    },
    {
      name: "Cutoff Date",
      slug: "cutoff-date",
      uiType: "multi-select",
      options: ["days before event"]
    },
    {
      name: "Comp Room Policy",
      slug: "comp-room-policy",
      uiType: "multi-select",
      options: ["1 per X rooms"]
    }
  ],
  "travel-lodging/hotels/hotel-wedding-packages": [
    {
      name: "Package Includes",
      slug: "package-includes",
      uiType: "multi-select",
      options: ["ceremony/reception/room block/food/beverage/florist/DJ"]
    },
    {
      name: "Price Per Guest",
      slug: "price-per-guest",
      uiType: "numeric",
      options: []
    },
    {
      name: "Minimum Guest Count",
      slug: "minimum-guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Room Block Attrition",
      slug: "room-block-attrition",
      uiType: "multi-select",
      options: ["percentage"]
    }
  ],
  "travel-lodging/hotels/luxury-hotels": [
    {
      name: "Star Rating",
      slug: "star-rating",
      uiType: "multi-select",
      options: ["5-star"]
    },
    {
      name: "Amenities",
      slug: "amenities",
      uiType: "multi-select",
      options: ["spa/fine dining/concierge/butler"]
    },
    {
      name: "Price Tier",
      slug: "price-tier",
      uiType: "multi-select",
      options: ["$$$$$"]
    },
    {
      name: "Guest Rating",
      slug: "guest-rating",
      uiType: "multi-select",
      options: ["4.5+"]
    },
    {
      name: "Award Winning",
      slug: "award-winning",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/pet-friendly-hotels": [
    {
      name: "Pet Fee",
      slug: "pet-fee",
      uiType: "multi-select",
      options: ["$25/$50/$75+"]
    },
    {
      name: "Pet Weight Limit",
      slug: "pet-weight-limit",
      uiType: "multi-select",
      options: ["20/40/60/80+ lbs"]
    },
    {
      name: "Pet Amenities",
      slug: "pet-amenities",
      uiType: "multi-select",
      options: ["bed/bowl/treats"]
    },
    {
      name: "Dog Walking Area",
      slug: "dog-walking-area",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/resort-hotels": [
    {
      name: "All-Inclusive",
      slug: "all-inclusive",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spa On-Site",
      slug: "spa-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Golf Course",
      slug: "golf-course",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pools",
      slug: "pools",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Kids Club",
      slug: "kids-club",
      uiType: "toggle",
      options: []
    },
    {
      name: "Adults-Only Area",
      slug: "adults-only-area",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/hotels/wedding-ready-hotels": [
    {
      name: "Indoor Ceremony Space",
      slug: "indoor-ceremony-space",
      uiType: "multi-select",
      options: ["yes/no capacity"]
    },
    {
      name: "Outdoor Ceremony Space",
      slug: "outdoor-ceremony-space",
      uiType: "multi-select",
      options: ["yes/no capacity"]
    },
    {
      name: "Reception Capacity",
      slug: "reception-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Bridal Suite",
      slug: "bridal-suite",
      uiType: "toggle",
      options: []
    },
    {
      name: "On-Site Coordinator",
      slug: "on-site-coordinator",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/conference-room-blocks": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["50-100/101-250/251-500/500+"]
    },
    {
      name: "Convention Center Proximity",
      slug: "convention-center-proximity",
      uiType: "multi-select",
      options: ["<1/1-3/3-5 miles"]
    },
    {
      name: "Shuttle Service",
      slug: "shuttle-service",
      uiType: "multi-select",
      options: ["included/fee/none"]
    },
    {
      name: "Attendee Booking Link",
      slug: "attendee-booking-link",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/corporate-event-room-blocks": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["20-50/51-100/101-200/200+"]
    },
    {
      name: "Hotel Category",
      slug: "hotel-category",
      uiType: "multi-select",
      options: ["luxury/business/mid-range"]
    },
    {
      name: "Corporate Rate",
      slug: "corporate-rate",
      uiType: "multi-select",
      options: ["percentage off"]
    },
    {
      name: "Flexible Cancellation",
      slug: "flexible-cancellation",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/courtesy-room-blocks": [
    {
      name: "Attrition Percentage",
      slug: "attrition-percentage",
      uiType: "multi-select",
      options: ["70%/80%/90%"]
    },
    {
      name: "Release Date",
      slug: "release-date",
      uiType: "multi-select",
      options: ["30/45/60 days out"]
    },
    {
      name: "No Upfront Cost",
      slug: "no-upfront-cost",
      uiType: "toggle",
      options: []
    },
    {
      name: "Attrition Fee",
      slug: "attrition-fee",
      uiType: "multi-select",
      options: ["yes/no if unfilled"]
    }
  ],
  "travel-lodging/room-blocks/family-reunion-room-blocks": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Suite Options",
      slug: "suite-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kitchenette Units",
      slug: "kitchenette-units",
      uiType: "toggle",
      options: []
    },
    {
      name: "Group Activity Space",
      slug: "group-activity-space",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/guaranteed-room-blocks": [
    {
      name: "Upfront Deposit",
      slug: "upfront-deposit",
      uiType: "multi-select",
      options: ["25%/50%/100%"]
    },
    {
      name: "Attrition Percentage",
      slug: "attrition-percentage",
      uiType: "multi-select",
      options: ["90%/95%/100%"]
    },
    {
      name: "Financial Risk",
      slug: "financial-risk",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Best Rate Guarantee",
      slug: "best-rate-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/sports-team-room-blocks": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["10-20/21-40/41-60/60+"]
    },
    {
      name: "Team Rates",
      slug: "team-rates",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Checkout",
      slug: "late-checkout",
      uiType: "toggle",
      options: []
    },
    {
      name: "Equipment Storage",
      slug: "equipment-storage",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/wedding-guest-room-blocks": [
    {
      name: "Room Block Type",
      slug: "room-block-type",
      uiType: "multi-select",
      options: ["courtesy/guaranteed"]
    },
    {
      name: "Rate Discount",
      slug: "rate-discount",
      uiType: "multi-select",
      options: ["10%/15%/20%/25%+"]
    },
    {
      name: "Cutoff Date",
      slug: "cutoff-date",
      uiType: "multi-select",
      options: ["30/45/60 days out"]
    },
    {
      name: "Booking Link",
      slug: "booking-link",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/room-blocks/wedding-room-blocks": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["10-20/21-30/31-50/51-100+"]
    },
    {
      name: "Hotel Category",
      slug: "hotel-category",
      uiType: "multi-select",
      options: ["luxury/mid-range/budget"]
    },
    {
      name: "Attrition Risk",
      slug: "attrition-risk",
      uiType: "multi-select",
      options: ["low/medium/high"]
    },
    {
      name: "Comp Rooms",
      slug: "comp-rooms",
      uiType: "multi-select",
      options: ["1 per 20/25/30/35"]
    }
  ],
  "travel-lodging/vacation-rentals/bachelor-vacation-rentals": [
    {
      name: "Pool Table",
      slug: "pool-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Poker Table",
      slug: "poker-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Grill",
      slug: "outdoor-grill",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Area",
      slug: "bar-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple TVs",
      slug: "multiple-tvs",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/bachelorette-vacation-rentals": [
    {
      name: "Hot Tub",
      slug: "hot-tub",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool",
      slug: "pool",
      uiType: "toggle",
      options: []
    },
    {
      name: "Walk to Bars",
      slug: "walk-to-bars",
      uiType: "multi-select",
      options: ["under 10/10-20 min"]
    },
    {
      name: "Instagram-Worthy Decor",
      slug: "instagram-worthy-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Wall",
      slug: "photo-wall",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/beach-house-rentals": [
    {
      name: "Steps to Beach",
      slug: "steps-to-beach",
      uiType: "multi-select",
      options: ["under 100/100-200/200-500 ft"]
    },
    {
      name: "Outdoor Shower",
      slug: "outdoor-shower",
      uiType: "toggle",
      options: []
    },
    {
      name: "Deck/Patio",
      slug: "deck-patio",
      uiType: "toggle",
      options: []
    },
    {
      name: "Beach Gear Included",
      slug: "beach-gear-included",
      uiType: "multi-select",
      options: ["chairs/umbrella/towels"]
    }
  ],
  "travel-lodging/vacation-rentals/cabin-and-cottage-rentals": [
    {
      name: "Fireplace",
      slug: "fireplace",
      uiType: "multi-select",
      options: ["wood/gas/electric"]
    },
    {
      name: "Hot Tub",
      slug: "hot-tub",
      uiType: "toggle",
      options: []
    },
    {
      name: "Secluded",
      slug: "secluded",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hiking Access",
      slug: "hiking-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pet Friendly",
      slug: "pet-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/corporate-retreat-vacation-rentals": [
    {
      name: "Meeting Space",
      slug: "meeting-space",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "High-Speed WiFi",
      slug: "high-speed-wifi",
      uiType: "multi-select",
      options: ["speed"]
    },
    {
      name: "AV Equipment",
      slug: "av-equipment",
      uiType: "multi-select",
      options: ["projector/screen/sound"]
    },
    {
      name: "Catering Kitchen",
      slug: "catering-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sleeping Capacity",
      slug: "sleeping-capacity",
      uiType: "numeric",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/entire-home-rentals": [
    {
      name: "Bedrooms",
      slug: "bedrooms",
      uiType: "multi-select",
      options: ["1/2/3/4/5/6+"]
    },
    {
      name: "Bathrooms",
      slug: "bathrooms",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "multi-select",
      options: ["500-1000/1000-1500/1500-2000/2000+"]
    },
    {
      name: "Private Yard",
      slug: "private-yard",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/event-friendly-vacation-rentals": [
    {
      name: "Event Fee",
      slug: "event-fee",
      uiType: "multi-select",
      options: ["$250/$500/$1000+"]
    },
    {
      name: "Guest Limit",
      slug: "guest-limit",
      uiType: "multi-select",
      options: ["25/50/75/100+"]
    },
    {
      name: "Noise Ordinance",
      slug: "noise-ordinance",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Parking Capacity",
      slug: "parking-capacity",
      uiType: "multi-select",
      options: ["number of cars"]
    }
  ],
  "travel-lodging/vacation-rentals/historic-home-rentals": [
    {
      name: "Year Built",
      slug: "year-built",
      uiType: "multi-select",
      options: ["pre-1900/1900-1920/1920-1940"]
    },
    {
      name: "Original Features",
      slug: "original-features",
      uiType: "multi-select",
      options: ["fireplace/moldings/hardwood"]
    },
    {
      name: "Modern Updates",
      slug: "modern-updates",
      uiType: "multi-select",
      options: ["kitchen/bath/electrical"]
    },
    {
      name: "Ghost Stories",
      slug: "ghost-stories",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/lakefront-rentals": [
    {
      name: "Private Dock",
      slug: "private-dock",
      uiType: "toggle",
      options: []
    },
    {
      name: "Boat Rental Available",
      slug: "boat-rental-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Swim Platform",
      slug: "swim-platform",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lake View",
      slug: "lake-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water Toys Included",
      slug: "water-toys-included",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/large-group-rentals": [
    {
      name: "Bedrooms",
      slug: "bedrooms",
      uiType: "multi-select",
      options: ["10/12/15/20+"]
    },
    {
      name: "Bathrooms",
      slug: "bathrooms",
      uiType: "multi-select",
      options: ["6/8/10/12+"]
    },
    {
      name: "Dining Capacity",
      slug: "dining-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Commercial Kitchen",
      slug: "commercial-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Event Space",
      slug: "event-space",
      uiType: "multi-select",
      options: ["yes/no sq ft"]
    }
  ],
  "travel-lodging/vacation-rentals/luxury-villa-rentals": [
    {
      name: "Private Pool",
      slug: "private-pool",
      uiType: "toggle",
      options: []
    },
    {
      name: "Staff Included",
      slug: "staff-included",
      uiType: "multi-select",
      options: ["chef/housekeeping/concierge"]
    },
    {
      name: "Bedrooms",
      slug: "bedrooms",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Ocean View",
      slug: "ocean-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Gated",
      slug: "gated",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/pet-friendly-vacation-rentals": [
    {
      name: "Pet Fee",
      slug: "pet-fee",
      uiType: "multi-select",
      options: ["$25/$50/$75+"]
    },
    {
      name: "Fenced Yard",
      slug: "fenced-yard",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pet Weight Limit",
      slug: "pet-weight-limit",
      uiType: "multi-select",
      options: ["20/40/60/80+ lbs"]
    },
    {
      name: "Nearby Dog Park",
      slug: "nearby-dog-park",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/private-room-rentals": [
    {
      name: "Private Bathroom",
      slug: "private-bathroom",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shared Spaces",
      slug: "shared-spaces",
      uiType: "multi-select",
      options: ["kitchen/living/laundry"]
    },
    {
      name: "Host Present",
      slug: "host-present",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lock on Door",
      slug: "lock-on-door",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/vacation-rentals/urban-loft-rentals": [
    {
      name: "Walk Score",
      slug: "walk-score",
      uiType: "multi-select",
      options: ["80+/90+/95+"]
    },
    {
      name: "Exposed Brick",
      slug: "exposed-brick",
      uiType: "toggle",
      options: []
    },
    {
      name: "High Ceilings",
      slug: "high-ceilings",
      uiType: "multi-select",
      options: ["yes/no height"]
    },
    {
      name: "Parking Included",
      slug: "parking-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rooftop Access",
      slug: "rooftop-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/african-american-banquet-halls": [
    {
      name: "DJ Booth Size",
      slug: "dj-booth-size",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Catering Kitchen",
      slug: "catering-kitchen",
      uiType: "multi-select",
      options: ["commercial/warming/ none"]
    },
    {
      name: "Grand Entrance Staircase",
      slug: "grand-entrance-staircase",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/asian-banquet-halls": [
    {
      name: "Dim Sum Available",
      slug: "dim-sum-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Round Tables with Lazy Susans",
      slug: "round-tables-with-lazy-susans",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tea Ceremony Space",
      slug: "tea-ceremony-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Whole Roast Pig Service",
      slug: "whole-roast-pig-service",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/budget-banquet-halls": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["numeric under $30/$30-50/$50-70"]
    },
    {
      name: "BYO Catering Allowed",
      slug: "byo-catering-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "BYO Alcohol Allowed",
      slug: "byo-alcohol-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate Only",
      slug: "hourly-rate-only",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/filipino-banquet-halls": [
    {
      name: "Cocktail Hour Space",
      slug: "cocktail-hour-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Money Dance Area",
      slug: "money-dance-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lechon Service",
      slug: "lechon-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Band Stage",
      slug: "live-band-stage",
      uiType: "multi-select",
      options: ["yes/no size"]
    }
  ],
  "venues-spaces/banquet-halls/large-banquet-halls": [
    {
      name: "Max Capacity",
      slug: "max-capacity",
      uiType: "multi-select",
      options: ["200-300/301-500/501-1000/1000+"]
    },
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Stage Included",
      slug: "stage-included",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Built-in Bar",
      slug: "built-in-bar",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/luxury-banquet-halls": [
    {
      name: "Chandelier Type",
      slug: "chandelier-type",
      uiType: "multi-select",
      options: ["crystal/ modern/ none"]
    },
    {
      name: "Marble Flooring",
      slug: "marble-flooring",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Bridal Suite",
      slug: "private-bridal-suite",
      uiType: "toggle",
      options: []
    },
    {
      name: "Valet Parking Included",
      slug: "valet-parking-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/medium-banquet-halls": [
    {
      name: "Exact Capacity Slider",
      slug: "exact-capacity-slider",
      uiType: "multi-select",
      options: ["100-200"]
    },
    {
      name: "AV Package Included",
      slug: "av-package-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coat Check",
      slug: "coat-check",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tables & Chairs Included",
      slug: "tables-and-chairs-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/mexican-and-latin-banquet-halls": [
    {
      name: "Mariachi Space",
      slug: "mariachi-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Tequila Bar",
      slug: "tequila-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Courtyard",
      slug: "outdoor-courtyard",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/polish-and-eastern-european-banquet-halls": [
    {
      name: "Polka Band Space",
      slug: "polka-band-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vodka Bar",
      slug: "vodka-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Traditional Menu Available",
      slug: "traditional-menu-available",
      uiType: "multi-select",
      options: ["pierogi/kielbasa/bigos"]
    },
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    }
  ],
  "venues-spaces/banquet-halls/small-banquet-halls": [
    {
      name: "Exact Capacity Slider",
      slug: "exact-capacity-slider",
      uiType: "multi-select",
      options: ["20-100"]
    },
    {
      name: "Private Room",
      slug: "private-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restaurant Buyout Available",
      slug: "restaurant-buyout-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Minimum Food & Beverage",
      slug: "minimum-food-and-beverage",
      uiType: "numeric",
      options: []
    }
  ],
  "venues-spaces/banquet-halls/south-asian-banquet-halls": [
    {
      name: "Baraat Space",
      slug: "baraat-space",
      uiType: "multi-select",
      options: ["yes/no outdoor"]
    },
    {
      name: "Mandap Setup Area",
      slug: "mandap-setup-area",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Vegetarian Menu Options",
      slug: "vegetarian-menu-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Kitchen On-Site",
      slug: "catering-kitchen-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/community-centers/affordable-event-spaces": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "multi-select",
      options: ["$0-100/ $101-250/ $251-500"]
    },
    {
      name: "Hours Included",
      slug: "hours-included",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Tables & Chairs Included",
      slug: "tables-and-chairs-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cleaning Fee",
      slug: "cleaning-fee",
      uiType: "multi-select",
      options: ["included/ extra/ none"]
    }
  ],
  "venues-spaces/community-centers/city-run-community-centers": [
    {
      name: "Resident Discount",
      slug: "resident-discount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Proof of Residency Required",
      slug: "proof-of-residency-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Alcohol Allowed",
      slug: "alcohol-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kitchen Access",
      slug: "kitchen-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/community-centers/free-event-spaces": [
    {
      name: "Suggested Donation",
      slug: "suggested-donation",
      uiType: "numeric",
      options: []
    },
    {
      name: "Reservation Required",
      slug: "reservation-required",
      uiType: "multi-select",
      options: ["days in advance"]
    },
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Recurring Events Priority",
      slug: "recurring-events-priority",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/community-centers/nonprofit-community-centers": [
    {
      name: "Donation Requested",
      slug: "donation-requested",
      uiType: "toggle",
      options: []
    },
    {
      name: "Volunteer Opportunities",
      slug: "volunteer-opportunities",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grant-Funded Events",
      slug: "grant-funded-events",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mission Alignment Required",
      slug: "mission-alignment-required",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/community-centers/religious-community-centers": [
    {
      name: "Alcohol Permitted",
      slug: "alcohol-permitted",
      uiType: "toggle",
      options: []
    },
    {
      name: "Friday/Saturday Availability",
      slug: "friday-saturday-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Religious Decor",
      slug: "religious-decor",
      uiType: "multi-select",
      options: ["must stay/ must be covered/ not applicable"]
    },
    {
      name: "Kitchen",
      slug: "kitchen",
      uiType: "multi-select",
      options: ["commercial/ warming/ none"]
    }
  ],
  "venues-spaces/community-centers/school-and-university-community-spaces": [
    {
      name: "Summer Availability Only",
      slug: "summer-availability-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Background Check Required",
      slug: "background-check-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Insurance Required",
      slug: "insurance-required",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "AV Included",
      slug: "av-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/concert-venues/acoustic-and-singer-songwriter-venues": [
    {
      name: "Quiet Policy",
      slug: "quiet-policy",
      uiType: "multi-select",
      options: ["no talking during sets"]
    },
    {
      name: "Listening Room",
      slug: "listening-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "BYOB",
      slug: "byob",
      uiType: "toggle",
      options: []
    },
    {
      name: "Open Mic Nights",
      slug: "open-mic-nights",
      uiType: "multi-select",
      options: ["frequency"]
    }
  ],
  "venues-spaces/concert-venues/arena-and-stadium-venues": [
    {
      name: "Total Capacity",
      slug: "total-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Suites Available",
      slug: "suites-available",
      uiType: "multi-select",
      options: ["yes/no number"]
    },
    {
      name: "Concessions",
      slug: "concessions",
      uiType: "multi-select",
      options: ["number of stands"]
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["number of spaces"]
    }
  ],
  "venues-spaces/concert-venues/blues-clubs": [
    {
      name: "Live Blues Nights",
      slug: "live-blues-nights",
      uiType: "multi-select",
      options: ["frequency"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Whiskey Selection",
      slug: "whiskey-selection",
      uiType: "multi-select",
      options: ["number of brands"]
    },
    {
      name: "Late Night Hours",
      slug: "late-night-hours",
      uiType: "multi-select",
      options: ["until 1am/2am/3am+"]
    }
  ],
  "venues-spaces/concert-venues/country-and-western-venues": [
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Mechanical Bull",
      slug: "mechanical-bull",
      uiType: "toggle",
      options: []
    },
    {
      name: "Line Dancing Lessons",
      slug: "line-dancing-lessons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Honky Tonk",
      slug: "honky-tonk",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/concert-venues/electronic-dance-music-venues": [
    {
      name: "LED Wall",
      slug: "led-wall",
      uiType: "toggle",
      options: []
    },
    {
      name: "Laser Lighting",
      slug: "laser-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bottle Service",
      slug: "bottle-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "18+ or 21+",
      slug: "18plus-or-21plus",
      uiType: "multi-select",
      options: ["check"]
    }
  ],
  "venues-spaces/concert-venues/hip-hop-venues": [
    {
      name: "DJ Booth",
      slug: "dj-booth",
      uiType: "toggle",
      options: []
    },
    {
      name: "Turntables Provided",
      slug: "turntables-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Section",
      slug: "vip-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security",
      slug: "security",
      uiType: "multi-select",
      options: ["yes/no level"]
    }
  ],
  "venues-spaces/concert-venues/intimate-concert-venues": [
    {
      name: "Standing Capacity",
      slug: "standing-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Seated Capacity",
      slug: "seated-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stage Size",
      slug: "stage-size",
      uiType: "multi-select",
      options: ["dimensions"]
    }
  ],
  "venues-spaces/concert-venues/jazz-clubs": [
    {
      name: "Dinner Service",
      slug: "dinner-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cover Charge",
      slug: "cover-charge",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Minimum Age",
      slug: "minimum-age",
      uiType: "multi-select",
      options: ["18/21/ all ages"]
    }
  ],
  "venues-spaces/concert-venues/large-concert-venues": [
    {
      name: "Total Capacity",
      slug: "total-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Backline Provided",
      slug: "backline-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Load-In Access",
      slug: "load-in-access",
      uiType: "multi-select",
      options: ["loading dock/ street level"]
    },
    {
      name: "Production Office",
      slug: "production-office",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/concert-venues/latin-music-venues": [
    {
      name: "Dance Lessons",
      slug: "dance-lessons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Latin DJs",
      slug: "latin-djs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Band",
      slug: "live-band",
      uiType: "toggle",
      options: []
    },
    {
      name: "Salsa Nights",
      slug: "salsa-nights",
      uiType: "multi-select",
      options: ["frequency"]
    }
  ],
  "venues-spaces/concert-venues/medium-concert-venues": [
    {
      name: "Total Capacity",
      slug: "total-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Green Room",
      slug: "green-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound System Included",
      slug: "sound-system-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Package Included",
      slug: "lighting-package-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/concert-venues/music-halls-and-theaters": [
    {
      name: "Acoustics",
      slug: "acoustics",
      uiType: "multi-select",
      options: ["excellent/ good/ fair"]
    },
    {
      name: "Balcony Seating",
      slug: "balcony-seating",
      uiType: "toggle",
      options: []
    },
    {
      name: "Box Office On-Site",
      slug: "box-office-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coat Check",
      slug: "coat-check",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/concert-venues/outdoor-amphitheaters": [
    {
      name: "Seat Count",
      slug: "seat-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Lawn Seating",
      slug: "lawn-seating",
      uiType: "toggle",
      options: []
    },
    {
      name: "Covered Seating",
      slug: "covered-seating",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rain Policy",
      slug: "rain-policy",
      uiType: "multi-select",
      options: ["clear/ reschedule/ refund"]
    }
  ],
  "venues-spaces/concert-venues/rock-clubs": [
    {
      name: "Stage Dimensions",
      slug: "stage-dimensions",
      uiType: "multi-select",
      options: ["width x depth"]
    },
    {
      name: "Mosh Pit Space",
      slug: "mosh-pit-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Earplugs Available",
      slug: "earplugs-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "All Ages Shows",
      slug: "all-ages-shows",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/conference-centers": [
    {
      name: "Total Meeting Rooms",
      slug: "total-meeting-rooms",
      uiType: "numeric",
      options: []
    },
    {
      name: "Largest Room Capacity",
      slug: "largest-room-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "On-Site Catering",
      slug: "on-site-catering",
      uiType: "toggle",
      options: []
    },
    {
      name: "Exhibit Hall",
      slug: "exhibit-hall",
      uiType: "multi-select",
      options: ["sq ft"]
    }
  ],
  "venues-spaces/corporate-venues/convention-centers": [
    {
      name: "Total Sq Ft",
      slug: "total-sq-ft",
      uiType: "numeric",
      options: []
    },
    {
      name: "Loading Docks",
      slug: "loading-docks",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Wi-Fi Bandwidth",
      slug: "wi-fi-bandwidth",
      uiType: "multi-select",
      options: ["mbps"]
    },
    {
      name: "Union Labor Required",
      slug: "union-labor-required",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/corporate-retreat-centers": [
    {
      name: "Overnight Accommodations",
      slug: "overnight-accommodations",
      uiType: "multi-select",
      options: ["number of rooms"]
    },
    {
      name: "Team Building Activities",
      slug: "team-building-activities",
      uiType: "multi-select",
      options: ["on-site/ nearby/ none"]
    },
    {
      name: "Meal Plan",
      slug: "meal-plan",
      uiType: "multi-select",
      options: ["included/ optional/ none"]
    },
    {
      name: "AV Capabilities",
      slug: "av-capabilities",
      uiType: "multi-select",
      options: ["basic/full/ premium"]
    }
  ],
  "venues-spaces/corporate-venues/executive-conference-centers": [
    {
      name: "Video Conferencing",
      slug: "video-conferencing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Administrative Support",
      slug: "administrative-support",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Offices",
      slug: "private-offices",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Included",
      slug: "catering-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/hotel-ballrooms": [
    {
      name: "AV Included",
      slug: "av-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Breakout Rooms",
      slug: "breakout-rooms",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "On-Site Dining",
      slug: "on-site-dining",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Room Block Available",
      slug: "guest-room-block-available",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/meeting-and-boardrooms": [
    {
      name: "TV/Display Size",
      slug: "tv-display-size",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Whiteboard Included",
      slug: "whiteboard-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Allowed",
      slug: "catering-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Natural Light",
      slug: "natural-light",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/nonprofit-event-spaces": [
    {
      name: "Nonprofit Discount",
      slug: "nonprofit-discount",
      uiType: "multi-select",
      options: ["percentage"]
    },
    {
      name: "In-Kind Donation Option",
      slug: "in-kind-donation-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grant Funded Availability",
      slug: "grant-funded-availability",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/product-launch-venues": [
    {
      name: "Stage Dimensions",
      slug: "stage-dimensions",
      uiType: "multi-select",
      options: ["width x depth"]
    },
    {
      name: "LED Wall Available",
      slug: "led-wall-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Green Room",
      slug: "green-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Load-In Access",
      slug: "load-in-access",
      uiType: "multi-select",
      options: ["freight elevator/ loading dock/ street level"]
    }
  ],
  "venues-spaces/corporate-venues/tech-conference-venues": [
    {
      name: "WiFi Speed",
      slug: "wifi-speed",
      uiType: "multi-select",
      options: ["mbps"]
    },
    {
      name: "Ethernet Ports",
      slug: "ethernet-ports",
      uiType: "multi-select",
      options: ["number per room"]
    },
    {
      name: "Built-in AV",
      slug: "built-in-av",
      uiType: "multi-select",
      options: ["projector/screen/sound"]
    },
    {
      name: "Livestream Capable",
      slug: "livestream-capable",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/trade-show-and-expo-halls": [
    {
      name: "Booth Spaces",
      slug: "booth-spaces",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Union Labor Required",
      slug: "union-labor-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Floor Load Capacity",
      slug: "floor-load-capacity",
      uiType: "multi-select",
      options: ["lbs/sq ft"]
    },
    {
      name: "Overhead Rigging",
      slug: "overhead-rigging",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/training-facilities": [
    {
      name: "Computers Provided",
      slug: "computers-provided",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Peripherals",
      slug: "peripherals",
      uiType: "multi-select",
      options: ["printers/scanners"]
    },
    {
      name: "Break Area",
      slug: "break-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parking Included",
      slug: "parking-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/corporate-venues/university-and-college-event-spaces": [
    {
      name: "Semester Availability",
      slug: "semester-availability",
      uiType: "multi-select",
      options: ["academic year/ summer/ year-round"]
    },
    {
      name: "Student Staff Required",
      slug: "student-staff-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Alcohol Allowed",
      slug: "alcohol-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["paid/free/ limited"]
    }
  ],
  "venues-spaces/milestone-venues/ballroom-quinceaera-venues": [
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Stage for Court",
      slug: "stage-for-court",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grand Entrance Staircase",
      slug: "grand-entrance-staircase",
      uiType: "toggle",
      options: []
    },
    {
      name: "Changing Rooms",
      slug: "changing-rooms",
      uiType: "multi-select",
      options: ["yes/no number"]
    }
  ],
  "venues-spaces/milestone-venues/ballroom-sweet-16-venues": [
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "DJ Booth",
      slug: "dj-booth",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candy Buffet Area",
      slug: "candy-buffet-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/banquet-hall-mitzvah-venues": [
    {
      name: "Kosher Kitchen",
      slug: "kosher-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candle Lighting Ceremony Space",
      slug: "candle-lighting-ceremony-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hora Space",
      slug: "hora-space",
      uiType: "multi-select",
      options: ["yes/no ceiling height"]
    },
    {
      name: "Photo Booth Area",
      slug: "photo-booth-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/banquet-hall-quinceaera-venues": [
    {
      name: "AV Package Included",
      slug: "av-package-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Centerpieces Included",
      slug: "centerpieces-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Included",
      slug: "catering-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/banquet-hall-sweet-16-venues": [
    {
      name: "AV Package Included",
      slug: "av-package-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Centerpieces Included",
      slug: "centerpieces-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Booth Area",
      slug: "photo-booth-area",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Included",
      slug: "catering-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/budget-quinceaera-venues": [
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "numeric",
      options: []
    },
    {
      name: "BYO Catering",
      slug: "byo-catering",
      uiType: "toggle",
      options: []
    },
    {
      name: "BYO Decor",
      slug: "byo-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "numeric",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/church-hall-quinceaera-venues": [
    {
      name: "Mass On-Site",
      slug: "mass-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Priest Available",
      slug: "priest-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rehearsal Space",
      slug: "rehearsal-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Decor Allowed",
      slug: "decor-allowed",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/convention-center-prom-venues": [
    {
      name: "Total Sq Ft",
      slug: "total-sq-ft",
      uiType: "numeric",
      options: []
    },
    {
      name: "AV Package",
      slug: "av-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple Rooms",
      slug: "multiple-rooms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Load-In Access",
      slug: "load-in-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/country-club-mitzvah-venues": [
    {
      name: "Golf Available",
      slug: "golf-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool Access",
      slug: "pool-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Ceremony Space",
      slug: "outdoor-ceremony-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Valet Parking",
      slug: "valet-parking",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/cruise-ship-and-boat-prom-venues": [
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Rain Backup",
      slug: "rain-backup",
      uiType: "multi-select",
      options: ["inside cabin"]
    },
    {
      name: "Departure Times",
      slug: "departure-times",
      uiType: "multi-select",
      options: ["evening/ late night"]
    },
    {
      name: "Coast Guard Certified",
      slug: "coast-guard-certified",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/hotel-ballroom-mitzvah-venues": [
    {
      name: "Room Block Available",
      slug: "room-block-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kosher Catering",
      slug: "kosher-catering",
      uiType: "multi-select",
      options: ["available/ external/ not available"]
    },
    {
      name: "AV Package",
      slug: "av-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/hotel-ballroom-prom-venues": [
    {
      name: "Coat Check",
      slug: "coat-check",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security Included",
      slug: "security-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "DJ Booth",
      slug: "dj-booth",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop Area",
      slug: "photo-backdrop-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/luxury-quinceaera-venues": [
    {
      name: "Bridal Suite",
      slug: "bridal-suite",
      uiType: "toggle",
      options: []
    },
    {
      name: "Valet Parking",
      slug: "valet-parking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Menu",
      slug: "custom-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Event Coordinator Included",
      slug: "event-coordinator-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/museum-and-cultural-center-prom-venues": [
    {
      name: "Exhibit Access",
      slug: "exhibit-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photography Permit",
      slug: "photography-permit",
      uiType: "multi-select",
      options: ["included/ extra/ restricted"]
    },
    {
      name: "Unique Photo Spots",
      slug: "unique-photo-spots",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours Only",
      slug: "after-hours-only",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/outdoor-quinceaera-venues": [
    {
      name: "Rain Backup",
      slug: "rain-backup",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tent Permitted",
      slug: "tent-permitted",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Dance Floor",
      slug: "outdoor-dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting",
      slug: "lighting",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/outdoor-sweet-16-venues": [
    {
      name: "Rain Backup",
      slug: "rain-backup",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tent Permitted",
      slug: "tent-permitted",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool Access",
      slug: "pool-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fire Pit",
      slug: "fire-pit",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/pool-party-sweet-16-venues": [
    {
      name: "Lifeguard Included",
      slug: "lifeguard-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool Size",
      slug: "pool-size",
      uiType: "multi-select",
      options: ["dimensions"]
    },
    {
      name: "Cabanas",
      slug: "cabanas",
      uiType: "multi-select",
      options: ["yes/no number"]
    },
    {
      name: "Sound System",
      slug: "sound-system",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/synagogue-social-halls": [
    {
      name: "Kosher Catering Required",
      slug: "kosher-catering-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Separate Men/Women Seating",
      slug: "separate-men-women-seating",
      uiType: "toggle",
      options: []
    },
    {
      name: "Torah Scroll On-Site",
      slug: "torah-scroll-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shabbat Observance",
      slug: "shabbat-observance",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/milestone-venues/themed-sweet-16-venues": [
    {
      name: "Theme Packages Available",
      slug: "theme-packages-available",
      uiType: "multi-select",
      options: ["yes/no list"]
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Costume Friendly",
      slug: "costume-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/after-hours-clubs": [
    {
      name: "Opening Time",
      slug: "opening-time",
      uiType: "multi-select",
      options: ["10pm/11pm/midnight"]
    },
    {
      name: "Last Call",
      slug: "last-call",
      uiType: "multi-select",
      options: ["4am/5am/6am"]
    },
    {
      name: "Re-Entry Policy",
      slug: "re-entry-policy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Membership Required",
      slug: "membership-required",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/biker-bars": [
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["motorcycle/ car/ both"]
    },
    {
      name: "Live Music",
      slug: "live-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool Tables",
      slug: "pool-tables",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kitchen",
      slug: "kitchen",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/brewery-beer-gardens": [
    {
      name: "Beer Garden Size",
      slug: "beer-garden-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Fire Pits",
      slug: "fire-pits",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Trucks",
      slug: "food-trucks",
      uiType: "multi-select",
      options: ["schedule"]
    },
    {
      name: "Dog Friendly",
      slug: "dog-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/brewpubs": [
    {
      name: "Full Kitchen",
      slug: "full-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Beer Styles Available",
      slug: "beer-styles-available",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Private Events",
      slug: "private-events",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Seating",
      slug: "outdoor-seating",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/cocktail-bars": [
    {
      name: "Dress Code",
      slug: "dress-code",
      uiType: "multi-select",
      options: ["casual/ smart/ formal"]
    },
    {
      name: "Reservation Required",
      slug: "reservation-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Speakeasy",
      slug: "speakeasy",
      uiType: "multi-select",
      options: ["hidden entrance", "yes/no"]
    },
    {
      name: "House Infusions",
      slug: "house-infusions",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/college-bars": [
    {
      name: "Student Discount",
      slug: "student-discount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cover Charge",
      slug: "cover-charge",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Weekend Line",
      slug: "weekend-line",
      uiType: "multi-select",
      options: ["short/ medium/ long"]
    },
    {
      name: "Drink Specials",
      slug: "drink-specials",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/dive-bars": [
    {
      name: "Cash Only",
      slug: "cash-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "ATM On-Site",
      slug: "atm-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Jukebox",
      slug: "jukebox",
      uiType: "multi-select",
      options: ["digital/ classic/ vinyl"]
    },
    {
      name: "PBR on Tap",
      slug: "pbr-on-tap",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/edm-clubs": [
    {
      name: "LED Wall",
      slug: "led-wall",
      uiType: "toggle",
      options: []
    },
    {
      name: "Laser Show",
      slug: "laser-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "International DJs",
      slug: "international-djs",
      uiType: "multi-select",
      options: ["frequency"]
    },
    {
      name: "After Hours",
      slug: "after-hours",
      uiType: "multi-select",
      options: ["closing time"]
    }
  ],
  "venues-spaces/nightlife-venues/gastropubs": [
    {
      name: "Burger Quality",
      slug: "burger-quality",
      uiType: "multi-select",
      options: ["basic/ excellent/ award-winning"]
    },
    {
      name: "Beer Tap Count",
      slug: "beer-tap-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Scotch Egg On Menu",
      slug: "scotch-egg-on-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sunday Roast",
      slug: "sunday-roast",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/gay-bars-and-lgbtqplus-bars": [
    {
      name: "Drag Shows",
      slug: "drag-shows",
      uiType: "multi-select",
      options: ["frequency"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Theme Nights",
      slug: "theme-nights",
      uiType: "toggle",
      options: []
    },
    {
      name: "Women-Only Nights",
      slug: "women-only-nights",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/hip-hop-clubs": [
    {
      name: "DJ",
      slug: "dj",
      uiType: "multi-select",
      options: ["local/ regional/ national"]
    },
    {
      name: "VIP Section",
      slug: "vip-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security",
      slug: "security",
      uiType: "multi-select",
      options: ["visible/ discreet"]
    },
    {
      name: "Dress Code",
      slug: "dress-code",
      uiType: "multi-select",
      options: ["casual/ upscale"]
    }
  ],
  "venues-spaces/nightlife-venues/hotel-bars": [
    {
      name: "Hotel Guest Priority",
      slug: "hotel-guest-priority",
      uiType: "toggle",
      options: []
    },
    {
      name: "Happy Hour",
      slug: "happy-hour",
      uiType: "multi-select",
      options: ["yes/no times"]
    },
    {
      name: "Small Plates",
      slug: "small-plates",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night",
      slug: "late-night",
      uiType: "multi-select",
      options: ["closing time"]
    }
  ],
  "venues-spaces/nightlife-venues/irish-pubs": [
    {
      name: "Guinness Pour Quality",
      slug: "guinness-pour-quality",
      uiType: "multi-select",
      options: ["perfect/ good/ inconsistent"]
    },
    {
      name: "Irish Whiskey Selection",
      slug: "irish-whiskey-selection",
      uiType: "numeric",
      options: []
    },
    {
      name: "Live Traditional Music",
      slug: "live-traditional-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Full Irish Breakfast",
      slug: "full-irish-breakfast",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/japanese-style-karaoke-boxes": [
    {
      name: "Tatami Rooms",
      slug: "tatami-rooms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sake Service",
      slug: "sake-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Snacks Included",
      slug: "snacks-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reservation Required",
      slug: "reservation-required",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/latin-bars": [
    {
      name: "Salsa Nights",
      slug: "salsa-nights",
      uiType: "multi-select",
      options: ["frequency"]
    },
    {
      name: "Dance Lessons",
      slug: "dance-lessons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Band",
      slug: "live-band",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mojitos",
      slug: "mojitos",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/latin-dance-clubs": [
    {
      name: "Dance Floor Size",
      slug: "dance-floor-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Lessons Included",
      slug: "lessons-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Band",
      slug: "live-band",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ladies Night",
      slug: "ladies-night",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/lgbtqplus-dance-clubs": [
    {
      name: "Drag Shows",
      slug: "drag-shows",
      uiType: "multi-select",
      options: ["frequency"]
    },
    {
      name: "Theme Nights",
      slug: "theme-nights",
      uiType: "multi-select",
      options: ["schedule"]
    },
    {
      name: "Coat Check",
      slug: "coat-check",
      uiType: "toggle",
      options: []
    },
    {
      name: "Women's Nights",
      slug: "womens-nights",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/lounge-and-chill-bars": [
    {
      name: "Seating Type",
      slug: "seating-type",
      uiType: "multi-select",
      options: ["booths/ couches/ high-top"]
    },
    {
      name: "Noise Level",
      slug: "noise-level",
      uiType: "multi-select",
      options: ["quiet/ moderate"]
    },
    {
      name: "Late Night",
      slug: "late-night",
      uiType: "multi-select",
      options: ["closing time"]
    },
    {
      name: "Small Plates",
      slug: "small-plates",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/microbreweries": [
    {
      name: "Beer Styles Available",
      slug: "beer-styles-available",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Food",
      slug: "food",
      uiType: "multi-select",
      options: ["kitchen/ food truck/ snacks/ none"]
    },
    {
      name: "Tours Available",
      slug: "tours-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dog Friendly",
      slug: "dog-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/nightclubs": [
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["18/21"]
    },
    {
      name: "Dress Code",
      slug: "dress-code",
      uiType: "multi-select",
      options: ["casual/ smart/ strict"]
    },
    {
      name: "Bottle Service",
      slug: "bottle-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Tables",
      slug: "vip-tables",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/private-room-karaoke": [
    {
      name: "Room Capacity",
      slug: "room-capacity",
      uiType: "multi-select",
      options: ["2-6/7-12/13-20"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "numeric",
      options: []
    },
    {
      name: "Food Service",
      slug: "food-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Song Languages",
      slug: "song-languages",
      uiType: "multi-select",
      options: ["English/ Spanish/ Korean/ Japanese/ Tagalog"]
    }
  ],
  "venues-spaces/nightlife-venues/production-breweries": [
    {
      name: "Tour Length",
      slug: "tour-length",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Samples Included",
      slug: "samples-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Merchandise Shop",
      slug: "merchandise-shop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Canning Line Visible",
      slug: "canning-line-visible",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/public-stage-karaoke": [
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "KJ Quality",
      slug: "kj-quality",
      uiType: "multi-select",
      options: ["encouraging/ professional/ ruthless"]
    },
    {
      name: "Private Rooms",
      slug: "private-rooms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drink Minimum",
      slug: "drink-minimum",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/rooftop-bars": [
    {
      name: "View Type",
      slug: "view-type",
      uiType: "multi-select",
      options: ["city/ lake/ river"]
    },
    {
      name: "Heated",
      slug: "heated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Covered",
      slug: "covered",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reservation Recommended",
      slug: "reservation-recommended",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/sports-bars": [
    {
      name: "TV Count",
      slug: "tv-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "NFL Sunday Ticket",
      slug: "nfl-sunday-ticket",
      uiType: "toggle",
      options: []
    },
    {
      name: "Game Day Specials",
      slug: "game-day-specials",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pool Tables",
      slug: "pool-tables",
      uiType: "multi-select",
      options: ["yes/no number"]
    }
  ],
  "venues-spaces/nightlife-venues/tiki-bars": [
    {
      name: "Tiki Drinks Menu",
      slug: "tiki-drinks-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Decor",
      slug: "decor",
      uiType: "multi-select",
      options: ["authentic/ kitschy/ modern"]
    },
    {
      name: "Live Ukulele",
      slug: "live-ukulele",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor",
      slug: "outdoor",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/top-40-clubs": [
    {
      name: "Current Chart Music",
      slug: "current-chart-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Request System",
      slug: "request-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Birthday Packages",
      slug: "birthday-packages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest List",
      slug: "guest-list",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/nightlife-venues/wine-bars": [
    {
      name: "Wine By Glass Count",
      slug: "wine-by-glass-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Sommelier On Staff",
      slug: "sommelier-on-staff",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cheese Board",
      slug: "cheese-board",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Seating",
      slug: "outdoor-seating",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/brewery-beer-gardens": [
    {
      name: "Beer Garden Size",
      slug: "beer-garden-size",
      uiType: "multi-select",
      options: ["sq ft"]
    },
    {
      name: "Dog Friendly",
      slug: "dog-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Trucks Permitted",
      slug: "food-trucks-permitted",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fire Pits",
      slug: "fire-pits",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/courtyard-venues": [
    {
      name: "Courtyard Type",
      slug: "courtyard-type",
      uiType: "multi-select",
      options: ["enclosed/ open/ interior"]
    },
    {
      name: "Noise Restrictions",
      slug: "noise-restrictions",
      uiType: "toggle",
      options: []
    },
    {
      name: "String Lighting Included",
      slug: "string-lighting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fountain",
      slug: "fountain",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/farm-venues": [
    {
      name: "Working Farm",
      slug: "working-farm",
      uiType: "toggle",
      options: []
    },
    {
      name: "Animals On-Site",
      slug: "animals-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Orchard Bloom",
      slug: "orchard-bloom",
      uiType: "multi-select",
      options: ["season"]
    },
    {
      name: "Hayrides Available",
      slug: "hayrides-available",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/forest-and-woods-venues": [
    {
      name: "Trail Access",
      slug: "trail-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wildlife Viewing",
      slug: "wildlife-viewing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cell Service",
      slug: "cell-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Camping Allowed",
      slug: "camping-allowed",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/garden-venues": [
    {
      name: "Bloom Seasons",
      slug: "bloom-seasons",
      uiType: "multi-select",
      options: ["spring/summer/fall/winter"]
    },
    {
      name: "Photography Permit",
      slug: "photography-permit",
      uiType: "multi-select",
      options: ["included/ extra/ restricted"]
    },
    {
      name: "Wedding Arch Included",
      slug: "wedding-arch-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/lakeside-and-beach-venues": [
    {
      name: "Water Access",
      slug: "water-access",
      uiType: "multi-select",
      options: ["swimming/ wading/ none"]
    },
    {
      name: "Boat Launch",
      slug: "boat-launch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dock",
      slug: "dock",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sandy Beach",
      slug: "sandy-beach",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/park-pavilions-and-shelters": [
    {
      name: "Pavilion Size",
      slug: "pavilion-size",
      uiType: "multi-select",
      options: ["small/medium/ large"]
    },
    {
      name: "Electricity Available",
      slug: "electricity-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restrooms",
      slug: "restrooms",
      uiType: "multi-select",
      options: ["yes/no distance"]
    },
    {
      name: "Grill Access",
      slug: "grill-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/private-estate-grounds": [
    {
      name: "Estate Size",
      slug: "estate-size",
      uiType: "multi-select",
      options: ["acres"]
    },
    {
      name: "Mansion Access",
      slug: "mansion-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Helipad",
      slug: "helipad",
      uiType: "toggle",
      options: []
    },
    {
      name: "Overnight Accommodation",
      slug: "overnight-accommodation",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/public-park-permits": [
    {
      name: "Permit Required",
      slug: "permit-required",
      uiType: "multi-select",
      options: ["yes/no cost"]
    },
    {
      name: "Alcohol Permit Available",
      slug: "alcohol-permit-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound Permit Required",
      slug: "sound-permit-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tent Permit Required",
      slug: "tent-permit-required",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/riverfront-venues": [
    {
      name: "Boat Access",
      slug: "boat-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fishing Allowed",
      slug: "fishing-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Riverwalk Access",
      slug: "riverwalk-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flood Zone",
      slug: "flood-zone",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/outdoor-venues/vineyard-and-winery-outdoor-venues": [
    {
      name: "Wine Tasting Included",
      slug: "wine-tasting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Harvest Season Availability",
      slug: "harvest-season-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crush Pad",
      slug: "crush-pad",
      uiType: "toggle",
      options: []
    },
    {
      name: "Barrel Room Access",
      slug: "barrel-room-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/adult-birthday-party-venues": [
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "multi-select",
      options: ["full/cash/ none"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Late Night Hours",
      slug: "late-night-hours",
      uiType: "multi-select",
      options: ["until 12am/1am/2am+"]
    },
    {
      name: "VIP Area",
      slug: "vip-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/anniversary-party-venues": [
    {
      name: "Vow Renewal Space",
      slug: "vow-renewal-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Romantic Packages",
      slug: "romantic-packages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Champagne Toast Included",
      slug: "champagne-toast-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Dining",
      slug: "private-dining",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/backyard-party-venues": [
    {
      name: "Tent Included",
      slug: "tent-included",
      uiType: "multi-select",
      options: ["size sq ft"]
    },
    {
      name: "Guest Count Max",
      slug: "guest-count-max",
      uiType: "numeric",
      options: []
    },
    {
      name: "Restroom Facilities",
      slug: "restroom-facilities",
      uiType: "multi-select",
      options: ["in-home/portable/ both"]
    },
    {
      name: "Power Available",
      slug: "power-available",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/birthday-party-venues": [
    {
      name: "Age Group",
      slug: "age-group",
      uiType: "multi-select",
      options: ["kids/ teen/ adult/ milestone"]
    },
    {
      name: "Party Host",
      slug: "party-host",
      uiType: "multi-select",
      options: ["included/ optional/ none"]
    },
    {
      name: "Decor Included",
      slug: "decor-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Included",
      slug: "food-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/divorce-party-venues": [
    {
      name: "Sarcastic Decor Allowed",
      slug: "sarcastic-decor-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Packages",
      slug: "themed-packages",
      uiType: "multi-select",
      options: ["\"I Do\" crossed out", "etc."]
    },
    {
      name: "Punching Bag",
      slug: "punching-bag",
      uiType: "toggle",
      options: []
    },
    {
      name: "Not Your Typical Venue",
      slug: "not-your-typical-venue",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/graduation-party-venues": [
    {
      name: "AV for Slideshow",
      slug: "av-for-slideshow",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Space",
      slug: "outdoor-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Included",
      slug: "catering-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Class Photo Area",
      slug: "class-photo-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/home-party-venues": [
    {
      name: "Bedrooms Available",
      slug: "bedrooms-available",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Kitchen Access",
      slug: "kitchen-access",
      uiType: "multi-select",
      options: ["full/ limited/ none"]
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["number of spaces"]
    },
    {
      name: "Noise Restrictions",
      slug: "noise-restrictions",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "venues-spaces/party-venues/kids-birthday-party-venues": [
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["1-4/5-8/9-12"]
    },
    {
      name: "Party Host Included",
      slug: "party-host-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Goody Bags Included",
      slug: "goody-bags-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Play Structure",
      slug: "play-structure",
      uiType: "multi-select",
      options: ["indoor/outdoor/ both"]
    }
  ],
  "venues-spaces/party-venues/milestone-birthday-venues": [
    {
      name: "Decor Package Included",
      slug: "decor-package-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Cake Allowed",
      slug: "custom-cake-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Event Coordinator",
      slug: "event-coordinator",
      uiType: "multi-select",
      options: ["included/ optional/ none"]
    }
  ],
  "venues-spaces/party-venues/retirement-party-venues": [
    {
      name: "Memory Table Space",
      slug: "memory-table-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "AV for Tribute Video",
      slug: "av-for-tribute-video",
      uiType: "toggle",
      options: []
    },
    {
      name: "Catering Buffet",
      slug: "catering-buffet",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Book Area",
      slug: "guest-book-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/surprise-party-venues": [
    {
      name: "Secluded Entrance",
      slug: "secluded-entrance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Soundproof Walls",
      slug: "soundproof-walls",
      uiType: "toggle",
      options: []
    },
    {
      name: "Staff Briefing Included",
      slug: "staff-briefing-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hideaway Space",
      slug: "hideaway-space",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/party-venues/teen-birthday-party-venues": [
    {
      name: "Chaperone Required",
      slug: "chaperone-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Alcohol-Free",
      slug: "alcohol-free",
      uiType: "toggle",
      options: []
    },
    {
      name: "Gaming Options",
      slug: "gaming-options",
      uiType: "multi-select",
      options: ["video/board/ VR"]
    },
    {
      name: "DJ Allowed",
      slug: "dj-allowed",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-bars": [
    {
      name: "Standing Capacity",
      slug: "standing-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "multi-select",
      options: ["full/ beer-wine/ cash"]
    },
    {
      name: "Cover",
      slug: "cover",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Elevator Access",
      slug: "elevator-access",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-gardens": [
    {
      name: "Garden Type",
      slug: "garden-type",
      uiType: "multi-select",
      options: ["landscaped/ urban/ wild"]
    },
    {
      name: "Greenhouse Access",
      slug: "greenhouse-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sprinkler System",
      slug: "sprinkler-system",
      uiType: "multi-select",
      options: ["for heat", "yes/no"]
    },
    {
      name: "Tent Permitted",
      slug: "tent-permitted",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-restaurants": [
    {
      name: "Seated Capacity",
      slug: "seated-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Reservation Required",
      slug: "reservation-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["numeric range"]
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-city-skyline-view": [
    {
      name: "View Direction",
      slug: "view-direction",
      uiType: "multi-select",
      options: ["north/ south/ east/ west/ 360"]
    },
    {
      name: "Sunset View",
      slug: "sunset-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Nighttime Lighting",
      slug: "nighttime-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Clear Sightlines",
      slug: "clear-sightlines",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-covered-area": [
    {
      name: "Coverage Percentage",
      slug: "coverage-percentage",
      uiType: "multi-select",
      options: ["25%/ 50%/ 75%/ 100%"]
    },
    {
      name: "Retractable Cover",
      slug: "retractable-cover",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heating Under Cover",
      slug: "heating-under-cover",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Under Cover",
      slug: "lighting-under-cover",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-heaters": [
    {
      name: "Heater Type",
      slug: "heater-type",
      uiType: "multi-select",
      options: ["propane/ electric/ infrared"]
    },
    {
      name: "Number of Heaters",
      slug: "number-of-heaters",
      uiType: "numeric",
      options: []
    },
    {
      name: "Winter Availability",
      slug: "winter-availability",
      uiType: "multi-select",
      options: ["months"]
    },
    {
      name: "Enclosed Area",
      slug: "enclosed-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-lake-michigan-view": [
    {
      name: "Direct Lake View",
      slug: "direct-lake-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lake Level Floor",
      slug: "lake-level-floor",
      uiType: "multi-select",
      options: ["number of stories up"]
    },
    {
      name: "Wind Barriers",
      slug: "wind-barriers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heated Area",
      slug: "heated-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-pool": [
    {
      name: "Pool Size",
      slug: "pool-size",
      uiType: "multi-select",
      options: ["dimensions"]
    },
    {
      name: "Pool Access Included",
      slug: "pool-access-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lifeguard",
      slug: "lifeguard",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heated Pool",
      slug: "heated-pool",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/rooftop-venues/rooftop-with-river-view": [
    {
      name: "River Name",
      slug: "river-name",
      uiType: "multi-select",
      options: ["Milwaukee/ Menomonee/ Kinnickinnic"]
    },
    {
      name: "Bridge View",
      slug: "bridge-view",
      uiType: "toggle",
      options: []
    },
    {
      name: "Boat Watching",
      slug: "boat-watching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sunset View",
      slug: "sunset-view",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/20-50-guests": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "multi-select",
      options: ["300-800"]
    },
    {
      name: "Standing Reception Capacity",
      slug: "standing-reception-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Seated Dinner Capacity",
      slug: "seated-dinner-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "AV Included",
      slug: "av-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/50-75-guests": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "multi-select",
      options: ["800-1200"]
    },
    {
      name: "Standing Reception Capacity",
      slug: "standing-reception-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Seated Dinner Capacity",
      slug: "seated-dinner-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Bar Area",
      slug: "bar-area",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/75-100-guests": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "multi-select",
      options: ["1200-1800"]
    },
    {
      name: "Standing Reception Capacity",
      slug: "standing-reception-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Seated Dinner Capacity",
      slug: "seated-dinner-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "multi-select",
      options: ["yes/no size"]
    }
  ],
  "venues-spaces/small-event-spaces/art-gallery-small-events": [
    {
      name: "Art Rotation",
      slug: "art-rotation",
      uiType: "multi-select",
      options: ["monthly/ quarterly/ annually"]
    },
    {
      name: "Hanging System",
      slug: "hanging-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours Only",
      slug: "after-hours-only",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/bookstore-event-spaces": [
    {
      name: "Bookstore Buyout Required",
      slug: "bookstore-buyout-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Author Event Capable",
      slug: "author-event-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coffee/Tea Service",
      slug: "coffee-tea-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seating",
      slug: "seating",
      uiType: "multi-select",
      options: ["number of chairs"]
    }
  ],
  "venues-spaces/small-event-spaces/coffee-shop-event-spaces": [
    {
      name: "Espresso Bar Included",
      slug: "espresso-bar-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pastry Service",
      slug: "pastry-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours Only",
      slug: "after-hours-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Minimum Spend",
      slug: "minimum-spend",
      uiType: "numeric",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/private-chefs-tables": [
    {
      name: "Chef Interaction",
      slug: "chef-interaction",
      uiType: "toggle",
      options: []
    },
    {
      name: "Courses",
      slug: "courses",
      uiType: "multi-select",
      options: ["3/5/7/10+"]
    },
    {
      name: "Wine Pairing Available",
      slug: "wine-pairing-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dietary Accommodations",
      slug: "dietary-accommodations",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/private-dining-rooms": [
    {
      name: "Cuisine Type",
      slug: "cuisine-type",
      uiType: "multi-select",
      options: ["Italian/ American/ Asian/ Mexican/ etc."]
    },
    {
      name: "Minimum Spend",
      slug: "minimum-spend",
      uiType: "numeric",
      options: []
    },
    {
      name: "Buyout Available",
      slug: "buyout-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Service",
      slug: "bar-service",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/under-20-guests": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "multi-select",
      options: ["100-300"]
    },
    {
      name: "Standing Reception Capacity",
      slug: "standing-reception-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Seated Dinner Capacity",
      slug: "seated-dinner-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Private",
      slug: "private",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/small-event-spaces/wine-cellar-event-spaces": [
    {
      name: "Wine Collection Size",
      slug: "wine-collection-size",
      uiType: "multi-select",
      options: ["bottles"]
    },
    {
      name: "Sommelier Available",
      slug: "sommelier-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tasting Included",
      slug: "tasting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Entrance",
      slug: "private-entrance",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/airplane-hangars": [
    {
      name: "Runway Access",
      slug: "runway-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Helicopter Tours",
      slug: "helicopter-tours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Jet Available",
      slug: "jet-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fuel Odor",
      slug: "fuel-odor",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/aquariums": [
    {
      name: "Shark Tank Viewing",
      slug: "shark-tank-viewing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Touch Tank Access",
      slug: "touch-tank-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours",
      slug: "after-hours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Behind-the-Scenes Tours",
      slug: "behind-the-scenes-tours",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/art-gallery-event-spaces": [
    {
      name: "Hanging System",
      slug: "hanging-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Curator Available",
      slug: "curator-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Art Sales Commission",
      slug: "art-sales-commission",
      uiType: "multi-select",
      options: ["percentage"]
    }
  ],
  "venues-spaces/unique-venues/boats-and-cruise-ships": [
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Indoor/Outdoor Decks",
      slug: "indoor-outdoor-decks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restrooms",
      slug: "restrooms",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Coast Guard Certified",
      slug: "coast-guard-certified",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/castles-and-chateaus": [
    {
      name: "Stone Walls",
      slug: "stone-walls",
      uiType: "toggle",
      options: []
    },
    {
      name: "Great Hall Capacity",
      slug: "great-hall-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Turret Access",
      slug: "turret-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Moat",
      slug: "moat",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/factory-and-industrial-spaces": [
    {
      name: "Raw Space",
      slug: "raw-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Loading Dock",
      slug: "loading-dock",
      uiType: "toggle",
      options: []
    },
    {
      name: "Exposed Brick",
      slug: "exposed-brick",
      uiType: "toggle",
      options: []
    },
    {
      name: "High Ceilings",
      slug: "high-ceilings",
      uiType: "multi-select",
      options: ["height in feet"]
    }
  ],
  "venues-spaces/unique-venues/fire-stations": [
    {
      name: "Historic Apparatus",
      slug: "historic-apparatus",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pole",
      slug: "pole",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bay Doors",
      slug: "bay-doors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Kitchen",
      slug: "kitchen",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/greenhouse-and-conservatory-venues": [
    {
      name: "Climate Controlled",
      slug: "climate-controlled",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bloom Season",
      slug: "bloom-season",
      uiType: "multi-select",
      options: ["spring/summer/fall/winter"]
    },
    {
      name: "Water Features",
      slug: "water-features",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photography Permit",
      slug: "photography-permit",
      uiType: "multi-select",
      options: ["included/ extra"]
    }
  ],
  "venues-spaces/unique-venues/historic-homes-and-mansions": [
    {
      name: "Period Decor",
      slug: "period-decor",
      uiType: "multi-select",
      options: ["era"]
    },
    {
      name: "Original Furnishings",
      slug: "original-furnishings",
      uiType: "toggle",
      options: []
    },
    {
      name: "Garden Access",
      slug: "garden-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photography Restrictions",
      slug: "photography-restrictions",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/libraries": [
    {
      name: "Book Stacks Access",
      slug: "book-stacks-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "AV Included",
      slug: "av-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quiet Hours",
      slug: "quiet-hours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/museum-event-spaces": [
    {
      name: "Exhibit Access",
      slug: "exhibit-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours Only",
      slug: "after-hours-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photography Permit",
      slug: "photography-permit",
      uiType: "multi-select",
      options: ["included/ extra/ restricted"]
    },
    {
      name: "Docent Available",
      slug: "docent-available",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/observatory-venues": [
    {
      name: "Telescope Access",
      slug: "telescope-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Night Only",
      slug: "night-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Clear Sky Policy",
      slug: "clear-sky-policy",
      uiType: "multi-select",
      options: ["refund/ reschedule/ proceed"]
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/planetariums": [
    {
      name: "Star Show Included",
      slug: "star-show-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Telescope Access",
      slug: "telescope-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours",
      slug: "after-hours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seated Capacity",
      slug: "seated-capacity",
      uiType: "numeric",
      options: []
    }
  ],
  "venues-spaces/unique-venues/police-stations": [
    {
      name: "Community Room",
      slug: "community-room",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["yes/no number"]
    },
    {
      name: "Alcohol Allowed",
      slug: "alcohol-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security On-Site",
      slug: "security-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/theater-and-performing-arts-venues": [
    {
      name: "Stage Dimensions",
      slug: "stage-dimensions",
      uiType: "multi-select",
      options: ["width x depth"]
    },
    {
      name: "Dressing Rooms",
      slug: "dressing-rooms",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Fly System",
      slug: "fly-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Box Office Included",
      slug: "box-office-included",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/train-stations": [
    {
      name: "Active Train Service",
      slug: "active-train-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Noise Level",
      slug: "noise-level",
      uiType: "multi-select",
      options: ["quiet/ moderate/ loud"]
    },
    {
      name: "Platform Access",
      slug: "platform-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Waiting Room",
      slug: "waiting-room",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/warehouse-event-spaces": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "numeric",
      options: []
    },
    {
      name: "Freight Elevator",
      slug: "freight-elevator",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restrooms",
      slug: "restrooms",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Heating/AC",
      slug: "heating-ac",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/yacht-clubs": [
    {
      name: "Member Required",
      slug: "member-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reciprocal Clubs",
      slug: "reciprocal-clubs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water Access",
      slug: "water-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Overnight Docking",
      slug: "overnight-docking",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/unique-venues/zoos": [
    {
      name: "Animal Encounters",
      slug: "animal-encounters",
      uiType: "toggle",
      options: []
    },
    {
      name: "After-Hours",
      slug: "after-hours",
      uiType: "toggle",
      options: []
    },
    {
      name: "Indoor Rain Backup",
      slug: "indoor-rain-backup",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parking",
      slug: "parking",
      uiType: "multi-select",
      options: ["free/paid/ limited"]
    }
  ],
  "venues-spaces/wedding-venues/all-inclusive-wedding-venues": [
    {
      name: "What's Included",
      slug: "whats-included",
      uiType: "multi-select",
      options: ["venue/catering/bar/florist/DJ/photographer/cake/coordinator"]
    },
    {
      name: "Minimum Guest Count",
      slug: "minimum-guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Maximum Guest Count",
      slug: "maximum-guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Preferred Vendor List",
      slug: "preferred-vendor-list",
      uiType: "multi-select",
      options: ["required/recommended/none"]
    }
  ],
  "venues-spaces/wedding-venues/barn-and-rustic-wedding-venues": [
    {
      name: "Barn Type",
      slug: "barn-type",
      uiType: "multi-select",
      options: ["bank/prairie/round/pole"]
    },
    {
      name: "Restrooms",
      slug: "restrooms",
      uiType: "multi-select",
      options: ["flush/portable/composting"]
    },
    {
      name: "Overnight Accommodation",
      slug: "overnight-accommodation",
      uiType: "multi-select",
      options: ["on-site/nearby/none"]
    }
  ],
  "venues-spaces/wedding-venues/beach-and-lakeside-wedding-venues": [
    {
      name: "Beach Type",
      slug: "beach-type",
      uiType: "multi-select",
      options: ["sand/pebble/grass"]
    },
    {
      name: "Permit Required",
      slug: "permit-required",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Weather Backup",
      slug: "weather-backup",
      uiType: "multi-select",
      options: ["indoor space/tent/none"]
    },
    {
      name: "Sunset View",
      slug: "sunset-view",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/church-and-religious-wedding-venues": [
    {
      name: "Denomination",
      slug: "denomination",
      uiType: "multi-select",
      options: ["Catholic/Protestant/Orthodox/Jewish/Muslim/Hindu/Other"]
    },
    {
      name: "Same-Sex Ceremony Allowed",
      slug: "same-sex-ceremony-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Non-Member Fee",
      slug: "non-member-fee",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Rehearsal Space",
      slug: "rehearsal-space",
      uiType: "multi-select",
      options: ["on-site/off-site"]
    }
  ],
  "venues-spaces/wedding-venues/diy-wedding-venues": [
    {
      name: "Vendor Restrictions",
      slug: "vendor-restrictions",
      uiType: "multi-select",
      options: ["none/catering only/bar only/all permitted"]
    },
    {
      name: "Kitchen Access",
      slug: "kitchen-access",
      uiType: "multi-select",
      options: ["full/commercial/none"]
    },
    {
      name: "Load-in Time",
      slug: "load-in-time",
      uiType: "multi-select",
      options: ["hours before event"]
    }
  ],
  "venues-spaces/wedding-venues/elopement-packages": [
    {
      name: "Ceremony Only Price",
      slug: "ceremony-only-price",
      uiType: "numeric",
      options: []
    },
    {
      name: "Photography Included",
      slug: "photography-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Officiant Included",
      slug: "officiant-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Witnesses Provided",
      slug: "witnesses-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/historic-wedding-venues": [
    {
      name: "Era Built",
      slug: "era-built",
      uiType: "multi-select",
      options: ["1800s/1900s/1920s/1950s+"]
    },
    {
      name: "Historic Registry",
      slug: "historic-registry",
      uiType: "multi-select",
      options: ["local/state/national"]
    },
    {
      name: "Original Features",
      slug: "original-features",
      uiType: "multi-select",
      options: ["fireplace/courtyard/stained glass/hardwood"]
    }
  ],
  "venues-spaces/wedding-venues/hotel-wedding-venues": [
    {
      name: "Guest Rooms On-Site",
      slug: "guest-rooms-on-site",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Bridal Suite Included",
      slug: "bridal-suite-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restaurant On-Site",
      slug: "restaurant-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Room Block Guarantee",
      slug: "room-block-guarantee",
      uiType: "multi-select",
      options: ["attrition policy"]
    }
  ],
  "venues-spaces/wedding-venues/indoor-wedding-venues": [
    {
      name: "Ceiling Height",
      slug: "ceiling-height",
      uiType: "multi-select",
      options: ["low/standard/high/cathedral"]
    },
    {
      name: "Columns",
      slug: "columns",
      uiType: "multi-select",
      options: ["none/few/many"]
    },
    {
      name: "Built-in AV",
      slug: "built-in-av",
      uiType: "toggle",
      options: []
    },
    {
      name: "Natural Light",
      slug: "natural-light",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/loft-and-warehouse-wedding-venues": [
    {
      name: "Square Footage",
      slug: "square-footage",
      uiType: "numeric",
      options: []
    },
    {
      name: "Original Exposed Elements",
      slug: "original-exposed-elements",
      uiType: "multi-select",
      options: ["brick/beams/pipes/concrete"]
    },
    {
      name: "Loading Dock Access",
      slug: "loading-dock-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Elevator",
      slug: "elevator",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/micro-wedding-venues": [
    {
      name: "Minimum Guest Count",
      slug: "minimum-guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Maximum Guest Count",
      slug: "maximum-guest-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Elopement Packages",
      slug: "elopement-packages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weekday Discount",
      slug: "weekday-discount",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/mountain-and-scenic-view-wedding-venues": [
    {
      name: "Elevation",
      slug: "elevation",
      uiType: "multi-select",
      options: ["numeric feet"]
    },
    {
      name: "Overlook Access",
      slug: "overlook-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hiking Trail Access",
      slug: "hiking-trail-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chairlift/Ropeway",
      slug: "chairlift-ropeway",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/museum-and-art-gallery-wedding-venues": [
    {
      name: "Exhibit Access During Reception",
      slug: "exhibit-access-during-reception",
      uiType: "toggle",
      options: []
    },
    {
      name: "Art Handling Fee",
      slug: "art-handling-fee",
      uiType: "multi-select",
      options: ["yes/no amount"]
    },
    {
      name: "Photography Permit",
      slug: "photography-permit",
      uiType: "multi-select",
      options: ["included/extra/restricted"]
    },
    {
      name: "After-Hours Only",
      slug: "after-hours-only",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/outdoor-garden-wedding-venues": [
    {
      name: "Rain Backup",
      slug: "rain-backup",
      uiType: "multi-select",
      options: ["indoor space/tent/none"]
    },
    {
      name: "Outdoor Ceremony Capacity",
      slug: "outdoor-ceremony-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Garden Type",
      slug: "garden-type",
      uiType: "multi-select",
      options: ["botanical/rose/woodland/formal"]
    },
    {
      name: "Season Availability",
      slug: "season-availability",
      uiType: "multi-select",
      options: ["spring/summer/fall/winter"]
    }
  ],
  "venues-spaces/wedding-venues/vineyard-and-winery-wedding-venues": [
    {
      name: "Wine Included",
      slug: "wine-included",
      uiType: "multi-select",
      options: ["per bottle/per person/consumption bar"]
    },
    {
      name: "Harvest Season Availability",
      slug: "harvest-season-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Indoor Cellar Option",
      slug: "indoor-cellar-option",
      uiType: "toggle",
      options: []
    }
  ],
  "venues-spaces/wedding-venues/waterfront-wedding-venues": [
    {
      name: "Water Type",
      slug: "water-type",
      uiType: "multi-select",
      options: ["lake/river/bay/pond"]
    },
    {
      name: "Dock Access",
      slug: "dock-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Boat Arrival Permitted",
      slug: "boat-arrival-permitted",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sunset View",
      slug: "sunset-view",
      uiType: "toggle",
      options: []
    }
  ]
};

// ─── Dynamic L4 Filters (apply to specific L4 sub-categories) ───
// Key format: "l1-slug/l2-slug/l3-slug/l4-slug"
export const l4DynamicFilters: Record<string, FilterDefinition[]> = {
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/bridal-hair-and-makeup-combined": [
    {
      name: "Package Discount",
      slug: "package-discount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Trial Combined",
      slug: "trial-combined",
      uiType: "toggle",
      options: []
    },
    {
      name: "Getting Ready Location",
      slug: "getting-ready-location",
      uiType: "multi-select",
      options: ["studio/hotel/venue"]
    },
    {
      name: "Time Per Person",
      slug: "time-per-person",
      uiType: "multi-select",
      options: ["minutes"]
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/bridal-hair-only": [
    {
      name: "Hair Styles",
      slug: "hair-styles",
      uiType: "multi-select",
      options: ["updo/half-up/down/braided"]
    },
    {
      name: "Trial Included",
      slug: "trial-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Veil Installation",
      slug: "veil-installation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Travel to Venue",
      slug: "travel-to-venue",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/bridal-makeup-only": [
    {
      name: "Makeup Styles",
      slug: "makeup-styles",
      uiType: "multi-select",
      options: ["natural/glam/airbrush"]
    },
    {
      name: "Trial Included",
      slug: "trial-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fake Lashes Included",
      slug: "fake-lashes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Touch-Up Kit",
      slug: "touch-up-kit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/bridal-party-hair-and-makeup": [
    {
      name: "Party Size",
      slug: "party-size",
      uiType: "multi-select",
      options: ["2-4/5-8/9-12/12+"]
    },
    {
      name: "Artist Team Size",
      slug: "artist-team-size",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Group Discount",
      slug: "group-discount",
      uiType: "toggle",
      options: []
    },
    {
      name: "Scheduling Coordination",
      slug: "scheduling-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/bridal-trial-sessions": [
    {
      name: "Trial Duration",
      slug: "trial-duration",
      uiType: "multi-select",
      options: ["1/1.5/2 hours"]
    },
    {
      name: "Look Changes",
      slug: "look-changes",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Photo Test",
      slug: "photo-test",
      uiType: "toggle",
      options: []
    },
    {
      name: "Product List Provided",
      slug: "product-list-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/cultural-bridal-hair-and-makeup": [
    {
      name: "Culture Specialization",
      slug: "culture-specialization",
      uiType: "multi-select",
      options: ["Indian/Latin/African/Middle Eastern/East Asian"]
    },
    {
      name: "Traditional Techniques",
      slug: "traditional-techniques",
      uiType: "toggle",
      options: []
    },
    {
      name: "Jewelry Application",
      slug: "jewelry-application",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dupatta/Veil Pinning",
      slug: "dupatta-veil-pinning",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/destination-wedding-hair-and-makeup": [
    {
      name: "Travel Included",
      slug: "travel-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Destination Type",
      slug: "destination-type",
      uiType: "multi-select",
      options: ["beach/mountain/city"]
    },
    {
      name: "Local Products",
      slug: "local-products",
      uiType: "toggle",
      options: []
    },
    {
      name: "Humidity Resistant",
      slug: "humidity-resistant",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/elopement-hair-and-makeup": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["2-10/11-20"]
    },
    {
      name: "Mini Package",
      slug: "mini-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shorter Duration",
      slug: "shorter-duration",
      uiType: "multi-select",
      options: ["1-2 hours"]
    },
    {
      name: "Location Flexibility",
      slug: "location-flexibility",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/bridal-hair-and-makeup/lgbtqplus-bridal-hair-and-makeup": [
    {
      name: "Gender-Neutral Terms",
      slug: "gender-neutral-terms",
      uiType: "toggle",
      options: []
    },
    {
      name: "Inclusive Portfolio",
      slug: "inclusive-portfolio",
      uiType: "toggle",
      options: []
    },
    {
      name: "All Pronoun Welcome",
      slug: "all-pronoun-welcome",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pride Event Experience",
      slug: "pride-event-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/blowout-specialists": [
    {
      name: "Blowout Styles",
      slug: "blowout-styles",
      uiType: "multi-select",
      options: ["straight/voluminous/wavy"]
    },
    {
      name: "Round Brush Technique",
      slug: "round-brush-technique",
      uiType: "toggle",
      options: []
    },
    {
      name: "Product Included",
      slug: "product-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/braiding-specialists": [
    {
      name: "Braid Types",
      slug: "braid-types",
      uiType: "multi-select",
      options: ["box/cornrows/French/Dutch/fishtail"]
    },
    {
      name: "Extension Included",
      slug: "extension-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Braid Size",
      slug: "braid-size",
      uiType: "multi-select",
      options: ["small/medium/large"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/coily-hair-specialists": [
    {
      name: "Coil Pattern",
      slug: "coil-pattern",
      uiType: "multi-select",
      options: ["4A/4B/4C"]
    },
    {
      name: "Protective Styling",
      slug: "protective-styling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shrinkage Management",
      slug: "shrinkage-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hydration Focus",
      slug: "hydration-focus",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/curly-hair-specialists": [
    {
      name: "Curl Pattern",
      slug: "curl-pattern",
      uiType: "multi-select",
      options: ["3A/3B/3C/4A/4B/4C"]
    },
    {
      name: "Dry Cutting Technique",
      slug: "dry-cutting-technique",
      uiType: "toggle",
      options: []
    },
    {
      name: "Product Recommendations",
      slug: "product-recommendations",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wash & Go",
      slug: "wash-and-go",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/extension-specialists": [
    {
      name: "Extension Method",
      slug: "extension-method",
      uiType: "multi-select",
      options: ["clip-in/tape-in/sew-in/fusion"]
    },
    {
      name: "Hair Type",
      slug: "hair-type",
      uiType: "multi-select",
      options: ["human/synthetic"]
    },
    {
      name: "Color Matching",
      slug: "color-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Removal Included",
      slug: "removal-included",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/kids-hair": [
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["2-5/5-8/8-12"]
    },
    {
      name: "Style Types",
      slug: "style-types",
      uiType: "multi-select",
      options: ["curls/braids/updos"]
    },
    {
      name: "Kid-Friendly Products",
      slug: "kid-friendly-products",
      uiType: "toggle",
      options: []
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["30 min/1 hour"]
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/mens-grooming": [
    {
      name: "Service Type",
      slug: "service-type",
      uiType: "multi-select",
      options: ["haircut/beard trim/both"]
    },
    {
      name: "Hot Towel Shave",
      slug: "hot-towel-shave",
      uiType: "toggle",
      options: []
    },
    {
      name: "Eyebrow Grooming",
      slug: "eyebrow-grooming",
      uiType: "toggle",
      options: []
    },
    {
      name: "On-Site",
      slug: "on-site",
      uiType: "multi-select",
      options: ["barbershop/mobile"]
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/natural-hair-specialists": [
    {
      name: "No Heat Policy",
      slug: "no-heat-policy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Protective Styles",
      slug: "protective-styles",
      uiType: "multi-select",
      options: ["box braids/twists/weaves"]
    },
    {
      name: "Scalp Care",
      slug: "scalp-care",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stretching Techniques",
      slug: "stretching-techniques",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/hair-stylists/updo-specialists": [
    {
      name: "Style Types",
      slug: "style-types",
      uiType: "multi-select",
      options: ["bun/chignon/braided/twisted"]
    },
    {
      name: "Pin Count",
      slug: "pin-count",
      uiType: "multi-select",
      options: ["discreet"]
    },
    {
      name: "Veil/Hairpiece Friendly",
      slug: "veil-hairpiece-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Humidity Resistance",
      slug: "humidity-resistance",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/airbrush-makeup": [
    {
      name: "Transfer-Proof",
      slug: "transfer-proof",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water-Resistant",
      slug: "water-resistant",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shine Control",
      slug: "shine-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Trial Required",
      slug: "trial-required",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/body-painting": [
    {
      name: "Coverage Area",
      slug: "coverage-area",
      uiType: "multi-select",
      options: ["partial/half/full"]
    },
    {
      name: "Paint Type",
      slug: "paint-type",
      uiType: "multi-select",
      options: ["water-based/alcohol-based"]
    },
    {
      name: "Time Required",
      slug: "time-required",
      uiType: "multi-select",
      options: ["hours"]
    },
    {
      name: "Photography Package",
      slug: "photography-package",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/editorial-makeup": [
    {
      name: "High Fashion Style",
      slug: "high-fashion-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Graphic Elements",
      slug: "graphic-elements",
      uiType: "toggle",
      options: []
    },
    {
      name: "HD/4K Ready",
      slug: "hd-4k-ready",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photographer Collaboration",
      slug: "photographer-collaboration",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/flawless-makeup": [
    {
      name: "Skin Prep",
      slug: "skin-prep",
      uiType: "multi-select",
      options: ["acne-safe"]
    },
    {
      name: "Coverage Type",
      slug: "coverage-type",
      uiType: "multi-select",
      options: ["full/buildable"]
    },
    {
      name: "Texture Minimizing",
      slug: "texture-minimizing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shade Matching Guarantee",
      slug: "shade-matching-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/freckle-tattooing": [
    {
      name: "Freckle Density",
      slug: "freckle-density",
      uiType: "multi-select",
      options: ["light/medium/heavy"]
    },
    {
      name: "Natural Placement",
      slug: "natural-placement",
      uiType: "toggle",
      options: []
    },
    {
      name: "Semi-Permanent",
      slug: "semi-permanent",
      uiType: "multi-select",
      options: ["3-5 days"]
    },
    {
      name: "Touch-Up Included",
      slug: "touch-up-included",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/glam-makeup": [
    {
      name: "Coverage Level",
      slug: "coverage-level",
      uiType: "multi-select",
      options: ["full"]
    },
    {
      name: "False Lashes Included",
      slug: "false-lashes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Highlight/Contour",
      slug: "highlight-contour",
      uiType: "toggle",
      options: []
    },
    {
      name: "Long-Wear Formula",
      slug: "long-wear-formula",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/natural-makeup": [
    {
      name: "Skin Finish",
      slug: "skin-finish",
      uiType: "multi-select",
      options: ["dewy/natural/matte"]
    },
    {
      name: "Coverage Level",
      slug: "coverage-level",
      uiType: "multi-select",
      options: ["sheer/light"]
    },
    {
      name: "SPF Included",
      slug: "spf-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Skin Prep Included",
      slug: "skin-prep-included",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-artists/sfx-makeup": [
    {
      name: "Prosthetics",
      slug: "prosthetics",
      uiType: "toggle",
      options: []
    },
    {
      name: "Latex/Silicone Work",
      slug: "latex-silicone-work",
      uiType: "toggle",
      options: []
    },
    {
      name: "Blood/Gore",
      slug: "blood-gore",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fantasy Character",
      slug: "fantasy-character",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/airbrush-finish": [
    {
      name: "Airbrush Applied",
      slug: "airbrush-applied",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flawless Texture",
      slug: "flawless-texture",
      uiType: "toggle",
      options: []
    },
    {
      name: "Even Coverage",
      slug: "even-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wedding Popular",
      slug: "wedding-popular",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/bold-lip": [
    {
      name: "Lip Colors",
      slug: "lip-colors",
      uiType: "multi-select",
      options: ["red/burgundy/purple/dark"]
    },
    {
      name: "Matte/Gloss",
      slug: "matte-gloss",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Long-Wear Formula",
      slug: "long-wear-formula",
      uiType: "toggle",
      options: []
    },
    {
      name: "Statement Look",
      slug: "statement-look",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/cut-crease": [
    {
      name: "Precision Required",
      slug: "precision-required",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Color Blocking",
      slug: "color-blocking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Eye Shape",
      slug: "eye-shape",
      uiType: "multi-select",
      options: ["any"]
    },
    {
      name: "Instagram Popular",
      slug: "instagram-popular",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/editorial-high-fashion": [
    {
      name: "Runway Inspired",
      slug: "runway-inspired",
      uiType: "toggle",
      options: []
    },
    {
      name: "Creative Techniques",
      slug: "creative-techniques",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photoshoot Ready",
      slug: "photoshoot-ready",
      uiType: "toggle",
      options: []
    },
    {
      name: "Unique Designs",
      slug: "unique-designs",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/full-glam": [
    {
      name: "Full Coverage",
      slug: "full-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dramatic Lashes",
      slug: "dramatic-lashes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heavy Contour",
      slug: "heavy-contour",
      uiType: "toggle",
      options: []
    },
    {
      name: "Evening Events",
      slug: "evening-events",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/glass-skin": [
    {
      name: "Dewy Finish",
      slug: "dewy-finish",
      uiType: "toggle",
      options: []
    },
    {
      name: "High Shine",
      slug: "high-shine",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hydrating Products",
      slug: "hydrating-products",
      uiType: "toggle",
      options: []
    },
    {
      name: "Youthful Glow",
      slug: "youthful-glow",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/graphic-liner": [
    {
      name: "Liner Styles",
      slug: "liner-styles",
      uiType: "multi-select",
      options: ["winged/double/geometric/color"]
    },
    {
      name: "Precision Required",
      slug: "precision-required",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Trendy",
      slug: "trendy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Creative",
      slug: "creative",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/matte-finish": [
    {
      name: "Matte Finish",
      slug: "matte-finish",
      uiType: "toggle",
      options: []
    },
    {
      name: "Oil Control",
      slug: "oil-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Shine",
      slug: "no-shine",
      uiType: "toggle",
      options: []
    },
    {
      name: "Long-Wear",
      slug: "long-wear",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/minimalist-clean-girl": [
    {
      name: "Clean Aesthetic",
      slug: "clean-aesthetic",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Makeup Look",
      slug: "no-makeup-look",
      uiType: "toggle",
      options: []
    },
    {
      name: "Glossy Skin",
      slug: "glossy-skin",
      uiType: "toggle",
      options: []
    },
    {
      name: "Effortless",
      slug: "effortless",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/natural-no-makeup-makeup": [
    {
      name: "Skin-Like Finish",
      slug: "skin-like-finish",
      uiType: "toggle",
      options: []
    },
    {
      name: "Light Coverage",
      slug: "light-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Minimal Product",
      slug: "minimal-product",
      uiType: "toggle",
      options: []
    },
    {
      name: "Everyday Wear",
      slug: "everyday-wear",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/smokey-eye": [
    {
      name: "Smokey Intensity",
      slug: "smokey-intensity",
      uiType: "multi-select",
      options: ["light/medium/heavy/dark"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["black/brown/color"]
    },
    {
      name: "Blending Quality",
      slug: "blending-quality",
      uiType: "multi-select",
      options: ["expert"]
    },
    {
      name: "Occasion",
      slug: "occasion",
      uiType: "multi-select",
      options: ["evening/party"]
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/soft-glam": [
    {
      name: "Soft Shimmer",
      slug: "soft-shimmer",
      uiType: "toggle",
      options: []
    },
    {
      name: "Neutral Tones",
      slug: "neutral-tones",
      uiType: "toggle",
      options: []
    },
    {
      name: "Defined but Natural",
      slug: "defined-but-natural",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Popular",
      slug: "bridal-popular",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/makeup-styles/vintage": [
    {
      name: "Era Specific",
      slug: "era-specific",
      uiType: "multi-select",
      options: ["20s/40s/50s/60s/70s/80s"]
    },
    {
      name: "Authentic Techniques",
      slug: "authentic-techniques",
      uiType: "toggle",
      options: []
    },
    {
      name: "Period Appropriate",
      slug: "period-appropriate",
      uiType: "toggle",
      options: []
    },
    {
      name: "Costume Events",
      slug: "costume-events",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/bobbi-brown-laura-mercier-armani-beauty": [
    {
      name: "Natural Finish Brands",
      slug: "natural-finish-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luminous Foundation",
      slug: "luminous-foundation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luxury Texture",
      slug: "luxury-texture",
      uiType: "toggle",
      options: []
    },
    {
      name: "Professional Kit",
      slug: "professional-kit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/charlotte-tilbury-pat-mcgrath": [
    {
      name: "Luxury Brands",
      slug: "luxury-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Editorial Quality",
      slug: "editorial-quality",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Experience",
      slug: "bridal-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Price Point",
      slug: "price-point",
      uiType: "multi-select",
      options: ["premium"]
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/dior-chanel-ysl": [
    {
      name: "High-Fashion Brands",
      slug: "high-fashion-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Editorial Looks",
      slug: "editorial-looks",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luxury Experience",
      slug: "luxury-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Red Carpet Ready",
      slug: "red-carpet-ready",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/hypoallergenic-brands": [
    {
      name: "Hypoallergenic",
      slug: "hypoallergenic",
      uiType: "toggle",
      options: []
    },
    {
      name: "Allergy Tested",
      slug: "allergy-tested",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fragrance-Free Options",
      slug: "fragrance-free-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dermatologist Recommended",
      slug: "dermatologist-recommended",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/mac-nars-fenty-urban-decay": [
    {
      name: "Brand Familiarity",
      slug: "brand-familiarity",
      uiType: "multi-select",
      options: ["professional"]
    },
    {
      name: "Shade Range",
      slug: "shade-range",
      uiType: "multi-select",
      options: ["extended"]
    },
    {
      name: "Product Knowledge",
      slug: "product-knowledge",
      uiType: "multi-select",
      options: ["expert"]
    },
    {
      name: "Availability",
      slug: "availability",
      uiType: "multi-select",
      options: ["stocked"]
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/make-up-for-ever-kryolan": [
    {
      name: "SFX Brands",
      slug: "sfx-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Professional Grade",
      slug: "professional-grade",
      uiType: "toggle",
      options: []
    },
    {
      name: "Camera Ready",
      slug: "camera-ready",
      uiType: "toggle",
      options: []
    },
    {
      name: "Long-Wear Formula",
      slug: "long-wear-formula",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/non-comedogenic-brands": [
    {
      name: "Non-Comedogenic",
      slug: "non-comedogenic",
      uiType: "toggle",
      options: []
    },
    {
      name: "Oil-Free",
      slug: "oil-free",
      uiType: "toggle",
      options: []
    },
    {
      name: "Acne-Safe",
      slug: "acne-safe",
      uiType: "toggle",
      options: []
    },
    {
      name: "Matte Finish",
      slug: "matte-finish",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/rare-beauty-clinique-este-lauder": [
    {
      name: "Skin-Friendly Brands",
      slug: "skin-friendly-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sensitive Skin Options",
      slug: "sensitive-skin-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mature Skin",
      slug: "mature-skin",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dermatologist Tested",
      slug: "dermatologist-tested",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/tarte-too-faced-anastasia-beverly-hills": [
    {
      name: "Mid-Range Brands",
      slug: "mid-range-brands",
      uiType: "toggle",
      options: []
    },
    {
      name: "Brow Expertise",
      slug: "brow-expertise",
      uiType: "multi-select",
      options: ["Anastasia"]
    },
    {
      name: "Amazonian Clay",
      slug: "amazonian-clay",
      uiType: "multi-select",
      options: ["Tarte"]
    },
    {
      name: "Trend Focus",
      slug: "trend-focus",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/product-brand-expertise/vegan-and-cruelty-free-brands": [
    {
      name: "Vegan Products",
      slug: "vegan-products",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cruelty-Free Certified",
      slug: "cruelty-free-certified",
      uiType: "toggle",
      options: []
    },
    {
      name: "Leaping Bunny",
      slug: "leaping-bunny",
      uiType: "toggle",
      options: []
    },
    {
      name: "Plant-Based Formulas",
      slug: "plant-based-formulas",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/all-skin-tones": [
    {
      name: "Inclusive Portfolio",
      slug: "inclusive-portfolio",
      uiType: "toggle",
      options: []
    },
    {
      name: "All Shades Stocked",
      slug: "all-shades-stocked",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Mixing",
      slug: "custom-mixing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Matching Guarantee",
      slug: "color-matching-guarantee",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/asian-makeup-artist": [
    {
      name: "Asian-Owned",
      slug: "asian-owned",
      uiType: "toggle",
      options: []
    },
    {
      name: "Monolid Techniques",
      slug: "monolid-techniques",
      uiType: "toggle",
      options: []
    },
    {
      name: "Double Lid Tape",
      slug: "double-lid-tape",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dewy Finish",
      slug: "dewy-finish",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/black-owned-makeup-artist": [
    {
      name: "Black-Owned Business",
      slug: "black-owned-business",
      uiType: "toggle",
      options: []
    },
    {
      name: "African American Specialization",
      slug: "african-american-specialization",
      uiType: "toggle",
      options: []
    },
    {
      name: "Natural Hair Knowledge",
      slug: "natural-hair-knowledge",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Experience",
      slug: "bridal-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/brown-skin-specialist": [
    {
      name: "Hyperpigmentation Management",
      slug: "hyperpigmentation-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Foundation Matching",
      slug: "foundation-matching",
      uiType: "multi-select",
      options: ["extended"]
    },
    {
      name: "Highlight/Contrast",
      slug: "highlight-contrast",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flash Photography",
      slug: "flash-photography",
      uiType: "multi-select",
      options: ["no flashback"]
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/dark-skin-specialist": [
    {
      name: "Deep Skin Experience",
      slug: "deep-skin-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Foundation Range",
      slug: "foundation-range",
      uiType: "multi-select",
      options: ["deepest shades"]
    },
    {
      name: "No Ashy Finish",
      slug: "no-ashy-finish",
      uiType: "toggle",
      options: []
    },
    {
      name: "Jewel Tones",
      slug: "jewel-tones",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/deep-skin-specialist": [
    {
      name: "Very Dark Skin",
      slug: "very-dark-skin",
      uiType: "multi-select",
      options: ["Fitzpatrick VI"]
    },
    {
      name: "High Pigment Products",
      slug: "high-pigment-products",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Gray Cast",
      slug: "no-gray-cast",
      uiType: "toggle",
      options: []
    },
    {
      name: "Editorial Work",
      slug: "editorial-work",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/fair-skin-specialist": [
    {
      name: "Sun Sensitivity",
      slug: "sun-sensitivity",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cool/Warm Undertone",
      slug: "cool-warm-undertone",
      uiType: "multi-select",
      options: ["matching"]
    },
    {
      name: "SPF Included",
      slug: "spf-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Freckle Work",
      slug: "freckle-work",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/latina-makeup-artist": [
    {
      name: "Latina-Owned",
      slug: "latina-owned",
      uiType: "toggle",
      options: []
    },
    {
      name: "Latin Features",
      slug: "latin-features",
      uiType: "multi-select",
      options: ["almond eyes/fuller lips"]
    },
    {
      name: "Warm Undertones",
      slug: "warm-undertones",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quinceañera Experience",
      slug: "quinceaera-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/light-medium-skin-specialist": [
    {
      name: "Undertone Matching",
      slug: "undertone-matching",
      uiType: "multi-select",
      options: ["warm/cool/neutral"]
    },
    {
      name: "Foundation Range",
      slug: "foundation-range",
      uiType: "multi-select",
      options: ["extended"]
    },
    {
      name: "Bronzer Application",
      slug: "bronzer-application",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/middle-eastern-makeup-artist": [
    {
      name: "Middle Eastern-Owned",
      slug: "middle-eastern-owned",
      uiType: "toggle",
      options: []
    },
    {
      name: "Heavy Glam",
      slug: "heavy-glam",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hijab-Friendly",
      slug: "hijab-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Experience",
      slug: "bridal-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/olive-tan-skin-specialist": [
    {
      name: "Olive Undertone",
      slug: "olive-undertone",
      uiType: "toggle",
      options: []
    },
    {
      name: "Yellow/Golden Base",
      slug: "yellow-golden-base",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Correction",
      slug: "color-correction",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Experience",
      slug: "bridal-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/hair-makeup/skin-tone-expertise/south-asian-makeup-artist": [
    {
      name: "South Asian-Owned",
      slug: "south-asian-owned",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bridal Experience",
      slug: "bridal-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Jewelry Application",
      slug: "jewelry-application",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dupatta Pinning",
      slug: "dupatta-pinning",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/bridesmaid-dress-alterations/hemming": [
    {
      name: "Dress Length",
      slug: "dress-length",
      uiType: "multi-select",
      options: ["floor/tea/knee/midi"]
    },
    {
      name: "Layers",
      slug: "layers",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Rush Available",
      slug: "rush-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple Dresses",
      slug: "multiple-dresses",
      uiType: "multi-select",
      options: ["group discount"]
    }
  ],
  "beauty-attire/tailors-alterations/bridesmaid-dress-alterations/strap-adjustment": [
    {
      name: "Strap Type",
      slug: "strap-type",
      uiType: "multi-select",
      options: ["thin/wide/convertible"]
    },
    {
      name: "Length Change",
      slug: "length-change",
      uiType: "multi-select",
      options: ["shorten/lengthen"]
    },
    {
      name: "Comfort Fit",
      slug: "comfort-fit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/bridesmaid-dress-alterations/taking-in-letting-out": [
    {
      name: "Size Adjustment",
      slug: "size-adjustment",
      uiType: "multi-select",
      options: ["1/2/3 sizes"]
    },
    {
      name: "Seam Access",
      slug: "seam-access",
      uiType: "multi-select",
      options: ["side/back"]
    },
    {
      name: "Multiple Dresses",
      slug: "multiple-dresses",
      uiType: "multi-select",
      options: ["group discount"]
    },
    {
      name: "Turnaround",
      slug: "turnaround",
      uiType: "multi-select",
      options: ["1/2 weeks"]
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/jacket-sleeve-length": [
    {
      name: "Sleeve Shortening",
      slug: "sleeve-shortening",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Functional Buttons",
      slug: "functional-buttons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Surgeon's Cuffs",
      slug: "surgeons-cuffs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lining Reattachment",
      slug: "lining-reattachment",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/jacket-waist-suppression": [
    {
      name: "Suppression Amount",
      slug: "suppression-amount",
      uiType: "multi-select",
      options: ["1/2/1/1.5/2 inches"]
    },
    {
      name: "Vent Type",
      slug: "vent-type",
      uiType: "multi-select",
      options: ["center/side/none"]
    },
    {
      name: "Canvas Construction",
      slug: "canvas-construction",
      uiType: "multi-select",
      options: ["floating/fused"]
    },
    {
      name: "Turnaround",
      slug: "turnaround",
      uiType: "multi-select",
      options: ["1/2 weeks"]
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/pant-hem": [
    {
      name: "Hem Style",
      slug: "hem-style",
      uiType: "multi-select",
      options: ["plain/cuffed"]
    },
    {
      name: "Break",
      slug: "break",
      uiType: "multi-select",
      options: ["full/half/no break"]
    },
    {
      name: "Turnaround",
      slug: "turnaround",
      uiType: "multi-select",
      options: ["3-5 days"]
    },
    {
      name: "Rush Available",
      slug: "rush-available",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/pant-taper": [
    {
      name: "Leg Opening Reduction",
      slug: "leg-opening-reduction",
      uiType: "multi-select",
      options: ["1/2/1/1.5 inches"]
    },
    {
      name: "Full Taper from Knee",
      slug: "full-taper-from-knee",
      uiType: "toggle",
      options: []
    },
    {
      name: "Modern Fit",
      slug: "modern-fit",
      uiType: "toggle",
      options: []
    },
    {
      name: "Original Hem Retained",
      slug: "original-hem-retained",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/pant-waist": [
    {
      name: "Waist Adjustment",
      slug: "waist-adjustment",
      uiType: "multi-select",
      options: ["1/2/1/1.5/2 inches"]
    },
    {
      name: "Seat Adjustment",
      slug: "seat-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Belt Loops",
      slug: "belt-loops",
      uiType: "toggle",
      options: []
    },
    {
      name: "Side Tab Adjusters",
      slug: "side-tab-adjusters",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/shirt-sleeve-length": [
    {
      name: "Sleeve Shortening",
      slug: "sleeve-shortening",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Placket Preservation",
      slug: "placket-preservation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Button Reposition",
      slug: "button-reposition",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cuff Replacement",
      slug: "cuff-replacement",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/shirt-torso": [
    {
      name: "Side Seam Taper",
      slug: "side-seam-taper",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dart Addition",
      slug: "dart-addition",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tuck-in Length",
      slug: "tuck-in-length",
      uiType: "toggle",
      options: []
    },
    {
      name: "Slim Fit",
      slug: "slim-fit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/suit-and-tuxedo-alterations/vest-adjustment": [
    {
      name: "Side Seam",
      slug: "side-seam",
      uiType: "toggle",
      options: []
    },
    {
      name: "Center Back",
      slug: "center-back",
      uiType: "toggle",
      options: []
    },
    {
      name: "Length Adjustment",
      slug: "length-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Button Reposition",
      slug: "button-reposition",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/adding-bustle": [
    {
      name: "Bustle Style",
      slug: "bustle-style",
      uiType: "multi-select",
      options: ["American/French/Ballroom/Austrian"]
    },
    {
      name: "Point Count",
      slug: "point-count",
      uiType: "multi-select",
      options: ["3/5/7/9+ points"]
    },
    {
      name: "Bustle Instructions",
      slug: "bustle-instructions",
      uiType: "multi-select",
      options: ["provided to bridal party"]
    },
    {
      name: "Train Length",
      slug: "train-length",
      uiType: "multi-select",
      options: ["sweep/chapel/cathedral"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/adding-sleeves": [
    {
      name: "Sleeve Type",
      slug: "sleeve-type",
      uiType: "multi-select",
      options: ["cap/long/bell/bishop/detachable"]
    },
    {
      name: "Fabric Matching",
      slug: "fabric-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lace Matching",
      slug: "lace-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Removable Options",
      slug: "removable-options",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/bust-adjustment": [
    {
      name: "Cup Size Change",
      slug: "cup-size-change",
      uiType: "numeric",
      options: []
    },
    {
      name: "Built-in Bra",
      slug: "built-in-bra",
      uiType: "toggle",
      options: []
    },
    {
      name: "Modesty Panel",
      slug: "modesty-panel",
      uiType: "toggle",
      options: []
    },
    {
      name: "Strapless Support",
      slug: "strapless-support",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/corset-back-conversion": [
    {
      name: "Corset Panel Added",
      slug: "corset-panel-added",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ribbon Color",
      slug: "ribbon-color",
      uiType: "multi-select",
      options: ["white/ivory/champagne"]
    },
    {
      name: "Grommets",
      slug: "grommets",
      uiType: "multi-select",
      options: ["metal/plastic"]
    },
    {
      name: "Lace-Up Tightening",
      slug: "lace-up-tightening",
      uiType: "multi-select",
      options: ["customizable"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/cup-insertion": [
    {
      name: "Cup Size",
      slug: "cup-size",
      uiType: "multi-select",
      options: ["A/B/C/D/DD+"]
    },
    {
      name: "Padding Level",
      slug: "padding-level",
      uiType: "multi-select",
      options: ["light/medium/heavy"]
    },
    {
      name: "Sewn-In vs Removable",
      slug: "sewn-in-vs-removable",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Support Level",
      slug: "support-level",
      uiType: "multi-select",
      options: ["low/medium/high"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/heirloom-wedding-dress-restoration": [
    {
      name: "Age of Dress",
      slug: "age-of-dress",
      uiType: "multi-select",
      options: ["10/20/30/40+ years"]
    },
    {
      name: "Yellowing Treatment",
      slug: "yellowing-treatment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stain Removal",
      slug: "stain-removal",
      uiType: "toggle",
      options: []
    },
    {
      name: "Size Adjustment",
      slug: "size-adjustment",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/hemming": [
    {
      name: "Dress Layers",
      slug: "dress-layers",
      uiType: "multi-select",
      options: ["1/2/3/4+ layers"]
    },
    {
      name: "Lace Hem Preservation",
      slug: "lace-hem-preservation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Train Length",
      slug: "train-length",
      uiType: "multi-select",
      options: ["sweep/chapel/cathedral"]
    },
    {
      name: "Turnaround Time",
      slug: "turnaround-time",
      uiType: "multi-select",
      options: ["1/2/3/4 weeks"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/hip-adjustment": [
    {
      name: "Hip Reduction",
      slug: "hip-reduction",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Seam Access",
      slug: "seam-access",
      uiType: "multi-select",
      options: ["side/back"]
    },
    {
      name: "Fit Over Curves",
      slug: "fit-over-curves",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mermaid/Slim Fit",
      slug: "mermaid-slim-fit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/lace-repair-and-matching": [
    {
      name: "Lace Type",
      slug: "lace-type",
      uiType: "multi-select",
      options: ["applique/embroidered/cutwork"]
    },
    {
      name: "Donor Lace Available",
      slug: "donor-lace-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Invisible Mending",
      slug: "invisible-mending",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Matching",
      slug: "color-matching",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/letting-out": [
    {
      name: "Size Increase",
      slug: "size-increase",
      uiType: "multi-select",
      options: ["1/2 sizes"]
    },
    {
      name: "Seam Allowance",
      slug: "seam-allowance",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Lace Matching",
      slug: "lace-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Success Rate",
      slug: "success-rate",
      uiType: "multi-select",
      options: ["percentage"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/removing-sleeves": [
    {
      name: "Convert to Strapless",
      slug: "convert-to-strapless",
      uiType: "toggle",
      options: []
    },
    {
      name: "Convert to Spaghetti Strap",
      slug: "convert-to-spaghetti-strap",
      uiType: "toggle",
      options: []
    },
    {
      name: "Armhole Reshaping",
      slug: "armhole-reshaping",
      uiType: "toggle",
      options: []
    },
    {
      name: "Boning Added",
      slug: "boning-added",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/shoulder-adjustment": [
    {
      name: "Shoulder Width Reduction",
      slug: "shoulder-width-reduction",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Sleeve Adjustment",
      slug: "sleeve-adjustment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cap Sleeve/Strapless",
      slug: "cap-sleeve-strapless",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Posture Fit",
      slug: "posture-fit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/strap-shortening-lengthening": [
    {
      name: "Strap Type",
      slug: "strap-type",
      uiType: "multi-select",
      options: ["thin/wide/off-shoulder/detachable"]
    },
    {
      name: "Beadwork Matching",
      slug: "beadwork-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Comfort Fit",
      slug: "comfort-fit",
      uiType: "toggle",
      options: []
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/taking-in": [
    {
      name: "Size Reduction",
      slug: "size-reduction",
      uiType: "multi-select",
      options: ["1/2/3/4+ sizes"]
    },
    {
      name: "Seam Type",
      slug: "seam-type",
      uiType: "multi-select",
      options: ["side/back/ princess seams"]
    },
    {
      name: "Rush Available",
      slug: "rush-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple Fittings",
      slug: "multiple-fittings",
      uiType: "multi-select",
      options: ["1/2/3"]
    }
  ],
  "beauty-attire/tailors-alterations/wedding-dress-alterations/waist-adjustment": [
    {
      name: "Waist Reduction",
      slug: "waist-reduction",
      uiType: "multi-select",
      options: ["inches"]
    },
    {
      name: "Seam Access",
      slug: "seam-access",
      uiType: "multi-select",
      options: ["side/back"]
    },
    {
      name: "Corset Conversion Option",
      slug: "corset-conversion-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Natural Waist vs Dropped",
      slug: "natural-waist-vs-dropped",
      uiType: "multi-select",
      options: ["both"]
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/anniversary-cakes": [
    {
      name: "Year Number",
      slug: "year-number",
      uiType: "multi-select",
      options: ["1/5/10/25/50+"]
    },
    {
      name: "Original Wedding Cake Recreation",
      slug: "original-wedding-cake-recreation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Gold Accents",
      slug: "gold-accents",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/baby-shower-cakes": [
    {
      name: "Gender Neutral",
      slug: "gender-neutral",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reveal Cake",
      slug: "reveal-cake",
      uiType: "multi-select",
      options: ["pink/blue inside", "yes/no"]
    },
    {
      name: "Theme",
      slug: "theme",
      uiType: "multi-select",
      options: ["animals/abc/neutral"]
    },
    {
      name: "Mini Cakes Available",
      slug: "mini-cakes-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/bar-bat-mitzvah-cakes": [
    {
      name: "Theme Matching",
      slug: "theme-matching",
      uiType: "multi-select",
      options: ["party theme"]
    },
    {
      name: "Torah or Star of David Design",
      slug: "torah-or-star-of-david-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Candy Integration",
      slug: "candy-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/birthday-cakes": [
    {
      name: "Age Number",
      slug: "age-number",
      uiType: "multi-select",
      options: ["1-12/13-17/18-20/21+/30+/40+/50+"]
    },
    {
      name: "Character Licensing",
      slug: "character-licensing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Cake",
      slug: "photo-cake",
      uiType: "toggle",
      options: []
    },
    {
      name: "Filling Options",
      slug: "filling-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/bridal-shower-cakes": [
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["elegant/romantic/floral/modern"]
    },
    {
      name: "Color Palette Matching",
      slug: "color-palette-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Topper Included",
      slug: "cake-topper-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery & Setup",
      slug: "delivery-and-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/gender-reveal-cakes": [
    {
      name: "Reveal Inside",
      slug: "reveal-inside",
      uiType: "multi-select",
      options: ["pink/blue"]
    },
    {
      name: "Smash Cake Option",
      slug: "smash-cake-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cupcake Reveal",
      slug: "cupcake-reveal",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mini Reveal Cakes",
      slug: "mini-reveal-cakes",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/graduation-cakes": [
    {
      name: "School Colors",
      slug: "school-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cap & Gown Design",
      slug: "cap-and-gown-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Diploma Detail",
      slug: "diploma-detail",
      uiType: "toggle",
      options: []
    },
    {
      name: "Class Year",
      slug: "class-year",
      uiType: "multi-select",
      options: ["2024/2025/etc."]
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/holiday-cakes": [
    {
      name: "Holiday Theme",
      slug: "holiday-theme",
      uiType: "multi-select",
      options: ["Christmas/Easter/Hanukkah/Thanksgiving"]
    },
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["traditional/modern"]
    },
    {
      name: "Serving Size",
      slug: "serving-size",
      uiType: "multi-select",
      options: ["8/10/12+"]
    },
    {
      name: "Delivery Available",
      slug: "delivery-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/quinceaera-cakes": [
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Crown Topper",
      slug: "crown-topper",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Matching",
      slug: "color-matching",
      uiType: "multi-select",
      options: ["dress color"]
    },
    {
      name: "Doll Included",
      slug: "doll-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/retirement-cakes": [
    {
      name: "Age Number",
      slug: "age-number",
      uiType: "numeric",
      options: []
    },
    {
      name: "\"Happy Retirement\" Message",
      slug: "happy-retirement-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hobby Theme",
      slug: "hobby-theme",
      uiType: "multi-select",
      options: ["golf/travel/reading/etc."]
    },
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["1/2/3+"]
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/sweet-16-cakes": [
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Number 16 Design",
      slug: "number-16-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sparklers Included",
      slug: "sparklers-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Cake",
      slug: "photo-cake",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/custom-cakes/wedding-cakes": [
    {
      name: "Tier Count",
      slug: "tier-count",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Tasting Session",
      slug: "tasting-session",
      uiType: "multi-select",
      options: ["included/paid/not offered"]
    },
    {
      name: "Flavor Options",
      slug: "flavor-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Design Style",
      slug: "design-style",
      uiType: "multi-select",
      options: ["classic/modern/rustic/elegant"]
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/dairy-free-cakes": [
    {
      name: "Milk Substitute",
      slug: "milk-substitute",
      uiType: "multi-select",
      options: ["oat/almond/soy/coconut"]
    },
    {
      name: "Butter Substitute",
      slug: "butter-substitute",
      uiType: "multi-select",
      options: ["vegan butter/coconut oil"]
    },
    {
      name: "DF Frosting",
      slug: "df-frosting",
      uiType: "toggle",
      options: []
    },
    {
      name: "DF Filling",
      slug: "df-filling",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/gluten-free-cakes": [
    {
      name: "Dedicated GF Kitchen",
      slug: "dedicated-gf-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cross-Contamination Protocol",
      slug: "cross-contamination-protocol",
      uiType: "multi-select",
      options: ["strict/segregated"]
    },
    {
      name: "Flour Blend",
      slug: "flour-blend",
      uiType: "multi-select",
      options: ["rice/almond/coconut/oat"]
    },
    {
      name: "Taste Comparison to Regular",
      slug: "taste-comparison-to-regular",
      uiType: "multi-select",
      options: ["identical/near/noticeable"]
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/keto-cakes": [
    {
      name: "Net Carbs",
      slug: "net-carbs",
      uiType: "multi-select",
      options: ["numeric per slice"]
    },
    {
      name: "Sweetener Type",
      slug: "sweetener-type",
      uiType: "multi-select",
      options: ["erythritol/monk fruit/allulose"]
    },
    {
      name: "Almond Flour Base",
      slug: "almond-flour-base",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dairy Options",
      slug: "dairy-options",
      uiType: "multi-select",
      options: ["full fat/DF"]
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/nut-free-cakes": [
    {
      name: "Dedicated NF Kitchen",
      slug: "dedicated-nf-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ingredient Sourcing",
      slug: "ingredient-sourcing",
      uiType: "multi-select",
      options: ["verified/trusted"]
    },
    {
      name: "Facility Allergen Policy",
      slug: "facility-allergen-policy",
      uiType: "multi-select",
      options: ["nut-free/separate equipment"]
    },
    {
      name: "Cross-Contamination Risk",
      slug: "cross-contamination-risk",
      uiType: "multi-select",
      options: ["none/low"]
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/sugar-free-cakes": [
    {
      name: "Sweetener Type",
      slug: "sweetener-type",
      uiType: "multi-select",
      options: ["stevia/monk fruit/erythritol/allulose"]
    },
    {
      name: "Carb Count",
      slug: "carb-count",
      uiType: "multi-select",
      options: ["numeric per slice"]
    },
    {
      name: "Diabetic Friendly",
      slug: "diabetic-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Taste Rating",
      slug: "taste-rating",
      uiType: "multi-select",
      options: ["customer reviews"]
    }
  ],
  "catering-food/bakeries-desserts/specialty-cakes/vegan-cakes": [
    {
      name: "Dedicated Vegan Kitchen",
      slug: "dedicated-vegan-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Egg Substitute",
      slug: "egg-substitute",
      uiType: "multi-select",
      options: ["flax/applesauce/baking soda/commercial"]
    },
    {
      name: "Dairy-Free Frosting",
      slug: "dairy-free-frosting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Nut-Free Option",
      slug: "nut-free-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/corporate-caterers/boxed-lunch-caterers": [
    {
      name: "Box Style",
      slug: "box-style",
      uiType: "multi-select",
      options: ["brown bag/window box/lunchbox/eco"]
    },
    {
      name: "Entree Options",
      slug: "entree-options",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Dietary Options",
      slug: "dietary-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Time Window",
      slug: "delivery-time-window",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "catering-food/caterers/corporate-caterers/breakfast-meeting-caterers": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["buffet/boxed/plated"]
    },
    {
      name: "Hot Breakfast Options",
      slug: "hot-breakfast-options",
      uiType: "multi-select",
      options: ["eggs/bacon/sausage/potatoes"]
    },
    {
      name: "Coffee Service",
      slug: "coffee-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dietary Options",
      slug: "dietary-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/corporate-caterers/executive-dinner-caterers": [
    {
      name: "Courses",
      slug: "courses",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Plating Style",
      slug: "plating-style",
      uiType: "multi-select",
      options: ["formal/modern"]
    },
    {
      name: "Wine Service",
      slug: "wine-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Dining Setup",
      slug: "private-dining-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/corporate-caterers/holiday-party-caterers": [
    {
      name: "Holiday Menu Options",
      slug: "holiday-menu-options",
      uiType: "multi-select",
      options: ["traditional/contemporary/ethnic"]
    },
    {
      name: "Carving Station",
      slug: "carving-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dessert Table",
      slug: "dessert-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bartending Included",
      slug: "bartending-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/corporate-caterers/lunch-buffet-caterers": [
    {
      name: "Stations",
      slug: "stations",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Setup Time Required",
      slug: "setup-time-required",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Chafing Dishes Included",
      slug: "chafing-dishes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Salad Bar Option",
      slug: "salad-bar-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/african-and-soul-food-caterers": [
    {
      name: "Fried Chicken",
      slug: "fried-chicken",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mac & Cheese",
      slug: "mac-and-cheese",
      uiType: "toggle",
      options: []
    },
    {
      name: "Collard Greens",
      slug: "collard-greens",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cornbread",
      slug: "cornbread",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/caribbean-caterers": [
    {
      name: "Jerk Chicken",
      slug: "jerk-chicken",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rice & Peas",
      slug: "rice-and-peas",
      uiType: "toggle",
      options: []
    },
    {
      name: "Plantains",
      slug: "plantains",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rum Punch",
      slug: "rum-punch",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/chinese-and-asian-caterers": [
    {
      name: "Dim Sum Options",
      slug: "dim-sum-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Noodle Station",
      slug: "noodle-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dumpling Count",
      slug: "dumpling-count",
      uiType: "multi-select",
      options: ["numeric per guest"]
    },
    {
      name: "Fortune Cookies Included",
      slug: "fortune-cookies-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/french-caterers": [
    {
      name: "Course Count",
      slug: "course-count",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Cheese Course",
      slug: "cheese-course",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crepe Station",
      slug: "crepe-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wine Pairing",
      slug: "wine-pairing",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/german-caterers": [
    {
      name: "Bratwurst Options",
      slug: "bratwurst-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Pretzel Station",
      slug: "pretzel-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sauerkraut",
      slug: "sauerkraut",
      uiType: "toggle",
      options: []
    },
    {
      name: "Beer Service",
      slug: "beer-service",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/greek-caterers": [
    {
      name: "Gyro Station",
      slug: "gyro-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spanakopita Count",
      slug: "spanakopita-count",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Greek Salad",
      slug: "greek-salad",
      uiType: "toggle",
      options: []
    },
    {
      name: "Baklava Included",
      slug: "baklava-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/indian-and-south-asian-caterers": [
    {
      name: "Curry Options",
      slug: "curry-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Naan Station",
      slug: "naan-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chai Service",
      slug: "chai-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vegetarian Options",
      slug: "vegetarian-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/italian-caterers": [
    {
      name: "Pasta Types",
      slug: "pasta-types",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Sauce Options",
      slug: "sauce-options",
      uiType: "multi-select",
      options: ["marinara/alfredo/vodka/pesto/bolognese"]
    },
    {
      name: "Antipasto Display",
      slug: "antipasto-display",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tiramisu Included",
      slug: "tiramisu-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/japanese-and-sushi-caterers": [
    {
      name: "Sushi Pieces",
      slug: "sushi-pieces",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Roll Options",
      slug: "roll-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Sashimi Station",
      slug: "sashimi-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Miso Soup",
      slug: "miso-soup",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/mediterranean-and-middle-eastern-caterers": [
    {
      name: "Hummus Bar",
      slug: "hummus-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pita Bread",
      slug: "pita-bread",
      uiType: "multi-select",
      options: ["fresh/warmed"]
    },
    {
      name: "Falafel Station",
      slug: "falafel-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Baklava Included",
      slug: "baklava-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/mexican-and-latin-caterers": [
    {
      name: "Taco Bar",
      slug: "taco-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Enchilada Options",
      slug: "enchilada-options",
      uiType: "multi-select",
      options: ["chicken/beef/cheese/veggie"]
    },
    {
      name: "Churro Cart",
      slug: "churro-cart",
      uiType: "toggle",
      options: []
    },
    {
      name: "Margarita Service",
      slug: "margarita-service",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/polish-and-eastern-european-caterers": [
    {
      name: "Pierogi Count",
      slug: "pierogi-count",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Kielbasa Service",
      slug: "kielbasa-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cabbage Rolls",
      slug: "cabbage-rolls",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vodka Tasting",
      slug: "vodka-tasting",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/cultural-and-ethnic-caterers/thai-and-vietnamese-caterers": [
    {
      name: "Pad Thai Station",
      slug: "pad-thai-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spring Rolls",
      slug: "spring-rolls",
      uiType: "multi-select",
      options: ["per guest"]
    },
    {
      name: "Pho Bar",
      slug: "pho-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sticky Rice",
      slug: "sticky-rice",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/dairy-free-caterers": [
    {
      name: "Dedicated DF Kitchen",
      slug: "dedicated-df-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "DF Cheese Options",
      slug: "df-cheese-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "DF Desserts",
      slug: "df-desserts",
      uiType: "toggle",
      options: []
    },
    {
      name: "Milk Alternatives",
      slug: "milk-alternatives",
      uiType: "multi-select",
      options: ["oat/almond/soy/coconut"]
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/gluten-free-caterers": [
    {
      name: "Dedicated GF Kitchen",
      slug: "dedicated-gf-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cross-Contamination Protocol",
      slug: "cross-contamination-protocol",
      uiType: "multi-select",
      options: ["strict/segregated/none"]
    },
    {
      name: "GF Pasta Options",
      slug: "gf-pasta-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "GF Bread Available",
      slug: "gf-bread-available",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/halal-caterers": [
    {
      name: "Certification",
      slug: "certification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hand-Slaughtered",
      slug: "hand-slaughtered",
      uiType: "toggle",
      options: []
    },
    {
      name: "Zabiha",
      slug: "zabiha",
      uiType: "toggle",
      options: []
    },
    {
      name: "Alcohol-Free Options",
      slug: "alcohol-free-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/keto-and-paleo-caterers": [
    {
      name: "Keto Options",
      slug: "keto-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Paleo Options",
      slug: "paleo-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Both",
      slug: "both",
      uiType: "toggle",
      options: []
    },
    {
      name: "Net Carb Count",
      slug: "net-carb-count",
      uiType: "multi-select",
      options: ["numeric per serving"]
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/kosher-caterers": [
    {
      name: "Certification",
      slug: "certification",
      uiType: "multi-select",
      options: ["Orthodox/Conservative/Reform"]
    },
    {
      name: "Glatt Kosher",
      slug: "glatt-kosher",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dairy/Meat Separation",
      slug: "dairy-meat-separation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shabbat Observance",
      slug: "shabbat-observance",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/nut-free-caterers": [
    {
      name: "Dedicated NF Kitchen",
      slug: "dedicated-nf-kitchen",
      uiType: "toggle",
      options: []
    },
    {
      name: "Nut-Free Facility",
      slug: "nut-free-facility",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ingredient Sourcing",
      slug: "ingredient-sourcing",
      uiType: "multi-select",
      options: ["trusted/verified"]
    },
    {
      name: "Epinephrine On-Site",
      slug: "epinephrine-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/dietary-specific-caterers/vegan-and-vegetarian-caterers": [
    {
      name: "Vegan Only",
      slug: "vegan-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vegetarian Only",
      slug: "vegetarian-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Both",
      slug: "both",
      uiType: "toggle",
      options: []
    },
    {
      name: "Plant-Based Protein Options",
      slug: "plant-based-protein-options",
      uiType: "multi-select",
      options: ["tofu/tempeh/seitan/jackfruit/lentils"]
    }
  ],
  "catering-food/caterers/party-caterers/anniversary-party-caterers": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["plated/buffet/family style"]
    },
    {
      name: "Champagne Toast Included",
      slug: "champagne-toast-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Couple's Plating",
      slug: "couples-plating",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Included",
      slug: "cake-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/backyard-bbq-caterers": [
    {
      name: "Meat Options",
      slug: "meat-options",
      uiType: "multi-select",
      options: ["brisket/pulled pork/ribs/chicken/sausage"]
    },
    {
      name: "Sides",
      slug: "sides",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Sauce Varieties",
      slug: "sauce-varieties",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Grill On-Site",
      slug: "grill-on-site",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/birthday-party-caterers": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["buffet/family style/food stations"]
    },
    {
      name: "Kid-Friendly Options",
      slug: "kid-friendly-options",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Cutting Service",
      slug: "cake-cutting-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Birthday Decor Included",
      slug: "birthday-decor-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/game-day-party-caterers": [
    {
      name: "Wings",
      slug: "wings",
      uiType: "multi-select",
      options: ["bone-in/boneless"]
    },
    {
      name: "Dip Options",
      slug: "dip-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Pizza Included",
      slug: "pizza-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tailgate Setup",
      slug: "tailgate-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/graduation-party-caterers": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["buffet/food trucks/family style"]
    },
    {
      name: "School Colors Decor",
      slug: "school-colors-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Class Photo Area Setup",
      slug: "class-photo-area-setup",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cap & Gown Cake",
      slug: "cap-and-gown-cake",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/holiday-party-caterers": [
    {
      name: "Holiday Menu",
      slug: "holiday-menu",
      uiType: "multi-select",
      options: ["Thanksgiving/Christmas/New Year's/Easter"]
    },
    {
      name: "Turkey Carving",
      slug: "turkey-carving",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pie Station",
      slug: "pie-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Eggnog/Cider Service",
      slug: "eggnog-cider-service",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/party-caterers/pool-party-caterers": [
    {
      name: "Menu Type",
      slug: "menu-type",
      uiType: "multi-select",
      options: ["BBQ/tacos/sandwiches/light fare"]
    },
    {
      name: "Cold Storage",
      slug: "cold-storage",
      uiType: "multi-select",
      options: ["coolers/refrigerated truck"]
    },
    {
      name: "Waterproof Serveware",
      slug: "waterproof-serveware",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ice Cream Cart",
      slug: "ice-cream-cart",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/buffet-caterers": [
    {
      name: "Stations",
      slug: "stations",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Carving Station Included",
      slug: "carving-station-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Count Capacity",
      slug: "guest-count-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Chafing Dishes Included",
      slug: "chafing-dishes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/family-style-caterers": [
    {
      name: "Family Style Platters",
      slug: "family-style-platters",
      uiType: "toggle",
      options: []
    },
    {
      name: "Server-to-Guest Ratio",
      slug: "server-to-guest-ratio",
      uiType: "multi-select",
      options: ["1:20/1:25/1:30"]
    },
    {
      name: "Refill Policy",
      slug: "refill-policy",
      uiType: "multi-select",
      options: ["unlimited/limited"]
    },
    {
      name: "Large Platter Rentals",
      slug: "large-platter-rentals",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/food-station-caterers": [
    {
      name: "Station Types",
      slug: "station-types",
      uiType: "multi-select",
      options: ["pasta/carving/taco/sushi/salad/dessert"]
    },
    {
      name: "Chef Attendance",
      slug: "chef-attendance",
      uiType: "multi-select",
      options: ["yes/no per station"]
    },
    {
      name: "Guest Count Capacity",
      slug: "guest-count-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Custom Menu Design",
      slug: "custom-menu-design",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/late-night-snack-caterers": [
    {
      name: "Snack Types",
      slug: "snack-types",
      uiType: "multi-select",
      options: ["pizza/sliders/tacos/fries/donuts/pizza"]
    },
    {
      name: "Service Window",
      slug: "service-window",
      uiType: "multi-select",
      options: ["9pm/10pm/11pm/midnight"]
    },
    {
      name: "Guest Count Capacity",
      slug: "guest-count-capacity",
      uiType: "numeric",
      options: []
    },
    {
      name: "Paper Goods Included",
      slug: "paper-goods-included",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/passed-appetizer-caterers": [
    {
      name: "Appetizer Count",
      slug: "appetizer-count",
      uiType: "multi-select",
      options: ["4-6/7-9/10-12/12+"]
    },
    {
      name: "Hot vs Cold Ratio",
      slug: "hot-vs-cold-ratio",
      uiType: "multi-select",
      options: ["slider"]
    },
    {
      name: "Staff-to-Guest Ratio",
      slug: "staff-to-guest-ratio",
      uiType: "multi-select",
      options: ["1:30/1:40/1:50"]
    },
    {
      name: "Dietary Options",
      slug: "dietary-options",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/plated-dinner-caterers": [
    {
      name: "Courses",
      slug: "courses",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Plating Style",
      slug: "plating-style",
      uiType: "multi-select",
      options: ["classic/modern/rustic/elegant"]
    },
    {
      name: "Wine Pairing Available",
      slug: "wine-pairing-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vegetarian Entree Option",
      slug: "vegetarian-entree-option",
      uiType: "toggle",
      options: []
    }
  ],
  "catering-food/caterers/wedding-caterers/rehearsal-dinner-caterers": [
    {
      name: "Service Style",
      slug: "service-style",
      uiType: "multi-select",
      options: ["plated/buffet/family style"]
    },
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["10-30/31-60/61-100/100+"]
    },
    {
      name: "Beer/Wine Included",
      slug: "beer-wine-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Private Room Available",
      slug: "private-room-available",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/event-florists/anniversary-party-florists": [
    {
      name: "Milestone Year Flowers",
      slug: "milestone-year-flowers",
      uiType: "multi-select",
      options: ["1-carnation/25-aster/50-gold"]
    },
    {
      name: "Re-Creation of Wedding Flowers",
      slug: "re-creation-of-wedding-flowers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vase Rentals",
      slug: "vase-rentals",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/event-florists/baby-shower-florists": [
    {
      name: "Gender Neutral Palette",
      slug: "gender-neutral-palette",
      uiType: "toggle",
      options: []
    },
    {
      name: "Blue/Pink Palettes",
      slug: "blue-pink-palettes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Small Arrangements",
      slug: "small-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Timing",
      slug: "delivery-timing",
      uiType: "multi-select",
      options: ["day of"]
    }
  ],
  "decor-rentals/florists/event-florists/birthday-party-florists": [
    {
      name: "Age Number Integration",
      slug: "age-number-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Arrangements",
      slug: "themed-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Flowers",
      slug: "cake-flowers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Timing",
      slug: "delivery-timing",
      uiType: "multi-select",
      options: ["day of/before"]
    }
  ],
  "decor-rentals/florists/event-florists/bridal-shower-florists": [
    {
      name: "Bride's Favorite Flowers",
      slug: "brides-favorite-flowers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Brunch Table Arrangements",
      slug: "brunch-table-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Take-Home Arrangements",
      slug: "take-home-arrangements",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/event-florists/corporate-event-florists": [
    {
      name: "Brand Colors Matching",
      slug: "brand-colors-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Reception Desk Arrangements",
      slug: "reception-desk-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "Conference Centerpieces",
      slug: "conference-centerpieces",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multiple Day Setup",
      slug: "multiple-day-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/event-florists/gala-and-fundraiser-florists": [
    {
      name: "High-End Blooms",
      slug: "high-end-blooms",
      uiType: "multi-select",
      options: ["peonies/orchids/gardenias"]
    },
    {
      name: "Stage Arrangements",
      slug: "stage-arrangements",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Table Priority",
      slug: "vip-table-priority",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tall Centerpieces",
      slug: "tall-centerpieces",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/event-florists/holiday-florists": [
    {
      name: "Holiday Specific",
      slug: "holiday-specific",
      uiType: "multi-select",
      options: ["Christmas/Thanksgiving/Easter/Hanukkah"]
    },
    {
      name: "Door Swags",
      slug: "door-swags",
      uiType: "toggle",
      options: []
    },
    {
      name: "Centerpieces",
      slug: "centerpieces",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wreaths",
      slug: "wreaths",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/aisle-and-pew-florists": [
    {
      name: "Aisle Runner Included",
      slug: "aisle-runner-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pew End Count",
      slug: "pew-end-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Flower Petal Alternatives",
      slug: "flower-petal-alternatives",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setup Included",
      slug: "setup-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/boutonniere-and-corsage-specialists": [
    {
      name: "Count Needed",
      slug: "count-needed",
      uiType: "numeric",
      options: []
    },
    {
      name: "Flower Matching",
      slug: "flower-matching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wrist vs Pin",
      slug: "wrist-vs-pin",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/bridal-bouquet-specialists": [
    {
      name: "Bouquet Style",
      slug: "bouquet-style",
      uiType: "multi-select",
      options: ["cascading/round/hand-tied/posy"]
    },
    {
      name: "Flower Seasonality",
      slug: "flower-seasonality",
      uiType: "multi-select",
      options: ["spring/summer/fall/winter"]
    },
    {
      name: "Color Matching",
      slug: "color-matching",
      uiType: "multi-select",
      options: ["Pantone/RGB"]
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/bridesmaid-bouquet-specialists": [
    {
      name: "Bouquet Count",
      slug: "bouquet-count",
      uiType: "multi-select",
      options: ["1-4/5-8/9-12/12+"]
    },
    {
      name: "Miniature Version of Bridal",
      slug: "miniature-version-of-bridal",
      uiType: "toggle",
      options: []
    },
    {
      name: "Color Coordinated",
      slug: "color-coordinated",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/ceremony-arch-and-altar-florists": [
    {
      name: "Arch Type",
      slug: "arch-type",
      uiType: "multi-select",
      options: ["round/square/hexagon/triangle"]
    },
    {
      name: "Greenery Fullness",
      slug: "greenery-fullness",
      uiType: "multi-select",
      options: ["light/medium/full"]
    },
    {
      name: "Flower Density",
      slug: "flower-density",
      uiType: "multi-select",
      options: ["accented/moderate/heavy"]
    },
    {
      name: "Setup Included",
      slug: "setup-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/floral-chandeliers": [
    {
      name: "Chandelier Size",
      slug: "chandelier-size",
      uiType: "multi-select",
      options: ["2ft/3ft/4ft/5ft diameter"]
    },
    {
      name: "Hanging Height",
      slug: "hanging-height",
      uiType: "multi-select",
      options: ["adjustable/fixed"]
    },
    {
      name: "Flower Density",
      slug: "flower-density",
      uiType: "multi-select",
      options: ["light/medium/full"]
    },
    {
      name: "Lighting Integration",
      slug: "lighting-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/flower-wall-installations": [
    {
      name: "Wall Size",
      slug: "wall-size",
      uiType: "multi-select",
      options: ["6x6/6x8/8x8/8x10 ft"]
    },
    {
      name: "Flower Density",
      slug: "flower-density",
      uiType: "multi-select",
      options: ["light/medium/full"]
    },
    {
      name: "Artificial vs Fresh",
      slug: "artificial-vs-fresh",
      uiType: "multi-select",
      options: ["both/fresh/artificial"]
    },
    {
      name: "Lighting Included",
      slug: "lighting-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/florists/wedding-florists/hanging-floral-installations": [
    {
      name: "Installation Size",
      slug: "installation-size",
      uiType: "multi-select",
      options: ["6x6/8x8/10x10/12x12 ft"]
    },
    {
      name: "Ceiling Height Required",
      slug: "ceiling-height-required",
      uiType: "multi-select",
      options: ["ft"]
    },
    {
      name: "Rigging Included",
      slug: "rigging-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hanging Time",
      slug: "hanging-time",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "decor-rentals/florists/wedding-florists/reception-centerpiece-florists": [
    {
      name: "Centerpiece Type",
      slug: "centerpiece-type",
      uiType: "multi-select",
      options: ["low/high/mixed"]
    },
    {
      name: "Table Count",
      slug: "table-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Vase Rentals",
      slug: "vase-rentals",
      uiType: "toggle",
      options: []
    },
    {
      name: "Floating Candles",
      slug: "floating-candles",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/banquet-chairs": [
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Padding Thickness",
      slug: "padding-thickness",
      uiType: "multi-select",
      options: ["1\"/2\"/3\""]
    },
    {
      name: "Weight Capacity",
      slug: "weight-capacity",
      uiType: "multi-select",
      options: ["350 lbs"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/bar-stools": [
    {
      name: "Seat Height",
      slug: "seat-height",
      uiType: "multi-select",
      options: ["30\""]
    },
    {
      name: "Back",
      slug: "back",
      uiType: "toggle",
      options: []
    },
    {
      name: "Swivel",
      slug: "swivel",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/bench-rentals": [
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["4ft/5ft/6ft/8ft"]
    },
    {
      name: "Back",
      slug: "back",
      uiType: "toggle",
      options: []
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["4-8"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/chiavari-chairs": [
    {
      name: "Finish",
      slug: "finish",
      uiType: "multi-select",
      options: ["gold/silver/natural/white/black"]
    },
    {
      name: "Cushion Included",
      slug: "cushion-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weight Capacity",
      slug: "weight-capacity",
      uiType: "multi-select",
      options: ["300 lbs"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/cross-back-chairs": [
    {
      name: "Finish",
      slug: "finish",
      uiType: "multi-select",
      options: ["natural/walnut/white"]
    },
    {
      name: "Wood Type",
      slug: "wood-type",
      uiType: "multi-select",
      options: ["birch/rubberwood"]
    },
    {
      name: "Weight Capacity",
      slug: "weight-capacity",
      uiType: "multi-select",
      options: ["300 lbs"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/folding-chairs": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["metal/plastic"]
    },
    {
      name: "Weight Capacity",
      slug: "weight-capacity",
      uiType: "multi-select",
      options: ["250/300 lbs"]
    },
    {
      name: "Padding",
      slug: "padding",
      uiType: "multi-select",
      options: ["none"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/ghost-chairs": [
    {
      name: "Clear Acrylic",
      slug: "clear-acrylic",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tinted",
      slug: "tinted",
      uiType: "multi-select",
      options: ["smoke/amber"]
    },
    {
      name: "Weight Capacity",
      slug: "weight-capacity",
      uiType: "multi-select",
      options: ["250 lbs"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/king-and-queen-throne-chairs": [
    {
      name: "Finish",
      slug: "finish",
      uiType: "multi-select",
      options: ["gold/silver/white/black"]
    },
    {
      name: "Upholstery",
      slug: "upholstery",
      uiType: "multi-select",
      options: ["velvet/satin"]
    },
    {
      name: "Delivery Included",
      slug: "delivery-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["1/2"]
    }
  ],
  "decor-rentals/furniture-linens/chair-rentals/lounge-chairs-and-sofas": [
    {
      name: "Style",
      slug: "style",
      uiType: "multi-select",
      options: ["club chair/armchair/sofa/loveseat"]
    },
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/backdrop-drapes": [
    {
      name: "Drape Height",
      slug: "drape-height",
      uiType: "multi-select",
      options: ["8ft/10ft/12ft/15ft+"]
    },
    {
      name: "Fabric Type",
      slug: "fabric-type",
      uiType: "multi-select",
      options: ["polyester/satin/velvet/chiffon"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/chair-covers": [
    {
      name: "Chair Type",
      slug: "chair-type",
      uiType: "multi-select",
      options: ["chiavari/folding/banquet"]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["white/ivory/black"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/chair-sashes": [
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Tie Style",
      slug: "tie-style",
      uiType: "multi-select",
      options: ["ties/bands/bows"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/napkins": [
    {
      name: "Napkin Type",
      slug: "napkin-type",
      uiType: "multi-select",
      options: ["dinner/cocktail/beverage"]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Fold Style",
      slug: "fold-style",
      uiType: "multi-select",
      options: ["standard/fan/rose"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/overlays": [
    {
      name: "Shape",
      slug: "shape",
      uiType: "multi-select",
      options: ["round/square"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["30\"/36\"/42\""]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/skirting": [
    {
      name: "Table Length",
      slug: "table-length",
      uiType: "multi-select",
      options: ["6ft/8ft/10ft"]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["white/black/ivory"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/table-runners": [
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["72\"/90\"/108\"/120\""]
    },
    {
      name: "Color",
      slug: "color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/linen-rentals/tablecloths": [
    {
      name: "Table Shape",
      slug: "table-shape",
      uiType: "multi-select",
      options: ["round/rectangle/square"]
    },
    {
      name: "Size Options",
      slug: "size-options",
      uiType: "multi-select",
      options: ["as needed"]
    },
    {
      name: "Drop Length",
      slug: "drop-length",
      uiType: "multi-select",
      options: ["lap/floor"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/armchairs": [
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Style",
      slug: "style",
      uiType: "multi-select",
      options: ["modern/classic/bohemian"]
    },
    {
      name: "Ottoman Included",
      slug: "ottoman-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/coffee-tables": [
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["16\"/18\""]
    },
    {
      name: "Top Material",
      slug: "top-material",
      uiType: "multi-select",
      options: ["wood/glass/marble"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["30\"/36\"/42\""]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/love-seats": [
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["2"]
    },
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Style",
      slug: "style",
      uiType: "multi-select",
      options: ["modern/classic/bohemian"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/ottomans-and-poufs": [
    {
      name: "Shape",
      slug: "shape",
      uiType: "multi-select",
      options: ["square/round"]
    },
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/side-tables": [
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["20\"/22\"/24\""]
    },
    {
      name: "Top Material",
      slug: "top-material",
      uiType: "multi-select",
      options: ["wood/glass/metal"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/lounge-furniture-rentals/sofas": [
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["2/3"]
    },
    {
      name: "Upholstery Color",
      slug: "upholstery-color",
      uiType: "multi-select",
      options: ["options"]
    },
    {
      name: "Style",
      slug: "style",
      uiType: "multi-select",
      options: ["modern/classic/bohemian"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/childrens-tables": [
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["22\"/24\""]
    },
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["4ft/5ft/6ft"]
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["4-6"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/cocktail-tables": [
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["42\" tall"]
    },
    {
      name: "Diameter",
      slug: "diameter",
      uiType: "multi-select",
      options: ["30\""]
    },
    {
      name: "Seating",
      slug: "seating",
      uiType: "multi-select",
      options: ["standing only"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/rectangle-tables": [
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["6ft/8ft"]
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["6-8/8-10"]
    },
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["30\" standard"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/round-tables": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["48\"/60\"/72\""]
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["6/8/10-12"]
    },
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["30\" standard"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/serpentine-tables": [
    {
      name: "Curve Direction",
      slug: "curve-direction",
      uiType: "multi-select",
      options: ["concave/convex"]
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["10-12"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/furniture-linens/table-rentals/square-tables": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["36\"/42\"/48\""]
    },
    {
      name: "Seating Capacity",
      slug: "seating-capacity",
      uiType: "multi-select",
      options: ["4/6/8"]
    },
    {
      name: "Height",
      slug: "height",
      uiType: "multi-select",
      options: ["30\" standard"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/anniversary-party-decorators": [
    {
      name: "Milestone Year",
      slug: "milestone-year",
      uiType: "multi-select",
      options: ["1/5/10/25/50+"]
    },
    {
      name: "Romantic Theme",
      slug: "romantic-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Display",
      slug: "photo-display",
      uiType: "toggle",
      options: []
    },
    {
      name: "Memory Table",
      slug: "memory-table",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/baby-shower-decorators": [
    {
      name: "Gender",
      slug: "gender",
      uiType: "multi-select",
      options: ["boy/girl/neutral/surprise"]
    },
    {
      name: "Theme",
      slug: "theme",
      uiType: "multi-select",
      options: ["animals/abc/garden/moon & stars"]
    },
    {
      name: "Balloon Arch",
      slug: "balloon-arch",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Table Styling",
      slug: "cake-table-styling",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/bachelor-party-decorators": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Props",
      slug: "photo-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar Styling",
      slug: "bar-styling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Disposable Decor",
      slug: "disposable-decor",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/bachelorette-party-decorators": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sashes Included",
      slug: "sashes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Props",
      slug: "photo-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Disposable Decor",
      slug: "disposable-decor",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/bar-bat-mitzvah-decorators": [
    {
      name: "Mitzvah Theme",
      slug: "mitzvah-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candy Buffet Styling",
      slug: "candy-buffet-styling",
      uiType: "toggle",
      options: []
    },
    {
      name: "DJ Booth Decor",
      slug: "dj-booth-decor",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/birthday-party-decorators": [
    {
      name: "Age Focus",
      slug: "age-focus",
      uiType: "multi-select",
      options: ["kids/teen/adult/milestone"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Custom Backdrop",
      slug: "custom-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Balloon Integration",
      slug: "balloon-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/bridal-shower-decorators": [
    {
      name: "Bride's Favorite Colors",
      slug: "brides-favorite-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Floral Integration",
      slug: "floral-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mimosa Bar Styling",
      slug: "mimosa-bar-styling",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/graduation-party-decorators": [
    {
      name: "School Colors",
      slug: "school-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cap & Gown Theme",
      slug: "cap-and-gown-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Display",
      slug: "photo-display",
      uiType: "toggle",
      options: []
    },
    {
      name: "Yard Signs",
      slug: "yard-signs",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/holiday-party-decorators": [
    {
      name: "Holiday Specific",
      slug: "holiday-specific",
      uiType: "multi-select",
      options: ["Christmas/Halloween/Thanksgiving/NYE/NYE"]
    },
    {
      name: "Indoor/Outdoor",
      slug: "indoor-outdoor",
      uiType: "multi-select",
      options: ["both"]
    },
    {
      name: "Lighting Integration",
      slug: "lighting-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Themed Props",
      slug: "themed-props",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/quinceaera-decorators": [
    {
      name: "Court Colors",
      slug: "court-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Traditional Elements",
      slug: "traditional-elements",
      uiType: "multi-select",
      options: ["crown/scepter"]
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ceremony Setup",
      slug: "ceremony-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/retirement-party-decorators": [
    {
      name: "\"Happy Retirement\" Theme",
      slug: "happy-retirement-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hobby Focus",
      slug: "hobby-focus",
      uiType: "multi-select",
      options: ["golf/travel/reading"]
    },
    {
      name: "Memory Table",
      slug: "memory-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-decorators/themed-party-decorators/sweet-16-decorators": [
    {
      name: "Birthday Girl's Favorite Colors",
      slug: "birthday-girls-favorite-colors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Backdrop",
      slug: "photo-backdrop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candy Buffet Styling",
      slug: "candy-buffet-styling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor Decor",
      slug: "dance-floor-decor",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/disposable-tableware/cups": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["paper/plastic/reusable"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["9oz/12oz/16oz"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Reusable",
      slug: "reusable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/disposable-tableware/cutlery": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["plastic/bamboo/compostable"]
    },
    {
      name: "Type",
      slug: "type",
      uiType: "multi-select",
      options: ["fork/knife/spoon/spork"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Compostable",
      slug: "compostable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/disposable-tableware/napkins": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["paper/cloth"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["cocktail/lunch/dinner"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Cloth Rental Available",
      slug: "cloth-rental-available",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/disposable-tableware/plates": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["paper/plastic/bamboo/compostable/palm leaf"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["7\"/9\"/10\""]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Compostable",
      slug: "compostable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/favor-packaging/favor-bags": [
    {
      name: "Bag Type",
      slug: "bag-type",
      uiType: "multi-select",
      options: ["organza/paper/cellophane/muslin"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["3x4/4x5/5x6 inches"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    }
  ],
  "decor-rentals/party-supplies/favor-packaging/favor-boxes": [
    {
      name: "Box Size",
      slug: "box-size",
      uiType: "multi-select",
      options: ["2x2/3x3/4x4/5x5 inches"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["cardboard/clear/wood"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    }
  ],
  "decor-rentals/party-supplies/favor-packaging/favor-tags-and-stickers": [
    {
      name: "Tag Shape",
      slug: "tag-shape",
      uiType: "multi-select",
      options: ["rectangle/circle/oval/custom"]
    },
    {
      name: "Sticker Type",
      slug: "sticker-type",
      uiType: "multi-select",
      options: ["paper/foil/clear"]
    },
    {
      name: "Custom Text",
      slug: "custom-text",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per sheet"]
    }
  ],
  "decor-rentals/party-supplies/favor-packaging/favor-tins-and-jars": [
    {
      name: "Container Type",
      slug: "container-type",
      uiType: "multi-select",
      options: ["tin/jar"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["2oz/4oz/6oz"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    }
  ],
  "decor-rentals/party-supplies/party-favors/charitable-favors": [
    {
      name: "Charity Options",
      slug: "charity-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Custom Card Design",
      slug: "custom-card-design",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tax Receipt Provided",
      slug: "tax-receipt-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Minimum Donation",
      slug: "minimum-donation",
      uiType: "multi-select",
      options: ["$5/$10/$25"]
    }
  ],
  "decor-rentals/party-supplies/party-favors/custom-swag-favors": [
    {
      name: "Customization Method",
      slug: "customization-method",
      uiType: "multi-select",
      options: ["screen print/embroidery/engraving"]
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Color Options",
      slug: "color-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Reusable",
      slug: "reusable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/party-favors/drinkable-favors": [
    {
      name: "Alcohol",
      slug: "alcohol",
      uiType: "multi-select",
      options: ["yes/no/optional"]
    },
    {
      name: "Custom Label",
      slug: "custom-label",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Age Restriction",
      slug: "age-restriction",
      uiType: "multi-select",
      options: ["21+"]
    }
  ],
  "decor-rentals/party-supplies/party-favors/edible-favors": [
    {
      name: "Flavor Options",
      slug: "flavor-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Dietary",
      slug: "dietary",
      uiType: "multi-select",
      options: ["vegan/gluten-free/nut-free"]
    },
    {
      name: "Custom Label",
      slug: "custom-label",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["dozen"]
    }
  ],
  "decor-rentals/party-supplies/party-favors/keepsake-favors": [
    {
      name: "Engraving Available",
      slug: "engraving-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Date",
      slug: "custom-date",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["wood/acrylic/metal"]
    }
  ],
  "decor-rentals/party-supplies/party-favors/plantable-favors": [
    {
      name: "Seed Type",
      slug: "seed-type",
      uiType: "multi-select",
      options: ["wildflower/herb/vegetable"]
    },
    {
      name: "Succulent Care Card",
      slug: "succulent-care-card",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Eco-Friendly",
      slug: "eco-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/party-favors/practical-favors": [
    {
      name: "Scent Options",
      slug: "scent-options",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Custom Label",
      slug: "custom-label",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Eco-Friendly",
      slug: "eco-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/party-favors/toy-favors": [
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["2-5/4-8/6-12"]
    },
    {
      name: "Custom Packaging",
      slug: "custom-packaging",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity Minimum",
      slug: "quantity-minimum",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Non-Toxic",
      slug: "non-toxic",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/serving-supplies/chafing-dishes-and-fuel": [
    {
      name: "Chafing Dish Size",
      slug: "chafing-dish-size",
      uiType: "multi-select",
      options: ["half/full"]
    },
    {
      name: "Fuel Type",
      slug: "fuel-type",
      uiType: "multi-select",
      options: ["gel/sterling"]
    },
    {
      name: "Burn Time",
      slug: "burn-time",
      uiType: "multi-select",
      options: ["2/4/6 hours"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "numeric",
      options: []
    }
  ],
  "decor-rentals/party-supplies/serving-supplies/serving-bowls": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["plastic/bamboo/glass"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8oz/16oz/32oz"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Lid Included",
      slug: "lid-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/serving-supplies/serving-platters-and-trays": [
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["plastic/bamboo/compostable/melamine"]
    },
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["small/medium/large"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Reusable",
      slug: "reusable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/party-supplies/serving-supplies/serving-utensils": [
    {
      name: "Type",
      slug: "type",
      uiType: "multi-select",
      options: ["spoons/tongs/ladles"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["plastic/stainless/bamboo"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per pack"]
    },
    {
      name: "Reusable",
      slug: "reusable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/anniversary-party-invitations": [
    {
      name: "Milestone Year",
      slug: "milestone-year",
      uiType: "multi-select",
      options: ["1/5/10/25/50+"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/baby-shower-invitations": [
    {
      name: "Gender",
      slug: "gender",
      uiType: "multi-select",
      options: ["boy/girl/neutral/surprise"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/bachelor-party-invitations": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/bachelorette-party-invitations": [
    {
      name: "Adult Theme",
      slug: "adult-theme",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/birthday-party-invitations": [
    {
      name: "Age Range",
      slug: "age-range",
      uiType: "multi-select",
      options: ["kids/teen/adult/milestone"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/bridal-shower-invitations": [
    {
      name: "Bride's Style",
      slug: "brides-style",
      uiType: "multi-select",
      options: ["traditional/modern/floral"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/corporate-event-invitations": [
    {
      name: "Company Branding",
      slug: "company-branding",
      uiType: "toggle",
      options: []
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["25/50/100/250+"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/graduation-party-invitations": [
    {
      name: "School Colors",
      slug: "school-colors",
      uiType: "multi-select",
      options: ["matching"]
    },
    {
      name: "Class Year",
      slug: "class-year",
      uiType: "multi-select",
      options: ["2024/2025/etc."]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/holiday-party-invitations": [
    {
      name: "Holiday Specific",
      slug: "holiday-specific",
      uiType: "multi-select",
      options: ["Christmas/Halloween/Thanksgiving/NYE"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["per dozen"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card",
      slug: "rsvp-card",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/invitations/wedding-invitations": [
    {
      name: "Suite Style",
      slug: "suite-style",
      uiType: "multi-select",
      options: ["classic/modern/rustic/beach/elegant"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["25/50/75/100+"]
    },
    {
      name: "Envelopes Included",
      slug: "envelopes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "RSVP Card Included",
      slug: "rsvp-card-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/bar-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8x10/11x14/16x20 inches"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["acrylic/wood/chalkboard/neon"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drink Menu Options",
      slug: "drink-menu-options",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/card-and-gift-box-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["4x6/5x7 inches"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pre-Printed Message",
      slug: "pre-printed-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Customizable",
      slug: "customizable",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/dessert-table-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["4x6/5x7 inches"]
    },
    {
      name: "Food Labels",
      slug: "food-labels",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Allergy Warnings",
      slug: "allergy-warnings",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/directional-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8x10/11x14 inches"]
    },
    {
      name: "Quantity",
      slug: "quantity",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Stakes Included",
      slug: "stakes-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weather Resistant",
      slug: "weather-resistant",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/favor-table-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["4x6/5x7 inches"]
    },
    {
      name: "\"Thank You\" Message",
      slug: "thank-you-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Message",
      slug: "custom-message",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/guest-book-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["4x6/5x7 inches"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pre-Printed Message",
      slug: "pre-printed-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Matching Guest Book",
      slug: "matching-guest-book",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/memorial-table-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8x10/11x14 inches"]
    },
    {
      name: "\"In Loving Memory\" Message",
      slug: "in-loving-memory-message",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Placement",
      slug: "photo-placement",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/photo-booth-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8x10/11x14 inches"]
    },
    {
      name: "Prop Box Sign",
      slug: "prop-box-sign",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Hashtag",
      slug: "social-media-hashtag",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/seating-chart-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["18x24/24x36/30x40 inches"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["acrylic/foam/wood"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Guest Names",
      slug: "guest-names",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/unplugged-ceremony-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["8x10/11x14 inches"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["acrylic/wood/chalkboard"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pre-Printed Message",
      slug: "pre-printed-message",
      uiType: "toggle",
      options: []
    }
  ],
  "decor-rentals/stationery/signage/welcome-signs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["11x14/16x20/18x24/24x36 inches"]
    },
    {
      name: "Material",
      slug: "material",
      uiType: "multi-select",
      options: ["acrylic/wood/foam/chalkboard"]
    },
    {
      name: "Stand Included",
      slug: "stand-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Text",
      slug: "custom-text",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/blue-comedians": [
    {
      name: "Explicit Content Warning",
      slug: "explicit-content-warning",
      uiType: "multi-select",
      options: ["yes"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["18/21"]
    },
    {
      name: "Adult Venue Experience",
      slug: "adult-venue-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Roast Experience",
      slug: "roast-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/clean-comedians": [
    {
      name: "Profanity Free",
      slug: "profanity-free",
      uiType: "toggle",
      options: []
    },
    {
      name: "Corporate Experience",
      slug: "corporate-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "All Ages",
      slug: "all-ages",
      uiType: "toggle",
      options: []
    },
    {
      name: "Church Event Experience",
      slug: "church-event-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/dark-comedians": [
    {
      name: "Trigger Warning Provided",
      slug: "trigger-warning-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sensitive Topics",
      slug: "sensitive-topics",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Late Night Only",
      slug: "late-night-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Adult Audience",
      slug: "adult-audience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/improv-comedians": [
    {
      name: "Audience Suggestion",
      slug: "audience-suggestion",
      uiType: "toggle",
      options: []
    },
    {
      name: "Short Form vs Long Form",
      slug: "short-form-vs-long-form",
      uiType: "multi-select",
      options: ["both/short/long"]
    },
    {
      name: "Team Size",
      slug: "team-size",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Workshop Available",
      slug: "workshop-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/observational-comedians": [
    {
      name: "Everyday Topics",
      slug: "everyday-topics",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Work",
      slug: "crowd-work",
      uiType: "toggle",
      options: []
    },
    {
      name: "Improv Skills",
      slug: "improv-skills",
      uiType: "toggle",
      options: []
    },
    {
      name: "Relatable Material",
      slug: "relatable-material",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/one-liner-comedians": [
    {
      name: "Jokes Per Minute",
      slug: "jokes-per-minute",
      uiType: "numeric",
      options: []
    },
    {
      name: "Rapid Fire Style",
      slug: "rapid-fire-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Deadpan Delivery",
      slug: "deadpan-delivery",
      uiType: "toggle",
      options: []
    },
    {
      name: "Short Set",
      slug: "short-set",
      uiType: "multi-select",
      options: ["15/20/30 min"]
    }
  ],
  "entertainment/comedians/stand-up-comedians/political-comedians": [
    {
      name: "Affliation",
      slug: "affliation",
      uiType: "multi-select",
      options: ["left/right/libertarian/neutral"]
    },
    {
      name: "Election Season Availability",
      slug: "election-season-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Debate Watching Parties",
      slug: "debate-watching-parties",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/roast-comedians": [
    {
      name: "Target",
      slug: "target",
      uiType: "multi-select",
      options: ["celebrity/corporate/friend"]
    },
    {
      name: "Roast Length",
      slug: "roast-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Insult Creativity",
      slug: "insult-creativity",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Comeback Skills",
      slug: "comeback-skills",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/sketch-comedians": [
    {
      name: "Cast Size",
      slug: "cast-size",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Costumes",
      slug: "costumes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Props",
      slug: "props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Video Sketches",
      slug: "video-sketches",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/storytelling-comedians": [
    {
      name: "Story Length",
      slug: "story-length",
      uiType: "multi-select",
      options: ["5-10/10-15/15-20 min"]
    },
    {
      name: "Emotional Range",
      slug: "emotional-range",
      uiType: "toggle",
      options: []
    },
    {
      name: "Personal Material",
      slug: "personal-material",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Connection",
      slug: "audience-connection",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/comedians/stand-up-comedians/surreal-comedians": [
    {
      name: "Absurdist Style",
      slug: "absurdist-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prop Comedy",
      slug: "prop-comedy",
      uiType: "toggle",
      options: []
    },
    {
      name: "Character Work",
      slug: "character-work",
      uiType: "toggle",
      options: []
    },
    {
      name: "Unexpected Punchlines",
      slug: "unexpected-punchlines",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/karaoke-djs/bilingual-karaoke-hosts": [
    {
      name: "Languages",
      slug: "languages",
      uiType: "multi-select",
      options: ["Spanish/English/Polish/Korean/Japanese/Tagalog"]
    },
    {
      name: "Song Libraries per Language",
      slug: "song-libraries-per-language",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Pronunciation Help",
      slug: "pronunciation-help",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Engagement",
      slug: "crowd-engagement",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/karaoke-djs/mobile-karaoke": [
    {
      name: "Equipment Included",
      slug: "equipment-included",
      uiType: "multi-select",
      options: ["speakers/mics/screen/stand"]
    },
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Setup Time",
      slug: "setup-time",
      uiType: "multi-select",
      options: ["minutes"]
    },
    {
      name: "Wireless Mics",
      slug: "wireless-mics",
      uiType: "multi-select",
      options: ["count"]
    }
  ],
  "entertainment/djs/karaoke-djs/private-room-karaoke-hosts": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["1/2/3/4+"]
    },
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "numeric",
      options: []
    },
    {
      name: "Remote Control",
      slug: "remote-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Food Service Coordination",
      slug: "food-service-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/karaoke-djs/public-stage-karaoke-hosts": [
    {
      name: "Song Library Size",
      slug: "song-library-size",
      uiType: "multi-select",
      options: ["5k/10k/20k/30k+"]
    },
    {
      name: "Rotation Management",
      slug: "rotation-management",
      uiType: "multi-select",
      options: ["fair"]
    },
    {
      name: "Scoring System",
      slug: "scoring-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prize Support",
      slug: "prize-support",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/bachata-djs": [
    {
      name: "Bachata Styles",
      slug: "bachata-styles",
      uiType: "multi-select",
      options: ["Traditional/ Modern/ Sensual"]
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Lesson Included",
      slug: "dance-lesson-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Guitar",
      slug: "live-guitar",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/bilingual-latin-djs": [
    {
      name: "Spanish Fluency",
      slug: "spanish-fluency",
      uiType: "multi-select",
      options: ["native/ fluent/ conversational"]
    },
    {
      name: "Announcements",
      slug: "announcements",
      uiType: "multi-select",
      options: ["both languages"]
    },
    {
      name: "Song Mixing",
      slug: "song-mixing",
      uiType: "multi-select",
      options: ["both languages"]
    },
    {
      name: "Cultural Knowledge",
      slug: "cultural-knowledge",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/cumbia-djs": [
    {
      name: "Cumbia Styles",
      slug: "cumbia-styles",
      uiType: "multi-select",
      options: ["Mexican/ Colombian/ Argentine/ Peruvian"]
    },
    {
      name: "Accordion Live",
      slug: "accordion-live",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Lesson",
      slug: "dance-lesson",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/latin-hip-hop-djs": [
    {
      name: "Subgenres",
      slug: "subgenres",
      uiType: "multi-select",
      options: ["Latin Trap/ Reggaeton/ Latin Drill"]
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Turntablism",
      slug: "turntablism",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live MC",
      slug: "live-mc",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/latin-house-djs": [
    {
      name: "Subgenres",
      slug: "subgenres",
      uiType: "multi-select",
      options: ["Afro/ Deep/ Tech/ Progressive"]
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Percussion",
      slug: "live-percussion",
      uiType: "toggle",
      options: []
    },
    {
      name: "Visuals Package",
      slug: "visuals-package",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/merengue-djs": [
    {
      name: "Merengue Styles",
      slug: "merengue-styles",
      uiType: "multi-select",
      options: ["Traditional/ Modern/ Orchestra"]
    },
    {
      name: "Live Saxophone",
      slug: "live-saxophone",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Lesson",
      slug: "dance-lesson",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/reggaeton-djs": [
    {
      name: "Eras",
      slug: "eras",
      uiType: "multi-select",
      options: ["Old School/ New School/ Both"]
    },
    {
      name: "Perreo Permission",
      slug: "perreo-permission",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Percussion",
      slug: "live-percussion",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/latin-music-djs/salsa-djs": [
    {
      name: "Salsa Styles",
      slug: "salsa-styles",
      uiType: "multi-select",
      options: ["Cuban/ Puerto Rican/ Colombian/ NY/ LA"]
    },
    {
      name: "Live Congas",
      slug: "live-congas",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Salsa Lesson Included",
      slug: "salsa-lesson-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/open-format-djs/open-format-djs": [
    {
      name: "Genres Comfortable",
      slug: "genres-comfortable",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Request Willingness",
      slug: "request-willingness",
      uiType: "toggle",
      options: []
    },
    {
      name: "Crowd Reading",
      slug: "crowd-reading",
      uiType: "multi-select",
      options: ["excellent/good/fair"]
    },
    {
      name: "Transition Style",
      slug: "transition-style",
      uiType: "multi-select",
      options: ["smooth/quick"]
    }
  ],
  "entertainment/djs/party-djs/anniversary-party-djs": [
    {
      name: "Music Eras",
      slug: "music-eras",
      uiType: "multi-select",
      options: ["50s/60s/70s/80s/90s/00s"]
    },
    {
      name: "Slow Song Count",
      slug: "slow-song-count",
      uiType: "multi-select",
      options: ["per hour"]
    },
    {
      name: "First Dance Coordination",
      slug: "first-dance-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Anniversary Dedications",
      slug: "anniversary-dedications",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/party-djs/birthday-party-djs": [
    {
      name: "Age Group",
      slug: "age-group",
      uiType: "multi-select",
      options: ["kids/teen/adult"]
    },
    {
      name: "Game Integration",
      slug: "game-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Microphone for Speeches",
      slug: "microphone-for-speeches",
      uiType: "toggle",
      options: []
    },
    {
      name: "Birthday Song Customization",
      slug: "birthday-song-customization",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/party-djs/graduation-party-djs": [
    {
      name: "School Fight Song",
      slug: "school-fight-song",
      uiType: "toggle",
      options: []
    },
    {
      name: "Class Year Music",
      slug: "class-year-music",
      uiType: "multi-select",
      options: ["mix"]
    },
    {
      name: "Photo Slideshow Coordination",
      slug: "photo-slideshow-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mic for Speeches",
      slug: "mic-for-speeches",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/party-djs/holiday-party-djs": [
    {
      name: "Holiday Music Database",
      slug: "holiday-music-database",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Themed Playlists",
      slug: "themed-playlists",
      uiType: "multi-select",
      options: ["Christmas/Halloween/New Year's"]
    },
    {
      name: "Countdown Timer",
      slug: "countdown-timer",
      uiType: "multi-select",
      options: ["NYE"]
    },
    {
      name: "Holiday Attire",
      slug: "holiday-attire",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/party-djs/house-party-djs": [
    {
      name: "Setup Footprint",
      slug: "setup-footprint",
      uiType: "multi-select",
      options: ["small/compact"]
    },
    {
      name: "Wireless Speakers",
      slug: "wireless-speakers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Neighborhood Noise Compliance",
      slug: "neighborhood-noise-compliance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Extension Cords Included",
      slug: "extension-cords-included",
      uiType: "multi-select",
      options: ["length"]
    }
  ],
  "entertainment/djs/party-djs/pool-party-djs": [
    {
      name: "Outdoor Rated Equipment",
      slug: "outdoor-rated-equipment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Splash Protection",
      slug: "splash-protection",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wireless Speakers",
      slug: "wireless-speakers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Generator Included",
      slug: "generator-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/prom-and-school-dance-djs/high-school-dance-djs": [
    {
      name: "Latest Chart Music",
      slug: "latest-chart-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Slow Song Count",
      slug: "slow-song-count",
      uiType: "multi-select",
      options: ["2-3/hour"]
    },
    {
      name: "Social Media Promotion",
      slug: "social-media-promotion",
      uiType: "toggle",
      options: []
    },
    {
      name: "DJ Booth Visible",
      slug: "dj-booth-visible",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/prom-and-school-dance-djs/homecoming-djs": [
    {
      name: "School Spirit Songs",
      slug: "school-spirit-songs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pep Rally Experience",
      slug: "pep-rally-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Coordinated Lights",
      slug: "coordinated-lights",
      uiType: "toggle",
      options: []
    },
    {
      name: "Student Requests",
      slug: "student-requests",
      uiType: "multi-select",
      options: ["managed"]
    }
  ],
  "entertainment/djs/prom-and-school-dance-djs/middle-school-dance-djs": [
    {
      name: "Age Appropriate",
      slug: "age-appropriate",
      uiType: "multi-select",
      options: ["11-14"]
    },
    {
      name: "Parent Approved Song List",
      slug: "parent-approved-song-list",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Slow Songs",
      slug: "no-slow-songs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Game Integration",
      slug: "game-integration",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/prom-and-school-dance-djs/prom-djs": [
    {
      name: "School Dance Count",
      slug: "school-dance-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Clean Edits Only",
      slug: "clean-edits-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Explicit Language Filter",
      slug: "explicit-language-filter",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chaperone Communication",
      slug: "chaperone-communication",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/prom-and-school-dance-djs/school-pep-rally-djs": [
    {
      name: "Crowd Mic Skills",
      slug: "crowd-mic-skills",
      uiType: "toggle",
      options: []
    },
    {
      name: "School Chant Database",
      slug: "school-chant-database",
      uiType: "toggle",
      options: []
    },
    {
      name: "Walkout Music",
      slug: "walkout-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Faculty Coordination",
      slug: "faculty-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/budget-wedding-djs": [
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "numeric",
      options: []
    },
    {
      name: "Package Minimum",
      slug: "package-minimum",
      uiType: "multi-select",
      options: ["2/3/4 hours"]
    },
    {
      name: "Basic Lighting Included",
      slug: "basic-lighting-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Referral Discount",
      slug: "referral-discount",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/intimate-wedding-djs": [
    {
      name: "Guest Count Max",
      slug: "guest-count-max",
      uiType: "multi-select",
      options: ["20/30/40/50"]
    },
    {
      name: "Acoustic Option",
      slug: "acoustic-option",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wireless Speakers",
      slug: "wireless-speakers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setup Footprint",
      slug: "setup-footprint",
      uiType: "multi-select",
      options: ["small/medium"]
    }
  ],
  "entertainment/djs/wedding-djs/latin-wedding-djs": [
    {
      name: "Genres Played",
      slug: "genres-played",
      uiType: "multi-select",
      options: ["salsa/bachata/reggaeton/merengue/cumbia"]
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "toggle",
      options: []
    },
    {
      name: "Latin Percussion Add-on",
      slug: "latin-percussion-add-on",
      uiType: "toggle",
      options: []
    },
    {
      name: "Salsa Dance Lesson",
      slug: "salsa-dance-lesson",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/lgbtqplus-wedding-djs": [
    {
      name: "Same-Sex Wedding Count",
      slug: "same-sex-wedding-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Inclusive Announcements",
      slug: "inclusive-announcements",
      uiType: "toggle",
      options: []
    },
    {
      name: "LGBTQ+ Song Database",
      slug: "lgbtqplus-song-database",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pride Event Experience",
      slug: "pride-event-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/luxury-wedding-djs": [
    {
      name: "Premium Uplighting",
      slug: "premium-uplighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Monogram Gobo",
      slug: "monogram-gobo",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cold Sparklers",
      slug: "cold-sparklers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Booth Included",
      slug: "photo-booth-included",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/multicultural-wedding-djs": [
    {
      name: "Cultures Served",
      slug: "cultures-served",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Bilingual",
      slug: "bilingual",
      uiType: "multi-select",
      options: ["yes/no languages"]
    },
    {
      name: "Multi-Genre Expertise",
      slug: "multi-genre-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cultural Song Database",
      slug: "cultural-song-database",
      uiType: "multi-select",
      options: ["size"]
    }
  ],
  "entertainment/djs/wedding-djs/south-asian-wedding-djs": [
    {
      name: "Genres Played",
      slug: "genres-played",
      uiType: "multi-select",
      options: ["Bhangra/Bollywood/Gujarati/Punjabi"]
    },
    {
      name: "Dhol Player Included",
      slug: "dhol-player-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Baraat Experience",
      slug: "baraat-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Multi-Day Event Experience",
      slug: "multi-day-event-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/djs/wedding-djs/traditional-wedding-djs": [
    {
      name: "Emcee Services",
      slug: "emcee-services",
      uiType: "multi-select",
      options: ["included/optional"]
    },
    {
      name: "Wedding Count",
      slug: "wedding-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Ceremony Sound Included",
      slug: "ceremony-sound-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wireless Mics Included",
      slug: "wireless-mics-included",
      uiType: "multi-select",
      options: ["count"]
    }
  ],
  "entertainment/interactive/escape-room-experiences/birthday-party-escape-rooms": [
    {
      name: "Age Appropriateness",
      slug: "age-appropriateness",
      uiType: "multi-select",
      options: ["8-12/13-17/18+"]
    },
    {
      name: "Party Favors Included",
      slug: "party-favors-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cake Friendly",
      slug: "cake-friendly",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parent Supervision",
      slug: "parent-supervision",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/escape-room-experiences/mobile-escape-rooms": [
    {
      name: "Capacity",
      slug: "capacity",
      uiType: "multi-select",
      options: ["4-6/6-8/8-12"]
    },
    {
      name: "Trailer Size",
      slug: "trailer-size",
      uiType: "multi-select",
      options: ["ft"]
    },
    {
      name: "Themes Available",
      slug: "themes-available",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Setup Time",
      slug: "setup-time",
      uiType: "multi-select",
      options: ["minutes"]
    }
  ],
  "entertainment/interactive/escape-room-experiences/pop-up-escape-rooms": [
    {
      name: "Room Count",
      slug: "room-count",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Theme Options",
      slug: "theme-options",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Setup Space Required",
      slug: "setup-space-required",
      uiType: "multi-select",
      options: ["sq ft"]
    }
  ],
  "entertainment/interactive/escape-room-experiences/team-building-escape-rooms": [
    {
      name: "Team Size",
      slug: "team-size",
      uiType: "multi-select",
      options: ["4-8/8-12/12-16/16-20"]
    },
    {
      name: "Facilitator Included",
      slug: "facilitator-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Debrief Included",
      slug: "debrief-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Competition Format",
      slug: "competition-format",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/murder-mystery-parties/boxed-murder-mystery": [
    {
      name: "Guest Count",
      slug: "guest-count",
      uiType: "multi-select",
      options: ["4-8/8-12/12-20"]
    },
    {
      name: "Difficulty",
      slug: "difficulty",
      uiType: "multi-select",
      options: ["easy/medium/hard"]
    },
    {
      name: "Character Booklets",
      slug: "character-booklets",
      uiType: "toggle",
      options: []
    },
    {
      name: "Host Guide",
      slug: "host-guide",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/murder-mystery-parties/corporate-murder-mystery": [
    {
      name: "Team Size",
      slug: "team-size",
      uiType: "multi-select",
      options: ["8-15/16-25/26-40"]
    },
    {
      name: "Collaboration Required",
      slug: "collaboration-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Debrief Included",
      slug: "debrief-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Professional Facilitation",
      slug: "professional-facilitation",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/murder-mystery-parties/hosted-murder-mystery": [
    {
      name: "Cast Size",
      slug: "cast-size",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["2/3/4 hours"]
    },
    {
      name: "Character Assignments",
      slug: "character-assignments",
      uiType: "toggle",
      options: []
    },
    {
      name: "Costumes Provided",
      slug: "costumes-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/interactive/murder-mystery-parties/wedding-murder-mystery": [
    {
      name: "Couple Integration",
      slug: "couple-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wedding Party Roles",
      slug: "wedding-party-roles",
      uiType: "toggle",
      options: []
    },
    {
      name: "Inside Jokes Allowed",
      slug: "inside-jokes-allowed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Rehearsal Friendly",
      slug: "rehearsal-friendly",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/alternative-bands": [
    {
      name: "Radio Play",
      slug: "radio-play",
      uiType: "multi-select",
      options: ["local/regional/national"]
    },
    {
      name: "Festival Experience",
      slug: "festival-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Music Videos",
      slug: "music-videos",
      uiType: "toggle",
      options: []
    },
    {
      name: "Press Kit Available",
      slug: "press-kit-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/bluegrass-bands": [
    {
      name: "Instrumentation",
      slug: "instrumentation",
      uiType: "multi-select",
      options: ["banjo/mandolin/fiddle/guitar/bass"]
    },
    {
      name: "Vocal Harmonies",
      slug: "vocal-harmonies",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fast Picking",
      slug: "fast-picking",
      uiType: "toggle",
      options: []
    },
    {
      name: "Workshop Available",
      slug: "workshop-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/blues-bands": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["delta/chicago/texas/british"]
    },
    {
      name: "Guitar Hero",
      slug: "guitar-hero",
      uiType: "toggle",
      options: []
    },
    {
      name: "Harmonica",
      slug: "harmonica",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night Set",
      slug: "late-night-set",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/brass-bands": [
    {
      name: "Second Line Experience",
      slug: "second-line-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parade Capable",
      slug: "parade-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Traditional Jazz",
      slug: "traditional-jazz",
      uiType: "toggle",
      options: []
    },
    {
      name: "Funeral Experience",
      slug: "funeral-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/country-bands": [
    {
      name: "Original vs Covers",
      slug: "original-vs-covers",
      uiType: "multi-select",
      options: ["ratio"]
    },
    {
      name: "Steel Guitar",
      slug: "steel-guitar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fiddle",
      slug: "fiddle",
      uiType: "toggle",
      options: []
    },
    {
      name: "Line Dance Songs",
      slug: "line-dance-songs",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/folk-and-americana-bands": [
    {
      name: "Vocal Harmonies",
      slug: "vocal-harmonies",
      uiType: "multi-select",
      options: ["2/3/4 part"]
    },
    {
      name: "Acoustic Focus",
      slug: "acoustic-focus",
      uiType: "toggle",
      options: []
    },
    {
      name: "Storytelling",
      slug: "storytelling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Banjo/Mandolin",
      slug: "banjo-mandolin",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/funk-bands": [
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bass Groove",
      slug: "bass-groove",
      uiType: "toggle",
      options: []
    },
    {
      name: "Danceable",
      slug: "danceable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Extended Jams",
      slug: "extended-jams",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/hip-hop-bands": [
    {
      name: "Live Drums",
      slug: "live-drums",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Bass",
      slug: "live-bass",
      uiType: "toggle",
      options: []
    },
    {
      name: "Horns",
      slug: "horns",
      uiType: "toggle",
      options: []
    },
    {
      name: "Turntables",
      slug: "turntables",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/indie-bands": [
    {
      name: "Label Signed",
      slug: "label-signed",
      uiType: "toggle",
      options: []
    },
    {
      name: "Spotify Monthly Listeners",
      slug: "spotify-monthly-listeners",
      uiType: "numeric",
      options: []
    },
    {
      name: "Touring Experience",
      slug: "touring-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "EP/Album Available",
      slug: "ep-album-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/jazz-bands": [
    {
      name: "Ensemble Size",
      slug: "ensemble-size",
      uiType: "multi-select",
      options: ["2-4/5-7/8-11/12+"]
    },
    {
      name: "Swing Era Focus",
      slug: "swing-era-focus",
      uiType: "toggle",
      options: []
    },
    {
      name: "Modern Jazz",
      slug: "modern-jazz",
      uiType: "toggle",
      options: []
    },
    {
      name: "Educational Component",
      slug: "educational-component",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/latin-bands": [
    {
      name: "Ensemble Size",
      slug: "ensemble-size",
      uiType: "multi-select",
      options: ["5/7/9/11+"]
    },
    {
      name: "Percussion Section",
      slug: "percussion-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Music Focus",
      slug: "dance-music-focus",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/marching-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["10/20/30/50+"]
    },
    {
      name: "Parade Experience",
      slug: "parade-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fight Songs",
      slug: "fight-songs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Uniformed",
      slug: "uniformed",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/mariachi-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Traditional Attire",
      slug: "traditional-attire",
      uiType: "toggle",
      options: []
    },
    {
      name: "Request Songs",
      slug: "request-songs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Birthday Serenades",
      slug: "birthday-serenades",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/metal-bands": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["death/thrash/doom/power/black"]
    },
    {
      name: "PA Requirements",
      slug: "pa-requirements",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Mosh Pit Management",
      slug: "mosh-pit-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Earplugs Provided",
      slug: "earplugs-provided",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/polka-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["3/4/5/6+"]
    },
    {
      name: "Accordion",
      slug: "accordion",
      uiType: "toggle",
      options: []
    },
    {
      name: "Oktoberfest Experience",
      slug: "oktoberfest-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chicken Dance",
      slug: "chicken-dance",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/punk-bands": [
    {
      name: "Set Length",
      slug: "set-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Stage Diving",
      slug: "stage-diving",
      uiType: "multi-select",
      options: ["allowed/ discouraged"]
    },
    {
      name: "All Ages Shows",
      slug: "all-ages-shows",
      uiType: "toggle",
      options: []
    },
    {
      name: "DIY Ethos",
      slug: "diy-ethos",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/reggae-bands": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["roots/rocksteady/dancehall"]
    },
    {
      name: "Live Riddim",
      slug: "live-riddim",
      uiType: "toggle",
      options: []
    },
    {
      name: "Weed Friendly",
      slug: "weed-friendly",
      uiType: "multi-select",
      options: ["venue policy"]
    },
    {
      name: "Dub Siren",
      slug: "dub-siren",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/rock-bands": [
    {
      name: "Subgenre",
      slug: "subgenre",
      uiType: "multi-select",
      options: ["indie/alternative/hard/metal/punk"]
    },
    {
      name: "Original Songs Only",
      slug: "original-songs-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Merch Available",
      slug: "merch-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Following",
      slug: "social-media-following",
      uiType: "multi-select",
      options: ["size"]
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/ska-bands": [
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Upbeat Tempo",
      slug: "upbeat-tempo",
      uiType: "toggle",
      options: []
    },
    {
      name: "Checkered Attire",
      slug: "checkered-attire",
      uiType: "toggle",
      options: []
    },
    {
      name: "3rd Wave",
      slug: "3rd-wave",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/soul-and-randb-bands": [
    {
      name: "Vocal Power",
      slug: "vocal-power",
      uiType: "toggle",
      options: []
    },
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Slow Jams",
      slug: "slow-jams",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wedding Experience",
      slug: "wedding-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/concert-and-festival-bands/world-music-bands": [
    {
      name: "Region Focus",
      slug: "region-focus",
      uiType: "multi-select",
      options: ["Africa/Caribbean/Celtic/Eastern"]
    },
    {
      name: "Traditional Instruments",
      slug: "traditional-instruments",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Instruction",
      slug: "dance-instruction",
      uiType: "toggle",
      options: []
    },
    {
      name: "Authentic Attire",
      slug: "authentic-attire",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/corporate-event-bands/cover-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["4/5/6+"]
    },
    {
      name: "Clean Lyrics",
      slug: "clean-lyrics",
      uiType: "toggle",
      options: []
    },
    {
      name: "Volume Control",
      slug: "volume-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mic for Speeches",
      slug: "mic-for-speeches",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/corporate-event-bands/funk-and-soul-bands": [
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor Energy",
      slug: "dance-floor-energy",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Break Management",
      slug: "break-management",
      uiType: "toggle",
      options: []
    },
    {
      name: "Set Length",
      slug: "set-length",
      uiType: "multi-select",
      options: ["45/60/90 min"]
    }
  ],
  "entertainment/live-bands/corporate-event-bands/jazz-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Dinner Set",
      slug: "dinner-set",
      uiType: "toggle",
      options: []
    },
    {
      name: "Background Only",
      slug: "background-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Instrumental",
      slug: "instrumental",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/corporate-event-bands/party-bands": [
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Lessons",
      slug: "dance-lessons",
      uiType: "toggle",
      options: []
    },
    {
      name: "Band Led Games",
      slug: "band-led-games",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Opportunities",
      slug: "photo-opportunities",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/party-bands/cover-bands": [
    {
      name: "Genre Focus",
      slug: "genre-focus",
      uiType: "multi-select",
      options: ["rock/pop/country/latin"]
    },
    {
      name: "Request Willingness",
      slug: "request-willingness",
      uiType: "toggle",
      options: []
    },
    {
      name: "Setlist Size",
      slug: "setlist-size",
      uiType: "multi-select",
      options: ["songs"]
    }
  ],
  "entertainment/live-bands/party-bands/dance-bands": [
    {
      name: "Tempo Range",
      slug: "tempo-range",
      uiType: "multi-select",
      options: ["BPM"]
    },
    {
      name: "DJ Collaboration",
      slug: "dj-collaboration",
      uiType: "toggle",
      options: []
    },
    {
      name: "LED Light Show",
      slug: "led-light-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fog Machine",
      slug: "fog-machine",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/party-bands/tribute-bands": [
    {
      name: "Artist Tribute",
      slug: "artist-tribute",
      uiType: "multi-select",
      options: ["Abbey Road/Zoso/Atomic Punks/etc."]
    },
    {
      name: "Costumes",
      slug: "costumes",
      uiType: "toggle",
      options: []
    },
    {
      name: "Authentic Gear",
      slug: "authentic-gear",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lookalike",
      slug: "lookalike",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/acoustic-guitar-singers": [
    {
      name: "Repertoire Size",
      slug: "repertoire-size",
      uiType: "multi-select",
      options: ["songs"]
    },
    {
      name: "Request Willingness",
      slug: "request-willingness",
      uiType: "toggle",
      options: []
    },
    {
      name: "Background Volume",
      slug: "background-volume",
      uiType: "toggle",
      options: []
    },
    {
      name: "Portable Setup",
      slug: "portable-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/bagpipers": [
    {
      name: "Traditional Attire",
      slug: "traditional-attire",
      uiType: "multi-select",
      options: ["kilt"]
    },
    {
      name: "Outdoor Only",
      slug: "outdoor-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Funeral Experience",
      slug: "funeral-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parade Experience",
      slug: "parade-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/cellists": [
    {
      name: "Solo Repertoire",
      slug: "solo-repertoire",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Duo Availability",
      slug: "duo-availability",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wedding Experience",
      slug: "wedding-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Amplification",
      slug: "amplification",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/flamenco-guitarists": [
    {
      name: "Traditional Flamenco",
      slug: "traditional-flamenco",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Accompaniment",
      slug: "dance-accompaniment",
      uiType: "toggle",
      options: []
    },
    {
      name: "Solo Performance",
      slug: "solo-performance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Authentic Attire",
      slug: "authentic-attire",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/harpists": [
    {
      name: "Harp Size",
      slug: "harp-size",
      uiType: "multi-select",
      options: ["concert/pedal/lever"]
    },
    {
      name: "Transport Requirements",
      slug: "transport-requirements",
      uiType: "multi-select",
      options: ["van/truck"]
    },
    {
      name: "Outdoor Capable",
      slug: "outdoor-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tuning Time",
      slug: "tuning-time",
      uiType: "multi-select",
      options: ["minutes"]
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/pianists": [
    {
      name: "Genre Focus",
      slug: "genre-focus",
      uiType: "multi-select",
      options: ["classical/jazz/pop"]
    },
    {
      name: "Sight Reading",
      slug: "sight-reading",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sheet Music Provided",
      slug: "sheet-music-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Grand Piano Required",
      slug: "grand-piano-required",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/saxophonists": [
    {
      name: "Backing Tracks",
      slug: "backing-tracks",
      uiType: "toggle",
      options: []
    },
    {
      name: "DJ Collaboration",
      slug: "dj-collaboration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Walkaround Playing",
      slug: "walkaround-playing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Genre Versatility",
      slug: "genre-versatility",
      uiType: "multi-select",
      options: ["jazz/pop/latin"]
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/steel-drum-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Tropical Attire",
      slug: "tropical-attire",
      uiType: "toggle",
      options: []
    },
    {
      name: "Island Music",
      slug: "island-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Beach Setup",
      slug: "beach-setup",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/solo-musicians-and-duos/violinists": [
    {
      name: "Classical Training",
      slug: "classical-training",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pop Covers",
      slug: "pop-covers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Electric Violin",
      slug: "electric-violin",
      uiType: "toggle",
      options: []
    },
    {
      name: "Backing Tracks",
      slug: "backing-tracks",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/acoustic-duos": [
    {
      name: "Instrumentation",
      slug: "instrumentation",
      uiType: "multi-select",
      options: ["guitar/vocal/guitar+violin/guitar+cello"]
    },
    {
      name: "Background Volume",
      slug: "background-volume",
      uiType: "multi-select",
      options: ["quiet"]
    },
    {
      name: "Playlist Length",
      slug: "playlist-length",
      uiType: "multi-select",
      options: ["hours"]
    }
  ],
  "entertainment/live-bands/wedding-bands/cover-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["3/4/5/6/7+ pc"]
    },
    {
      name: "Female Vocalist",
      slug: "female-vocalist",
      uiType: "toggle",
      options: []
    },
    {
      name: "Male Vocalist",
      slug: "male-vocalist",
      uiType: "toggle",
      options: []
    },
    {
      name: "First Dance Learning",
      slug: "first-dance-learning",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/jazz-wedding-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["2/3/4/5+"]
    },
    {
      name: "Cocktail Hour Only",
      slug: "cocktail-hour-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dinner Set Available",
      slug: "dinner-set-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Standards Database",
      slug: "standards-database",
      uiType: "multi-select",
      options: ["size"]
    }
  ],
  "entertainment/live-bands/wedding-bands/latin-wedding-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["4/6/8+"]
    },
    {
      name: "Percussion Section",
      slug: "percussion-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Lesson Available",
      slug: "dance-lesson-available",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/motown-and-soul-wedding-bands": [
    {
      name: "Horn Section",
      slug: "horn-section",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Female Lead",
      slug: "female-lead",
      uiType: "toggle",
      options: []
    },
    {
      name: "Male Lead",
      slug: "male-lead",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Participation",
      slug: "audience-participation",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/solo-musicians": [
    {
      name: "Instrument",
      slug: "instrument",
      uiType: "multi-select",
      options: ["guitar/piano/violin/cello/harp"]
    },
    {
      name: "Vocalist",
      slug: "vocalist",
      uiType: "toggle",
      options: []
    },
    {
      name: "Background Only",
      slug: "background-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Custom Song Learning",
      slug: "custom-song-learning",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/south-asian-wedding-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["3/5/7+"]
    },
    {
      name: "Dhol Player",
      slug: "dhol-player",
      uiType: "toggle",
      options: []
    },
    {
      name: "Tabla Player",
      slug: "tabla-player",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vocalist",
      slug: "vocalist",
      uiType: "multi-select",
      options: ["male/female/both"]
    }
  ],
  "entertainment/live-bands/wedding-bands/string-quartets": [
    {
      name: "Arrangements",
      slug: "arrangements",
      uiType: "multi-select",
      options: ["classical/pop/contemporary"]
    },
    {
      name: "Processional/Recessional",
      slug: "processional-recessional",
      uiType: "multi-select",
      options: ["custom"]
    },
    {
      name: "Outdoor Capable",
      slug: "outdoor-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Amplification",
      slug: "amplification",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/swing-wedding-bands": [
    {
      name: "Band Size",
      slug: "band-size",
      uiType: "multi-select",
      options: ["5/7/9+"]
    },
    {
      name: "Dance Lesson Available",
      slug: "dance-lesson-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vintage Attire",
      slug: "vintage-attire",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lindy Hop Compatible",
      slug: "lindy-hop-compatible",
      uiType: "toggle",
      options: []
    }
  ],
  "entertainment/live-bands/wedding-bands/top-40-wedding-bands": [
    {
      name: "Current Hits",
      slug: "current-hits",
      uiType: "toggle",
      options: []
    },
    {
      name: "Requests Welcome",
      slug: "requests-welcome",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor Energy",
      slug: "dance-floor-energy",
      uiType: "multi-select",
      options: ["high/medium"]
    },
    {
      name: "Break Music",
      slug: "break-music",
      uiType: "multi-select",
      options: ["DJ/iPod"]
    }
  ],
  "production-tech/photography/affordable-photographers/1000-2000": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "multi-select",
      options: ["$1000-1500/$1500-2000"]
    },
    {
      name: "Hours Included",
      slug: "hours-included",
      uiType: "multi-select",
      options: ["4/5/6"]
    },
    {
      name: "Edited Photos Included",
      slug: "edited-photos-included",
      uiType: "multi-select",
      options: ["100/150/200"]
    }
  ],
  "production-tech/photography/affordable-photographers/500-1000": [
    {
      name: "Price Range",
      slug: "price-range",
      uiType: "multi-select",
      options: ["$500-700/$700-1000"]
    },
    {
      name: "Hours Included",
      slug: "hours-included",
      uiType: "multi-select",
      options: ["2/3/4"]
    },
    {
      name: "Edited Photos Included",
      slug: "edited-photos-included",
      uiType: "multi-select",
      options: ["50/75/100"]
    }
  ],
  "production-tech/photography/affordable-photographers/amateur-photographers": [
    {
      name: "Portfolio Available",
      slug: "portfolio-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Experience Level",
      slug: "experience-level",
      uiType: "multi-select",
      options: ["1-2/2-3 years"]
    },
    {
      name: "TFP Available",
      slug: "tfp-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "References Available",
      slug: "references-available",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/affordable-photographers/digital-only-photographers": [
    {
      name: "Digital Delivery",
      slug: "digital-delivery",
      uiType: "multi-select",
      options: ["Dropbox/Google Drive/Pixieset"]
    },
    {
      name: "Print Rights Included",
      slug: "print-rights-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Size Included",
      slug: "social-media-size-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/affordable-photographers/hourly-rate-photographers": [
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$50-75/$75-100/$100-125/$125-150"]
    },
    {
      name: "Minimum Hours",
      slug: "minimum-hours",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Edited Photos Per Hour",
      slug: "edited-photos-per-hour",
      uiType: "multi-select",
      options: ["30/40/50"]
    }
  ],
  "production-tech/photography/affordable-photographers/student-photographers": [
    {
      name: "Portfolio Required",
      slug: "portfolio-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "School Affiliation",
      slug: "school-affiliation",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Supervision Available",
      slug: "supervision-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Discount Rate",
      slug: "discount-rate",
      uiType: "numeric",
      options: []
    }
  ],
  "production-tech/photography/affordable-photographers/under-500": [
    {
      name: "Price Cap",
      slug: "price-cap",
      uiType: "multi-select",
      options: ["$250/$350/$450/$500"]
    },
    {
      name: "Hourly Only",
      slug: "hourly-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Digital Only",
      slug: "digital-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Limited Edits",
      slug: "limited-edits",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/concert-and-festival-photographers": [
    {
      name: "Low Light Expertise",
      slug: "low-light-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Venue Approval Experience",
      slug: "venue-approval-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Pit Access",
      slug: "photo-pit-access",
      uiType: "toggle",
      options: []
    },
    {
      name: "Set List Coordination",
      slug: "set-list-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/conference-and-summit-photographers": [
    {
      name: "Multi-Day Coverage",
      slug: "multi-day-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Breakout Session Experience",
      slug: "breakout-session-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Speaker Headshots",
      slug: "speaker-headshots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Live Social Media Posting",
      slug: "live-social-media-posting",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/corporate-event-photographers": [
    {
      name: "Headshot Station",
      slug: "headshot-station",
      uiType: "toggle",
      options: []
    },
    {
      name: "Green Screen Capable",
      slug: "green-screen-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Same-Day Delivery",
      slug: "same-day-delivery",
      uiType: "toggle",
      options: []
    },
    {
      name: "NDAs Required",
      slug: "ndas-required",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/gala-and-fundraiser-photographers": [
    {
      name: "Red Carpet Experience",
      slug: "red-carpet-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candid & Posed Mix",
      slug: "candid-and-posed-mix",
      uiType: "multi-select",
      options: ["ratio"]
    },
    {
      name: "Sponsor Logo Integration",
      slug: "sponsor-logo-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fast Turnaround",
      slug: "fast-turnaround",
      uiType: "multi-select",
      options: ["24/48/72 hours"]
    }
  ],
  "production-tech/photography/event-photographers/party-photographers": [
    {
      name: "Candid Focus",
      slug: "candid-focus",
      uiType: "toggle",
      options: []
    },
    {
      name: "Group Posed Shots",
      slug: "group-posed-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flash Usage",
      slug: "flash-usage",
      uiType: "multi-select",
      options: ["on-camera/off-camera"]
    },
    {
      name: "Photo Booth Alternative",
      slug: "photo-booth-alternative",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/red-carpet-photographers": [
    {
      name: "Step-and-Repeat Experience",
      slug: "step-and-repeat-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lighting Setup",
      slug: "lighting-setup",
      uiType: "multi-select",
      options: ["portable/studio"]
    },
    {
      name: "Fast Editing",
      slug: "fast-editing",
      uiType: "multi-select",
      options: ["same-day/next-day"]
    },
    {
      name: "Press Release Photos",
      slug: "press-release-photos",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/event-photographers/sports-event-photographers": [
    {
      name: "Action Shots",
      slug: "action-shots",
      uiType: "toggle",
      options: []
    },
    {
      name: "Burst Mode Experience",
      slug: "burst-mode-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Remote Triggering",
      slug: "remote-triggering",
      uiType: "toggle",
      options: []
    },
    {
      name: "Media Credentials",
      slug: "media-credentials",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/boudoir-photographers": [
    {
      name: "Privacy Guarantee",
      slug: "privacy-guarantee",
      uiType: "toggle",
      options: []
    },
    {
      name: "Female Photographer",
      slug: "female-photographer",
      uiType: "multi-select",
      options: ["requestable"]
    },
    {
      name: "Outfit Guidance",
      slug: "outfit-guidance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Album Options",
      slug: "album-options",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/branding-photographers": [
    {
      name: "Commercial Rights Included",
      slug: "commercial-rights-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Social Media Sizing",
      slug: "social-media-sizing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lifestyle & Product Mix",
      slug: "lifestyle-and-product-mix",
      uiType: "multi-select",
      options: ["ratio"]
    },
    {
      name: "Website Ready",
      slug: "website-ready",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/couples-photographers": [
    {
      name: "Anniversary Experience",
      slug: "anniversary-experience",
      uiType: "multi-select",
      options: ["years"]
    },
    {
      name: "Surprise Proposal Experience",
      slug: "surprise-proposal-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Location Flexibility",
      slug: "location-flexibility",
      uiType: "toggle",
      options: []
    },
    {
      name: "Print Products",
      slug: "print-products",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/engagement-photographers": [
    {
      name: "Location Scouting",
      slug: "location-scouting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outfit Change",
      slug: "outfit-change",
      uiType: "multi-select",
      options: ["1/2/3"]
    },
    {
      name: "Print Rights",
      slug: "print-rights",
      uiType: "toggle",
      options: []
    },
    {
      name: "Save-the-Date Design",
      slug: "save-the-date-design",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/family-portrait-photographers": [
    {
      name: "Group Size Max",
      slug: "group-size-max",
      uiType: "multi-select",
      options: ["4/6/8/10+"]
    },
    {
      name: "Kids Experience",
      slug: "kids-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pets Welcome",
      slug: "pets-welcome",
      uiType: "toggle",
      options: []
    },
    {
      name: "Outdoor Location Options",
      slug: "outdoor-location-options",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/headshot-photographers": [
    {
      name: "Background Options",
      slug: "background-options",
      uiType: "multi-select",
      options: ["white/gray/outdoor/custom"]
    },
    {
      name: "Retouching Level",
      slug: "retouching-level",
      uiType: "multi-select",
      options: ["natural/polished/glam"]
    },
    {
      name: "Wardrobe Consultation",
      slug: "wardrobe-consultation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Digital Delivery",
      slug: "digital-delivery",
      uiType: "multi-select",
      options: ["same-day/24hrs"]
    }
  ],
  "production-tech/photography/portrait-photographers/maternity-photographers": [
    {
      name: "Studio vs Outdoor",
      slug: "studio-vs-outdoor",
      uiType: "multi-select",
      options: ["both/studio/outdoor"]
    },
    {
      name: "Wardrobe Provided",
      slug: "wardrobe-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Partner Included",
      slug: "partner-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sibling Included",
      slug: "sibling-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/newborn-photographers": [
    {
      name: "Safety Certification",
      slug: "safety-certification",
      uiType: "toggle",
      options: []
    },
    {
      name: "Studio Temperature Control",
      slug: "studio-temperature-control",
      uiType: "toggle",
      options: []
    },
    {
      name: "Props Provided",
      slug: "props-provided",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parent Posing",
      slug: "parent-posing",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/quinceaera-portrait-photographers": [
    {
      name: "Court Photography",
      slug: "court-photography",
      uiType: "toggle",
      options: []
    },
    {
      name: "Large Group Experience",
      slug: "large-group-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Venue Familiarity",
      slug: "venue-familiarity",
      uiType: "toggle",
      options: []
    },
    {
      name: "Traditional Poses",
      slug: "traditional-poses",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/senior-portrait-photographers": [
    {
      name: "Location Options",
      slug: "location-options",
      uiType: "multi-select",
      options: ["studio/outdoor/urban/nature"]
    },
    {
      name: "Outfit Changes",
      slug: "outfit-changes",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Yearbook Compliance",
      slug: "yearbook-compliance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Peer Groups",
      slug: "peer-groups",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/portrait-photographers/sweet-16-portrait-photographers": [
    {
      name: "Individual & Group",
      slug: "individual-and-group",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candid & Posed Mix",
      slug: "candid-and-posed-mix",
      uiType: "multi-select",
      options: ["ratio"]
    },
    {
      name: "Party Coverage Available",
      slug: "party-coverage-available",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Booth Add-on",
      slug: "photo-booth-add-on",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/african-american-wedding-photographers": [
    {
      name: "Skin Tone Experience",
      slug: "skin-tone-experience",
      uiType: "multi-select",
      options: ["all shades"]
    },
    {
      name: "Exposure Expertise",
      slug: "exposure-expertise",
      uiType: "toggle",
      options: []
    },
    {
      name: "Natural Lighting",
      slug: "natural-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flash Experience",
      slug: "flash-experience",
      uiType: "multi-select",
      options: ["bounce/off-camera"]
    }
  ],
  "production-tech/photography/wedding-photographers/black-and-white-wedding-photographers": [
    {
      name: "B&W Conversion",
      slug: "bandw-conversion",
      uiType: "multi-select",
      options: ["in-camera/post"]
    },
    {
      name: "Grain Preference",
      slug: "grain-preference",
      uiType: "multi-select",
      options: ["fine/medium/visible"]
    },
    {
      name: "Contrast Style",
      slug: "contrast-style",
      uiType: "multi-select",
      options: ["high/low/balanced"]
    },
    {
      name: "Color Option Available",
      slug: "color-option-available",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/bright-and-airy-wedding-photographers": [
    {
      name: "Editing Style",
      slug: "editing-style",
      uiType: "multi-select",
      options: ["bright/airy/light/ethereal"]
    },
    {
      name: "Exposure Preference",
      slug: "exposure-preference",
      uiType: "multi-select",
      options: ["overexposed"]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["pastel/cream/white"]
    },
    {
      name: "Skin Tone",
      slug: "skin-tone",
      uiType: "multi-select",
      options: ["warm"]
    }
  ],
  "production-tech/photography/wedding-photographers/budget-wedding-photographers": [
    {
      name: "Price Cap",
      slug: "price-cap",
      uiType: "multi-select",
      options: ["$1k/$1.5k/$2k/$2.5k"]
    },
    {
      name: "Hourly Only",
      slug: "hourly-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Digital Only",
      slug: "digital-only",
      uiType: "toggle",
      options: []
    },
    {
      name: "Shorter Coverage",
      slug: "shorter-coverage",
      uiType: "multi-select",
      options: ["4/5/6 hours"]
    }
  ],
  "production-tech/photography/wedding-photographers/dark-and-moody-wedding-photographers": [
    {
      name: "Editing Style",
      slug: "editing-style",
      uiType: "multi-select",
      options: ["dark/moody/matte/desaturated"]
    },
    {
      name: "Contrast Level",
      slug: "contrast-level",
      uiType: "multi-select",
      options: ["high"]
    },
    {
      name: "Shadow Detail",
      slug: "shadow-detail",
      uiType: "multi-select",
      options: ["crushed/preserved"]
    },
    {
      name: "Color Palette",
      slug: "color-palette",
      uiType: "multi-select",
      options: ["muted"]
    }
  ],
  "production-tech/photography/wedding-photographers/destination-wedding-photographers": [
    {
      name: "Regions Served",
      slug: "regions-served",
      uiType: "multi-select",
      options: ["list"]
    },
    {
      name: "Travel Fee Structure",
      slug: "travel-fee-structure",
      uiType: "multi-select",
      options: ["included/flat/percentage"]
    },
    {
      name: "Accommodation Required",
      slug: "accommodation-required",
      uiType: "toggle",
      options: []
    },
    {
      name: "Local Knowledge",
      slug: "local-knowledge",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/elopement-photographers": [
    {
      name: "Guest Count Max",
      slug: "guest-count-max",
      uiType: "multi-select",
      options: ["10/20/30/50"]
    },
    {
      name: "Hourly Minimum",
      slug: "hourly-minimum",
      uiType: "multi-select",
      options: ["1/2/3 hours"]
    },
    {
      name: "Location Flexibility",
      slug: "location-flexibility",
      uiType: "toggle",
      options: []
    },
    {
      name: "Permit Assistance",
      slug: "permit-assistance",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/fine-art-wedding-photographers": [
    {
      name: "Editorial Experience",
      slug: "editorial-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Magazine Publications",
      slug: "magazine-publications",
      uiType: "multi-select",
      options: ["number"]
    },
    {
      name: "Album Design Included",
      slug: "album-design-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fine Art Printing",
      slug: "fine-art-printing",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/latin-wedding-photographers": [
    {
      name: "Quinceañera Experience",
      slug: "quinceaera-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Large Family Experience",
      slug: "large-family-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vibrant Color Editing",
      slug: "vibrant-color-editing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candid Style",
      slug: "candid-style",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/lgbtqplus-wedding-photographers": [
    {
      name: "Same-Sex Wedding Count",
      slug: "same-sex-wedding-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Inclusive Posing",
      slug: "inclusive-posing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Gender-Neutral Language",
      slug: "gender-neutral-language",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pride Event Experience",
      slug: "pride-event-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/luxury-wedding-photographers": [
    {
      name: "Minimum Investment",
      slug: "minimum-investment",
      uiType: "multi-select",
      options: ["$5k/$7.5k/$10k/$15k+"]
    },
    {
      name: "Assistant Included",
      slug: "assistant-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Album Included",
      slug: "album-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Engagement Session Included",
      slug: "engagement-session-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/photojournalistic-wedding-photographers": [
    {
      name: "Documentary Style",
      slug: "documentary-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Unposed Approach",
      slug: "unposed-approach",
      uiType: "toggle",
      options: []
    },
    {
      name: "Candid Ratio",
      slug: "candid-ratio",
      uiType: "multi-select",
      options: ["90%+/80%+/70%+"]
    },
    {
      name: "No Flash Preference",
      slug: "no-flash-preference",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/south-asian-wedding-photographers": [
    {
      name: "Multi-Day Experience",
      slug: "multi-day-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Large Group Experience",
      slug: "large-group-experience",
      uiType: "multi-select",
      options: ["200-500+"]
    },
    {
      name: "Candid Style",
      slug: "candid-style",
      uiType: "toggle",
      options: []
    },
    {
      name: "Vibrant Color Editing",
      slug: "vibrant-color-editing",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/photography/wedding-photographers/traditional-wedding-photographers": [
    {
      name: "Formal Portraits",
      slug: "formal-portraits",
      uiType: "toggle",
      options: []
    },
    {
      name: "Family Formals Experience",
      slug: "family-formals-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Large Group Experience",
      slug: "large-group-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Posing Direction",
      slug: "posing-direction",
      uiType: "multi-select",
      options: ["heavy/moderate/light"]
    }
  ],
  "production-tech/photography/wedding-photographers/vintage-film-wedding-photographers": [
    {
      name: "Film Format",
      slug: "film-format",
      uiType: "multi-select",
      options: ["35mm/120/4x5"]
    },
    {
      name: "Film Stocks Used",
      slug: "film-stocks-used",
      uiType: "multi-select",
      options: ["Portra/HP5/Ektar/Tri-X"]
    },
    {
      name: "Scans Included",
      slug: "scans-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Prints Included",
      slug: "prints-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/concert-and-festival-videographers": [
    {
      name: "Multi-Camera",
      slug: "multi-camera",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Live Switching",
      slug: "live-switching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Audience Cut",
      slug: "audience-cut",
      uiType: "toggle",
      options: []
    },
    {
      name: "Backstage B-Roll",
      slug: "backstage-b-roll",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/conference-and-summit-videographers": [
    {
      name: "Multi-Camera",
      slug: "multi-camera",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Live Switching",
      slug: "live-switching",
      uiType: "toggle",
      options: []
    },
    {
      name: "Presentation Capture",
      slug: "presentation-capture",
      uiType: "toggle",
      options: []
    },
    {
      name: "Speaker Reel",
      slug: "speaker-reel",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/corporate-event-videographers": [
    {
      name: "Interview Setup",
      slug: "interview-setup",
      uiType: "toggle",
      options: []
    },
    {
      name: "B-Roll Package",
      slug: "b-roll-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Logo Watermark",
      slug: "logo-watermark",
      uiType: "toggle",
      options: []
    },
    {
      name: "Internal Use Rights",
      slug: "internal-use-rights",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/gala-and-fundraiser-videographers": [
    {
      name: "Red Carpet Coverage",
      slug: "red-carpet-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Donor Testimonials",
      slug: "donor-testimonials",
      uiType: "toggle",
      options: []
    },
    {
      name: "Impact Video Integration",
      slug: "impact-video-integration",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sponsor Spots",
      slug: "sponsor-spots",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/live-streaming-event-videographers": [
    {
      name: "Platform",
      slug: "platform",
      uiType: "multi-select",
      options: ["YouTube/Vimeo/Facebook/Custom"]
    },
    {
      name: "CDN Included",
      slug: "cdn-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chat Moderation",
      slug: "chat-moderation",
      uiType: "toggle",
      options: []
    },
    {
      name: "Recording Included",
      slug: "recording-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/event-videographers/sports-event-videographers": [
    {
      name: "High Frame Rate",
      slug: "high-frame-rate",
      uiType: "multi-select",
      options: ["60/120/240fps"]
    },
    {
      name: "Replay Capable",
      slug: "replay-capable",
      uiType: "toggle",
      options: []
    },
    {
      name: "Drone Coverage",
      slug: "drone-coverage",
      uiType: "toggle",
      options: []
    },
    {
      name: "Highlight Reel",
      slug: "highlight-reel",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/cinematic-wedding-videographers": [
    {
      name: "Highlight Length",
      slug: "highlight-length",
      uiType: "multi-select",
      options: ["3-4/4-5/5-6/6-8 min"]
    },
    {
      name: "Music Licensing",
      slug: "music-licensing",
      uiType: "multi-select",
      options: ["royalty-free/licensed"]
    },
    {
      name: "Color Grade",
      slug: "color-grade",
      uiType: "multi-select",
      options: ["film/moody/bright"]
    },
    {
      name: "Drone Included",
      slug: "drone-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/cultural-wedding-videographers": [
    {
      name: "Multi-Day Experience",
      slug: "multi-day-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cultural Traditions Knowledge",
      slug: "cultural-traditions-knowledge",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bilingual Editors",
      slug: "bilingual-editors",
      uiType: "toggle",
      options: []
    },
    {
      name: "Documentary Style",
      slug: "documentary-style",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/documentary-wedding-videographers": [
    {
      name: "Full Ceremony",
      slug: "full-ceremony",
      uiType: "multi-select",
      options: ["unedited/edited"]
    },
    {
      name: "Full Speeches",
      slug: "full-speeches",
      uiType: "multi-select",
      options: ["unedited/edited"]
    },
    {
      name: "Multi-Camera",
      slug: "multi-camera",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Raw Footage Included",
      slug: "raw-footage-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/drone-only-wedding-videographers": [
    {
      name: "FAA Certified",
      slug: "faa-certified",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flight Time",
      slug: "flight-time",
      uiType: "multi-select",
      options: ["minutes per battery"]
    },
    {
      name: "Weather Policy",
      slug: "weather-policy",
      uiType: "multi-select",
      options: ["reschedule/refund"]
    },
    {
      name: "Ground Footage",
      slug: "ground-footage",
      uiType: "multi-select",
      options: ["none"]
    }
  ],
  "production-tech/videography/wedding-videographers/full-feature-wedding-videographers": [
    {
      name: "Feature Length",
      slug: "feature-length",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Chapters/Menu",
      slug: "chapters-menu",
      uiType: "toggle",
      options: []
    },
    {
      name: "Blu-ray Authoring",
      slug: "blu-ray-authoring",
      uiType: "toggle",
      options: []
    },
    {
      name: "USB Packaging",
      slug: "usb-packaging",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/highlight-reel-only-wedding-videographers": [
    {
      name: "Highlight Length",
      slug: "highlight-length",
      uiType: "multi-select",
      options: ["3/4/5 min"]
    },
    {
      name: "Social Media Clips",
      slug: "social-media-clips",
      uiType: "toggle",
      options: []
    },
    {
      name: "Music Licensing",
      slug: "music-licensing",
      uiType: "multi-select",
      options: ["included/client provides"]
    },
    {
      name: "No Full Ceremony",
      slug: "no-full-ceremony",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/lgbtqplus-wedding-videographers": [
    {
      name: "Same-Sex Wedding Count",
      slug: "same-sex-wedding-count",
      uiType: "numeric",
      options: []
    },
    {
      name: "Inclusive Storytelling",
      slug: "inclusive-storytelling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Pride Event Experience",
      slug: "pride-event-experience",
      uiType: "toggle",
      options: []
    },
    {
      name: "Ally Statement",
      slug: "ally-statement",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/raw-footage-wedding-videographers": [
    {
      name: "Footage Format",
      slug: "footage-format",
      uiType: "multi-select",
      options: ["4K/1080p"]
    },
    {
      name: "All Cameras Included",
      slug: "all-cameras-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "All Audio Included",
      slug: "all-audio-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Delivery Method",
      slug: "delivery-method",
      uiType: "multi-select",
      options: ["HDD/download"]
    }
  ],
  "production-tech/videography/wedding-videographers/same-day-edit-videographers": [
    {
      name: "Editor On-Site",
      slug: "editor-on-site",
      uiType: "toggle",
      options: []
    },
    {
      name: "Montage Length",
      slug: "montage-length",
      uiType: "multi-select",
      options: ["2-3/3-4 min"]
    },
    {
      name: "Footage Cutoff",
      slug: "footage-cutoff",
      uiType: "multi-select",
      options: ["ceremony/pre-ceremony"]
    },
    {
      name: "Projector Included",
      slug: "projector-included",
      uiType: "toggle",
      options: []
    }
  ],
  "production-tech/videography/wedding-videographers/super-8-and-vintage-film-videographers": [
    {
      name: "Film Stock",
      slug: "film-stock",
      uiType: "multi-select",
      options: ["real/digital emulation"]
    },
    {
      name: "Physical Film Included",
      slug: "physical-film-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Processing Time",
      slug: "processing-time",
      uiType: "multi-select",
      options: ["weeks"]
    },
    {
      name: "Audio Sync",
      slug: "audio-sync",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/airport-shuttles/coach-bus-shuttles": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["30/40/50/56+"]
    },
    {
      name: "Restroom",
      slug: "restroom",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luggage Bay",
      slug: "luggage-bay",
      uiType: "toggle",
      options: []
    },
    {
      name: "TV/DVD",
      slug: "tv-dvd",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$150-300"]
    }
  ],
  "travel-lodging/transportation/airport-shuttles/executive-sedan-shuttles": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["3"]
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water Included",
      slug: "water-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Meet & Greet",
      slug: "meet-and-greet",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Wait Fee",
      slug: "hourly-wait-fee",
      uiType: "multi-select",
      options: ["$20-50"]
    }
  ],
  "travel-lodging/transportation/airport-shuttles/flight-tracking": [
    {
      name: "Automatic Rescheduling",
      slug: "automatic-rescheduling",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Extra Fee",
      slug: "no-extra-fee",
      uiType: "toggle",
      options: []
    },
    {
      name: "Text Alerts",
      slug: "text-alerts",
      uiType: "toggle",
      options: []
    },
    {
      name: "International Flight Experience",
      slug: "international-flight-experience",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/airport-shuttles/meet-and-greet-service": [
    {
      name: "Name Sign",
      slug: "name-sign",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luggage Assistance",
      slug: "luggage-assistance",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wait Time Included",
      slug: "wait-time-included",
      uiType: "multi-select",
      options: ["30/45/60 min"]
    },
    {
      name: "Phone/Text Confirmation",
      slug: "phone-text-confirmation",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/airport-shuttles/minibus-shuttles": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["15/20/25"]
    },
    {
      name: "Under-Bus Storage",
      slug: "under-bus-storage",
      uiType: "toggle",
      options: []
    },
    {
      name: "A/C",
      slug: "a-c",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wheelchair Lift",
      slug: "wheelchair-lift",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$100-150"]
    }
  ],
  "travel-lodging/transportation/airport-shuttles/private-shuttles": [
    {
      name: "Price Per Vehicle",
      slug: "price-per-vehicle",
      uiType: "multi-select",
      options: ["$50-150"]
    },
    {
      name: "Direct Route",
      slug: "direct-route",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Additional Stops",
      slug: "no-additional-stops",
      uiType: "toggle",
      options: []
    },
    {
      name: "Group Discount",
      slug: "group-discount",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/airport-shuttles/shared-ride-shuttles": [
    {
      name: "Wait Time",
      slug: "wait-time",
      uiType: "multi-select",
      options: ["15/30/45 min"]
    },
    {
      name: "Price Per Person",
      slug: "price-per-person",
      uiType: "multi-select",
      options: ["$15-30"]
    },
    {
      name: "Multiple Stops",
      slug: "multiple-stops",
      uiType: "toggle",
      options: []
    },
    {
      name: "Luggage Limit",
      slug: "luggage-limit",
      uiType: "multi-select",
      options: ["1/2 bags"]
    }
  ],
  "travel-lodging/transportation/airport-shuttles/sprinter-van-shuttles": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["8/10/12/14"]
    },
    {
      name: "Luggage Space",
      slug: "luggage-space",
      uiType: "multi-select",
      options: ["large"]
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "TV",
      slug: "tv",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$50-100"]
    }
  ],
  "travel-lodging/transportation/car-rentals/convertibles": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["2/4"]
    },
    {
      name: "Trunk Space",
      slug: "trunk-space",
      uiType: "multi-select",
      options: ["small"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$100-250+"]
    },
    {
      name: "\"Just Married\" Signs",
      slug: "just-married-signs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Red Carpet Service",
      slug: "red-carpet-service",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/economy-cars": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["4"]
    },
    {
      name: "MPG",
      slug: "mpg",
      uiType: "multi-select",
      options: ["30+"]
    },
    {
      name: "Trunk Space",
      slug: "trunk-space",
      uiType: "multi-select",
      options: ["small"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$25-40"]
    },
    {
      name: "Unlimited Miles",
      slug: "unlimited-miles",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/exotic-car-rentals": [
    {
      name: "Brand",
      slug: "brand",
      uiType: "multi-select",
      options: ["Lamborghini/Ferrari/Porsche/McLaren/Aston Martin"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$500-2000+"]
    },
    {
      name: "Mileage Limit",
      slug: "mileage-limit",
      uiType: "multi-select",
      options: ["50/100/200 miles"]
    },
    {
      name: "Age Minimum",
      slug: "age-minimum",
      uiType: "multi-select",
      options: ["25/30"]
    },
    {
      name: "Security Deposit",
      slug: "security-deposit",
      uiType: "multi-select",
      options: ["$2000+"]
    }
  ],
  "travel-lodging/transportation/car-rentals/full-size-cars": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["5"]
    },
    {
      name: "MPG",
      slug: "mpg",
      uiType: "multi-select",
      options: ["20-25"]
    },
    {
      name: "Trunk Space",
      slug: "trunk-space",
      uiType: "multi-select",
      options: ["large"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$60-85"]
    },
    {
      name: "Unlimited Miles",
      slug: "unlimited-miles",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/luxury-cars": [
    {
      name: "Brand",
      slug: "brand",
      uiType: "multi-select",
      options: ["BMW/Mercedes/Audi/Lexus"]
    },
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["4-5"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$100-200+"]
    },
    {
      name: "Premium Package",
      slug: "premium-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Chauffeur Option",
      slug: "chauffeur-option",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/minivans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["7/8"]
    },
    {
      name: "Stow & Go",
      slug: "stow-and-go",
      uiType: "toggle",
      options: []
    },
    {
      name: "Entertainment System",
      slug: "entertainment-system",
      uiType: "toggle",
      options: []
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$80-120"]
    },
    {
      name: "Car Seats Available",
      slug: "car-seats-available",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/passenger-vans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["8/10/12/15"]
    },
    {
      name: "Cargo Space",
      slug: "cargo-space",
      uiType: "toggle",
      options: []
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$120-200+"]
    },
    {
      name: "Commercial Insurance Required",
      slug: "commercial-insurance-required",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/standard-cars": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["5"]
    },
    {
      name: "MPG",
      slug: "mpg",
      uiType: "multi-select",
      options: ["25-30"]
    },
    {
      name: "Trunk Space",
      slug: "trunk-space",
      uiType: "multi-select",
      options: ["medium"]
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$40-60"]
    },
    {
      name: "Unlimited Miles",
      slug: "unlimited-miles",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/car-rentals/suvs": [
    {
      name: "Size",
      slug: "size",
      uiType: "multi-select",
      options: ["compact/mid-size/full-size"]
    },
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["5/7/8"]
    },
    {
      name: "4WD/AWD",
      slug: "4wd-awd",
      uiType: "toggle",
      options: []
    },
    {
      name: "Daily Rate",
      slug: "daily-rate",
      uiType: "multi-select",
      options: ["$75-150+"]
    },
    {
      name: "Cargo Space",
      slug: "cargo-space",
      uiType: "multi-select",
      options: ["cu ft"]
    }
  ],
  "travel-lodging/transportation/corporate-transportation/conference-transportation": [
    {
      name: "Venue Count",
      slug: "venue-count",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Schedule Coordination",
      slug: "schedule-coordination",
      uiType: "toggle",
      options: []
    },
    {
      name: "Name Badges",
      slug: "name-badges",
      uiType: "toggle",
      options: []
    },
    {
      name: "ADA Accessible",
      slug: "ada-accessible",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/corporate-transportation/corporate-shuttles": [
    {
      name: "Route Planning",
      slug: "route-planning",
      uiType: "multi-select",
      options: ["included"]
    },
    {
      name: "Employee Badge Check",
      slug: "employee-badge-check",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "Power Outlets",
      slug: "power-outlets",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/corporate-transportation/executive-sedans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["3"]
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "Power Outlets",
      slug: "power-outlets",
      uiType: "toggle",
      options: []
    },
    {
      name: "Water Included",
      slug: "water-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Professional Chauffeur",
      slug: "professional-chauffeur",
      uiType: "multi-select",
      options: ["suit"]
    }
  ],
  "travel-lodging/transportation/corporate-transportation/executive-suvs": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["4-5"]
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "Power Outlets",
      slug: "power-outlets",
      uiType: "toggle",
      options: []
    },
    {
      name: "Privacy Partition",
      slug: "privacy-partition",
      uiType: "toggle",
      options: []
    },
    {
      name: "Corporate Account Billing",
      slug: "corporate-account-billing",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/corporate-transportation/executive-vans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["6-8"]
    },
    {
      name: "Wi-Fi",
      slug: "wi-fi",
      uiType: "toggle",
      options: []
    },
    {
      name: "Work Table",
      slug: "work-table",
      uiType: "toggle",
      options: []
    },
    {
      name: "Conference Calling",
      slug: "conference-calling",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$60-120"]
    }
  ],
  "travel-lodging/transportation/limousines/hummer-limousines": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["14/16/18/20+"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Light Show",
      slug: "light-show",
      uiType: "toggle",
      options: []
    },
    {
      name: "Bar",
      slug: "bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound System",
      slug: "sound-system",
      uiType: "multi-select",
      options: ["club-grade"]
    }
  ],
  "travel-lodging/transportation/limousines/luxury-sedans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["3"]
    },
    {
      name: "Trunk Space",
      slug: "trunk-space",
      uiType: "multi-select",
      options: ["golf bags"]
    },
    {
      name: "Professional Chauffeur",
      slug: "professional-chauffeur",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$50-100"]
    },
    {
      name: "Airport Meet & Greet",
      slug: "airport-meet-and-greet",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/limousines/stretch-limousines": [
    {
      name: "Length",
      slug: "length",
      uiType: "multi-select",
      options: ["120\"/140\"/160\""]
    },
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["6/8/10"]
    },
    {
      name: "Bar",
      slug: "bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Privacy Partition",
      slug: "privacy-partition",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$75-150"]
    }
  ],
  "travel-lodging/transportation/limousines/suv-limousines": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["10/12/14"]
    },
    {
      name: "Bar",
      slug: "bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "TV/DVD",
      slug: "tv-dvd",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sound System",
      slug: "sound-system",
      uiType: "multi-select",
      options: ["premium"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$100-200"]
    }
  ],
  "travel-lodging/transportation/limousines/vintage-limousines": [
    {
      name: "Year",
      slug: "year",
      uiType: "multi-select",
      options: ["1950s/60s/70s"]
    },
    {
      name: "Model",
      slug: "model",
      uiType: "multi-select",
      options: ["Cadillac/Lincoln/Rolls Royce"]
    },
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["4/6/8"]
    },
    {
      name: "Wedding Package",
      slug: "wedding-package",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Package",
      slug: "photo-package",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/party-buses/bachelor-party-buses": [
    {
      name: "Groom Decor",
      slug: "groom-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Beer Pong Setup",
      slug: "beer-pong-setup",
      uiType: "toggle",
      options: []
    },
    {
      name: "Stripper Pole",
      slug: "stripper-pole",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cooler Included",
      slug: "cooler-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Strip Club Stop",
      slug: "strip-club-stop",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/party-buses/bachelorette-party-buses": [
    {
      name: "Bachelorette Decor",
      slug: "bachelorette-decor",
      uiType: "toggle",
      options: []
    },
    {
      name: "Penis Props",
      slug: "penis-props",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sashes/Veils",
      slug: "sashes-veils",
      uiType: "toggle",
      options: []
    },
    {
      name: "Champagne Service",
      slug: "champagne-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Package",
      slug: "photo-package",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/party-buses/bar-crawl-party-buses": [
    {
      name: "Bar Stops",
      slug: "bar-stops",
      uiType: "multi-select",
      options: ["3/4/5+"]
    },
    {
      name: "Route Planning",
      slug: "route-planning",
      uiType: "multi-select",
      options: ["included"]
    },
    {
      name: "Drink Specials",
      slug: "drink-specials",
      uiType: "toggle",
      options: []
    },
    {
      name: "Entry Fees Included",
      slug: "entry-fees-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["3/4/5 hours"]
    }
  ],
  "travel-lodging/transportation/party-buses/disco-party-buses": [
    {
      name: "Dance Poles",
      slug: "dance-poles",
      uiType: "multi-select",
      options: ["1/2/3+"]
    },
    {
      name: "Disco Ball",
      slug: "disco-ball",
      uiType: "toggle",
      options: []
    },
    {
      name: "Laser Lights",
      slug: "laser-lights",
      uiType: "toggle",
      options: []
    },
    {
      name: "Fog Machine",
      slug: "fog-machine",
      uiType: "toggle",
      options: []
    },
    {
      name: "DJ Booth",
      slug: "dj-booth",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/party-buses/large-party-buses": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["30/35"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "multi-select",
      options: ["yes/no size"]
    },
    {
      name: "Restroom",
      slug: "restroom",
      uiType: "toggle",
      options: []
    },
    {
      name: "TV Screens",
      slug: "tv-screens",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$250-350"]
    }
  ],
  "travel-lodging/transportation/party-buses/medium-party-buses": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["20/22/25"]
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "toggle",
      options: []
    },
    {
      name: "LED Lighting",
      slug: "led-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Restroom",
      slug: "restroom",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$150-250"]
    }
  ],
  "travel-lodging/transportation/party-buses/mega-party-buses": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["56+"]
    },
    {
      name: "Double Decker",
      slug: "double-decker",
      uiType: "toggle",
      options: []
    },
    {
      name: "Dance Floor",
      slug: "dance-floor",
      uiType: "multi-select",
      options: ["level"]
    },
    {
      name: "Restrooms",
      slug: "restrooms",
      uiType: "multi-select",
      options: ["2+"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$500-800"]
    }
  ],
  "travel-lodging/transportation/party-buses/prom-party-buses": [
    {
      name: "No Alcohol Policy",
      slug: "no-alcohol-policy",
      uiType: "multi-select",
      options: ["strict"]
    },
    {
      name: "Chaperone",
      slug: "chaperone",
      uiType: "multi-select",
      options: ["included/required"]
    },
    {
      name: "Clean Edits Music",
      slug: "clean-edits-music",
      uiType: "toggle",
      options: []
    },
    {
      name: "Parental Waiver",
      slug: "parental-waiver",
      uiType: "multi-select",
      options: ["required"]
    },
    {
      name: "Curfew",
      slug: "curfew",
      uiType: "multi-select",
      options: ["time"]
    }
  ],
  "travel-lodging/transportation/party-buses/small-party-buses": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["14/16/18"]
    },
    {
      name: "Bar",
      slug: "bar",
      uiType: "multi-select",
      options: ["wet/dry"]
    },
    {
      name: "Sound System",
      slug: "sound-system",
      uiType: "multi-select",
      options: ["premium"]
    },
    {
      name: "Lighting",
      slug: "lighting",
      uiType: "multi-select",
      options: ["RGB"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$100-150"]
    }
  ],
  "travel-lodging/transportation/party-buses/sprinter-party-vans": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["10/12/14"]
    },
    {
      name: "Leather Lounge",
      slug: "leather-lounge",
      uiType: "toggle",
      options: []
    },
    {
      name: "Premium Sound",
      slug: "premium-sound",
      uiType: "toggle",
      options: []
    },
    {
      name: "Mood Lighting",
      slug: "mood-lighting",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$80-150"]
    }
  ],
  "travel-lodging/transportation/party-buses/vip-party-buses": [
    {
      name: "Leather Seats",
      slug: "leather-seats",
      uiType: "toggle",
      options: []
    },
    {
      name: "Premium Sound",
      slug: "premium-sound",
      uiType: "multi-select",
      options: ["Bose/JBL/Harman"]
    },
    {
      name: "Champagne Bar",
      slug: "champagne-bar",
      uiType: "toggle",
      options: []
    },
    {
      name: "Flat Screen TVs",
      slug: "flat-screen-tvs",
      uiType: "multi-select",
      options: ["size"]
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$200-400"]
    }
  ],
  "travel-lodging/transportation/party-buses/wine-tour-party-buses": [
    {
      name: "Vineyard Stops",
      slug: "vineyard-stops",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Tasting Fees Included",
      slug: "tasting-fees-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Lunch Stop",
      slug: "lunch-stop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cheese Pairing",
      slug: "cheese-pairing",
      uiType: "toggle",
      options: []
    },
    {
      name: "Duration",
      slug: "duration",
      uiType: "multi-select",
      options: ["4/5/6 hours"]
    }
  ],
  "travel-lodging/transportation/party-buses/xl-party-buses": [
    {
      name: "Seats",
      slug: "seats",
      uiType: "multi-select",
      options: ["40/45/50"]
    },
    {
      name: "Multiple Bars",
      slug: "multiple-bars",
      uiType: "multi-select",
      options: ["1/2"]
    },
    {
      name: "Restroom",
      slug: "restroom",
      uiType: "toggle",
      options: []
    },
    {
      name: "VIP Section",
      slug: "vip-section",
      uiType: "toggle",
      options: []
    },
    {
      name: "Hourly Rate",
      slug: "hourly-rate",
      uiType: "multi-select",
      options: ["$350-500"]
    }
  ],
  "travel-lodging/transportation/wedding-transportation/after-party-transportation": [
    {
      name: "Late Night Hours",
      slug: "late-night-hours",
      uiType: "multi-select",
      options: ["10pm-2am/11pm-3am"]
    },
    {
      name: "Bar Crawl Route",
      slug: "bar-crawl-route",
      uiType: "toggle",
      options: []
    },
    {
      name: "Last Call Coordination",
      slug: "last-call-coordination",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/wedding-transportation/bridal-party-shuttles": [
    {
      name: "Multiple Stops",
      slug: "multiple-stops",
      uiType: "multi-select",
      options: ["2/3/4+"]
    },
    {
      name: "Champagne Included",
      slug: "champagne-included",
      uiType: "toggle",
      options: []
    },
    {
      name: "Red Carpet Service",
      slug: "red-carpet-service",
      uiType: "toggle",
      options: []
    },
    {
      name: "Photo Stop",
      slug: "photo-stop",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/wedding-transportation/getaway-car": [
    {
      name: "Car Type",
      slug: "car-type",
      uiType: "multi-select",
      options: ["vintage/convertible/luxury/sports"]
    },
    {
      name: "\"Just Married\" Signs",
      slug: "just-married-signs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Cans/Streamers",
      slug: "cans-streamers",
      uiType: "toggle",
      options: []
    },
    {
      name: "Sparkler Exit Coordinated",
      slug: "sparkler-exit-coordinated",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/wedding-transportation/guest-shuttles": [
    {
      name: "Shuttle Frequency",
      slug: "shuttle-frequency",
      uiType: "multi-select",
      options: ["every 15/30/60 min"]
    },
    {
      name: "Continuous Loop",
      slug: "continuous-loop",
      uiType: "toggle",
      options: []
    },
    {
      name: "Late Night Return",
      slug: "late-night-return",
      uiType: "toggle",
      options: []
    },
    {
      name: "Wheelchair Accessible",
      slug: "wheelchair-accessible",
      uiType: "toggle",
      options: []
    }
  ],
  "travel-lodging/transportation/wedding-transportation/late-night-guest-drop-off": [
    {
      name: "Hours",
      slug: "hours",
      uiType: "multi-select",
      options: ["10pm-4am"]
    },
    {
      name: "Multiple Drop-offs",
      slug: "multiple-drop-offs",
      uiType: "toggle",
      options: []
    },
    {
      name: "Security Present",
      slug: "security-present",
      uiType: "toggle",
      options: []
    },
    {
      name: "No Alcohol Consumption On-Bus",
      slug: "no-alcohol-consumption-on-bus",
      uiType: "toggle",
      options: []
    }
  ]
};

// ─── Helper: get all filters for a category page ───
export function getFiltersForCategory(
  l1Slug: string,
  l2Slug?: string,
  l3Slug?: string,
  l4Slug?: string,
): FilterDefinition[] {
  const universal = universalFilters[l1Slug] ?? [];
  let dynamic: FilterDefinition[] = [];

  if (l4Slug && l2Slug && l3Slug) {
    const l4Key = `${l1Slug}/${l2Slug}/${l3Slug}/${l4Slug}`;
    dynamic = l4DynamicFilters[l4Key] ?? [];
  } else if (l3Slug && l2Slug) {
    const l3Key = `${l1Slug}/${l2Slug}/${l3Slug}`;
    dynamic = dynamicFilters[l3Key] ?? [];
  }

  return [...universal, ...dynamic];
}
