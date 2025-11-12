import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getClientIP(request: NextRequest): string {
  // Try various headers for IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { optionIndex } = body

    if (optionIndex === undefined || optionIndex === null) {
      return NextResponse.json(
        { error: 'Option index required' },
        { status: 400 }
      )
    }

    // Get IP and User Agent
    const ipAddress = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id },
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Validate option index
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { error: 'Invalid option index' },
        { status: 400 }
      )
    }

    // Check if already voted (unique constraint will catch this too)
    const existingVote = await prisma.vote.findFirst({
      where: {
        pollId: id,
        ipAddress,
        userAgent,
      },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already voted', alreadyVoted: true },
        { status: 409 }
      )
    }

    // Create vote
    await prisma.vote.create({
      data: {
        pollId: id,
        optionIndex,
        ipAddress,
        userAgent,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Vote error:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already voted', alreadyVoted: true },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 }
    )
  }
}
