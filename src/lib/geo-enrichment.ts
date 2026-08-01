import { interactiveExperienceGeoBySlug } from '@/lib/interactive-experience-products'

export type GeoFaq = { question: string; answer: string }
export type GeoLink = { label: string; href: string }

export type GeoEnrichment = {
  whatIsIt: string
  benefits: string[]
  features: string[]
  howItWorks: string[]
  industries: string[]
  useCases: string[]
  whyChooseUs: string[]
  faqs: GeoFaq[]
  conclusion: string
  relatedLinks: GeoLink[]
}

const sharedWhy = [
  'End-to-end ownership from creative direction to on-ground operations',
  'Unified event technology stack instead of fragmented vendors',
  'Production-ready systems proven across conferences, expos, and brand activations',
  'India-wide deployment support with measurable engagement outcomes',
]

const sharedIndustries = [
  'Corporate conferences',
  'Exhibitions & trade shows',
  'Brand activations',
  'Entertainment & awards',
  'Tourism & cultural events',
]

function serviceGeo(
  name: string,
  whatIsIt: string,
  extras: Partial<GeoEnrichment> & Pick<GeoEnrichment, 'benefits' | 'features' | 'howItWorks' | 'useCases' | 'faqs' | 'conclusion' | 'relatedLinks'>,
): GeoEnrichment {
  return {
    whatIsIt,
    industries: extras.industries ?? sharedIndustries,
    whyChooseUs: extras.whyChooseUs ?? sharedWhy,
    benefits: extras.benefits,
    features: extras.features,
    howItWorks: extras.howItWorks,
    useCases: extras.useCases,
    faqs: extras.faqs,
    conclusion: extras.conclusion,
    relatedLinks: extras.relatedLinks,
  }
}

export const serviceGeoBySlug: Record<string, GeoEnrichment> = {
  'event-branding-creative-production': serviceGeo(
    'Event branding',
    'Event branding and creative production is the visual and narrative system that defines how an event looks, feels, and communicates — from invitations and stage design to motion graphics and social assets.',
    {
      benefits: [
        'Consistent brand presence across every guest touchpoint',
        'Higher recall and shareability for sponsors and organizers',
        'Faster creative iteration with reusable design systems',
      ],
      features: [
        'Conference and corporate identity systems',
        'Stage backdrops and LED show content',
        'Motion graphics and openers',
        'Invitation and collateral suites',
      ],
      howItWorks: [
        'Brand discovery and event story framing',
        'Creative system design across digital and physical surfaces',
        'Asset production for stage, venue, and social channels',
        'On-site creative support through show day',
      ],
      useCases: [
        'Annual conferences and leadership summits',
        'Product launches and brand unveilings',
        'Awards nights and celebration shows',
      ],
      faqs: [
        {
          question: 'When should event branding start?',
          answer:
            'Ideally before invitations go out, so every guest interaction reinforces one coherent story from first touch to post-event content.',
        },
        {
          question: 'Do you handle both digital and on-ground creative?',
          answer:
            'Yes. Nebuloid produces unified creative systems spanning digital assets, stage content, and venue environments.',
        },
      ],
      conclusion:
        'Strong event branding turns logistics into experience. Nebuloid builds creative systems that make corporate and cultural events feel intentional, memorable, and on-brand.',
      relatedLinks: [
        { label: 'Motion graphics technology', href: '/technology/motion-graphics' },
        { label: 'LED wall content', href: '/technology/led-wall-content' },
        { label: 'Blogs on experiential marketing', href: '/insights' },
        { label: 'Contact Nebuloid', href: '/contact' },
      ],
    },
  ),
  'registration-guest-journey': serviceGeo(
    'Registration',
    'Registration and guest journey design covers check-in, badging, wayfinding, and VIP flows so arrival feels effortless and operations stay measurable.',
    {
      benefits: [
        'Shorter queues and smoother first impressions',
        'Real-time attendance visibility for organizers',
        'Lower staff load with self-serve options',
      ],
      features: [
        'QR check-in systems',
        'On-site badge printing',
        'Touchscreen self-registration',
        'VIP and group processing lanes',
      ],
      howItWorks: [
        'Map guest segments and venue constraints',
        'Configure check-in logic and hardware layout',
        'Run dry rehearsals with operations teams',
        'Monitor live guest flow on event day',
      ],
      useCases: [
        'High-volume conferences',
        'Multi-day expos with repeat entry',
        'VIP hospitality desks',
      ],
      faqs: [
        {
          question: 'Can registration integrate with existing CRM lists?',
          answer:
            'Yes. Guest lists and registration data can sync with organizer systems so check-in stays accurate and reporting stays clean.',
        },
        {
          question: 'Do you support offline venues?',
          answer:
            'We design resilient flows with contingency paths for connectivity gaps common in large venues.',
        },
      ],
      conclusion:
        'The guest journey starts at registration. Nebuloid designs arrival systems that feel invisible to guests and invaluable to operations teams.',
      relatedLinks: [
        { label: 'QR check-in systems', href: '/technology/qr-check-in-systems' },
        { label: 'Touchscreen kiosks', href: '/technology/touchscreen-kiosks' },
        { label: 'Digital experiences', href: '/digital-experiences' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  'interactive-installations': serviceGeo(
    'Interactive installations',
    'Interactive installations turn passive audiences into participants through kiosks, games, digital signage, and experiential builds designed for live venues.',
    {
      benefits: [
        'Increased dwell time and engagement',
        'Shareable moments that extend brand reach',
        'Lead capture at high-intent touchpoints',
      ],
      features: [
        'Touchscreen kiosks and displays',
        'Gamification and quizzes',
        'Digital signage networks',
        'On-ground experiential builds',
      ],
      howItWorks: [
        'Define the participation mechanic and brand goal',
        'Prototype interaction and content rules',
        'Build and stage hardware for footfall patterns',
        'Operate and optimize during the live event',
      ],
      useCases: [
        'Exhibition booth ecosystems',
        'Brand pavilion activations',
        'Campus and festival experiences',
      ],
      faqs: [
        {
          question: 'Are installations custom or template-based?',
          answer:
            'Both. We reuse proven interaction frameworks and customize creative, data, and hardware to each brand brief.',
        },
        {
          question: 'Can installations capture leads?',
          answer:
            'Yes. Forms, QR flows, and CRM handoffs can be embedded without breaking the experience.',
        },
      ],
      conclusion:
        'Interactive installations create the moments people stop for. Nebuloid designs them to perform for guests, brands, and measurement teams alike.',
      relatedLinks: [
        { label: 'Interactive games', href: '/technology/interactive-games' },
        { label: 'Digital signage', href: '/technology/digital-signage' },
        { label: 'AI photo booths', href: '/technology/ai-photo-booths' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  'ai-powered-experiences': serviceGeo(
    'AI-powered experiences',
    'AI-powered event experiences use intelligent systems — including AI photo booths, personalization, and vision-based engagement — to create magical, measurable guest moments.',
    {
      benefits: [
        'Differentiated activations competitors cannot easily copy',
        'Social amplification through personalized outputs',
        'Rich engagement data for post-event insight',
      ],
      features: [
        'AI photo booth experiences',
        'Personalized guest interactions',
        'Vision-based engagement',
        'Real-time AI analytics',
      ],
      howItWorks: [
        'Translate brand themes into AI creative systems',
        'Configure models, moderation, and delivery flows',
        'Stage hardware for throughput and VIP needs',
        'Capture performance data throughout the activation',
      ],
      useCases: [
        'Corporate brand activations',
        'Product launches',
        'Entertainment and awards experiences',
      ],
      faqs: [
        {
          question: 'What is an AI photo booth for events?',
          answer:
            'An AI photo booth captures guests and generates branded, themed imagery in seconds using custom AI models and event-ready hardware.',
        },
        {
          question: 'Do you deploy AI photo booths across India?',
          answer:
            'Yes. Nebuloid supports AI photo booth and related AI activations for events across India, including Delhi, Mumbai, Bangalore, and more.',
        },
      ],
      conclusion:
        'AI is most powerful when it feels magical, not mechanical. Nebuloid embeds intelligence into event experiences that guests love and brands can measure.',
      relatedLinks: [
        { label: 'AI photo booths', href: '/technology/ai-photo-booths' },
        { label: 'AI Photo Booth Delhi', href: '/ai-photo-booth-delhi' },
        { label: 'AI Photo Booth Mumbai', href: '/ai-photo-booth-mumbai' },
        { label: 'AI at events blog', href: '/insights' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  'event-websites-applications': serviceGeo(
    'Event websites & apps',
    'Event websites and applications are the digital companion layer for planning, live engagement, navigation, and post-event content — keeping every guest in sync with the ground experience.',
    {
      benefits: [
        'Reduced on-site confusion with always-current information',
        'Extended event lifespan beyond show days',
        'Direct channel for communication and conversion',
      ],
      features: [
        'Event websites and landing pages',
        'Mobile event applications',
        'Venue navigation and maps',
        'Live schedule and push updates',
      ],
      howItWorks: [
        'Define guest journeys across pre-, live-, and post-event phases',
        'Design and develop the digital product layer',
        'Integrate with registration and on-ground systems',
        'Operate content updates through the event lifecycle',
      ],
      useCases: [
        'Multi-track conferences',
        'Campus and expo wayfinding',
        'Hybrid and content-led events',
      ],
      faqs: [
        {
          question: 'Can the website connect to registration systems?',
          answer:
            'Yes. We design integrations so schedules, profiles, and check-in status stay aligned with operations.',
        },
        {
          question: 'Do you build both web and mobile?',
          answer:
            'Yes. Nebuloid delivers responsive event websites and mobile applications tailored to the event format.',
        },
      ],
      conclusion:
        'The digital layer is where modern events begin and continue. Nebuloid builds websites and apps that keep guests oriented and organizers in control.',
      relatedLinks: [
        { label: 'Event websites', href: '/technology/event-websites' },
        { label: 'Mobile applications', href: '/technology/mobile-applications' },
        { label: 'Venue navigation', href: '/technology/venue-navigation' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  'analytics-event-intelligence': serviceGeo(
    'Event intelligence',
    'Analytics and event intelligence systems capture interactions, attendance, and engagement so organizers can measure ROI and improve the next experience.',
    {
      benefits: [
        'Clear ROI and sponsor reporting',
        'Qualified lead pipelines from live engagement',
        'Operational visibility during the event',
      ],
      features: [
        'Live event dashboards',
        'Lead capture and scoring',
        'Engagement heatmaps',
        'Automated post-event reporting',
      ],
      howItWorks: [
        'Define KPIs tied to business outcomes',
        'Instrument touchpoints across registration and activations',
        'Monitor live dashboards during the show',
        'Deliver actionable post-event intelligence packs',
      ],
      useCases: [
        'Sponsor ROI reporting',
        'Exhibition lead generation',
        'Multi-session conference optimization',
      ],
      faqs: [
        {
          question: 'What metrics can you track?',
          answer:
            'Attendance, dwell, engagement at installations, lead quality, session participation, and custom brand KPIs depending on the stack deployed.',
        },
        {
          question: 'Is reporting real-time?',
          answer:
            'Live dashboards can surface operational metrics during the event, with deeper analysis delivered afterward.',
        },
      ],
      conclusion:
        'Every interaction tells a story. Nebuloid helps event teams capture it, understand it, and act on it.',
      relatedLinks: [
        { label: 'Live dashboards', href: '/technology/live-dashboards' },
        { label: 'Lead capture', href: '/technology/lead-capture' },
        { label: 'Solutions overview', href: '/solutions' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
}

export const technologyGeoBySlug: Record<string, GeoEnrichment> = {
  'ai-photo-booths': serviceGeo(
    'AI photo booths',
    'AI photo booths are interactive event activations that capture guests and generate branded, themed imagery in seconds using custom AI models and venue-ready hardware.',
    {
      benefits: [
        'High social share rates and brand amplification',
        'Premium themed outputs aligned to campaign creative',
        'Scalable throughput for mass and VIP audiences',
      ],
      features: [
        'Custom AI look systems',
        'QR delivery and sharing flows',
        'Moderation and operator controls',
        'On-site staffing and technical support',
      ],
      howItWorks: [
        'Creative briefing and AI theme development',
        'Hardware staging and network planning',
        'Live operation with quality controls',
        'Delivery of engagement metrics after the event',
      ],
      useCases: [
        'Corporate brand activations',
        'Product launches',
        'Awards and entertainment nights',
        'Exhibition booth magnets',
      ],
      faqs: [
        {
          question: 'Is an AI photo booth suitable for corporate events in India?',
          answer:
            'Yes. Nebuloid deploys AI photo booths for corporate, expo, and experiential events across India with brand-safe creative systems.',
        },
        {
          question: 'How is this different from a standard photo booth?',
          answer:
            'Outputs are generated with custom AI themes mapped to your brand, not generic filters, and the activation can connect into a broader event technology ecosystem.',
        },
      ],
      conclusion:
        'AI photo booths are among the highest-engagement activations at modern events. Nebuloid designs them as brand systems, not gadgets.',
      relatedLinks: [
        { label: 'AI-powered experiences', href: '/solutions/ai-powered-experiences' },
        { label: 'AI Photo Booth Delhi', href: '/ai-photo-booth-delhi' },
        { label: 'AI Photo Booth Mumbai', href: '/ai-photo-booth-mumbai' },
        { label: 'AI Photo Booth Bangalore', href: '/ai-photo-booth-bangalore' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  'touchscreen-kiosks': serviceGeo(
    'Touchscreen kiosks',
    'Touchscreen kiosks are interactive terminals used for registration, wayfinding, content discovery, and brand engagement at events and exhibitions.',
    {
      benefits: [
        'Self-serve guest journeys with lower staff load',
        'Consistent brand interaction at scale',
        'Structured data capture at the point of engagement',
      ],
      features: [
        'Custom UI experiences',
        'Registration and info flows',
        'Durable event hardware setups',
        'Analytics on interaction patterns',
      ],
      howItWorks: [
        'Map the guest task to a simple interaction model',
        'Design and build the kiosk application',
        'Stage hardware for traffic patterns',
        'Monitor usage and iterate content live if needed',
      ],
      useCases: [
        'Self-registration',
        'Product catalogs on expo floors',
        'Wayfinding and information hubs',
      ],
      faqs: [
        {
          question: 'Can kiosks work offline?',
          answer:
            'We plan for venue network realities and can support resilient modes depending on the workflow.',
        },
        {
          question: 'Do you supply hardware and software?',
          answer:
            'Yes. Nebuloid can deliver the full stack — application, hardware plan, and on-ground operation.',
        },
      ],
      conclusion:
        'Interactive kiosks turn venue space into a guided digital experience. Nebuloid builds them for clarity, durability, and brand impact.',
      relatedLinks: [
        { label: 'Interactive kiosk India', href: '/interactive-kiosk-india' },
        { label: 'Interactive installations', href: '/solutions/interactive-installations' },
        { label: 'Registration journey', href: '/solutions/registration-guest-journey' },
        { label: 'Contact', href: '/contact' },
      ],
    },
  ),
  ...interactiveExperienceGeoBySlug,
}

export function getServiceGeo(slug: string) {
  return serviceGeoBySlug[slug] ?? null
}

export function getTechnologyGeo(slug: string) {
  if (technologyGeoBySlug[slug]) return technologyGeoBySlug[slug]
  return null
}

/** Lightweight GEO fallback so every technology page still exposes FAQ-ready structure when curated copy is absent. */
export function getTechnologyGeoOrFallback(
  slug: string,
  title: string,
  intro: string,
  highlights: string[],
): GeoEnrichment {
  const curated = getTechnologyGeo(slug)
  if (curated) return curated
  return {
    whatIsIt: intro,
    benefits: [
      `Stronger on-ground engagement with ${title.toLowerCase()}`,
      'Operational reliability for live venues',
      'Measurable interaction data for organizers and sponsors',
    ],
    features: highlights.slice(0, 6),
    howItWorks: [
      'Scope the guest journey and brand requirements',
      'Configure creative, software, and hardware for the venue',
      'Stage, rehearse, and operate through show day',
      'Report engagement outcomes after the event',
    ],
    industries: sharedIndustries,
    useCases: [
      'Corporate conferences',
      'Exhibitions and trade shows',
      'Brand activations',
    ],
    whyChooseUs: sharedWhy,
    faqs: [
      {
        question: `What is ${title}?`,
        answer: intro,
      },
      {
        question: `Can Nebuloid deploy ${title} across India?`,
        answer:
          'Yes. Nebuloid supports event technology deployments nationwide with creative, technical, and on-ground operations.',
      },
    ],
    conclusion: `${title} is most effective when creative, technology, and operations work as one system — the Nebuloid approach to event experiences.`,
    relatedLinks: [
      { label: 'All technology', href: '/technology' },
      { label: 'Solutions', href: '/solutions' },
      { label: 'Digital experiences', href: '/digital-experiences' },
      { label: 'Contact', href: '/contact' },
    ],
  }
}
