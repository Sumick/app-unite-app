import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
      include: {
        votes: true,
      },
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Calculate votes per option
    const voteCounts = poll.options.map((_, index) => {
      return poll.votes.filter(v => v.optionIndex === index).length
    })

    // Return without PIN
    return NextResponse.json({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      votes: voteCounts,
      createdAt: poll.createdAt,
    })
  } catch (error) {
    console.error('Get poll error:', error)
    return NextResponse.json(
      { error: 'Failed to get poll' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verify PIN
    const poll = await prisma.poll.findUnique({
      where: { id: params.id },
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    if (poll.pin !== pin) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 403 }
      )
    }

    // Delete poll (votes cascade)
    await prisma.poll.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete poll error:', error)
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    )
  }
}
