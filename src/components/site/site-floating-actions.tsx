import { FloatingChatbot } from '@/components/site/floating-chatbot'
import { WhatsAppFloatingButton } from '@/components/site/whatsapp-floating-button'
import { getSiteSettings } from '@/lib/cms/site-settings'

export async function SiteFloatingActions() {
  const settings = await getSiteSettings()
  return (
    <>
      <WhatsAppFloatingButton settings={settings} />
      <FloatingChatbot />
    </>
  )
}
