import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '../src/db/client'
import { adminUsers } from '../src/db/schema'
import { hashPassword } from '../src/lib/auth/password'

async function main() {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is required to seed the CMS admin user.')
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@nebuloidtechstudio.com').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!123'
  const name = process.env.ADMIN_NAME || 'Nebuloid Admin'

  if (password.length < 12) {
    throw new Error('ADMIN_PASSWORD must be at least 12 characters.')
  }

  const db = getDb()
  const passwordHash = await hashPassword(password)
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1)

  if (existing[0]) {
    await db
      .update(adminUsers)
      .set({
        name,
        passwordHash,
        role: 'admin',
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, existing[0].id))
    console.log(`Updated admin user: ${email}`)
  } else {
    await db.insert(adminUsers).values({
      id: nanoid(),
      email,
      name,
      passwordHash,
      role: 'admin',
    })
    console.log(`Created admin user: ${email}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
