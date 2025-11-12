// API Client for Poll operations

interface CreatePollData {
  question: string
  options: string[]
  pin: string
}

interface Poll {
  id: string
  question: string
  options: string[]
  votes: number[]
  createdAt: string
}

interface VoteData {
  optionIndex: number
}

interface VerifyPinData {
  pin: string
}

interface DeletePollData {
  pin: string
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  }

  async createPoll(data: CreatePollData): Promise<Poll> {
    const response = await fetch(`${this.baseUrl}/api/polls`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create poll')
    }

    return response.json()
  }

  async getPoll(pollId: string): Promise<Poll> {
    const response = await fetch(`${this.baseUrl}/api/polls/${pollId}`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get poll')
    }

    return response.json()
  }

  async vote(pollId: string, data: VoteData): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      
      // Special handling for already voted
      if (response.status === 409) {
        throw new Error('ALREADY_VOTED')
      }
      
      throw new Error(error.error || 'Failed to vote')
    }

    return response.json()
  }

  async verifyPin(pollId: string, data: VerifyPinData): Promise<{ valid: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/polls/${pollId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to verify PIN')
    }

    return response.json()
  }

  async deletePoll(pollId: string, data: DeletePollData): Promise<{ success: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/polls/${pollId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete poll')
    }

    return response.json()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types
export type { CreatePollData, Poll, VoteData, VerifyPinData, DeletePollData }
