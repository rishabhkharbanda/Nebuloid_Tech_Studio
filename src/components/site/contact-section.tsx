'use client'

import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { SectionReveal } from '@/components/site/section-reveal'
import { MagneticButton } from '@/components/site/magnetic-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const contactDetails = [
  {
    label: 'Office Address',
    icon: MapPin,
    content: (
      <>
        H no. : 944, Block - C, Sushant Lok 1
        <br />
        Gurugram, Haryana, India, 122001
      </>
    ),
  },
  {
    label: 'Phone',
    icon: Phone,
    content: (
      <a
        href="tel:+917303922260"
        className="transition-colors hover:text-[#d4af37]"
      >
        +91 7303922260
      </a>
    ),
  },
  {
    label: 'Email',
    icon: Mail,
    content: (
      <a
        href="mailto:nebuloidtechstudio1@gmail.com"
        className="break-all transition-colors hover:text-[#d4af37]"
      >
        nebuloidtechstudio1@gmail.com
      </a>
    ),
  },
] as const

export function ContactSection() {
  return (
    <section id="contact" className="section-padding">
      <div className="content-grid">
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Contact
          </p>
          <h2 className="mt-4 max-w-5xl text-display-filled text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-[0.02em] text-[#F1E9DB]">
            Let&apos;s Build Something Amazing.
          </h2>
          <p className="mt-6 max-w-xl text-base text-[#F1E9DB]/60 md:text-lg">
            Tell us about your project and we&apos;ll get back within one business
            day.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-14 border-y border-white/10">
          <div className="grid gap-12 py-12 md:grid-cols-12 md:gap-16 md:py-16 lg:py-20">
            {/* Contact info */}
            <div className="md:col-span-4 lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F1E9DB]/45">
                Get in Touch
              </p>

              <div className="mt-8 divide-y divide-white/10">
                {contactDetails.map((item) => (
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

            {/* Form */}
            <form className="md:col-span-8 lg:col-span-7">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Your Name
                  </label>
                  <Input id="name" name="name" placeholder="John Doe" />
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
                    placeholder="you@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="company"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Company
                  </label>
                  <Input id="company" name="company" placeholder="Company name" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="project-type"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Project Type
                  </label>
                  <Input
                    id="project-type"
                    name="project-type"
                    placeholder="Website, App, Event..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="message"
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your vision, goals, and timeline..."
                    className="min-h-44"
                  />
                </div>
              </div>

              <div className="mt-10 border-t border-white/10 pt-10">
                <MagneticButton
                  type="submit"
                  variant="default"
                  size="lg"
                  className="group h-16 w-full gap-3 px-10 text-base font-semibold tracking-wide shadow-[0_0_36px_rgba(241,233,219,0.18)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#d4af37] hover:text-[#090909] hover:shadow-[0_0_48px_rgba(212,175,55,0.45)] md:w-auto md:min-w-[300px]"
                >
                  Send Inquiry
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#090909]/10 transition-colors group-hover:bg-[#090909]/15">
                    <ArrowUpRight size={18} />
                  </span>
                </MagneticButton>
              </div>
            </form>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
