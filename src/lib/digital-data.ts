export const digitalProjects = [
  {
    slug: 'paras-dham-girnar',
    client: 'Paras Dham Girnar',
    category: 'Religious Tourism · Interactive Visitor Experience · Digital Experience Platform',
    title: 'Transforming a Sacred Destination Through Interactive Digital Experiences',
    overview:
      'Nebuloid designed and developed a complete digital experience ecosystem for Paras Dham Girnar that enhances visitor engagement through interactive technologies, immersive storytelling, digital platforms, and gamified experiences. The objective was to make the spiritual journey more engaging, informative, and memorable while preserving the sanctity of the destination.',
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea423?auto=format&fit=crop&w=1400&q=80',
    contribution: [
      'Interactive Visitor Experience Platform',
      'Interactive Gaming Experiences',
      'Website Design & Development',
      'Touchscreen Experience Design',
      'Visitor Engagement Solutions',
      'Gamification',
      'Digital Information System',
      'UI/UX Design',
      'Responsive Digital Platform',
    ],
    interactiveExperiences: {
      games: [
        'Quiz Experiences',
        'Memory Games',
        'Puzzle Games',
        'Educational Challenges',
        'Interactive Learning',
        'Family & Kids Engagement',
      ],
      technologies: [
        'Interactive Touch Interfaces',
        'Smart Visitor Information System',
        'Digital Storytelling',
        'Multimedia Experiences',
        'Interactive Learning Modules',
        'QR Code Experiences',
        'Digital Knowledge Hub',
      ],
    },
    techStack: [
      'React / Next.js',
      'Interactive Web Technologies',
      'Touchscreen Applications',
      'CMS',
      'Responsive UI',
      'Performance Optimization',
      'Analytics Integration',
    ],
    impact: [
      'Increased visitor engagement',
      'Enhanced learning experience',
      'Better accessibility to information',
      'Digitized visitor journey',
      'Modern digital presence',
      'Memorable interactive experiences',
    ],
  },
  {
    slug: 'national-book-trust-filbo',
    client: 'National Book Trust (NBT)',
    subtitle: 'FILBO – Bogotá International Book Fair',
    category: 'International Event · AI Experience · Interactive Gaming · Event Technology',
    title: 'Creating an Immersive AI-Powered Experience at FILBO',
    overview:
      'Nebuloid partnered with the National Book Trust (NBT) to transform India\'s pavilion at FILBO into an engaging digital experience through AI-powered activations and interactive gaming. Visitors explored India\'s culture through immersive technology, making the pavilion more interactive, educational, and memorable.',
    image: '/assets/digital-experiences/filbo/heritage-taj-mahal.png',
    gallery: [
      {
        src: '/assets/digital-experiences/filbo/heritage-taj-mahal.png',
        alt: 'AI selfie booth output — visitor at the Taj Mahal with FILBO branding',
        label: 'Heritage · Taj Mahal',
      },
      {
        src: '/assets/digital-experiences/filbo/wedding-theme.png',
        alt: 'AI selfie booth output — visitor in traditional Indian wedding attire',
        label: 'Cultural · Wedding',
      },
      {
        src: '/assets/digital-experiences/filbo/wildlife-elephant.png',
        alt: 'AI selfie booth output — visitor with an elephant in a forest setting',
        label: 'Wildlife · Elephant',
      },
      {
        src: '/assets/digital-experiences/filbo/wildlife-lioness.png',
        alt: 'AI selfie booth output — visitor with a lioness on the savanna',
        label: 'Wildlife · Lioness',
      },
      {
        src: '/assets/digital-experiences/filbo/heritage-gandhi.png',
        alt: 'AI selfie booth output — literary heritage portrait with Mahatma Gandhi',
        label: 'Heritage · Literary Portrait',
      },
    ],
    contribution: [
      'AI Selfie Booth',
      'Interactive Gaming Platform',
      'Touchscreen Kiosk Software',
      'Visitor Engagement Experience',
      'Event Technology',
      'Digital Experience Design',
      'Gamification',
    ],
    interactiveExperiences: {
      aiBooth: [
        'AI-generated themed photos',
        'Instant branded images',
        'QR Code download',
        'Social sharing',
        'Event branding',
      ],
      games: [
        'India Quiz',
        'Interactive Map Explorer',
        'Educational Challenges',
        'Cultural Discovery Games',
        'Touchscreen Experience',
        'Multi-age Engagement',
      ],
    },
    techStack: [
      'AI Image Generation',
      'Interactive Kiosk Platform',
      'Touchscreen Software',
      'QR Code Integration',
      'Responsive Web Application',
      'Content Management',
      'Analytics Dashboard',
    ],
    impact: [
      'Higher visitor participation',
      'Increased booth engagement',
      'Interactive cultural learning',
      'Stronger brand recall',
      'Memorable AI-powered experiences',
      'Enhanced visitor interaction',
    ],
  },
  {
    slug: 'cish-digital-platform',
    client: 'Central Institute for Subtropical Horticulture (CISH)',
    category: 'Government Digital Platform · Digital Transformation',
    title: 'Building a Modern Digital Platform for Research & Public Engagement',
    overview:
      'Nebuloid designed and developed a modern digital platform for CISH that improves accessibility, simplifies information delivery, and strengthens the institute\'s online presence through a scalable and user-friendly web experience.',
    image:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80',
    contribution: [
      'Website Design',
      'Website Development',
      'UI/UX Design',
      'Information Architecture',
      'CMS Development',
      'Mobile Optimization',
      'SEO Optimization',
    ],
    techStack: [
      'Modern Frontend Stack',
      'CMS',
      'Responsive Design',
      'Accessibility Standards',
      'Performance Optimization',
      'SEO Best Practices',
    ],
    impact: [
      'Improved institutional visibility',
      'Better accessibility',
      'Faster information access',
      'Enhanced user experience',
      'Modern government digital presence',
    ],
  },
] as const

export const digitalCapabilityCategories = [
  'Interactive Experiences',
  'AI & Engagement',
  'Platforms & Web',
  'Event Technology',
  'Data & Systems',
] as const

export const digitalCapabilities = [
  {
    id: '01',
    slug: 'interactive-experience-platforms',
    title: 'Interactive Experience Platforms',
    category: 'Interactive Experiences',
    description:
      'Unified platforms where visitors touch, play, learn, and explore — engineered for destinations, venues, and high-traffic environments.',
    href: '/technology/interactive-games',
    featured: true,
  },
  {
    id: '02',
    slug: 'ai-selfie-booths',
    title: 'AI Selfie Booths',
    category: 'AI & Engagement',
    description:
      'AI-generated themed photos with instant branded output, QR downloads, and social sharing built for events and activations.',
    href: '/technology/ai-photo-booths',
    featured: true,
  },
  {
    id: '03',
    slug: 'ai-powered-visitor-experiences',
    title: 'AI-Powered Visitor Experiences',
    category: 'AI & Engagement',
    description:
      'Intelligent layers woven into the visitor journey — personalization, smart interactions, and memorable AI-first moments.',
    href: '/technology/ai-photo-booths',
    featured: false,
  },
  {
    id: '04',
    slug: 'interactive-gaming-solutions',
    title: 'Interactive Gaming Solutions',
    category: 'Interactive Experiences',
    description:
      'Quizzes, puzzles, educational challenges, and touchscreen games that turn passive audiences into active participants.',
    href: '/technology/interactive-games',
    featured: false,
  },
  {
    id: '05',
    slug: 'touchscreen-kiosks',
    title: 'Touchscreen Kiosks',
    category: 'Event Technology',
    description:
      'Custom kiosk software for registration, information, engagement, and wayfinding — reliable under live event pressure.',
    href: '/technology/touchscreen-kiosks',
    featured: false,
  },
  {
    id: '06',
    slug: 'website-design-development',
    title: 'Website Design & Development',
    category: 'Platforms & Web',
    description:
      'Premium responsive websites with performance, accessibility, and brand storytelling at the core of every build.',
    href: '/solutions/event-websites-applications',
    featured: false,
  },
  {
    id: '07',
    slug: 'government-digital-platforms',
    title: 'Government Digital Platforms',
    category: 'Platforms & Web',
    description:
      'Accessible, scalable public-facing platforms that modernize institutional presence and simplify information delivery.',
    href: '/digital-experiences/cish-digital-platform',
    featured: false,
  },
  {
    id: '08',
    slug: 'event-technology',
    title: 'Event Technology',
    category: 'Event Technology',
    description:
      'End-to-end digital systems for exhibitions, pavilions, and brand activations — from kiosks to live engagement layers.',
    href: '/experiences',
    featured: false,
  },
  {
    id: '09',
    slug: 'digital-storytelling',
    title: 'Digital Storytelling',
    category: 'Interactive Experiences',
    description:
      'Immersive narratives through multimedia, interactive modules, and touch-driven experiences that bring stories to life.',
    href: '/digital-experiences/paras-dham-girnar',
    featured: false,
  },
  {
    id: '10',
    slug: 'visitor-engagement-systems',
    title: 'Visitor Engagement Systems',
    category: 'Interactive Experiences',
    description:
      'Smart information hubs, guided journeys, and engagement touchpoints designed to deepen every visitor interaction.',
    href: '/technology/touchscreen-kiosks',
    featured: false,
  },
  {
    id: '11',
    slug: 'qr-code-experiences',
    title: 'QR Code Experiences',
    category: 'Event Technology',
    description:
      'Seamless QR-driven flows for check-in, content access, downloads, and on-ground digital handoffs.',
    href: '/technology/qr-check-in-systems',
    featured: false,
  },
  {
    id: '12',
    slug: 'analytics-dashboards',
    title: 'Analytics Dashboards',
    category: 'Data & Systems',
    description:
      'Live dashboards and engagement analytics that translate visitor behavior into actionable performance insight.',
    href: '/technology/live-dashboards',
    featured: false,
  },
  {
    id: '13',
    slug: 'cms-development',
    title: 'CMS Development',
    category: 'Data & Systems',
    description:
      'Flexible content management systems that empower teams to publish, update, and scale digital experiences with ease.',
    href: '/contact',
    featured: false,
  },
  {
    id: '14',
    slug: 'api-integrations',
    title: 'API Integrations',
    category: 'Data & Systems',
    description:
      'Robust API layers connecting platforms, third-party services, and on-ground systems into one cohesive experience.',
    href: '/contact',
    featured: false,
  },
  {
    id: '15',
    slug: 'performance-optimization',
    title: 'Performance Optimization',
    category: 'Data & Systems',
    description:
      'Speed, reliability, and scalability tuning so every digital touchpoint performs flawlessly at scale.',
    href: '/contact',
    featured: false,
  },
] as const

/** @deprecated Use digitalCapabilities */
export const digitalSolutions = digitalCapabilities.map((item) => item.title)

export const digitalSpecializations = [
  'AI Experiences',
  'AI Selfie Booths',
  'Interactive Games',
  'Touchscreen Kiosks',
  'Interactive Web Applications',
  'Event Technology',
  'Digital Storytelling',
  'Responsive Web Platforms',
  'QR Code Experiences',
  'Visitor Engagement',
  'Gamification',
  'Digital Information Systems',
  'CMS Solutions',
  'API Integrations',
  'Analytics Dashboards',
  'SEO Optimization',
] as const

export const digitalWorkflow = [
  { step: 'Understand', description: 'We study your audience, goals, and the experience you want to create.' },
  { step: 'Design', description: 'We craft interfaces, flows, and interactions that feel intuitive and premium.' },
  { step: 'Develop', description: 'We engineer scalable platforms with performance and reliability at the core.' },
  { step: 'Deploy', description: 'We launch across venues, devices, and environments — ready for real-world use.' },
  { step: 'Engage Visitors', description: 'We optimize touchpoints so every interaction feels seamless and memorable.' },
  { step: 'Measure Performance', description: 'We track engagement, usage, and outcomes with live analytics.' },
  { step: 'Optimize & Scale', description: 'We refine, expand, and evolve the experience based on real data.' },
] as const

export const whyChooseNebuloid = [
  { title: 'AI-first Experiences', description: 'Intelligent activations woven into every layer of the digital journey.' },
  { title: 'Interactive Visitor Engagement', description: 'Touch, play, learn — experiences that turn audiences into participants.' },
  { title: 'Enterprise-grade Software', description: 'Built for scale, reliability, and the demands of high-traffic environments.' },
  { title: 'Event Technology Solutions', description: 'Kiosks, AI booths, and engagement systems engineered for live events.' },
  { title: 'Government Digital Platforms', description: 'Accessible, compliant, and modern platforms for public institutions.' },
  { title: 'Scalable Architecture', description: 'Systems designed to grow with your organization and your audience.' },
  { title: 'Premium UI/UX', description: 'Every interface crafted with intent — elegant, intuitive, and on-brand.' },
  { title: 'End-to-End Development', description: 'From concept to deployment — one partner for the complete digital experience.' },
] as const

export const digitalImpactStats = [
  {
    id: '01',
    value: '3',
    suffix: '+',
    label: 'Major Digital Experience Projects',
    description:
      'Complete digital ecosystems delivered across religious tourism, international exhibitions, and government institutions.',
    featured: true,
  },
  {
    id: '02',
    value: 'AI',
    suffix: '',
    label: 'Powered Event Activations',
    description:
      'Selfie booths, intelligent interactions, and immersive activations engineered for live audiences.',
    isText: true,
  },
  {
    id: '03',
    value: 'Interactive',
    suffix: '',
    label: 'Gaming Experiences',
    description:
      'Touch-driven quizzes, puzzles, and educational games that turn visitors into participants.',
    isText: true,
  },
  {
    id: '04',
    value: 'Government',
    suffix: '',
    label: 'Digital Platforms',
    description:
      'Accessible, scalable public-facing platforms built for institutions and research organizations.',
    isText: true,
  },
  {
    id: '05',
    value: '100',
    suffix: '%',
    label: 'Custom-Built Solutions',
    description:
      'Every system designed and developed from the ground up — no templates, no shortcuts.',
    featured: false,
  },
] as const

export const impactOutcomes = [
  'Increased Visitor Engagement',
  'Higher Booth Participation',
  'Modern Digital Presence',
  'Memorable Brand Recall',
  'Faster Information Access',
  'Enhanced Learning Experiences',
] as const
