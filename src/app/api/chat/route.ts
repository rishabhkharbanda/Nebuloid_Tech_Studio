import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'
import {
  buildChatKnowledge,
  formatKnowledgeForPrompt,
  pickChatLinks,
  retrieveChatKnowledge,
} from '@/lib/chat-knowledge'

export const runtime = 'nodejs'
export const maxDuration = 30

type ChatRole = 'user' | 'assistant'
type IncomingMessage = { role: ChatRole; text: string }

const SYSTEM_RULES = `You are the Nebuloid Tech Studio website assistant.
Answer using ONLY the SITE CONTEXT provided below.
If the answer is not clearly supported by the context, say you do not have that detail on the site and recommend contacting the team.
Keep replies concise (2–5 short sentences).
Do not invent pricing, timelines, client names, or capabilities that are not in the context.
Do not paste raw URLs in the reply — page links are shown separately in the chat UI.
Tone: professional, clear, and helpful.`

function getApiKey() {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    ''
  )
}

/** gemini-2.0-flash is shut down; override with GEMINI_MODEL if needed. */
function getChatModelId() {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'
}

function looksUncertain(reply: string) {
  return /do not have|don't have|could not find|couldn't find|not (clearly )?on (the )?site|no matching|i'?m not (sure|able)|outside (of )?what/i.test(
    reply,
  )
}

export async function POST(request: Request) {
  const apiKey = getApiKey()
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          'Gemini is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to the environment.',
      },
      { status: 503 },
    )
  }

  let body: { messages?: IncomingMessage[] }
  try {
    body = (await request.json()) as { messages?: IncomingMessage[] }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const messages = (body.messages ?? [])
    .filter(
      (message) =>
        message?.text?.trim() && (message.role === 'user' || message.role === 'assistant'),
    )
    .slice(-12)

  const latestUser = [...messages].reverse().find((message) => message.role === 'user')
  if (!latestUser) {
    return NextResponse.json({ error: 'A user message is required.' }, { status: 400 })
  }

  try {
    const knowledge = await buildChatKnowledge()
    const { matches, hasStrongMatch } = retrieveChatKnowledge(knowledge, latestUser.text, 8)
    const context = formatKnowledgeForPrompt(matches)
    const links = hasStrongMatch ? pickChatLinks(matches, 3) : []

    const history = messages
      .map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.text}`)
      .join('\n')

    const google = createGoogleGenerativeAI({ apiKey })
    const { text } = await generateText({
      model: google(getChatModelId()),
      prompt: `${SYSTEM_RULES}

SITE CONTEXT:
${context}

CONVERSATION:
${history}

Assistant:`,
    })

    const reply =
      text.trim() ||
      'I could not find that on the site. Use Contact Us and our team will help.'
    const uncertain = looksUncertain(reply)
    const showContact = !hasStrongMatch || links.length === 0 || uncertain

    return NextResponse.json({
      reply,
      links,
      showContact,
    })
  } catch (error) {
    console.error('[chat]', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate a reply. Please try again.',
        showContact: true,
        links: [],
      },
      { status: 500 },
    )
  }
}
