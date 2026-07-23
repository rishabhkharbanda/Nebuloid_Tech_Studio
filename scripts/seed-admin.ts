import { config } from 'dotenv'
config({ path: '.env.local' })
config()

import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { getDb, hasDatabase } from '../src/db/client'
import { adminUsers, digitalExperienceCards } from '../src/db/schema'
import { hashPassword } from '../src/lib/auth/password'
import { digitalProjects } from '../src/lib/digital-data'

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

  await seedDigitalExperienceCards()
}

function projectToCardValues(
  project: (typeof digitalProjects)[number],
  index: number,
  now: Date,
) {
  const interactive =
    'interactiveExperiences' in project ? { ...project.interactiveExperiences } : {}
  return {
    slug: project.slug,
    title: project.title,
    shortDescription: project.overview,
    overview: project.overview,
    subtitle: 'subtitle' in project ? project.subtitle : '',
    imageUrl: project.image,
    imageAlt: project.client,
    iconUrl: '',
    ctaText: 'View Case Study',
    ctaHref: `/digital-experiences/${project.slug}`,
    category: project.category,
    clientLabel: project.client,
    displayOrder: index,
    enabled: true,
    status: 'published' as const,
    galleryTitle: 'galleryTitle' in project ? project.galleryTitle : '',
    galleryHeading: 'galleryHeading' in project ? project.galleryHeading : '',
    galleryAspect: 'galleryAspect' in project ? project.galleryAspect : '',
    gallery: 'gallery' in project ? [...project.gallery] : [],
    contribution: [...project.contribution],
    interactiveExperiences: interactive,
    techStack: [...project.techStack],
    impact: [...project.impact],
    metaTitle: project.title,
    metaDescription: project.overview.slice(0, 160),
    previewToken: nanoid(24),
    publishedAt: now,
    updatedAt: now,
  }
}

async function seedDigitalExperienceCards() {
  const db = getDb()
  const now = new Date()
  let inserted = 0
  let upgraded = 0

  for (const [index, project] of digitalProjects.entries()) {
    const values = projectToCardValues(project, index, now)
    const [existing] = await db
      .select()
      .from(digitalExperienceCards)
      .where(eq(digitalExperienceCards.slug, project.slug))
      .limit(1)

    if (!existing) {
      await db.insert(digitalExperienceCards).values({
        id: nanoid(),
        ...values,
        createdAt: now,
      })
      inserted += 1
      continue
    }

    const needsCaseStudy =
      (existing.gallery?.length ?? 0) === 0 &&
      (existing.contribution?.length ?? 0) === 0 &&
      (existing.impact?.length ?? 0) === 0

    if (needsCaseStudy) {
      await db
        .update(digitalExperienceCards)
        .set({
          ...values,
          previewToken: existing.previewToken || values.previewToken,
          createdAt: existing.createdAt,
        })
        .where(eq(digitalExperienceCards.id, existing.id))
      upgraded += 1
    }
  }

  console.log(
    `Digital experiences seed: inserted ${inserted}, upgraded case-study fields on ${upgraded}.`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
