'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function toggleTopic(topicId: string, completed: boolean) {
  await prisma.topic.update({ where: { id: topicId }, data: { completed } })
  revalidatePath('/', 'layout')
}

export async function setExamDate(subjectId: string, date: string) {
  await prisma.subject.update({
    where: { id: subjectId },
    data: { examDate: date ? new Date(date) : null },
  })
  revalidatePath('/', 'layout')
}

export async function addSession(data: {
  subjectId: string
  date: string
  durationMin: number
  notes?: string
}) {
  await prisma.session.create({
    data: {
      subjectId: data.subjectId,
      date: new Date(data.date),
      durationMin: data.durationMin,
      notes: data.notes,
    },
  })
  revalidatePath('/', 'layout')
}

export async function toggleSession(sessionId: string, completed: boolean) {
  await prisma.session.update({ where: { id: sessionId }, data: { completed } })
  revalidatePath('/', 'layout')
}

export async function deleteSession(sessionId: string) {
  await prisma.session.delete({ where: { id: sessionId } })
  revalidatePath('/', 'layout')
}

export async function addMockTest(data: {
  subjectId: string
  date: string
  score?: number
  maxScore?: number
  notes?: string
}) {
  await prisma.mockTest.create({
    data: {
      subjectId: data.subjectId,
      date: new Date(data.date),
      score: data.score ?? null,
      maxScore: data.maxScore ?? null,
      notes: data.notes,
    },
  })
  revalidatePath('/', 'layout')
}

export async function deleteMockTest(id: string) {
  await prisma.mockTest.delete({ where: { id } })
  revalidatePath('/', 'layout')
}
