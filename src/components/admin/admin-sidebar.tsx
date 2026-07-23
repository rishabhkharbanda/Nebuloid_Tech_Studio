'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  MonitorPlay,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/lib/auth/session'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/digital-experiences', label: 'Digital Experiences', icon: MonitorPlay },
  { href: '/admin/media', label: 'Media Library', icon: Images },
]

export function AdminSidebar({
  user,
  cmsEnabled,
}: {
  user: SessionUser
  cmsEnabled: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <aside className="border-b border-black/10 bg-white lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b45309]">
          Nebuloid
        </p>
        <h1 className="mt-1 text-lg font-semibold">Content Admin</h1>
        <p className="mt-1 text-xs text-[#6b7280]">
          {user.name} · {user.role}
          {!cmsEnabled ? ' · offline mode' : ''}
        </p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-4 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const active =
            link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href)
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition',
                active
                  ? 'bg-[#111827] text-white'
                  : 'text-[#374151] hover:bg-black/5',
              )}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#374151] hover:bg-black/5 lg:mt-4"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </nav>
    </aside>
  )
}
