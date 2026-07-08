import { SectionReveal } from '@/components/site/section-reveal'

export function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="content-grid grid gap-12 lg:grid-cols-12">
        <SectionReveal className="lg:col-span-7">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
            Why Nebuloid
          </p>
          <h2 className="mt-4 text-[clamp(2.3rem,6.5vw,7rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            We don&apos;t plan events.
            <br />
            <span className="text-gradient-gold">We create experiences.</span>
          </h2>
        </SectionReveal>
        <SectionReveal delay={0.15} className="lg:col-span-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-[#F1E9DB]/78 md:p-10">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#d4af37]">
              Our Philosophy
            </p>
            <p className="mt-6 leading-relaxed">
              Nebuloid Tech Studio exists because events deserve more than
              logistics and more than software. We are a creative technology
              partner — designing complete event ecosystems where branding, motion,
              interactive installations, and digital systems work as one.
            </p>
            <p className="mt-4 leading-relaxed">
              Every touchpoint has intent. Every interaction has purpose. Every
              experience is built to be remembered.
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
