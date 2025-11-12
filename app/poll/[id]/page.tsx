'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button, Card, LoadingSpinner, ErrorMessage, ProgressBar } from '@/components/ui'
import { Check, Lock, Trash2, X, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Poll {
  id: string
  question: string
  options: string[]
  votes: number[]
  createdAt: string
}

type ViewState = 'loading' | 'voting' | 'results' | 'error' | 'admin'

export default function PollPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pollId = params.id as string
  const isAdminMode = searchParams.get('admin') === 'true'

  const [poll, setPoll] = useState<Poll | null>(null)
  const [viewState, setViewState] = useState<ViewState>('loading')
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [userVotedOption, setUserVotedOption] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [adminPin, setAdminPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  // Load poll data
  useEffect(() => {
    const loadPoll = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const polls = JSON.parse(localStorage.getItem('polls') || '[]')
      const foundPoll = polls.find((p: Poll) => p.id === pollId)

      if (!foundPoll) {
        setViewState('error')
        return
      }

      setPoll(foundPoll)

      // Check if admin mode with session
      if (isAdminMode) {
        const sessionPin = sessionStorage.getItem(`admin_${pollId}`)
        if (sessionPin && sessionPin === foundPoll.pin) {
          setIsAdmin(true)
          setViewState('admin')
          return
        }
      }

      // Check if user already voted
      const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}')
      if (votedPolls[pollId] !== undefined) {
        setUserVotedOption(votedPolls[pollId])
        setViewState('results')
      } else {
        setViewState('voting')
      }
    }

    loadPoll()
  }, [pollId, isAdminMode])

  // Poll for live updates (only in results view)
  useEffect(() => {
    if (viewState !== 'results') return

    const interval = setInterval(() => {
      const polls = JSON.parse(localStorage.getItem('polls') || '[]')
      const updatedPoll = polls.find((p: Poll) => p.id === pollId)
      if (updatedPoll) {
        setPoll(updatedPoll)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [viewState, pollId])

  const handleVote = async () => {
    if (selectedOption === null || !poll) return

    setIsSubmitting(true)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600))

    // Update votes in localStorage
    const polls = JSON.parse(localStorage.getItem('polls') || '[]')
    const pollIndex = polls.findIndex((p: Poll) => p.id === pollId)

    if (pollIndex !== -1) {
      polls[pollIndex].votes[selectedOption]++
      localStorage.setItem('polls', JSON.stringify(polls))
      setPoll(polls[pollIndex])
    }

    // Mark as voted
    const votedPolls = JSON.parse(localStorage.getItem('voted_polls') || '{}')
    votedPolls[pollId] = selectedOption
    localStorage.setItem('voted_polls', JSON.stringify(votedPolls))

    setUserVotedOption(selectedOption)
    setViewState('results')
    setIsSubmitting(false)
  }

  const handleAdminAccess = () => {
    setShowPinModal(true)
  }

  const verifyPin = async () => {
    setPinError('')
    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 500))

    const polls = JSON.parse(localStorage.getItem('polls') || '[]')
    const foundPoll = polls.find((p: any) => p.id === pollId)

    if (foundPoll && foundPoll.pin === adminPin) {
      setIsAdmin(true)
      setShowPinModal(false)
      setViewState('admin')
    } else {
      setPinError('Nieprawidłowy PIN')
    }

    setIsSubmitting(false)
  }

  const handleDeletePoll = async () => {
    if (!confirm('Czy na pewno chcesz usunąć tę ankietę? Ta operacja jest nieodwracalna.')) {
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))

    const polls = JSON.parse(localStorage.getItem('polls') || '[]')
    const updatedPolls = polls.filter((p: Poll) => p.id !== pollId)
    localStorage.setItem('polls', JSON.stringify(updatedPolls))

    router.push('/')
  }

  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Ładowanie ankiety...</p>
        </div>
      </div>
    )
  }

  if (viewState === 'error' || !poll) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <ErrorMessage
              title="Ankieta nie została znaleziona"
              message="Sprawdź, czy link jest prawidłowy lub skontaktuj się z osobą, która udostępniła ankietę."
              variant="error"
            />
          </Card>
        </div>
      </div>
    )
  }

  const totalVotes = poll.votes.reduce((sum, votes) => sum + votes, 0)

  if (viewState === 'results') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {poll.question}
                </h1>
              </div>

              {userVotedOption !== null && (
                <div className="bg-success-50 border-l-4 border-success-600 p-4 rounded">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-success-600 mr-2" />
                    <p className="text-sm text-success-600 font-medium">
                      Dziękujemy za oddanie głosu!
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-6">
              {poll.options.map((option, index) => {
                const votes = poll.votes[index]
                const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
                const isUserChoice = index === userVotedOption

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-colors ${isUserChoice
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 bg-white'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 flex items-center">
                        {option}
                        {isUserChoice && (
                          <span className="ml-2 text-xs bg-primary-600 text-white px-2 py-1 rounded">
                            Twój głos
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-gray-600">
                        {votes} {votes === 1 ? 'głos' : 'głosów'}
                      </span>
                    </div>
                    <ProgressBar
                      value={percentage}
                      showPercentage={false}
                      color={isUserChoice ? 'primary' : 'primary'}
                      size="md"
                    />
                    <div className="text-right mt-1">
                      <span className="text-sm font-medium text-gray-700">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Łącznie głosów: <span className="font-semibold text-gray-900">{totalVotes}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Wyniki aktualizują się automatycznie
              </p>
            </div>

            {!isAdmin && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminAccess}
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Zarządzaj ankietą
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    )
  }

  // PIN Modal
  if (showPinModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Wprowadź PIN administratora</h3>
            <button
              onClick={() => {
                setShowPinModal(false)
                setAdminPin('')
                setPinError('')
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                value={adminPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setAdminPin(value)
                  setPinError('')
                }}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                autoFocus
                disabled={isSubmitting}
              />
            </div>

            {pinError && (
              <ErrorMessage message={pinError} variant="error" />
            )}

            <Button
              onClick={verifyPin}
              disabled={adminPin.length !== 4}
              isLoading={isSubmitting}
              className="w-full"
            >
              Potwierdź
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Admin View
  if (viewState === 'admin' && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel administratora
                </h1>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdmin(false)
                    setViewState('results')
                  }}
                >
                  Wróć do wyników
                </Button>
              </div>

              <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded">
                <p className="text-sm text-primary-900 font-medium">
                  {poll?.question}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statystyki</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Łącznie głosów</p>
                    <p className="text-3xl font-bold text-gray-900">{totalVotes}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Opcji</p>
                    <p className="text-3xl font-bold text-gray-900">{poll?.options.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Wyniki szczegółowe</h3>
                <div className="space-y-3">
                  {poll?.options.map((option, index) => {
                    const votes = poll.votes[index]
                    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{option}</span>
                          <span className="text-sm text-gray-600">{votes} głosów</span>
                        </div>
                        <ProgressBar
                          value={percentage}
                          showPercentage={false}
                          color="primary"
                          size="md"
                        />
                        <div className="text-right mt-1">
                          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Zarządzanie</h3>
                <div className="space-y-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      // Open poll in new tab for preview
                      window.open(`/poll/${pollId}`, '_blank')
                    }}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Zobacz ankietę (preview)
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleDeletePoll}
                    isLoading={isSubmitting}
                    className="w-full text-error-600 hover:bg-error-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Usuń ankietę
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Usunięcie ankiety jest nieodwracalne
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Voting view
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {poll.question}
            </h1>
            <p className="text-gray-600">
              Wybierz jedną opcję i zagłosuj
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {poll.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                disabled={isSubmitting}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${selectedOption === index
                    ? 'border-primary-600 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedOption === index
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                      }`}
                  >
                    {selectedOption === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleVote}
            disabled={selectedOption === null}
            isLoading={isSubmitting}
            className="w-full"
            size="lg"
          >
            Zagłosuj
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Możesz zagłosować tylko raz
          </p>
        </Card>
      </div>
    </div>
  )
}
