export type ServiceAccent = "ember" | "teal";

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceData {
  slug: string;
  headline: string;
  subheadline: string;
  bodyCopy: [string, string];
  genres: string[];
  cta: string;
  ctaRoute: string;
  startingPrice?: string;
  includes: string[];
  howItWorks: HowItWorksStep[];
  accent: ServiceAccent;
}

export const serviceData: ServiceData[] = [
  {
    slug: "dj-services",
    headline: "Milwaukee's Most In-Demand DJ Service",
    subheadline: "Reading the room. Owning the floor.",
    bodyCopy: [
      "Open-format, house, hip-hop, weddings, festivals. Every DJ in the Best Time network is auditioned, insured, and trained to read the room before they touch the deck. We don't send amateurs. We don't send DJs who learned on YouTube last month. Every DJ on our roster has been vetted through a multi-round audition process, carries full liability insurance, and brings the kind of professional equipment that makes a venue sound the way it was designed to sound. That's the standard, and we don't compromise on it.",
      "The difference between a good DJ and a great one isn't the music library. It's the read. Knowing when to push the energy, when to hold back, when to transition, and when to let the moment breathe. Our DJs are trained to read crowds in real time and adjust on the fly. No pre-programmed sets. No autopilot. Every performance is live, responsive, and tailored to the specific room, crowd, and moment. That's what makes Best Time different, and that's why Milwaukee keeps booking us.",
    ],
    genres: [
      "Open Format",
      "House",
      "Hip-Hop",
      "R&B",
      "Top 40",
      "EDM",
      "Afrobeats",
      "Latin",
      "Reggaeton",
      "Pop",
      "Dance",
      "Disco",
      "80s/90s/2000s",
      "Motown",
      "Country",
    ],
    cta: "Secure Your Date",
    ctaRoute: "/booking",
    startingPrice: "$950",
    includes: [
      "5 hours of professional mixing",
      "Ceremony and cocktail hour audio",
      "Full intelligent lighting array",
      "Wireless mics and emcee coverage",
      "Custom playlist consultation",
      "Professional sound system",
      "Live request management",
      "Coordination with your planner",
    ],
    howItWorks: [
      {
        number: "01",
        title: "Choose a Date",
        description: "Pick your event date and check availability. Popular dates book months in advance.",
      },
      {
        number: "02",
        title: "Choose a Time Block",
        description: "Select your start and end times. We build the set around your schedule, not the other way around.",
      },
      {
        number: "03",
        title: "Let Us Know the Venue",
        description: "Don't have a venue? We can help with that too. Our partner venue network covers Milwaukee and beyond.",
      },
      {
        number: "04",
        title: "Event Type",
        description: "Tell us what kind of event. Wedding, corporate, birthday, festival. Each gets a different approach.",
      },
      {
        number: "05",
        title: "Guest Number",
        description: "Headcount determines sound and lighting requirements. We scale the production to the crowd.",
      },
      {
        number: "06",
        title: "Need Help Coordinating?",
        description: "Day-of coordination, vendor wrangling, timeline management. Add it on, or go without.",
      },
    ],
    accent: "ember",
  },
  {
    slug: "photo-booth",
    headline: "Strike a Pose. Keep the Memory.",
    subheadline: "Memories, immersive and instant.",
    bodyCopy: [
      "Not a box with a camera. A curated social experience your guests will line up for. The Best Time Photo Booth is designed to be the second-most-popular thing at your event, right after the dance floor. We offer three distinct booth styles to match your event's energy: the Classic Open-Air for groups and high energy, the Enclosed Classic for intimate shots and privacy, and the 360° Video Booth for the kind of content that breaks the internet. Every style includes a professional attendant, custom graphics, and instant sharing.",
      "The photo booth isn't an afterthought. It's an experience design decision. That's why we build custom graphic overlays for every event, provide real-time digital galleries your guests can access instantly, and include an on-site attendant who manages the flow, keeps the props organized, and ensures every guest gets a great shot. From corporate galas that need branded overlays to weddings that want a photo strip keepsake, we customize every detail. Four hours of unlimited sessions. Every photo. Every angle. Every memory.",
    ],
    genres: [
      "Classic Open-Air Booth",
      "Enclosed Classic Booth",
      "360° Video Booth",
      "Custom Graphic Overlays",
      "Green Screen Options",
      "GIF and Boomerang Modes",
      "Instant Digital Gallery",
      "Print Strips and 4x6 Prints",
      "Social Media Sharing Station",
      "Props and Backdrops",
    ],
    cta: "Book the Booth",
    ctaRoute: "/booking",
    startingPrice: "$600",
    includes: [
      "4 hours of unlimited sessions",
      "Custom graphic overlay and prints",
      "Instant digital gallery for guests",
      "Attendant on-site for the full event",
      "Props and backdrop selection",
      "Social media sharing station",
      "Print strips or 4x6 prints",
      "Setup and teardown included",
    ],
    howItWorks: [
      {
        number: "01",
        title: "Choose Your Booth Style",
        description: "Open-Air, Enclosed, or 360° Video. Each creates a different experience for your guests.",
      },
      {
        number: "02",
        title: "Customize Your Overlay",
        description: "Branded graphics, event logos, custom colors. Every print and digital share carries your identity.",
      },
      {
        number: "03",
        title: "Select Your Backdrop",
        description: "From elegant sequins to branded step-and-repeat. We have options for every event style.",
      },
      {
        number: "04",
        title: "Book Your Date",
        description: "Secure your date and time. Popular weekends book early, especially during wedding season.",
      },
    ],
    accent: "teal",
  },
  {
    slug: "mobile-event-van",
    headline: "We Bring the Party to Your Block",
    subheadline: "Pull up. Plug in. Party on.",
    bodyCopy: [
      "A fully built-out production van for tailgates, pool parties, block parties, festivals, and brand pop-ups. The Best Time Mobile Event Van is a self-contained sound and lighting rig on wheels. No venue? No problem. No power? We bring our own. No stage? We set one up. The van rolls onto your block, into your backyard, up to your tailgate, or alongside your pool, and within thirty minutes you have a professional-grade sound system, intelligent lighting, and a DJ who's ready to bring the energy.",
      "The Mobile Event Van was built for the unconventional venue. Block parties that need permit-friendly sound. Pool parties where there's no power outlet within a hundred feet. Tailgates that need more than a portable speaker. Brand pop-ups that need a professional presence in a non-traditional space. We've deployed the van at festivals, street fairs, community events, and private parties across Milwaukee and the surrounding area. Weather-ready, self-contained, and loud enough to fill a city block. That's the van.",
    ],
    genres: [
      "Block Parties",
      "Pool Parties",
      "Tailgates",
      "Street Fairs",
      "Brand Pop-Ups",
      "Community Events",
      "Festivals",
      "Backyard Bashes",
      "Parking Lot Parties",
      "Lake Houses",
    ],
    cta: "Request a Quote",
    ctaRoute: "/contact",
    includes: [
      "Self-contained power supply",
      "Professional sound system",
      "Intelligent lighting rig",
      "Weather-resistant equipment",
      "Professional DJ coverage",
      "Setup and teardown included",
      "Permit and noise compliance consultation",
      "Custom playlist consultation",
    ],
    howItWorks: [
      {
        number: "01",
        title: "Tell Us Where",
        description: "Street address, park, parking lot, or backyard. We'll assess the space and plan the setup.",
      },
      {
        number: "02",
        title: "Tell Us When",
        description: "Date, time, and duration. We arrive early, set up, and are ready before your first guest.",
      },
      {
        number: "03",
        title: "Tell Us the Vibe",
        description: "Block party energy or poolside chill? We match the sound and lighting to the moment.",
      },
      {
        number: "04",
        title: "We Handle the Rest",
        description: "Permits, power, setup, teardown, and every detail in between. You just show up and celebrate.",
      },
    ],
    accent: "ember",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return serviceData.find((s) => s.slug === slug);
}
