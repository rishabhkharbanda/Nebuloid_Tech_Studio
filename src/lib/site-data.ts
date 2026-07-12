export const heroStates = [
  {
    title: 'AI Experiences.',
    image: '/assets/hero/ai-experiences.png',
    classes:
      'from-[#161022]/60 via-[#2f1b4d]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_50%_20%,rgba(112,192,255,.14),transparent_50%)]',
  },
  {
    title: 'Interactive Kiosks.',
    image: '/assets/hero/interactive-kiosks.png',
    classes:
      'from-[#0e0f13]/60 via-[#1f2538]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_70%_35%,rgba(129,175,255,.12),transparent_45%)]',
  },
  {
    title: 'LED Experiences.',
    image:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1920&q=80',
    classes:
      'from-[#131111]/60 via-[#37220f]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_55%_20%,rgba(255,164,72,.16),transparent_52%)]',
  },
  {
    title: 'Venue Navigation.',
    image: '/assets/hero/venue-navigation.png',
    classes:
      'from-[#0b1024]/60 via-[#0f1438]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_25%_40%,rgba(108,124,255,.14),transparent_45%)]',
  },
  {
    title: 'Event Graphics.',
    image: '/assets/hero/event-graphics.png',
    classes:
      'from-[#0f1116]/60 via-[#1f2335]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_32%_30%,rgba(212,175,55,.14),transparent_45%)]',
  },
  {
    title: 'Motion Design.',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80',
    classes:
      'from-[#161022]/60 via-[#2f1b4d]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_50%_20%,rgba(229,112,255,.12),transparent_50%)]',
  },
  {
    title: 'Creative Production.',
    image: '/assets/hero/creative-production.png',
    classes:
      'from-[#131111]/60 via-[#37220f]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_55%_20%,rgba(255,164,72,.14),transparent_52%)]',
  },
  {
    title: 'Registration Systems.',
    image: '/assets/hero/registration-systems.png',
    classes:
      'from-[#0e0f13]/60 via-[#1f2538]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_70%_35%,rgba(129,175,255,.12),transparent_45%)]',
  },
  {
    title: 'Touchscreen Experiences.',
    image: '/assets/hero/touchscreen-experiences.png',
    classes:
      'from-[#0b1024]/60 via-[#0f1438]/45 to-[#090909]/70 before:bg-[radial-gradient(circle_at_25%_40%,rgba(108,124,255,.16),transparent_45%)]',
  },
] as const

export const trustedBy = [
  'Corporate',
  'Healthcare',
  'Education',
  'Government',
  'Technology',
  'Hospitality',
  'Retail',
  'Manufacturing',
] as const

export const industries = [
  {
    slug: 'entertainment',
    title: 'Entertainment',
    description:
      'Concerts, award nights, launches, and live experiences with stage graphics, LED content, and immersive audience engagement.',
    image: '/assets/hero/creative-production.png',
  },
  {
    slug: 'textile',
    title: 'Textile',
    description:
      'Trade fairs, fashion showcases, and textile exhibitions with interactive booths, digital signage, and lead capture.',
    image: '/assets/hero/interactive-kiosks.png',
  },
  {
    slug: 'tourism',
    title: 'Tourism',
    description:
      'Destination activations, visitor experiences, and digital platforms that make journeys more engaging and memorable.',
    image: '/assets/hero/venue-navigation.png',
  },
  {
    slug: 'tech',
    title: 'Tech',
    description:
      'Product launches, demo days, and innovation forums with AI activations, kiosks, and high-impact digital layers.',
    image: '/assets/hero/ai-experiences.png',
  },
  {
    slug: 'agriculture',
    title: 'Agriculture',
    description:
      'Agri expos, farmer outreach, and institutional platforms with clear information design and interactive engagement.',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'religious',
    title: 'Religious',
    description:
      'Pilgrimage destinations, cultural gatherings, and sacred spaces enhanced through respectful digital storytelling.',
    image: '/assets/digital-experiences/filbo/wedding-theme.png',
  },
  {
    slug: 'more-sectors',
    title: 'And More',
    description:
      'Corporate, healthcare, education, government, exhibitions, and emerging sectors — tailored to your audience and protocol.',
    image: '/assets/hero/touchscreen-experiences.png',
  },
] as const

export const services = [
  {
    id: '01',
    slug: 'event-branding-creative-production',
    title: 'Event Branding & Creative Production',
    description:
      'The visual language of your event — before anyone walks through the door.',
    detail:
      'From conference identity to stage backdrops, LED content, motion graphics, and invitation systems — every touchpoint speaks the same story.',
    tags: ['Branding', 'Motion', 'LED Content', 'Stage Design'],
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '02',
    slug: 'registration-guest-journey',
    title: 'Registration & Guest Journey',
    description:
      'The first impression sets the tone for everything that follows.',
    detail:
      'QR check-in, badge printing, touchscreen registration, and seamless guest flow — designed to feel effortless at scale.',
    tags: ['QR Check-in', 'Badges', 'Kiosks', 'Guest Flow'],
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '03',
    slug: 'interactive-installations',
    title: 'Interactive Installations',
    description:
      'Moments people pause for — and remember long after the event ends.',
    detail:
      'Touchscreen experiences, digital signage, gamification, and on-ground installations that turn passive audiences into participants.',
    tags: ['Kiosks', 'Gamification', 'Signage', 'Installations'],
    image:
      'https://images.unsplash.com/photo-1556745750-6826e973b173?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '04',
    slug: 'ai-powered-experiences',
    title: 'AI-Powered Experiences',
    description:
      'Intelligence woven into the experience — not bolted on as an afterthought.',
    detail:
      'AI photo booths, personalized interactions, and smart engagement layers that feel magical, not mechanical.',
    tags: ['AI Booth', 'Vision AI', 'Personalization', 'Engagement'],
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '05',
    slug: 'event-websites-applications',
    title: 'Event Websites & Applications',
    description:
      'Your event lives online before, during, and after the physical moment.',
    detail:
      'Event websites, mobile apps, venue navigation, and digital companion experiences — unified under one ecosystem.',
    tags: ['Event Web', 'Mobile App', 'Navigation', 'Live Updates'],
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: '06',
    slug: 'analytics-event-intelligence',
    title: 'Analytics & Event Intelligence',
    description:
      'Every interaction tells a story. We help you read it clearly.',
    detail:
      'Lead capture systems, live dashboards, and post-event analytics that translate engagement into actionable insight.',
    tags: ['Dashboards', 'Lead Capture', 'Analytics', 'Reporting'],
    image:
      'https://images.unsplash.com/photo-1551281044-8b9a7bda51d4?auto=format&fit=crop&w=1200&q=80',
  },
] as const

export const projects = [
  {
    slug: 'ai-photo-booth-experience',
    title: 'AI Photo Booth Experience',
    category: 'AI Experience',
    tech: 'Vision AI · Instant Sharing · Custom Branding',
    image: '/assets/hero/ai-experiences.png',
    aspect: 'aspect-[4/5]',
    span: '',
  },
  {
    slug: 'ar-vr-experiences',
    title: 'Immersive Virtual Experiences',
    category: 'AR / VR Experiences',
    tech: 'AR Filters · VR Simulations · Interactive Demos',
    image: '/assets/hero/touchscreen-experiences.png',
    aspect: 'aspect-[4/5]',
    span: '',
  },
  {
    slug: 'exhibition-booth-ecosystem',
    title: 'Event Engagement Games',
    category: 'Interactive Games',
    tech: 'Quiz · Spin Wheel · Leaderboard · Touch Games',
    image: '/assets/hero/interactive-kiosks.png',
    aspect: 'aspect-[4/5]',
    span: '',
  },
  {
    slug: 'annual-awards-night',
    title: 'Creative Event Design',
    category: 'Event Graphics',
    tech: 'Stage Graphics · LED Content · Signage · Branding',
    image: '/assets/hero/event-graphics.png',
    aspect: 'aspect-[4/5]',
    span: '',
  },
  {
    slug: 'venue-navigation-system',
    title: 'Venue Navigation System',
    category: 'Spatial Experience',
    tech: 'Wayfinding · Maps · Digital Layer',
    image:
      'https://images.unsplash.com/photo-1524661139772-096332aef623?auto=format&fit=crop&w=900&q=80',
    aspect: 'aspect-[4/5]',
    span: '',
  },
  {
    slug: 'registration-command-center',
    title: 'Registration Command Center',
    category: 'Guest Journey',
    tech: 'QR Check-in · Badges · Kiosks',
    image: '/assets/hero/registration-systems.png',
    aspect: 'aspect-[16/10]',
    span: 'sm:col-span-2 xl:col-span-2',
  },
  {
    slug: 'event-intelligence-dashboard',
    title: 'Event Intelligence Dashboard',
    category: 'Analytics & Insights',
    tech: 'Live Data · Lead Capture · Reports',
    image:
      'https://images.unsplash.com/photo-1551281044-8b9a7bda51d4?auto=format&fit=crop&w=1200&q=80',
    aspect: 'aspect-[16/10]',
    span: 'sm:col-span-2 xl:col-span-2',
  },
] as const

export const processSteps = [
  {
    step: 'Discover',
    description: 'We listen to your vision, audience, and objectives.',
    detail:
      'Stakeholder alignment, audience mapping, and technical feasibility — so every decision starts from clarity.',
    outputs: ['Experience brief', 'Audience insights', 'Technical scope'],
  },
  {
    step: 'Imagine',
    description: 'We explore concepts that make your event unforgettable.',
    detail:
      'Creative territories, interaction models, and experience narratives shaped around your brand and venue.',
    outputs: ['Concept directions', 'Experience storyboard', 'Activation ideas'],
  },
  {
    step: 'Design',
    description: 'Brand, motion, space, and technology — unified.',
    detail:
      'UI/UX, visual systems, content architecture, and interaction design engineered as one cohesive layer.',
    outputs: ['Design systems', 'User flows', 'Prototype screens'],
  },
  {
    step: 'Build',
    description: 'We engineer every layer of the experience ecosystem.',
    detail:
      'Frontend development, kiosk software, AI integrations, and platform engineering built for real-world scale.',
    outputs: ['Production systems', 'Kiosk software', 'Platform deployment'],
  },
  {
    step: 'Experience',
    description: 'Flawless execution on the ground, at scale.',
    detail:
      'On-site deployment, live monitoring, and rapid response so every touchpoint performs under pressure.',
    outputs: ['Live deployment', 'On-ground support', 'Guest-ready systems'],
  },
  {
    step: 'Measure',
    description: 'Data, insight, and clarity for what comes next.',
    detail:
      'Engagement analytics, performance reporting, and optimization insights that inform your next experience.',
    outputs: ['Analytics dashboards', 'Engagement reports', 'Optimization roadmap'],
  },
] as const

export const technologyCategories = [
  'All',
  'Interactive',
  'AI',
  'Digital',
  'Analytics',
] as const

export const technologies = [
  {
    slug: 'touchscreen-kiosks',
    title: 'Touchscreen Kiosks',
    category: 'Interactive',
    tagline: 'Self-service interfaces that scale under live event pressure.',
    image:
      'https://images.unsplash.com/photo-1556745750-6826e973b173?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'qr-check-in-systems',
    title: 'QR Check-in Systems',
    category: 'Interactive',
    tagline: 'Frictionless arrivals with scan-to-enter guest flows.',
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'ai-photo-booths',
    title: 'AI Photo Booths',
    category: 'AI',
    tagline: 'AI-generated moments built for shareability and brand recall.',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'led-wall-content',
    title: 'LED Wall Content',
    category: 'Digital',
    tagline: 'Motion-led visuals that command attention at scale.',
    image:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'venue-navigation',
    title: 'Venue Navigation',
    category: 'Digital',
    tagline: 'Wayfinding systems that keep audiences moving effortlessly.',
    image:
      'https://images.unsplash.com/photo-1524661139772-096332aef623?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'event-websites',
    title: 'Event Websites',
    category: 'Digital',
    tagline: 'Digital hubs for your event before, during, and after.',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'mobile-applications',
    title: 'Mobile Applications',
    category: 'Digital',
    tagline: 'Companion apps that extend the experience into every pocket.',
    image:
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'digital-signage',
    title: 'Digital Signage',
    category: 'Digital',
    tagline: 'Dynamic on-venue displays synced to your event narrative.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'interactive-games',
    title: 'Interactive Games',
    category: 'Interactive',
    tagline: 'Touch-driven games that turn visitors into participants.',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'live-dashboards',
    title: 'Live Dashboards',
    category: 'Analytics',
    tagline: 'Real-time intelligence for operations and engagement teams.',
    image:
      'https://images.unsplash.com/photo-1551281044-8b9a7bda51d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'lead-capture',
    title: 'Lead Capture',
    category: 'Analytics',
    tagline: 'Structured data collection woven into the experience flow.',
    image:
      'https://images.unsplash.com/photo-1556745750-6826e973b173?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'motion-graphics',
    title: 'Motion Graphics',
    category: 'Digital',
    tagline: 'Animated content systems for stages, screens, and environments.',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
  },
] as const

export const stats = [
  { label: 'Events Delivered', value: 50, suffix: '+' },
  { label: 'Cities Served', value: 10, suffix: '+' },
  { label: 'Attendees Engaged', value: 100, suffix: 'K+' },
  { label: 'Years Crafting Experiences', value: 5, suffix: '+' },
] as const

export const testimonials = [
  {
    quote:
      'Our annual summit went from a standard corporate event to an experience people talked about for months. Nebuloid connected branding, technology, and production into one seamless ecosystem.',
    name: 'Aditi Mehra',
    role: 'Director of Events, Lumina Corporate',
  },
  {
    quote:
      'Registration used to be our biggest bottleneck. Nebuloid redesigned the entire guest journey — check-in, badges, navigation — and our lines disappeared.',
    name: 'Karan Verma',
    role: 'Head of Marketing, Eventorix',
  },
  {
    quote:
      'The AI photo booth became the most shared moment of our product launch. It wasn\'t a gimmick — it was a beautifully integrated part of the experience.',
    name: 'Rehan Siddiqui',
    role: 'Brand Lead, Vistara Labs',
  },
] as const

export const blogPosts = [
  {
    slug: 'why-event-branding-starts-before-venue-doors-open',
    title: 'Why Event Branding Starts Before the Venue Doors Open',
    excerpt:
      'The most memorable events begin with a visual language that attendees feel before they arrive.',
    date: 'June 2026',
    category: 'Event Branding',
    readTime: '6 min read',
  },
  {
    slug: 'designing-registration-that-disappears-into-the-experience',
    title: 'Designing Registration That Disappears Into the Experience',
    excerpt:
      'When check-in feels effortless, your event starts on the right note — every single time.',
    date: 'May 2026',
    category: 'Guest Journey',
    readTime: '5 min read',
  },
  {
    slug: 'ai-at-events-beyond-the-photo-booth',
    title: 'AI at Events: Beyond the Photo Booth',
    excerpt:
      'How intelligent experiences are reshaping engagement at corporate gatherings worldwide.',
    date: 'April 2026',
    category: 'AI Experiences',
    readTime: '7 min read',
  },
  {
    slug: 'the-art-of-stage-design-in-corporate-celebrations',
    title: 'The Art of Stage Design in Corporate Celebrations',
    excerpt:
      'When the backdrop becomes the narrative — and the audience becomes part of the story.',
    date: 'March 2026',
    category: 'Event Design',
    readTime: '6 min read',
  },
  {
    slug: 'experiential-marketing-that-earns-attention-not-just-impressions',
    title: 'Experiential Marketing That Earns Attention, Not Just Impressions',
    excerpt:
      'Why interactive installations outperform passive displays at every exhibition.',
    date: 'February 2026',
    category: 'Experiential Marketing',
    readTime: '5 min read',
  },
  {
    slug: 'conference-experiences-that-people-actually-remember',
    title: 'Conference Experiences That People Actually Remember',
    excerpt:
      'The difference between a well-run event and one that changes how people think.',
    date: 'January 2026',
    category: 'Conference Experiences',
    readTime: '8 min read',
  },
] as const

export const faqs = [
  {
    question: 'What makes Nebuloid different from an event management company?',
    answer:
      'We don\'t coordinate logistics — we design and build the entire creative technology ecosystem. Branding, motion, kiosks, AI, registration, navigation, and analytics — unified under one partner.',
  },
  {
    question: 'Do you handle both creative and technology?',
    answer:
      'Yes. That\'s our core strength. We combine event branding, creative production, and interactive technology into one seamless experience — so you work with one team, not five vendors.',
  },
  {
    question: 'What types of events do you work on?',
    answer:
      'Corporate conferences, product launches, award nights, exhibitions, brand activations, annual meetings, and experiential marketing campaigns across industries.',
  },
  {
    question: 'Can you support events across multiple cities?',
    answer:
      'We\'ve delivered experiences across 10+ cities. Our systems are built for scale — whether your event is in one venue or across a multi-city tour.',
  },
  {
    question: 'How early should we reach out?',
    answer:
      'The earlier, the better — especially for custom installations, AI experiences, and large-scale branding. We recommend starting conversations 8–12 weeks before your event date.',
  },
] as const

export const contactDetails = {
  address: {
    lines: ['H no. 944, Block - C, Sushant Lok 1', 'Gurugram, Haryana, India 122001'],
  },
  phone: '+91 7303922260',
  phoneHref: 'tel:+917303922260',
  email: 'nebuloidtechstudio1@gmail.com',
  emailHref: 'mailto:nebuloidtechstudio1@gmail.com',
} as const

export const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const
