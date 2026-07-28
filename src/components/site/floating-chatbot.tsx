'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ChatLink = {
  title: string
  url: string
  category: string
}

type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
  links?: ChatLink[]
  showContact?: boolean
}

const WELCOME =
  "Hi! I'm the Nebuloid assistant. Ask about our experiences, digital work, or how we can help with your next event — I'll answer from what's on this site."

/** Floating AI chat grounded on Nebuloid website content via Gemini. */
export function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', text: WELCOME },
  ])
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('textarea')?.focus()
  }, [open])

  useEffect(() => {
    if (open) {
      document.documentElement.setAttribute('data-chat-open', '')
    } else {
      document.documentElement.removeAttribute('data-chat-open')
    }
    return () => document.documentElement.removeAttribute('data-chat-open')
  }, [open])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    list.scrollTop = list.scrollHeight
  }, [messages, pending])

  async function send() {
    const text = input.trim()
    if (!text || pending) return

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setPending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== 'welcome')
            .map((message) => ({ role: message.role, text: message.text })),
        }),
      })
      const data = (await res.json()) as {
        reply?: string
        error?: string
        links?: ChatLink[]
        showContact?: boolean
      }
      if (!res.ok) {
        throw new Error(data.error || 'Chat request failed')
      }
      const links = data.links ?? []
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text:
            data.reply?.trim() ||
            'I could not find that on the site. Reach us via Contact and our team will help.',
          links,
          showContact: links.length === 0 ? true : Boolean(data.showContact),
        },
      ])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text:
            error instanceof Error
              ? `${error.message} You can also reach us via Contact.`
              : 'Something went wrong. Please try Contact Us.',
          showContact: true,
          links: [],
        },
      ])
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          className="theme-preserve-dark fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-[80] flex h-[min(70vh,36rem)] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#111111]/95 shadow-2xl backdrop-blur-xl sm:right-6"
          role="dialog"
          aria-label="AI assistant chat"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#F1E9DB]">Nebuloid Assistant</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/45">
                  Site knowledge
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-[#F1E9DB]/50 hover:text-[#d4af37]"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'rounded-2xl px-3 py-2.5 text-sm leading-relaxed',
                  message.role === 'assistant'
                    ? 'bg-white/[0.05] text-[#F1E9DB]/80'
                    : 'ml-8 bg-[#d4af37]/15 text-[#F1E9DB]',
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>

                {message.role === 'assistant' && message.links && message.links.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#F1E9DB]/40">
                      Related pages
                    </p>
                    {message.links.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        onClick={() => setOpen(false)}
                        className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-[#d4af37]/40 hover:bg-white/[0.06]"
                      >
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4af37]">
                            {link.category}
                          </span>
                          <span className="mt-0.5 block text-sm text-[#F1E9DB]">{link.title}</span>
                        </span>
                        <ArrowUpRight size={14} className="mt-1 shrink-0 text-[#F1E9DB]/45" />
                      </Link>
                    ))}
                  </div>
                ) : null}

                {message.role === 'assistant' && message.showContact ? (
                  <Link
                    href="/contact"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 px-3.5 py-2 text-sm font-medium text-[#d4af37] transition hover:bg-[#d4af37]/25"
                  >
                    Contact Us
                    <ArrowUpRight size={14} />
                  </Link>
                ) : null}
              </div>
            ))}
            {pending ? (
              <div className="rounded-2xl bg-white/[0.05] px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#F1E9DB]/45">
                Thinking…
              </div>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-white/10 p-3">
            <div className="flex items-end gap-2">
              <textarea
                rows={2}
                value={input}
                disabled={pending}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    void send()
                  }
                }}
                placeholder="Ask about our work…"
                className="min-h-[2.75rem] flex-1 resize-none rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 text-sm text-[#F1E9DB] outline-none placeholder:text-[#F1E9DB]/35 focus:border-[#d4af37]/45 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={pending || !input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#d4af37] text-[#111111] transition hover:bg-[#e8c65a] disabled:opacity-50"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="theme-preserve-dark fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/35 bg-[#111111]/90 text-[#d4af37] shadow-lg backdrop-blur-md transition hover:scale-105 hover:border-[#d4af37]/60 sm:right-6"
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
