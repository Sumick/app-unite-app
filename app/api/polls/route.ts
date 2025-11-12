import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, options, pin } = body

    // Basic validation
    if (!question || !options || !pin) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (options.length < 3 || options.length > 5) {
      return NextResponse.json(
        { error: 'Options must be between 3 and 5' },
        { status: 400 }
      )
    }

    if (pin.length !== 4) {
      return NextResponse.json(
        { error: 'PIN must be 4 digits' },
        { status: 400 }
      )
    }

    // Create poll
    const poll = await prisma.poll.create({
      data: {
        question,
        options,
        pin,
      },
    })

    // Return without PIN
    return NextResponse.json({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      createdAt: poll.createdAt,
    })
  } catch (error) {
    console.error('Create poll error:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}
