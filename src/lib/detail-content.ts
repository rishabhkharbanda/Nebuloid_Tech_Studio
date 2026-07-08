export const projectDetails: Record<
  string,
  {
    intro: string
    sections: { title: string; content: string }[]
    highlights: string[]
  }
> = {
  'global-leadership-summit': {
    intro:
      'A three-day leadership summit for 800 executives — unified through branding, registration, and a cinematic LED stage experience that set the tone from arrival to closing address.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'The client needed a single partner to deliver conference identity, guest registration at scale, and stage visuals that felt world-class — without juggling multiple vendors on event day.',
      },
      {
        title: 'Our Approach',
        content:
          'We designed a complete visual system, built QR-based registration with live badge printing, and produced motion content for the main LED stage — all connected under one cohesive experience layer.',
      },
      {
        title: 'The Outcome',
        content:
          'Check-in averaged under 90 seconds per guest. The stage became the most photographed moment of the summit. Leadership cited the experience as a benchmark for future global events.',
      },
    ],
    highlights: [
      'Conference branding & visual identity',
      'QR check-in with badge printing',
      'LED stage motion content',
      'Wayfinding & venue signage',
      'Live registration dashboard',
    ],
  },
  'annual-awards-night': {
    intro:
      'An awards ceremony where every visual moment — from entrance graphics to stage backdrops — was designed to feel cinematic, celebratory, and unmistakably on-brand.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'The event needed to elevate a traditional awards format into a premium celebration that honored winners while keeping 600 guests engaged throughout the evening.',
      },
      {
        title: 'Our Approach',
        content:
          'We crafted stage graphics, motion sequences for each award category, and environmental signage that transformed the venue into a cohesive branded world.',
      },
      {
        title: 'The Outcome',
        content:
          'Winner reveal moments landed with impact. Social sharing increased threefold compared to the previous year. The client rebooked Nebuloid for the next annual edition.',
      },
    ],
    highlights: [
      'Stage backdrop design',
      'Award category motion graphics',
      'Environmental signage',
      'Social media creative templates',
      'Run-of-show visual coordination',
    ],
  },
  'product-launch-activation': {
    intro:
      'A product launch activation combining interactive kiosks, LED wall content, and a tactile brand environment that turned attendees into participants.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'The brand needed more than a presentation — they needed an activation that let people experience the product story firsthand in a crowded exhibition setting.',
      },
      {
        title: 'Our Approach',
        content:
          'We built touchscreen demo kiosks, designed LED wall narratives synced to live presentations, and created a booth flow that guided guests through discovery to conversion.',
      },
      {
        title: 'The Outcome',
        content:
          'Booth dwell time doubled industry averages. Lead capture increased by 140%. The activation became the reference design for the brand\'s global roadshow.',
      },
    ],
    highlights: [
      'Interactive product kiosks',
      'LED wall launch content',
      'Booth spatial design',
      'Lead capture integration',
      'Live demo synchronization',
    ],
  },
  'ai-photo-booth-experience': {
    intro:
      'An AI-powered photo experience that became the most shared moment of a major product launch — intelligent, on-brand, and seamlessly integrated into the event flow.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'The client wanted a shareable moment that felt premium and on-brand — not a generic photo booth bolted onto the side of the event.',
      },
      {
        title: 'Our Approach',
        content:
          'We developed a custom AI photo experience with branded overlays, instant social sharing, and a touchscreen interface designed to match the launch aesthetic.',
      },
      {
        title: 'The Outcome',
        content:
          'Over 2,000 photos generated in four hours. Social mentions spiked during the event window. The experience was featured in the client\'s post-event recap film.',
      },
    ],
    highlights: [
      'Custom AI vision pipeline',
      'Branded photo overlays',
      'Touchscreen interface',
      'Instant social sharing',
      'Live usage analytics',
    ],
  },
  'exhibition-booth-ecosystem': {
    intro:
      'A complete exhibition booth ecosystem — from structural branding to interactive games — designed to stop foot traffic and start conversations.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'In a hall of hundreds of booths, the client needed to stand out, engage passersby, and capture qualified leads without feeling sales-heavy.',
      },
      {
        title: 'Our Approach',
        content:
          'We designed the booth visual system, built an interactive game on touchscreen, and integrated digital signage that adapted messaging based on time of day and crowd density.',
      },
      {
        title: 'The Outcome',
        content:
          'The booth ranked among the top three most visited at the exhibition. Lead quality scores improved. The design was reused across two subsequent trade shows.',
      },
    ],
    highlights: [
      'Booth branding & graphics',
      'Interactive touchscreen game',
      'Digital signage system',
      'Lead capture workflow',
      'Staff-facing analytics view',
    ],
  },
  'venue-navigation-system': {
    intro:
      'A digital wayfinding layer that helped 1,200 attendees navigate a multi-floor venue without confusion — on mobile, on screens, and at key decision points.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'A sprawling conference venue with parallel sessions across three floors created constant navigation friction and delayed session starts.',
      },
      {
        title: 'Our Approach',
        content:
          'We built a venue navigation system with interactive maps, session-aware routing, and digital signage at elevators and junction points — all synced to the live event schedule.',
      },
      {
        title: 'The Outcome',
        content:
          'Wayfinding-related support requests dropped by 70%. Session attendance improved in peripheral rooms. Attendees rated navigation clarity highest in post-event surveys.',
      },
    ],
    highlights: [
      'Interactive venue maps',
      'Session-aware routing',
      'Digital signage network',
      'Mobile companion access',
      'Real-time schedule sync',
    ],
  },
  'registration-command-center': {
    intro:
      'A registration ecosystem built for 2,000 guests — QR check-in, badge printing, kiosk self-service, and a live command center for the events team.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'Previous events suffered from long queues, manual badge lookups, and no real-time visibility into guest flow for the operations team.',
      },
      {
        title: 'Our Approach',
        content:
          'We deployed QR check-in stations, self-service kiosks for walk-ins, instant badge printing, and a live dashboard showing throughput, wait times, and capacity by zone.',
      },
      {
        title: 'The Outcome',
        content:
          'Peak check-in processed 400 guests per hour. Average wait time dropped to under three minutes. The command center became standard for all future events.',
      },
    ],
    highlights: [
      'QR check-in stations',
      'Self-service registration kiosks',
      'On-demand badge printing',
      'Live operations dashboard',
      'Multi-zone capacity monitoring',
    ],
  },
  'event-intelligence-dashboard': {
    intro:
      'A live event intelligence platform that turned attendee interactions into actionable insight — from lead capture to engagement heatmaps and post-event reporting.',
    sections: [
      {
        title: 'The Challenge',
        content:
          'Marketing and sales teams had no unified view of what happened at the event until weeks later — when follow-up momentum was already lost.',
      },
      {
        title: 'Our Approach',
        content:
          'We built a live dashboard aggregating registration data, kiosk interactions, lead captures, and session attendance — with automated post-event reports delivered within 24 hours.',
      },
      {
        title: 'The Outcome',
        content:
          'Sales follow-up began the same day as the event. Marketing received clear ROI metrics for the first time. The dashboard model was adopted across the client\'s event portfolio.',
      },
    ],
    highlights: [
      'Live engagement dashboard',
      'Lead capture aggregation',
      'Session attendance tracking',
      'Automated post-event reports',
      'Export-ready analytics',
    ],
  },
}

export const serviceDetails: Record<
  string,
  {
    intro: string
    sections: { title: string; content: string }[]
    highlights: string[]
  }
> = {
  'event-branding-creative-production': {
    intro:
      'The visual language that defines your event before a single guest arrives — and stays with them long after they leave.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'Event branding is not decoration. It is the emotional frame through which every moment is experienced — from the invitation to the stage to the social posts that follow.',
      },
      {
        title: 'Attendee Experience',
        content:
          'Guests enter a world that feels intentional. Every touchpoint reinforces the same story — building trust, excitement, and a sense that this event was crafted with care.',
      },
      {
        title: 'Business Outcome',
        content:
          'Strong event identity increases recall, social sharing, and sponsor visibility — while giving your team a cohesive system that scales across venues and formats.',
      },
    ],
    highlights: [
      'Conference & corporate event identity',
      'Stage backdrops & LED content',
      'Motion graphics & show openers',
      'Invitation & collateral design',
      'Social media creative systems',
    ],
  },
  'registration-guest-journey': {
    intro:
      'The first touchpoint of your event sets the emotional tone for everything that follows. We make arrival feel effortless.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'Registration is the first real interaction between your event and your guest. Friction here creates frustration that colors the entire experience.',
      },
      {
        title: 'Attendee Experience',
        content:
          'Guests scan, check in, and receive their badge in seconds — with clear wayfinding from the moment they enter the venue.',
      },
      {
        title: 'Business Outcome',
        content:
          'Faster throughput means happier guests, less staff overhead, and real-time data on attendance that powers better decisions throughout the event.',
      },
    ],
    highlights: [
      'QR check-in systems',
      'On-site badge printing',
      'Touchscreen self-registration',
      'VIP & group check-in flows',
      'Live guest flow monitoring',
    ],
  },
  'interactive-installations': {
    intro:
      'Installations that transform passive audiences into active participants — creating moments people stop for, engage with, and remember.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'In a world of distractions, interactive moments are what separate memorable events from forgettable ones.',
      },
      {
        title: 'Attendee Experience',
        content:
          'Touchscreen experiences, games, and digital installations give guests a reason to pause, play, and connect with your brand on their own terms.',
      },
      {
        title: 'Business Outcome',
        content:
          'Higher dwell time, stronger engagement metrics, and shareable moments that extend your event\'s reach far beyond the venue walls.',
      },
    ],
    highlights: [
      'Touchscreen kiosks & displays',
      'Gamification & quizzes',
      'Digital signage networks',
      'On-ground experiential builds',
      'Lead capture at touchpoints',
    ],
  },
  'ai-powered-experiences': {
    intro:
      'Intelligence woven into the fabric of your event — personalized, surprising, and designed to feel magical rather than mechanical.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'AI is most powerful when invisible — enhancing the experience without making technology the headline.',
      },
      {
        title: 'Attendee Experience',
        content:
          'From AI photo booths to personalized content recommendations, guests encounter moments that feel tailored, playful, and worth sharing.',
      },
      {
        title: 'Business Outcome',
        content:
          'AI-driven engagement generates rich data, social amplification, and differentiated experiences that competitors cannot easily replicate.',
      },
    ],
    highlights: [
      'AI photo booth experiences',
      'Personalized guest interactions',
      'Vision-based engagement',
      'Smart content delivery',
      'Real-time AI analytics',
    ],
  },
  'event-websites-applications': {
    intro:
      'Your event lives online before, during, and after the physical moment — unified in one digital companion experience.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'The digital layer of your event is where planning begins, engagement continues, and relationships are maintained post-event.',
      },
      {
        title: 'Attendee Experience',
        content:
          'Guests access schedules, maps, updates, and networking tools from any device — always in sync with what is happening on the ground.',
      },
      {
        title: 'Business Outcome',
        content:
          'A strong digital layer reduces on-site confusion, extends event lifespan, and provides a direct channel for communication and conversion.',
      },
    ],
    highlights: [
      'Event websites & landing pages',
      'Mobile event applications',
      'Venue navigation & maps',
      'Live schedule & push updates',
      'Post-event content hubs',
    ],
  },
  'analytics-event-intelligence': {
    intro:
      'Every interaction tells a story. We help you capture it, read it, and act on it — in real time and long after the event ends.',
    sections: [
      {
        title: 'Why It Matters',
        content:
          'Events generate enormous amounts of engagement data. Without the right systems, that insight disappears the moment the venue clears.',
      },
      {
        title: 'Attendee Experience',
        content:
          'While invisible to guests, intelligence systems enable smoother operations, faster support, and increasingly personalized touchpoints.',
      },
      {
        title: 'Business Outcome',
        content:
          'Clear ROI metrics, qualified lead pipelines, and post-event reports that justify investment and inform the next experience.',
      },
    ],
    highlights: [
      'Live event dashboards',
      'Lead capture & scoring',
      'Engagement heatmaps',
      'Session attendance analytics',
      'Automated post-event reporting',
    ],
  },
}

export const blogDetails: Record<
  string,
  {
    image: string
    body: string[]
  }
> = {
  'why-event-branding-starts-before-venue-doors-open': {
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1400&q=80',
    body: [
      'The most memorable events do not begin at the venue. They begin the moment an invitation arrives, a social post appears, or a colleague mentions the date. Event branding is the thread that connects these moments into a single feeling — anticipation.',
      'When branding is treated as an afterthought, the event feels assembled rather than designed. Guests notice the disconnect between a polished stage and a generic email. Sponsors feel underrepresented. Teams scramble to produce last-minute assets that never quite match.',
      'A unified visual system — spanning digital invitations, environmental graphics, stage design, and post-event content — creates coherence that guests feel even if they cannot articulate it. That coherence builds trust before anyone walks through the door.',
      'The best event brands are built early, applied consistently, and scaled across every touchpoint. That is when an event stops being a logistics exercise and starts being an experience.',
    ],
  },
  'designing-registration-that-disappears-into-the-experience': {
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
    body: [
      'Registration should be invisible. Not because it lacks importance, but because when it works perfectly, guests do not think about it at all — they simply arrive and the event begins.',
      'The friction points are predictable: long queues, manual lookups, badge reprints, and unclear signage. Each one erodes the emotional investment guests brought with them.',
      'QR check-in, self-service kiosks, and live command centers change the equation. Guests scan, receive their badge, and move forward. Operations teams see throughput in real time and adjust before problems become visible.',
      'When registration disappears into the experience, the event starts on the right note — every single time.',
    ],
  },
  'ai-at-events-beyond-the-photo-booth': {
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1400&q=80',
    body: [
      'AI at events is often reduced to a novelty — a photo booth with filters and a queue. But the technology is capable of far more when integrated thoughtfully into the experience ecosystem.',
      'Personalized content delivery, intelligent wayfinding, real-time translation, and adaptive signage are all within reach. The key is designing AI as an invisible layer that enhances human moments rather than replacing them.',
      'The events that get AI right treat it as a creative tool — one that generates shareable moments, captures rich engagement data, and surprises guests in ways that feel intentional rather than gimmicky.',
      'The photo booth is just the beginning. The future of AI at events is quieter, smarter, and deeply integrated into how experiences are designed and measured.',
    ],
  },
  'the-art-of-stage-design-in-corporate-celebrations': {
    image:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80',
    body: [
      'The stage is the emotional anchor of any corporate celebration. It is where attention converges, stories are told, and the brand speaks loudest.',
      'Great stage design goes beyond backdrop graphics. It considers sightlines, lighting transitions, motion content timing, and the rhythm of reveal moments that keep an audience of hundreds engaged for hours.',
      'When stage design aligns with the event\'s visual identity and narrative arc, winner announcements land with weight, keynote speakers feel authoritative, and the entire evening gains a cinematic quality.',
      'Corporate celebrations deserve the same design rigor as product launches. The stage is not a utility — it is the narrative center of the experience.',
    ],
  },
  'experiential-marketing-that-earns-attention-not-just-impressions': {
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80',
    body: [
      'Impressions measure exposure. Engagement measures impact. Experiential marketing should aim for the second — creating moments that earn attention rather than buying it.',
      'Interactive installations outperform passive displays at every exhibition because they invite participation. A guest who plays, touches, or creates something carries your brand story out of the venue and into their network.',
      'The design principle is simple: give people a reason to stop, a reason to stay, and a reason to share. When all three align, experiential marketing becomes the highest-ROI line item in the event budget.',
      'Attention is earned through design, not volume. The brands that understand this difference are the ones guests remember.',
    ],
  },
  'conference-experiences-that-people-actually-remember': {
    image:
      'https://images.unsplash.com/photo-1475721027889-d74a52b22810?auto=format&fit=crop&w=1400&q=80',
    body: [
      'Most conferences are well-run. Few are remembered. The difference is not budget — it is intention. Memorable conferences are designed as experiences, not agendas.',
      'The elements that stick are consistent: a strong visual identity, frictionless navigation, moments of surprise, and technology that serves the guest rather than showcasing itself.',
      'When branding, registration, content, and interactive layers work as one ecosystem, attendees leave with a feeling — not just a bag of materials and a LinkedIn connection request.',
      'The conferences people talk about months later are the ones where every detail felt connected to a single idea. That is experience design — and it is what separates good events from great ones.',
    ],
  },
}

export const industryDetails: Record<
  string,
  {
    intro: string
    sections: { title: string; content: string }[]
    highlights: string[]
  }
> = {
  'corporate-enterprise': {
    intro:
      'Internal events that align leadership vision with team culture — designed to feel premium, purposeful, and unmistakably on-brand.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Town halls, leadership summits, annual meetings, and employee celebrations with unified branding, seamless registration, and stage experiences that command attention.',
      },
      {
        title: 'Why It Works',
        content:
          'Corporate audiences expect polish. We combine creative production with event technology so internal events feel as considered as external brand moments.',
      },
    ],
    highlights: ['Leadership summits', 'Town halls & all-hands', 'Annual meetings', 'Award ceremonies', 'Internal brand activations'],
  },
  'healthcare-pharma': {
    intro:
      'Medical conferences and symposiums where clarity, compliance, and credibility are non-negotiable — and the experience still feels human.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Conference branding, registration systems, session navigation, and digital engagement layers built for healthcare audiences and regulatory environments.',
      },
      {
        title: 'Why It Works',
        content:
          'Complex information demands clear design. We create experiences that communicate with precision while maintaining warmth and trust.',
      },
    ],
    highlights: ['Medical conferences', 'Symposium branding', 'Speaker session systems', 'Attendee registration', 'Digital companion apps'],
  },
  'education-institutions': {
    intro:
      'Campus events and academic gatherings designed for engagement — convocations, conferences, and activations that honor tradition while feeling contemporary.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Convocation branding, academic conference systems, campus activations, and interactive installations that connect institutions with students and stakeholders.',
      },
      {
        title: 'Why It Works',
        content:
          'Educational events serve diverse audiences. We design flexible ecosystems that work for formal ceremonies and energetic student-facing activations alike.',
      },
    ],
    highlights: ['Convocations', 'Academic conferences', 'Campus activations', 'Alumni events', 'Interactive campus installations'],
  },
  'government-public-sector': {
    intro:
      'Public-facing events with the precision, protocol, and polish that government and institutional gatherings demand.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Ceremony branding, forum staging, registration with protocol considerations, and digital systems that support large-scale public events.',
      },
      {
        title: 'Why It Works',
        content:
          'Public sector events carry symbolic weight. We design experiences that reflect authority, accessibility, and national or institutional identity.',
      },
    ],
    highlights: ['Ceremonies & forums', 'Public conferences', 'Protocol-aware registration', 'Stage & signage systems', 'Multi-venue coordination'],
  },
  'technology-startups': {
    intro:
      'Product launches, demo days, and brand moments engineered for momentum — where speed, innovation, and shareability matter most.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Launch activations, demo day branding, interactive product experiences, AI-powered engagement, and digital layers that amplify reach.',
      },
      {
        title: 'Why It Works',
        content:
          'Tech audiences expect the unexpected. We build experiences that feel cutting-edge without sacrificing reliability on event day.',
      },
    ],
    highlights: ['Product launches', 'Demo days', 'Interactive kiosks', 'AI experiences', 'Launch event websites'],
  },
  'exhibitions-conferences': {
    intro:
      'Booth ecosystems, wayfinding, and interactive layers that keep audiences moving — and keep your brand at the center of the floor.',
    sections: [
      {
        title: 'What We Deliver',
        content:
          'Exhibition booth design, digital signage, gamification, lead capture, venue navigation, and registration systems scaled for high footfall.',
      },
      {
        title: 'Why It Works',
        content:
          'Exhibitions are competitive environments. We design ecosystems that stop traffic, capture leads, and extend engagement beyond the booth.',
      },
    ],
    highlights: ['Booth ecosystems', 'Exhibition graphics', 'Wayfinding systems', 'Lead capture', 'Interactive floor games'],
  },
}

export const technologyDetails: Record<
  string,
  {
    intro: string
    sections: { title: string; content: string }[]
    highlights: string[]
  }
> = {
  'touchscreen-kiosks': {
    intro: 'Self-service interfaces that put control in the guest\'s hands — registration, information, and interaction at scale.',
    sections: [
      { title: 'Use Cases', content: 'Registration, wayfinding, product demos, surveys, and gamified experiences deployed on robust touchscreen hardware.' },
      { title: 'Impact', content: 'Reduces staff load, speeds up guest flow, and creates tactile moments that feel modern and intuitive.' },
    ],
    highlights: ['Self-service registration', 'Interactive demos', 'On-site surveys', 'Branded UI design', 'Offline-capable systems'],
  },
  'qr-check-in-systems': {
    intro: 'Frictionless arrival experiences that process guests in seconds — not minutes.',
    sections: [
      { title: 'Use Cases', content: 'Pre-event QR invitations, on-site scanning stations, VIP fast lanes, and real-time attendance tracking.' },
      { title: 'Impact', content: 'Eliminates queue bottlenecks and gives operations teams live visibility into guest flow.' },
    ],
    highlights: ['QR invitations', 'Scan stations', 'Badge triggers', 'VIP flows', 'Live attendance data'],
  },
  'ai-photo-booths': {
    intro: 'AI-powered photo experiences that generate shareable moments and measurable social amplification.',
    sections: [
      { title: 'Use Cases', content: 'Branded AI photo booths with custom overlays, instant social sharing, and real-time usage analytics.' },
      { title: 'Impact', content: 'Creates the most shared moment of the event while capturing rich engagement data.' },
    ],
    highlights: ['Custom AI overlays', 'Instant sharing', 'Branded templates', 'Touch interface', 'Usage analytics'],
  },
  'led-wall-content': {
    intro: 'Cinematic visual content designed for LED stages, walls, and large-format displays that define the event atmosphere.',
    sections: [
      { title: 'Use Cases', content: 'Stage backdrops, opening sequences, award reveals, product launch visuals, and ambient loop content.' },
      { title: 'Impact', content: 'Transforms physical space into an immersive branded environment that photographs and films beautifully.' },
    ],
    highlights: ['Stage motion content', 'Award sequences', 'Launch visuals', 'Ambient loops', 'Multi-screen sync'],
  },
  'venue-navigation': {
    intro: 'Digital wayfinding that helps guests move confidently through complex venues and multi-track schedules.',
    sections: [
      { title: 'Use Cases', content: 'Interactive maps, session routing, mobile navigation, and digital signage at decision points.' },
      { title: 'Impact', content: 'Reduces confusion, improves session attendance, and lowers on-site support requests.' },
    ],
    highlights: ['Interactive maps', 'Session routing', 'Mobile wayfinding', 'Signage integration', 'Schedule sync'],
  },
  'event-websites': {
    intro: 'The digital front door of your event — where information, registration, and anticipation come together.',
    sections: [
      { title: 'Use Cases', content: 'Event landing pages, registration portals, speaker directories, schedules, and post-event content hubs.' },
      { title: 'Impact', content: 'Extends the event lifecycle and provides a always-on channel for communication and conversion.' },
    ],
    highlights: ['Landing pages', 'Registration portals', 'Speaker profiles', 'Live schedule', 'Post-event archive'],
  },
  'mobile-applications': {
    intro: 'Companion apps that keep guests connected to your event from pocket to venue and back.',
    sections: [
      { title: 'Use Cases', content: 'Event schedules, push notifications, networking, maps, live polls, and personalized agendas.' },
      { title: 'Impact', content: 'Increases engagement during the event and provides a direct post-event communication channel.' },
    ],
    highlights: ['Live schedules', 'Push updates', 'Venue maps', 'Networking tools', 'Personal agendas'],
  },
  'digital-signage': {
    intro: 'Dynamic display networks that adapt messaging across your venue in real time.',
    sections: [
      { title: 'Use Cases', content: 'Session updates, sponsor rotations, directional signage, social walls, and countdown timers.' },
      { title: 'Impact', content: 'Keeps venues feeling alive and informed without manual content swaps.' },
    ],
    highlights: ['Session displays', 'Sponsor loops', 'Directional signs', 'Social walls', 'Live countdowns'],
  },
  'interactive-games': {
    intro: 'Gamified experiences that turn passive booth visitors into active participants.',
    sections: [
      { title: 'Use Cases', content: 'Touchscreen quizzes, prize wheels, AR games, leaderboard challenges, and team competitions.' },
      { title: 'Impact', content: 'Increases dwell time, captures leads, and creates memorable brand interactions.' },
    ],
    highlights: ['Touchscreen games', 'Leaderboards', 'Prize mechanics', 'Lead integration', 'Brand customization'],
  },
  'live-dashboards': {
    intro: 'Real-time operational intelligence that keeps your team informed and responsive throughout the event.',
    sections: [
      { title: 'Use Cases', content: 'Registration throughput, zone capacity, session attendance, kiosk usage, and engagement metrics.' },
      { title: 'Impact', content: 'Enables proactive decisions before small issues become visible guest problems.' },
    ],
    highlights: ['Registration metrics', 'Zone monitoring', 'Session tracking', 'Kiosk analytics', 'Alert systems'],
  },
  'lead-capture': {
    intro: 'Systems that turn event interactions into qualified pipelines for sales and marketing teams.',
    sections: [
      { title: 'Use Cases', content: 'Kiosk forms, badge scanning, QR interactions, game completions, and session check-ins tied to CRM export.' },
      { title: 'Impact', content: 'Connects event ROI to revenue with data sales teams can act on immediately.' },
    ],
    highlights: ['Kiosk capture', 'Badge scanning', 'CRM export', 'Lead scoring', 'Follow-up automation'],
  },
  'motion-graphics': {
    intro: 'Animated content that brings event stages, screens, and digital touchpoints to life with rhythm and narrative.',
    sections: [
      { title: 'Use Cases', content: 'Show openers, transitions, award reveals, speaker intros, social content, and LED loop animations.' },
      { title: 'Impact', content: 'Adds cinematic quality to live moments and maintains visual energy between program segments.' },
    ],
    highlights: ['Show openers', 'Award sequences', 'Speaker intros', 'LED loops', 'Social cutdowns'],
  },
}
