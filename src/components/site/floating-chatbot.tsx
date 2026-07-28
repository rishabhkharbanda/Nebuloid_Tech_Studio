'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'
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
  "Hi! I'm the Nebuloid assistant. Ask about our experiences, digital work, or how we can help with your next event."

/** Floating AI chat grounded on Nebuloid website content via Gemini. */
export function FloatingChatbot() {
  const theme = useTheme()
  const isDay = theme === 'day'
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
          data-lenis-prevent
          className={cn(
            'fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-[80] flex h-[min(70vh,36rem)] w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl sm:right-6',
            isDay
              ? 'border-black/10 bg-[#f4f0e7]/96 text-[#181712]'
              : 'border-white/12 bg-[#111111]/95 text-[#F1E9DB]',
          )}
          role="dialog"
          aria-label="AI assistant chat"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          <div
            className={cn(
              'flex shrink-0 items-center justify-between border-b px-4 py-3',
              isDay ? 'border-black/10' : 'border-white/10',
            )}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#d4af37]">
                <Sparkles size={16} />
              </span>
              <div>
                <p className={cn('text-sm font-semibold', isDay ? 'text-[#181712]' : 'text-[#F1E9DB]')}>
                  Nebuloid Assistant
                </p>
                <p
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-[0.14em]',
                    isDay ? 'text-[#181712]/45' : 'text-[#F1E9DB]/45',
                  )}
                >
                  Site knowledge
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-full p-1.5 transition hover:text-[#d4af37]',
                isDay ? 'text-[#181712]/50' : 'text-[#F1E9DB]/50',
              )}
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          <div
            ref={listRef}
            data-lenis-prevent
            className="min-h-0 flex-1 touch-pan-y space-y-3 overflow-y-auto overscroll-contain px-4 py-4 [-webkit-overflow-scrolling:touch]"
            onWheel={(event) => event.stopPropagation()}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'rounded-2xl px-3 py-2.5 text-sm leading-relaxed',
                  message.role === 'assistant'
                    ? isDay
                      ? 'bg-black/[0.04] text-[#181712]/85'
                      : 'bg-white/[0.05] text-[#F1E9DB]/80'
                    : 'ml-8 bg-[#d4af37]/15 text-inherit',
                )}
              >
                <p className="whitespace-pre-wrap">{message.text}</p>

                {message.role === 'assistant' && message.links && message.links.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    <p
                      className={cn(
                        'font-mono text-[10px] uppercase tracking-[0.14em]',
                        isDay ? 'text-[#181712]/40' : 'text-[#F1E9DB]/40',
                      )}
                    >
                      Related pages
                    </p>
                    {message.links.map((link) => (
                      <Link
                        key={link.url}
                        href={link.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-start justify-between gap-2 rounded-xl border px-3 py-2 transition hover:border-[#d4af37]/40',
                          isDay
                            ? 'border-black/10 bg-black/[0.03] hover:bg-black/[0.06]'
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]',
                        )}
                      >
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-[#d4af37]">
                            {link.category}
                          </span>
                          <span
                            className={cn(
                              'mt-0.5 block text-sm',
                              isDay ? 'text-[#181712]' : 'text-[#F1E9DB]',
                            )}
                          >
                            {link.title}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={14}
                          className={cn(
                            'mt-1 shrink-0',
                            isDay ? 'text-[#181712]/45' : 'text-[#F1E9DB]/45',
                          )}
                        />
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
              <div
                className={cn(
                  'rounded-2xl px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em]',
                  isDay
                    ? 'bg-black/[0.04] text-[#181712]/45'
                    : 'bg-white/[0.05] text-[#F1E9DB]/45',
                )}
              >
                Thinking…
              </div>
            ) : null}
          </div>

          <div className={cn('shrink-0 border-t p-3', isDay ? 'border-black/10' : 'border-white/10')}>
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
                className={cn(
                  'min-h-[2.75rem] flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-[#d4af37]/45 disabled:opacity-60',
                  isDay
                    ? 'border-black/12 bg-black/[0.03] text-[#181712] placeholder:text-[#181712]/35'
                    : 'border-white/12 bg-white/[0.03] text-[#F1E9DB] placeholder:text-[#F1E9DB]/35',
                )}
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
        className={cn(
          'fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[80] inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#d4af37]/35 text-[#d4af37] shadow-lg backdrop-blur-md transition hover:scale-105 hover:border-[#d4af37]/60 sm:right-6',
          isDay ? 'bg-[#f4f0e7]/95' : 'bg-[#111111]/90',
        )}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={open}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
