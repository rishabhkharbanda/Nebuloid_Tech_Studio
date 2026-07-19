'use client'

import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { SectionReveal } from '@/components/site/section-reveal'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { contactDetails, industries } from '@/lib/site-data'

const contactItems = [
  {
    label: 'Office Address',
    icon: MapPin,
    content: (
      <>
        {contactDetails.address.lines[0]}
        <br />
        {contactDetails.address.lines[1]}
      </>
    ),
  },
  {
    label: 'Phone',
    icon: Phone,
    content: (
      <a
        href={contactDetails.phoneHref}
        className="transition-colors hover:text-[#d4af37]"
      >
        {contactDetails.phone}
      </a>
    ),
  },
  {
    label: 'Email',
    icon: Mail,
    content: (
      <a
        href={contactDetails.emailHref}
        className="break-all transition-colors hover:text-[#d4af37]"
      >
        {contactDetails.email}
      </a>
    ),
  },
] as const

const eventTypes = [
  'Corporate Event',
  'Conference',
  'Exhibition',
  'Product Launch',
  'Awards Night',
  'Trade Show',
  'Brand Activation',
  'Private Event',
  'Other',
] as const

const budgetRanges = [
  'Under ₹5 Lakh',
  '₹5–15 Lakh',
  '₹15–50 Lakh',
  '₹50 Lakh – ₹1 Crore',
  'Above ₹1 Crore',
  'Prefer not to say',
] as const

const timelines = [
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  '6+ months',
  'Flexible / Exploring',
] as const

const industryOptions: string[] = [
  ...industries
    .filter((industry) => industry.slug !== 'more-sectors')
    .map((industry) => industry.title),
  'Corporate',
  'Healthcare',
  'Education',
  'Government',
  'Other',
]

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [feedback, setFeedback] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setFeedback('')

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          eventType: data.get('event-type'),
          industry: data.get('industry'),
          budget: data.get('budget'),
          timeline: data.get('timeline'),
          message: data.get('message'),
        }),
      })

      const result = (await response.json()) as { ok?: boolean; message?: string; error?: string }

      if (!response.ok || !result.ok) {
        setStatus('error')
        setFeedback(result.error || 'Unable to submit right now. Please try again.')
        return
      }

      setStatus('success')
      setFeedback(result.message || 'Thank you. Nebuloid will respond within one business day.')
      form.reset()
    } catch {
      setStatus('error')
      setFeedback('Unable to submit right now. Please try again.')
    }
  }

  return (
    <section id="contact" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Contact
          </p>
          <h1 className="mt-4 max-w-5xl text-display-filled text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-[0.02em] text-[#F1E9DB]">
            Let&apos;s Create Your Next Experience.
          </h1>
          <p className="mt-6 max-w-xl text-base text-[#F1E9DB]/60 md:text-lg">
            Share your vision, timeline, and audience. Nebuloid will respond within
            one business day with ideas worth exploring.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-14 border-y border-white/10">
          <div className="grid gap-12 py-12 md:grid-cols-12 md:gap-16 md:py-16 lg:py-20">
            <div className="md:col-span-4 lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                Start a Collaboration
              </p>

              <div className="mt-8 divide-y divide-white/10">
                {contactItems.map((item) => (
                  <div key={item.label} className="py-7 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <item.icon size={14} className="text-[#d4af37]" />
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d4af37]">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#F1E9DB]/75 md:text-base">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <form className="md:col-span-8 lg:col-span-7" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Your Name
                  </label>
                  <Input id="name" name="name" placeholder="Your Name" required />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Organization
                  </label>
                  <Input id="company" name="company" placeholder="Organization" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="event-type"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Event Type
                  </label>
                  <Select id="event-type" name="event-type" defaultValue="" required>
                    <option value="" disabled>
                      Select event type
                    </option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type} className="bg-[#090909] text-[#F1E9DB]">
                        {type}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="industry"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Industry
                  </label>
                  <Select id="industry" name="industry" defaultValue="">
                    <option value="" disabled>
                      Select industry
                    </option>
                    {industryOptions.map((industry) => (
                      <option
                        key={industry}
                        value={industry}
                        className="bg-[#090909] text-[#F1E9DB]"
                      >
                        {industry}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="budget"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Budget Range
                  </label>
                  <Select id="budget" name="budget" defaultValue="">
                    <option value="" disabled>
                      Select budget range
                    </option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range} className="bg-[#090909] text-[#F1E9DB]">
                        {range}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="timeline"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Timeline
                  </label>
                  <Select id="timeline" name="timeline" defaultValue="">
                    <option value="" disabled>
                      Select timeline
                    </option>
                    {timelines.map((timeline) => (
                      <option
                        key={timeline}
                        value={timeline}
                        className="bg-[#090909] text-[#F1E9DB]"
                      >
                        {timeline}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="message"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Project Brief
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Share the event goals, audience, venue, and any must-have experiences..."
                    className="min-h-44"
                    required
                  />
                </div>
              </div>

              <div className="mt-10 border-t border-white/10 pt-10">
                <MagneticButton
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={status === 'submitting'}
                  className="group h-16 w-full gap-3 px-10 text-base font-semibold tracking-wide shadow-[0_0_36px_rgba(241,233,219,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#d4af37] hover:text-[#090909] hover:shadow-[0_0_48px_rgba(212,175,55,0.45)] disabled:pointer-events-none disabled:opacity-60 md:w-auto md:min-w-[300px]"
                >
                  {status === 'submitting' ? 'Sending...' : 'Begin the Conversation'}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#090909]/10 transition-colors group-hover:bg-[#090909]/15">
                    <ArrowUpRight size={18} />
                  </span>
                </MagneticButton>

                {feedback && (
                  <p
                    className={`mt-5 text-sm ${
                      status === 'success' ? 'text-[#d4af37]' : 'text-red-300'
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {feedback}
                  </p>
                )}
              </div>
            </form>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
