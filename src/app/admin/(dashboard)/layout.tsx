import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth/session'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { hasDatabase } from '@/db/client'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect('/admin/login')

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <AdminSidebar user={user} cmsEnabled={hasDatabase()} />
      <div className="min-w-0">
        {!hasDatabase() ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900">
            CMS database is not configured. Set <code>DATABASE_URL</code>, run migrations, and
            seed an admin user. Public site continues using static content.
          </div>
        ) : null}
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  )
}
