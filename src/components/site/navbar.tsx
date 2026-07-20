'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { MagneticButton } from '@/components/site/magnetic-button'
import { ThemeToggle } from '@/components/site/theme-toggle'
import { contactDetails } from '@/lib/site-data'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Digital', href: '/digital-experiences' },
  { label: 'Insights', href: '/insights' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function AnimatedLabel({ text }: { text: string }) {
  return (
    <span className="group relative block overflow-hidden">
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {text}
      </span>
      <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {text}
      </span>
    </span>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-5" aria-hidden>
      <span
        className={cn(
          'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[cubic-bezier(0.2,0.65,0.3,0.9)]',
          open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0',
        )}
      />
      <span
        className={cn(
          'absolute left-0 top-1/2 block h-px w-full -translate-y-1/2 bg-current transition-all duration-300 ease-[cubic-bezier(0.2,0.65,0.3,0.9)]',
          open ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100',
        )}
      />
      <span
        className={cn(
          'absolute left-0 block h-px w-full bg-current transition-all duration-300 ease-[cubic-bezier(0.2,0.65,0.3,0.9)]',
          open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0',
        )}
      />
    </span>
  )
}

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__nebuloidLenis?.stop()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.__nebuloidLenis?.start()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <header
      data-scrolled={scrolled || mobileOpen}
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-500',
        scrolled || mobileOpen
          ? 'bg-black/55 backdrop-blur-xl'
          : 'bg-gradient-to-r from-black/70 via-black/30 to-[#8A6A0A]/30',
      )}
    >
      <div className="content-grid px-6 md:px-10 lg:px-16">
        <div className="relative z-20 flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="inline-flex shrink-0 items-center" onClick={() => setMobileOpen(false)}>
            <Image
              src="/assets/nebuloid-logo-mark.png"
              alt="Nebuloid Tech Studio"
              width={56}
              height={56}
              className="h-10 w-10 shrink-0 object-contain md:h-12 md:w-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-[#F1E9DB]"
              >
                <AnimatedLabel text={link.label} />
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#d4af37] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <MagneticButton
              size="default"
              onClick={() => router.push('/contact')}
            >
              Get In Touch <ArrowUpRight size={16} />
            </MagneticButton>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-full border text-[#F1E9DB] transition-colors duration-300',
                mobileOpen
                  ? 'border-[#d4af37]/50 text-[#d4af37]'
                  : 'border-white/20 hover:border-[#d4af37]/50 hover:text-[#d4af37]',
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-hidden border-t border-white/10 bg-[#090909]/97 backdrop-blur-2xl md:h-[calc(100dvh-5rem)] lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.12),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(241,233,219,0.05),transparent_40%)]" />

            <div className="relative flex h-full flex-col px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 md:px-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d4af37]">
                  Navigate
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#F1E9DB]/35">
                  {String(navLinks.length).padStart(2, '0')} pages
                </p>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {navLinks.map((link, index) => {
                    const active = isActivePath(pathname, link.href)

                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{
                          duration: 0.35,
                          delay: 0.04 + index * 0.045,
                          ease: [0.2, 0.65, 0.3, 0.9],
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'group flex items-center gap-4 py-3.5 transition-colors duration-300',
                            active ? 'text-[#d4af37]' : 'text-[#F1E9DB] active:text-[#d4af37]',
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          <span
                            className={cn(
                              'font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300',
                              active ? 'text-[#d4af37]' : 'text-[#F1E9DB]/35 group-hover:text-[#d4af37]/80',
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-display-filled flex-1 text-[clamp(2rem,9vw,3.25rem)] tracking-[0.04em] transition-transform duration-300 group-active:translate-x-1">
                            {link.label}
                          </span>
                          <ArrowUpRight
                            size={18}
                            className={cn(
                              'shrink-0 transition-all duration-300',
                              active
                                ? 'translate-x-0 opacity-100 text-[#d4af37]'
                                : 'translate-x-1 opacity-40 group-hover:translate-x-0 group-hover:opacity-100',
                            )}
                          />
                        </Link>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.28, ease: [0.2, 0.65, 0.3, 0.9] }}
                className="mt-5 shrink-0 space-y-4 border-t border-white/10 pt-5"
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F1E9DB] px-6 py-3.5 text-sm font-semibold text-[#090909] transition-transform duration-300 active:scale-[0.98]"
                >
                  Get In Touch
                  <ArrowUpRight size={16} />
                </Link>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href={contactDetails.emailHref}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[#d4af37]/35"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                      Email
                    </p>
                    <p className="mt-1 truncate text-sm text-[#F1E9DB]/75">
                      {contactDetails.email}
                    </p>
                  </a>
                  <a
                    href={contactDetails.phoneHref}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-[#d4af37]/35"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#d4af37]">
                      Call
                    </p>
                    <p className="mt-1 text-sm text-[#F1E9DB]/75">{contactDetails.phone}</p>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
