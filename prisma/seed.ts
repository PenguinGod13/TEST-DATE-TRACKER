import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

const SUBJECTS = [
  { name: 'IGCSE Physics', color: '#3b82f6', examBoard: 'Cambridge' },
  { name: 'IGCSE Chemistry', color: '#10b981', examBoard: 'Cambridge' },
  { name: 'IGCSE Biology', color: '#22c55e', examBoard: 'Cambridge' },
  { name: 'IGCSE English Literature', color: '#f59e0b', examBoard: 'Cambridge' },
  { name: 'AS Mathematics', color: '#8b5cf6', examBoard: 'Cambridge' },
  { name: 'IGCSE Design & Technology', color: '#ef4444', examBoard: 'Cambridge' },
]

const TOPICS: Record<string, string[]> = {
  'IGCSE Physics': ['Forces and Motion', 'Energy', 'Waves', 'Electricity', 'Magnetism', 'Nuclear Physics', 'Thermal Physics', 'Space Physics'],
  'IGCSE Chemistry': ['Atomic Structure', 'Bonding', 'Stoichiometry', 'Energetics', 'Kinetics', 'Equilibrium', 'Organic Chemistry', 'Electrochemistry'],
  'IGCSE Biology': ['Cell Biology', 'Nutrition', 'Respiration', 'Transport', 'Reproduction', 'Genetics', 'Evolution', 'Ecology'],
  'IGCSE English Literature': ['Poetry Analysis', 'Prose Analysis', 'Drama Analysis', 'Essay Writing', 'Unseen Texts', 'Context & Themes'],
  'AS Mathematics': ['Pure 1 – Algebra', 'Pure 1 – Coordinate Geometry', 'Pure 1 – Calculus', 'Pure 1 – Trigonometry', 'Statistics 1', 'Mechanics 1'],
  'IGCSE Design & Technology': ['Design Process', 'Materials', 'Manufacturing Techniques', 'CAD/CAM', 'Sustainability', 'Product Analysis'],
}

async function main() {
  console.log('Seeding subjects and topics...')
  for (const s of SUBJECTS) {
    const subject = await prisma.subject.upsert({
      where: { id: s.name },
      update: {},
      create: { id: s.name, name: s.name, color: s.color, examBoard: s.examBoard },
    })
    const topics = TOPICS[s.name] ?? []
    for (const t of topics) {
      await prisma.topic.upsert({
        where: { id: `${s.name}:${t}` },
        update: {},
        create: { id: `${s.name}:${t}`, name: t, subjectId: subject.id },
      })
    }
  }
  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
