import { Footer } from '@/components/site/footer'
import { Navbar } from '@/components/site/navbar'

type PageShellProps = {
  children: React.ReactNode
  withTopPadding?: boolean
}

export function PageShell({ children, withTopPadding = true }: PageShellProps) {
  return (
    <div className="relative overflow-clip bg-[#090909] text-[#F1E9DB]">
      <div className="grain-overlay" />
      <Navbar />
      <main className={withTopPadding ? 'pt-28' : undefined}>{children}</main>
      <Footer />
    </div>
  )
}
