import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { pin } = body

    if (!pin) {
      return NextResponse.json(
        { error: 'PIN required' },
        { status: 400 }
      )
    }

    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
      select: { pin: true },
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    const isValid = poll.pin === pin

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    console.error('Verify PIN error:', error)
    return NextResponse.json(
      { error: 'Failed to verify PIN' },
      { status: 500 }
    )
  }
}
