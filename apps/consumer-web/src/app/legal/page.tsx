'use client'

import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Shield, 
  Scale, 
  FileCheck, 
  Printer, 
  Building2, 
  Database, 
  Coins, 
  BookOpen, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

// Document structure (Enterprise Standard)
interface LegalDoc {
  id: string;
  title: string;
  category: 'governance' | 'financial' | 'vendors' | 'ops' | 'standards';
  categoryLabel: string;
  lastUpdated: string;
  summary: string;
  clauses: { title: string; body: string }[];
}

const legalDocsData: LegalDoc[] = [
  {
    id: 'consumer-tos',
    title: 'Terms of Service',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Essential governing agreement establishing the legal contract between consumers and Planviry Co., addressing liability, arbitration, and unified itinerary purchases.',
    clauses: [
      {
        title: '1. Acceptance of Terms',
        body: 'Welcome to Planviry. By accessing our directory, initiating a co-planning workspace, sharing itineraries, or checking out with a curated planning order, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must cease using the platform immediately.'
      },
      {
        title: '2. The Planviry Curated Concierge Model',
        body: 'Planviry acts as an elite, high-end celebration planner and custom concierge. Unlike standard agencies, our unified checkout allows you to book and check out with multiple premium third-party service partners—including exclusive private properties, catering teams, and live entertainment—on a single, integrated order. Contractually, your payment serves to execute separate agreements with the individual verified partners chosen.'
      },
      {
        title: '3. Co-Planning Workspace and Multi-user Collaboration',
        body: 'Our interactive planning control panels allow primary planners to invite collaborators. All actions taken by invited collaborators (including adding items, editing times, and initiating group cost splits) are deemed authorized. The primary planner remains solidarily liable for any financial bookings or obligations committed in the session.'
      },
      {
        title: '4. Limitation of Liability & Indemnification',
        body: 'Planviry does not operate or own any hotel properties, vehicles, aircraft, or event venues. To the maximum extent permitted under applicable law, Planviry Co. shall not be liable for any indirect, incidental, or consequential damages arising from physical injury, food safety failures, cancellation delays, or flight delays caused by certified vendors.'
      },
      {
        title: '5. Binding Arbitration & Governing Law',
        body: 'All disputes, controversies, or claims arising out of these terms or platform utilization shall be resolved exclusively through final and binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. These terms are governed by the laws of the State of Delaware, without giving effect to conflicts of laws principles.'
      }
    ]
  },
  {
    id: 'privacy-statement',
    title: 'Privacy Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Comprehensive document detailing how Planviry collects, processes, masks, and secures user data, ensuring compliance with global data privacy frameworks.',
    clauses: [
      {
        title: '1. Comprehensive Data Security and Masking',
        body: 'To safeguard your private details during the planning process, we employ strict industry-standard encryption and data masking. No unencrypted sensitive details are stored or transmitted without strict, validated safeguards.'
      },
      {
        title: '2. Private Account Isolation',
        body: 'Our security controls guarantee strict privacy for every planner. All custom itineraries, planning chat logs, guest lists, and checkout baskets are locked specifically to authorized collaborators. Other organizers or users can never access your celebration\'s private workspace.'
      },
      {
        title: '3. Data Retention and Lifecycle Deletion',
        body: 'We store application database backups for an append-only timeline. Logs remain in hot storage for 30 days, cold storage for 90 days, and are irreversibly purged. Personal user profiles are completely deleted from all active replicas within 72 hours of an account closure request in compliance with GDPR Art. 17 ("Right to Erasure").'
      },
      {
        title: '4. Subprocessor Registrations',
        body: 'Planviry shares selected data payloads with pre-vetted subprocessors under strict contractual safeguards. These include: Stripe (for payment routing), Supabase (for authentication/hosting), Algolia (for real-time search indexing), PostHog (for masked interaction analytics), and Resend (for secure notification delivery).'
      }
    ]
  },
  {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Provides transparency into our tracking mechanisms, categorizing essential cookies and analytical tags with granular controls.',
    clauses: [
      {
        title: '1. Legally Compliant ePrivacy Frameworks',
        body: 'In accordance with the European ePrivacy Directive and GDPR Art. 6(1)(a), Planviry employs an interactive cookie banner that requires affirmative, explicit user action before writing any non-essential cookies to browser storage.'
      },
      {
        title: '2. Specific Tracking Technologies Logged',
        body: 'We detail all tracking libraries integrated into the frontend: (a) PostHog for telemetry (strict session recording disabled), (b) Stripe Elements for secure tokenized card storage, and (c) local browser localStorage for persistent state caching during checkout.'
      },
      {
        title: '3. Granular Opt-Out Protocols',
        body: 'Users may adjust their cookie configurations at any time. Opting out of analytical tracking will immediately disable PostHog scripts, while essential Stripe and session state local storage caches will continue functioning to permit checkout operations.'
      }
    ]
  },
  {
    id: 'refund-cancellation',
    title: 'Cancellation & Refund Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'A unified policy governing refund mechanisms and deadlines across different inventory categories (lodging, dining, yachts, shows).',
    clauses: [
      {
        title: '1. Cross-Vertical Cancellation Windows',
        body: 'Because Planviry integrates distinct industries, cancellation policies are strictly category-dependent. Lodging blocks ("Spaces") allow full refunds up to 30 days prior. Private charters ("Things to Do") require 14 days. Michelin reservations ("Food & Drink") are entirely non-refundable but allow name-swaps up to 48 hours prior.'
      },
      {
        title: '2. Automated Cancellation Flow',
        body: 'Our backend handles cancellations through an automated refund manager. When a cancellation is initiated, the system checks the current time against the partner contract. If within the refund window, refunds are automatically generated to the original card within 5 to 10 business days.'
      },
      {
        title: '3. Vendor-Initiated Cancellation & Force Majeure',
        body: 'In the rare event that a verified partner must cancel (e.g., severe weather preventing a yacht cruise), the Planviry concierge will instantly attempt to source an equivalent luxury replacement. If no suitable option matches, a full refund of that specific component is deposited to the card with zero platform fees.'
      }
    ]
  },
  {
    id: 'pci-dss-compliance',
    title: 'Payment Security & PCI Compliance',
    category: 'financial',
    categoryLabel: 'Payments & Financial',
    lastUpdated: 'June 2026',
    summary: 'Off-loads cardholder data capture entirely to Stripe while certifying the platform’s secure posture.',
    clauses: [
      {
        title: '1. Security Self-Assessment Questionnaire A (SAQ A)',
        body: 'Planviry certifies that its architecture qualifies for the PCI DSS SAQ A status. All payment processing tasks are fully outsourced to Stripe, ensuring that we never collect, transmit, or store any raw cardholder details on our local database servers.'
      },
      {
        title: '2. Stripe Elements as Sole Payment Capture',
        body: 'All text inputs for card numbers, expiration dates, and CVC codes are securely hosted within Stripe-managed iFrames. No script on the Planviry frontend has access to these inputs, completely insulating the application from card-sniffing or script-injection threats.'
      },
      {
        title: '3. Annual Renewal Audit Schedule',
        body: 'To preserve our compliance status, Planviry undertakes a rigorous annual security assessment and network vulnerability scan conducted by an independent Qualified Security Assessor (QSA) each calendar spring.'
      }
    ]
  },
  {
    id: 'organizer-terms',
    title: 'Partner & Vendor Terms',
    category: 'vendors',
    categoryLabel: 'Partner & Vendor Portal',
    lastUpdated: 'June 2026',
    summary: 'Legally binding rules for boutique providers, luxury hotels, and private charter services hosting listings on Planviry.',
    clauses: [
      {
        title: '1. Stripe Connect Onboarding Requirements',
        body: 'To receive payouts on our master directory, all Organizers and Vendors must successfully complete Stripe Connect onboarding. Organizers agree to provide accurate corporate tax details, bank Routing routing numbers, and verify beneficial ownership as required by international anti-money laundering regulations.'
      },
      {
        title: '2. Claim Verification & Asset Integrity',
        body: 'Planviry requires active verification for all luxury listing claims. If an Organizer registers a private yacht or historical estate, our staff will cross-examine registry files and insurance policies prior to adding a "Certified" badge to their listings.'
      },
      {
        title: '3. Secure Partner Portals',
        body: 'All host and service partners operate in a secure, isolated workspace. Partners are strictly barred from accessing any consumer itinerary, client profiles, or transaction histories beyond those explicitly authorized for their booked services.'
      },
      {
        title: '4. Staff Invite Liability & Audit Logs',
        body: 'Organizers can invite managers and staff to their portals. The master Organizer account remains solely liable for all pricing updates, cancellations, or communications made by their invited team members.'
      }
    ]
  },
  {
    id: 'dmca-policy',
    title: 'DMCA Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Standardized notice and takedown framework to protect copyrights on user-generated images or event listings.',
    clauses: [
      {
        title: '1. 17 U.S.C. § 512 Safe Harbor Statement',
        body: 'Planviry respects intellectual property rights. We operate as an online service provider qualifying for Safe Harbor status under the Digital Millennium Copyright Act. We immediately investigate any notices of copyright infringement.'
      },
      {
        title: '2. Submitting a Proper Takedown Notice',
        body: 'If you believe content hosted on Planviry infringes your copyright, please submit a written notice to our designated DMCA Agent (legal@planviry.com) with: (a) physical signature, (b) identification of copyrighted work, (c) direct URL of infringing content, and (d) contact details.'
      },
      {
        title: '3. Counter-Notice and Appeals System',
        body: 'If a vendor listing or user review is removed in error, the owner may submit a formal Counter-Notice. Planviry will notify the copyright owner, and unless they file an active court action within 10 business days, the content will be restored.'
      }
    ]
  },
  {
    id: 'content-guidelines',
    title: 'Content Guidelines',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Rules for user-generated content, reviews, and organizer photos, ensuring the feed stays elite and safe.',
    clauses: [
      {
        title: '1. Standards for Luxury Reviews & UGC',
        body: 'All reviews, comments, and planning notes must represent authentic experiences. Content containing profanity, aggressive harassment, spam links, or misrepresentations is automatically flagged by our moderation systems and deleted.'
      },
      {
        title: '2. Child Safety, Hate Speech & Fraud Protections',
        body: 'Planviry has a zero-tolerance policy. Any content representing hate speech, financial fraud, or Child Abuse Material will be deleted immediately. We are contractually bound to report all such events to legal and cyber-compliance authorities.'
      },
      {
        title: '3. Professional Visual Asset Integrity',
        body: 'To maintain the premium design language of Planviry, images uploaded by Organizers must meet minimum resolution, contrast, and branding standards. Stock images with heavy promotional text, phone numbers, or low-resolution grids will be rejected by our automated media pipelines.'
      }
    ]
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Binding conditions on platform interaction, blocking bad-faith crawlers and automated script injections.',
    clauses: [
      {
        title: '1. Prohibited Automated Crawling & Scraping',
        body: 'Users and third parties are strictly forbidden from scraping, crawling, indexing, or extracting listings, price matrix rows, or user profiles from the Planviry platform using automated tools, headless browsers, or custom scripts.'
      },
      {
        title: '2. System Protection and Non-Interference',
        body: 'No user may execute stress tests, service interruptions, or attempt to compromise system integrity. Authorized security audits must receive explicit written clearance from our executive security counsel.'
      },
      {
        title: '3. Account Termination Workflows',
        body: 'Violating this Acceptable Use Policy results in the immediate termination of the offending user or organizer account, IP address bans at the gateway level, and potential referral to compliance authorities.'
      }
    ]
  },
  {
    id: 'sponsored-content',
    title: 'Partner Disclosure Policy',
    category: 'vendors',
    categoryLabel: 'Partner & Vendor Portal',
    lastUpdated: 'June 2026',
    summary: 'Governs sponsored placements on our marketplace feed, ensuring clear visual separation for sponsored assets.',
    clauses: [
      {
        title: '1. Endorsement Guide Conformance',
        body: 'In compliance with trade endorsement guidelines, any listing on Planviry that pays an advertising premium must carry an unmistakable visual label indicating its promotional nature. This protects consumers and establishes pure transparency.'
      },
      {
        title: '2. Precise Visual Labeling',
        body: 'Our design system uses dedicated visual indicators to render sponsored listings with a distinct styled tag in the marketplace feeds. No promoted venue may mask its status under generic styles.'
      },
      {
        title: '3. Influencer & Affiliate Disclosures',
        body: 'Co-planners and influencers sharing curation boards with custom affiliated reservation links must state clearly that they receive potential compensation for bookings initiated through their public boards.'
      }
    ]
  },
  {
    id: 'data-retention',
    title: 'Data Deletion & Retention Policy',
    category: 'ops',
    categoryLabel: 'Technical Operations & GDPR',
    lastUpdated: 'June 2026',
    summary: 'Operational timelines governing system backups, transactional database histories, and database optimization.',
    clauses: [
      {
        title: '1. System Logging and Analytical Timelines',
        body: 'We practice strict data minimization. Hot application performance logs are held for 30 days, cold backups are maintained for 90 days, and are irreversibly shredded. System metrics are preserved in aggregate form for 13 months.'
      },
      {
        title: '2. Portability of Co-Planning Ledger Records',
        body: 'Under GDPR Art. 20, users possess a right to data portability. Planviry allows any customer to export their entire active planning ledger, chat history logs, and billing invoices in a structured, machine-readable format at any time.'
      },
      {
        title: '3. Transactional Records & Tax Compliance',
        body: 'Despite user deletion requests, certain accounting parameters, tax invoices, and transaction logs will be securely archived for up to 7 years in direct compliance with international taxation and auditing guidelines.'
      }
    ]
  },
  {
    id: 'security-policy',
    title: 'Security Policy',
    category: 'ops',
    categoryLabel: 'Technical Operations & GDPR',
    lastUpdated: 'June 2026',
    summary: 'Public description of how Planviry safeguards our Cloud Run database containers and database layers.',
    clauses: [
      {
        title: '1. Elite Encryption Standards',
        body: 'All platform interactions are encrypted using advanced TLS 1.3 protocols. Client profiles and reservation histories are stored securely with enterprise-level AES-256 encryption. We utilize closed, high-security routing to keep all celebration planning details private.'
      },
      {
        title: '2. Container Vulnerability Scanning',
        body: 'Planviry utilizes automated static analysis on all container builds. Packages with high or critical vulnerability scores are automatically blocked at compile-time and cannot reach production.'
      },
      {
        title: '3. Responsible Vulnerability Disclosure',
        body: 'We welcome reports from ethical security researchers. If you identify a security concern, please email security@planviry.com. We commit to acknowledging receipt within 48 hours.'
      }
    ]
  },
  {
    id: 'sms-terms',
    title: 'SMS Terms of Service',
    category: 'standards',
    categoryLabel: 'Communication & Standards',
    lastUpdated: 'June 2026',
    summary: 'Binding terms governing transactional SMS alerts sent for travel, flight changes, and real-time planning modifications.',
    clauses: [
      {
        title: '1. Transactional Alerts and Real-Time Pushes',
        body: 'By opting in to SMS alerts, you agree to receive real-time notifications about your co-planning workspace, changes to flight gates, hotel reservation confirmations, and Stripe payment reminders.'
      },
      {
        title: '2. Prior Consent Requirement',
        body: 'Planviry never initiates push or SMS requests without explicit user permission. In-browser push messages utilize secured signature handshakes to prevent third-party notification spoofing or device targeting.'
      },
      {
        title: '3. Opt-Out Mechanics',
        body: 'You can opt out of Planviry SMS messages at any time by reply texting "STOP" or toggling off the notification sliders in your profile settings panel. Message and data rates may apply.'
      }
    ]
  },
  {
    id: 'cancelled-event',
    title: 'Cancelled Event Policy',
    category: 'governance',
    categoryLabel: 'Core Governance',
    lastUpdated: 'June 2026',
    summary: 'Governs our automated procedures when a live performance, festival, or vendor-hosted event is cancelled.',
    clauses: [
      {
        title: '1. Fully Automated Refund Triggers',
        body: 'If a verified live show organizer cancels their show, our system triggers an immediate status change. Refunds are initiated automatically to the original card with zero manual intervention.'
      },
      {
        title: '2. Consolidated Itinerary Adjustment Notification',
        body: 'If one event in a consolidated itinerary is cancelled, Planviry instantly alerts all co-planning participants via push. The system highlights the open time slot on the shared timeline, allowing the group to query alternative activities.'
      }
    ]
  },
  {
    id: 'accessibility-doc',
    title: 'Accessibility Statement',
    category: 'standards',
    categoryLabel: 'Communication & Standards',
    lastUpdated: 'June 2026',
    summary: 'Public commitment to WCAG 2.1 AA accessibility guidelines, ensuring equal access for planners of all abilities.',
    clauses: [
      {
        title: '1. WCAG 2.1 AA Conformance Target',
        body: 'Planviry is committed to digital accessibility. We continuously audit our markup, color contrast ratios, screen-reader landmarks, and keyboard focus states to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.'
      },
      {
        title: '2. Keyboard Nav & Interactive Map Standards',
        body: 'Our interactive timeline, vertical filters, and unified checkout forms support full keyboard navigation and carry clear ARIA labels. High-contrast focus outlines prevent keyboard users from getting lost in nested menus.'
      },
      {
        title: '3. Remediation & Accessibility Contact',
        body: 'If you encounter an accessibility barrier or require assistance booking a bespoke service, please email accessibility@planviry.com. We address usability concerns and issue frontend fixes within 5 business days.'
      }
    ]
  }
];

export const LegalCenter: React.FC = () => {
  const [selectedDocId, setSelectedDocId] = useState<string>('consumer-tos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter documents based on search
  const filteredDocs = useMemo(() => {
    return legalDocsData.filter(doc => {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.summary.toLowerCase().includes(query) ||
        doc.clauses.some(c => c.title.toLowerCase().includes(query) || c.body.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  // Find active doc
  const activeDoc = useMemo(() => {
    const doc = legalDocsData.find(d => d.id === selectedDocId);
    if (doc) return doc;
    return legalDocsData[0];
  }, [selectedDocId]);

  // Group by category
  const docsByCategory = useMemo(() => {
    const groups: Record<string, { label: string; docs: LegalDoc[] }> = {
      governance: { label: 'Core Governance & Policies', docs: [] },
      vendors: { label: 'Partner & Vendor Portal', docs: [] },
      financial: { label: 'Payments & Financial Security', docs: [] },
      ops: { label: 'Operations & Data Protection', docs: [] },
      standards: { label: 'Communication & Standards', docs: [] }
    };
    
    filteredDocs.forEach(doc => {
      if (groups[doc.category]) {
        groups[doc.category].docs.push(doc);
      }
    });

    return Object.entries(groups).filter(([_, group]) => group.docs.length > 0);
  }, [filteredDocs]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-[#010000] font-sans flex flex-col selection:bg-[#F47245]/20">
      
      {/* FULL WIDTH SPLIT CONTAINER (No outer padding, sidebar hangs directly to left edge of layout) */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch">
        
        {/* LEFT SIDEBAR: DOCUMENT INDEX - SITS ON THE VERY LEFT EDGE */}
        <div className="w-full md:w-85 shrink-0 bg-[#F5F5F4] border-r border-black/10 flex flex-col no-scrollbar">
          
          {/* Serious branding header block inside the sidebar */}
          <div className="p-6 border-b border-black/5 bg-[#FAFAF9]">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-[#010000]/50 uppercase mb-2">
              <Shield className="w-3.5 h-3.5 text-black" />
              <span>Trust &amp; Legal</span>
            </div>
            <h1 className="font-serif text-2xl font-normal leading-tight tracking-tight text-[#010000]">
              Planviry Trust Center
            </h1>
            <p className="text-[11px] text-[#010000]/60 mt-2 leading-relaxed font-light">
              Official regulatory agreements, customer terms, vendor codes, and privacy standards.
            </p>
          </div>

          {/* Minimalist Search inside sidebar */}
          <div className="p-4 border-b border-black/5 bg-white">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#010000]/40" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAFAF9] rounded-xl border border-black/5 text-xs font-semibold placeholder:text-[#010000]/30 text-[#010000] outline-none focus:border-black transition-all"
              />
            </div>
          </div>

          {/* Navigation Document Tree */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-180px)] md:max-h-none">
            {docsByCategory.map(([catKey, group]) => (
              <div key={catKey} className="space-y-1.5">
                <h3 className="text-[9px] font-bold text-[#010000]/40 uppercase tracking-[0.15em] px-2">
                  {group.label}
                </h3>

                <div className="space-y-0.5">
                  {group.docs.map((doc) => {
                    const isActive = doc.id === selectedDocId;
                    return (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-2.5 border cursor-pointer ${
                          isActive
                            ? 'bg-white border-black/10 shadow-sm font-semibold'
                            : 'bg-transparent border-transparent hover:bg-black/5'
                        }`}
                      >
                        <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-black' : 'text-[#010000]/40'}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs truncate ${isActive ? 'text-black font-bold' : 'text-[#010000]/85'}`}>
                              {doc.title}
                            </span>
                            {isActive && <ChevronRight className="w-3 h-3 text-black shrink-0" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="text-center py-8 px-4 text-[#010000]/50 space-y-1">
                <p className="text-xs font-semibold">No policies found</p>
                <p className="text-[10px] font-light">Try another keyword</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 bg-white p-6 md:p-12 lg:p-16 flex flex-col justify-between max-w-4xl">
          
          <div className="space-y-10">
            
            {/* Top Bar Actions & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-black text-white px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {activeDoc.categoryLabel}
                  </span>
                  <span className="text-[10px] text-[#010000]/40 font-mono">•</span>
                  <span className="text-[10px] text-[#010000]/50 font-mono">
                    Revised: <span className="font-semibold text-black">{activeDoc.lastUpdated}</span>
                  </span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#010000] tracking-tight pt-1">
                  {activeDoc.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black border border-black/10 bg-white hover:bg-black hover:text-white transition-all rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Print Active Policy"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </div>

            {/* Document summary quote block */}
            <div className="p-5 bg-[#FAFAF9] border border-black/5 rounded-2xl">
              <p className="text-xs text-[#010000]/70 leading-relaxed font-light italic font-serif">
                "{activeDoc.summary}"
              </p>
            </div>

            {/* Scrollable Formatted Clauses */}
            <div className="space-y-8 text-justify font-serif">
              {activeDoc.clauses.map((clause, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xs font-sans font-bold text-[#010000] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    {clause.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#010000]/80 leading-relaxed font-sans pl-3.5 border-l-2 border-black/5">
                    {clause.body}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Official Sign-off Footer */}
          <div className="pt-12 mt-12 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center text-[9px] text-[#010000]/40 font-mono gap-4">
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-black" />
              <span>Signed &amp; Authorized via Planviry Operations</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Representative ID:</span>
              <span className="font-semibold text-black">PV-REG-2026</span>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
};

export default LegalCenter;
