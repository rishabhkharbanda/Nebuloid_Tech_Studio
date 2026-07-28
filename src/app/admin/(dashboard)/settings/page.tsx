import { SiteSettingsEditor } from '@/components/admin/site-settings-editor'

export default function AdminSiteSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b45309]">
          Site
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-[#111827]">Site Settings</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#6b7280]">
          Manage floating WhatsApp and other site-wide options. Changes apply on the public site
          without redeploying code.
        </p>
      </div>
      <SiteSettingsEditor />
    </div>
  )
}
