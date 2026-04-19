import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0])

const SUBJECTS = [
  { id: 'physics',    name: 'IGCSE Physics',             color: '#3b82f6', examBoard: 'Cambridge' },
  { id: 'chemistry',  name: 'IGCSE Chemistry',            color: '#10b981', examBoard: 'Cambridge' },
  { id: 'biology',    name: 'IGCSE Biology',              color: '#22c55e', examBoard: 'Cambridge' },
  { id: 'english',    name: 'IGCSE English Literature',   color: '#f59e0b', examBoard: 'Cambridge' },
  { id: 'maths',      name: 'AS Mathematics',             color: '#8b5cf6', examBoard: 'Cambridge' },
  { id: 'dt',         name: 'IGCSE Design & Technology',  color: '#ef4444', examBoard: 'Cambridge' },
]

const TOPICS: Record<string, string[]> = {
  physics: [
    'Motion, Forces and Energy',
    'Thermal Physics',
    'Waves',
    'Light and Optics',
    'Sound',
    'Electricity',
    'Magnetism and Electromagnetism',
    'Nuclear Physics',
    'Space Physics',
  ],
  chemistry: [
    'States of Matter',
    'Atoms, Elements and Compounds',
    'Atomic Structure and Bonding',
    'Stoichiometry and Moles',
    'Redox Reactions',
    'Electricity and Chemical Change',
    'Energy Changes in Reactions',
    'Rate of Reaction',
    'Reversible Reactions and Equilibrium',
    'Acids, Bases and Salts',
    'The Periodic Table',
    'Metals and Extraction',
    'Chemistry of the Environment',
    'Organic Chemistry',
    'Polymers',
    'Separation and Purification',
  ],
  biology: [
    'Characteristics and Classification of Living Organisms',
    'Cell Structure and Organisation',
    'Movement into and out of Cells',
    'Biological Molecules',
    'Enzymes',
    'Plant Nutrition',
    'Human Nutrition',
    'Transport in Plants',
    'Transport in Animals',
    'Diseases and Immunity',
    'Gas Exchange in Humans',
    'Respiration',
    'Excretion in Humans',
    'Coordination and Response',
    'Reproduction',
    'Inheritance',
    'Variation and Natural Selection',
    'Organisms and Their Environment',
    'Human Influences on Ecosystems',
    'Biotechnology and Genetic Modification',
  ],
  english: [
    'Poetry Analysis',
    'Prose Analysis',
    'Drama Analysis',
    'Unseen Texts',
    'Essay Writing and Literary Criticism',
    'Theme Analysis',
    'Language and Structure',
    'Character Development',
  ],
  maths: [
    'P1: Quadratics and Discriminant',
    'P1: Functions and Domain/Range',
    'P1: Graph Transformations',
    'P1: Coordinate Geometry and Circles',
    'P1: Radians and Circular Measure',
    'P1: Trigonometric Equations and Identities',
    'P1: Arithmetic and Geometric Series',
    'P1: Binomial Expansion',
    'P1: Differentiation',
    'P1: Integration',
    'S1: Data Representation',
    'S1: Descriptive Statistics',
    'S1: Probability',
    'S1: Permutations and Combinations',
    'S1: Discrete Random Variables',
    'S1: Binomial and Geometric Distributions',
    'S1: Normal Distribution',
    'M1: Kinematics (SUVAT)',
    'M1: Forces and Equilibrium',
    'M1: Friction and Inclined Planes',
    'M1: Connected Particles and Pulleys',
    'M1: Work, Energy and Power',
  ],
  dt: [
    'Design Process and Analysis',
    'Product Design Requirements',
    'Materials and Their Properties',
    'Systems and Control',
    'Construction and Joining Techniques',
    'CAD/CAM and Digital Tools',
    'Graphics and Technical Drawing',
    'Sustainability and Environmental Impact',
    'Practical Making Skills',
  ],
}

async function main() {
  console.log('Seeding subjects and topics...')

  // Clear existing data first to avoid stale IDs
  await prisma.topic.deleteMany()
  await prisma.subject.deleteMany()

  for (const s of SUBJECTS) {
    const subject = await prisma.subject.create({
      data: { id: s.id, name: s.name, color: s.color, examBoard: s.examBoard },
    })
    const topics = TOPICS[s.id] ?? []
    for (const t of topics) {
      await prisma.topic.create({
        data: { name: t, subjectId: subject.id },
      })
    }
  }
  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
