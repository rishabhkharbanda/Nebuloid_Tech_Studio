import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'
import { SiteFloatingActions } from '@/components/site/site-floating-actions'

type PageShellProps = {
  children: React.ReactNode
  withTopPadding?: boolean
}

export function PageShell({ children, withTopPadding = true }: PageShellProps) {
  return (
    <div className="relative overflow-clip bg-[#090909] text-[#F1E9DB]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#F1E9DB] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#090909]"
      >
        Skip to main content
      </a>
      <div className="grain-overlay" aria-hidden />
      <Navbar />
      <main id="main-content" className={withTopPadding ? 'pt-28' : undefined}>
        {children}
      </main>
      <Footer />
      <SiteFloatingActions />
    </div>
  )
}
