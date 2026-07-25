export type LocationLanding = {
  slug: string
  title: string
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  city: string
  serviceLabel: string
  heroIntro: string
  whatIsIt: string
  benefits: string[]
  features: string[]
  howItWorks: string[]
  industries: string[]
  useCases: string[]
  whyChooseUs: string[]
  faqs: { question: string; answer: string }[]
  conclusion: string
  relatedPaths: { label: string; href: string }[]
  canonicalPath?: string
  ogImageUrl?: string
  twitterImageUrl?: string
  robotsIndex?: boolean
  schemaType?: string
}

export const locationLandings: LocationLanding[] = [
  {
    slug: 'ai-photo-booth-delhi',
    title: 'AI Photo Booth in Delhi',
    metaTitle: 'AI Photo Booth Delhi | Event AI Activations',
    metaDescription:
      'Deploy branded AI photo booths for Delhi corporate events, expos, and brand activations. Instant themed outputs, on-site engagement, and unified event tech.',
    focusKeyword: 'AI Photo Booth Delhi',
    city: 'Delhi',
    serviceLabel: 'AI Photo Booth',
    heroIntro:
      'Nebuloid designs and operates AI photo booth activations for Delhi NCR conferences, product launches, and brand experiences — engineered for high footfall and premium brand consistency.',
    whatIsIt:
      'An AI photo booth is an interactive activation that captures guests and generates branded, themed imagery in seconds using custom AI models and event-ready hardware.',
    benefits: [
      'Higher booth dwell time and social sharing',
      'On-brand creative output instead of generic filters',
      'Faster guest throughput for VIP and mass audiences',
      'Measurable engagement data from every activation',
    ],
    features: [
      'Custom AI themes mapped to event branding',
      'QR delivery and optional social sharing',
      'Touchscreen UX tuned for live venues',
      'Operator dashboards and content moderation controls',
    ],
    howItWorks: [
      'Brief and brand guidelines are translated into AI look systems',
      'Hardware and software are staged for venue constraints',
      'Guests capture, generate, and receive outputs on-site',
      'Engagement metrics and assets are packaged post-event',
    ],
    industries: ['Technology', 'Consumer brands', 'Government events', 'Exhibitions'],
    useCases: [
      'Product launches in Delhi NCR',
      'Trade-show pavilion magnets',
      'Award-night guest entertainment',
      'Campus and conference networking zones',
    ],
    whyChooseUs: [
      'End-to-end creative + engineering under one studio',
      'Built for Indian venue realities and peak traffic',
      'Consistent branding across booth, screens, and outputs',
      'Integrates with wider digital experience ecosystems',
    ],
    faqs: [
      {
        question: 'Can you customize AI themes for our Delhi event brand?',
        answer:
          'Yes. Themes, prompts, overlays, and delivery UX are designed around your brand guidelines and event narrative.',
      },
      {
        question: 'How much setup time does an AI photo booth need?',
        answer:
          'Most deployments are planned 3–6 weeks ahead for creative, testing, and on-site rehearsal, depending on complexity.',
      },
    ],
    conclusion:
      'If you need an AI photo booth in Delhi that feels premium, branded, and operationally reliable, Nebuloid builds the full activation — not just rented hardware.',
    relatedPaths: [
      { label: 'AI Photo Booth technology', href: '/technology/ai-photo-booths' },
      { label: 'AI-powered experiences', href: '/solutions/ai-powered-experiences' },
      { label: 'Contact Nebuloid', href: '/contact' },
    ],
  },
  {
    slug: 'ai-photo-booth-mumbai',
    title: 'AI Photo Booth in Mumbai',
    metaTitle: 'AI Photo Booth Mumbai | Brand Activations',
    metaDescription:
      'AI photo booth activations for Mumbai corporate events, expos, and experiential marketing. Custom themes, high-throughput guest journeys, event-ready delivery.',
    focusKeyword: 'AI Photo Booth Mumbai',
    city: 'Mumbai',
    serviceLabel: 'AI Photo Booth',
    heroIntro:
      'From marine-drive launches to expo halls, Nebuloid delivers AI photo booth experiences for Mumbai brands that need speed, spectacle, and consistent creative quality.',
    whatIsIt:
      'A Mumbai-ready AI photo booth combines generative imagery, branded UX, and live-event operations so guests leave with shareable, on-brand memories.',
    benefits: [
      'Creates a viral moment without sacrificing brand control',
      'Works for both VIP lounges and high-volume show floors',
      'Supports multilingual and multi-theme event storytelling',
      'Connects into broader registration and engagement systems',
    ],
    features: [
      'Custom generative styles and overlays',
      'Instant delivery workflows',
      'Live operator tools',
      'Optional CRM / lead capture hooks',
    ],
    howItWorks: [
      'Creative brief and sample outputs are approved before the show',
      'Booth software is configured for venue lighting and queue flow',
      'Guests interact, generate, and receive branded assets',
      'Performance insights are shared after the event',
    ],
    industries: ['BFSI', 'Entertainment', 'Retail', 'Technology'],
    useCases: [
      'Brand activations and mall takeovers',
      'Corporate annual days',
      'Media and entertainment premieres',
      'Exhibition booth traffic drivers',
    ],
    whyChooseUs: [
      'Studio-built software instead of one-size rental templates',
      'Strong on-ground deployment discipline',
      'Design language aligned with premium Mumbai events',
      'One partner for creative, tech, and operations',
    ],
    faqs: [
      {
        question: 'Do you support outdoor or atypical Mumbai venues?',
        answer:
          'Yes, with advance site assessment for power, lighting, shade, and queue management.',
      },
      {
        question: 'Can outputs include Mumbai-specific themes?',
        answer:
          'Absolutely. Themes can reflect city culture, campaign narratives, or product storylines.',
      },
    ],
    conclusion:
      'Choose Nebuloid for AI photo booth activations in Mumbai when brand fidelity and operational reliability matter as much as the wow moment.',
    relatedPaths: [
      { label: 'Digital experiences', href: '/digital-experiences' },
      { label: 'AI-powered experiences', href: '/solutions/ai-powered-experiences' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    slug: 'ai-photo-booth-bangalore',
    title: 'AI Photo Booth in Bangalore',
    metaTitle: 'AI Photo Booth Bangalore | Tech Event Activations',
    metaDescription:
      'AI photo booths for Bangalore tech summits, product launches, and campus events. Custom generative experiences engineered for modern Indian audiences.',
    focusKeyword: 'AI Photo Booth Bangalore',
    city: 'Bangalore',
    serviceLabel: 'AI Photo Booth',
    heroIntro:
      'Nebuloid builds AI photo booth activations for Bangalore’s product launches, developer conferences, and brand experiences — polished, fast, and technically robust.',
    whatIsIt:
      'An AI photo booth for Bangalore events turns guest participation into branded digital moments using generative models, touchscreen UX, and live operations.',
    benefits: [
      'Tech-forward positioning for innovation-led brands',
      'High engagement without disrupting agenda flow',
      'Custom creative systems unique to each campaign',
      'Data-friendly activation architecture',
    ],
    features: [
      'Model and theme customization',
      'Queue-aware UI',
      'Cloud or local delivery options',
      'Analytics-ready event logging',
    ],
    howItWorks: [
      'Concept, sample generations, and UX are approved pre-event',
      'Systems are load-tested for peak conference traffic',
      'Guests create and receive assets in minutes',
      'Teams receive content and engagement summaries',
    ],
    industries: ['SaaS', 'Consumer tech', 'Education', 'Startups'],
    useCases: [
      'Tech summit networking lounges',
      'Product demo theaters',
      'Campus brand days',
      'Partner pavilion magnets',
    ],
    whyChooseUs: [
      'Engineering-first studio culture',
      'Experience designing for sophisticated tech audiences',
      'Tight brand systems and motion craft',
      'Scalable across India after Bangalore pilots',
    ],
    faqs: [
      {
        question: 'Can the booth integrate with our product narrative?',
        answer:
          'Yes. Themes, prompts, and on-screen copy can mirror product messaging and campaign aesthetics.',
      },
      {
        question: 'Is this suitable for developer conferences?',
        answer:
          'Yes. Interfaces and themes can be tuned for technical audiences without feeling gimmicky.',
      },
    ],
    conclusion:
      'For Bangalore events that need credible AI spectacle, Nebuloid delivers photo booth activations that feel native to modern tech brands.',
    relatedPaths: [
      { label: 'AI photo booths', href: '/technology/ai-photo-booths' },
      { label: 'Interactive games', href: '/technology/interactive-games' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    slug: 'digital-experiences-delhi',
    title: 'Digital Experiences in Delhi',
    metaTitle: 'Digital Experiences Delhi | Interactive Event Tech',
    metaDescription:
      'Design and deploy digital experiences in Delhi — interactive installations, AI activations, kiosks, and visitor journeys for corporate and institutional events.',
    focusKeyword: 'Digital Experiences Delhi',
    city: 'Delhi',
    serviceLabel: 'Digital Experiences',
    heroIntro:
      'Nebuloid creates digital experience ecosystems for Delhi events — from pavilion storytelling to AI activations and interactive visitor technology.',
    whatIsIt:
      'Digital experiences combine software, content, and on-ground interaction so venues become participatory journeys rather than static displays.',
    benefits: [
      'Stronger visitor engagement and dwell time',
      'Clearer storytelling across physical spaces',
      'Reusable digital assets for future events',
      'Unified operations across multiple touchpoints',
    ],
    features: [
      'Interactive installations',
      'Touchscreen and kiosk layers',
      'AI and gamified activations',
      'Content systems for LED and media walls',
    ],
    howItWorks: [
      'Experience strategy and journey mapping',
      'Design, engineering, and content production',
      'On-site deployment and show calling',
      'Post-event learning and iteration',
    ],
    industries: ['Government', 'Trade fairs', 'Corporate', 'Culture'],
    useCases: [
      'Pavilion experiences',
      'Institutional showcases',
      'Brand experience centers',
      'Conference engagement zones',
    ],
    whyChooseUs: [
      'Proven national and international deployments',
      'Creative and technical teams under one roof',
      'Built for high-traffic Indian venues',
      'CMS-ready content operations',
    ],
    faqs: [
      {
        question: 'Can digital experiences integrate with registration systems?',
        answer:
          'Yes. Journeys can connect to guest profiles, access rules, and personalization layers when required.',
      },
      {
        question: 'Do you handle both content and hardware?',
        answer:
          'We design the experience software and creative systems, and coordinate hardware deployment as part of delivery.',
      },
    ],
    conclusion:
      'For Delhi organizers seeking memorable digital experiences, Nebuloid builds cohesive visitor technology — not disconnected gadgets.',
    relatedPaths: [
      { label: 'Digital experiences portfolio', href: '/digital-experiences' },
      { label: 'Interactive installations', href: '/solutions/interactive-installations' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    slug: 'interactive-kiosk-india',
    title: 'Interactive Kiosks in India',
    metaTitle: 'Interactive Kiosk India | Touchscreen Event Systems',
    metaDescription:
      'Custom interactive kiosk software for events and venues across India. Registration, wayfinding, content discovery, and engagement systems by Nebuloid.',
    focusKeyword: 'Interactive Kiosk India',
    city: 'India',
    serviceLabel: 'Interactive Kiosks',
    heroIntro:
      'Nebuloid builds interactive kiosk platforms for Indian events and destinations — reliable under live pressure, brand-consistent, and easy for guests to use.',
    whatIsIt:
      'Interactive kiosks are touchscreen systems that help guests register, navigate, explore content, and engage with brands in physical spaces.',
    benefits: [
      'Reduce staff load at entry and information points',
      'Deliver consistent brand UX at scale',
      'Capture structured interaction data',
      'Support multilingual audiences',
    ],
    features: [
      'Custom kiosk applications',
      'Registration and check-in flows',
      'Wayfinding and content browsers',
      'Remote content updates',
    ],
    howItWorks: [
      'Define guest jobs-to-be-done for each kiosk role',
      'Design UI/UX and backend workflows',
      'Deploy and stress-test before show open',
      'Operate, monitor, and iterate live',
    ],
    industries: ['Exhibitions', 'Tourism', 'Corporate campuses', 'Retail'],
    useCases: [
      'Event registration desks',
      'Pavilion information hubs',
      'Destination visitor centers',
      'Product catalog explorers',
    ],
    whyChooseUs: [
      'Software designed for Indian event conditions',
      'Tight integration with wider experience stacks',
      'Accessible, clear interfaces',
      'Nationwide deployment capability',
    ],
    faqs: [
      {
        question: 'Can kiosks work offline?',
        answer:
          'Critical flows can be designed with offline resilience and later sync, depending on venue constraints.',
      },
      {
        question: 'Do you support multilingual interfaces?',
        answer: 'Yes. Interfaces can support multiple languages based on audience needs.',
      },
    ],
    conclusion:
      'Interactive kiosks across India work best when software, content, and operations are designed together — exactly how Nebuloid delivers.',
    relatedPaths: [
      { label: 'Touchscreen kiosks', href: '/technology/touchscreen-kiosks' },
      { label: 'Registration & guest journey', href: '/solutions/registration-guest-journey' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export function getLocationLandingBySlug(slug: string) {
  return locationLandings.find((item) => item.slug === slug) ?? null
}

export function getAllLocationLandingSlugs() {
  return locationLandings.map((item) => item.slug)
}

/** Prefer published CMS rows, then static fallbacks. */
export async function resolveLocationLandingBySlug(slug: string) {
  try {
    const { cmsEnabled, getPublishedLocationLandingBySlug, mapCmsLocationToPublic } =
      await import('@/lib/cms/queries')
    if (cmsEnabled()) {
      const row = await getPublishedLocationLandingBySlug(slug)
      if (row) return mapCmsLocationToPublic(row)
    }
  } catch {
    // Fall through to static content.
  }
  return getLocationLandingBySlug(slug)
}

export async function resolveAllLocationLandingSlugs() {
  const staticSlugs = getAllLocationLandingSlugs()
  try {
    const { cmsEnabled, getPublishedLocationLandingSlugsCms } = await import('@/lib/cms/queries')
    if (cmsEnabled()) {
      const cmsSlugs = await getPublishedLocationLandingSlugsCms()
      return Array.from(new Set([...cmsSlugs, ...staticSlugs]))
    }
  } catch {
    // Fall through.
  }
  return staticSlugs
}
