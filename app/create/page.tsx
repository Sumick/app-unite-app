'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, ErrorMessage } from '@/components/ui'
import { Plus, X, Copy, Check, Lock } from 'lucide-react'

interface PollOption {
  id: string
  value: string
}

export default function CreatePollPage() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', value: '' },
    { id: '2', value: '' },
    { id: '3', value: '' }
  ])
  const [showPinModal, setShowPinModal] = useState(false)
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdPollId, setCreatedPollId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, { id: Date.now().toString(), value: '' }])
    }
  }

  const removeOption = (id: string) => {
    if (options.length > 3) {
      setOptions(options.filter(opt => opt.id !== id))
    }
  }

  const updateOption = (id: string, value: string) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, value } : opt))
  }

  const isFormValid = () => {
    if (!question.trim()) return false
    if (options.length < 3) return false
    return options.every(opt => opt.value.trim())
  }

  const handleSaveAndShare = (e: FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return
    setShowPinModal(true)
  }

  const handlePinSubmit = async () => {
    setPinError('')

    if (pin.length !== 4) {
      setPinError('PIN musi mieć 4 cyfry')
      return
    }

    if (pin !== confirmPin) {
      setPinError('PIN-y nie są identyczne')
      return
    }

    setIsSubmitting(true)

    try {
      const { apiClient } = await import('@/lib/api-client')
      
      const poll = await apiClient.createPoll({
        question: question.trim(),
        options: options.map(opt => opt.value.trim()),
        pin: pin,
      })

      setCreatedPollId(poll.id)
    } catch (error: any) {
      setPinError(error.message || 'Nie udało się utworzyć ankiety')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyLink = async () => {
    const link = `${window.location.origin}/poll/${createdPollId}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createAnother = () => {
    setQuestion('')
    setOptions([
      { id: '1', value: '' },
      { id: '2', value: '' },
      { id: '3', value: '' }
    ])
    setCreatedPollId(null)
    setShowPinModal(false)
    setPin('')
    setConfirmPin('')
    setPinError('')
  }

  // Success screen
  if (createdPollId) {
    const pollLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/poll/${createdPollId}`

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ankieta utworzona!
              </h2>
              <p className="text-gray-600">
                Twoja ankieta jest gotowa. Skopiuj link i udostępnij go mieszkańcom.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Link do ankiety:</p>
              <p className="text-sm font-mono text-gray-900 break-all mb-4">
                {pollLink}
              </p>
              <Button
                onClick={copyLink}
                variant="secondary"
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Skopiowano!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopiuj link
                  </>
                )}
              </Button>
            </div>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-4 rounded mb-6 text-left">
              <div className="flex items-start">
                <Lock className="w-5 h-5 text-primary-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-primary-900 mb-1">
                    Twój PIN: <span className="font-mono">{pin}</span>
                  </p>
                  <p className="text-xs text-primary-700">
                    Zapisz ten PIN - będzie potrzebny do edycji lub usunięcia ankiety
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  // Store admin session for direct access
                  sessionStorage.setItem(`admin_${createdPollId}`, pin)
                  router.push(`/poll/${createdPollId}?admin=true`)
                }}
                className="w-full"
              >
                Edytuj ankietę
              </Button>
              <Button
                onClick={createAnother}
                variant="secondary"
                className="w-full"
              >
                Utwórz kolejną ankietę
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // PIN Modal
  if (showPinModal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Zabezpiecz ankietę PIN-em
              </h2>
              <p className="text-sm text-gray-600">
                Ustaw 4-cyfrowy PIN, aby móc później edytować lub usunąć ankietę
              </p>
            </div>

            <div className="space-y-4">
              <Input
                label="Ustaw PIN (4 cyfry)"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setPin(value)
                  setPinError('')
                }}
                className="text-center text-xl tracking-widest"
                disabled={isSubmitting}
              />

              <Input
                label="Potwierdź PIN"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="••••"
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setConfirmPin(value)
                  setPinError('')
                }}
                className="text-center text-xl tracking-widest"
                disabled={isSubmitting}
              />

              {pinError && (
                <ErrorMessage message={pinError} variant="error" />
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowPinModal(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Wróć
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  disabled={pin.length !== 4 || confirmPin.length !== 4}
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Zapisz i udostępnij
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Create form
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Utwórz nową ankietę
          </h1>
          <p className="text-gray-600">
            Zadaj pytanie i dodaj 3-5 opcji odpowiedzi.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSaveAndShare} className="space-y-6">
            <Input
              label="Pytanie"
              placeholder="Np. Która godzina otwarcia basenu jest dla Ciebie najlepsza?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={200}
              helperText={`${question.length}/200 znaków`}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Opcje odpowiedzi
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex gap-2">
                    <Input
                      placeholder={`Opcja ${index + 1}`}
                      value={option.value}
                      onChange={(e) => updateOption(option.id, e.target.value)}
                      required
                      className="flex-1"
                    />
                    {options.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        onClick={() => removeOption(option.id)}
                        className="px-3"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 5 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addOption}
                  className="mt-3"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Dodaj opcję
                </Button>
              )}

              <p className="text-sm text-gray-500 mt-2">
                Minimum 3 opcje, maksimum 5
              </p>
            </div>

            {!isFormValid() && question && (
              <ErrorMessage
                variant="warning"
                message="Wypełnij wszystkie pola, aby utworzyć ankietę."
              />
            )}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/')}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!isFormValid()}
              >
                Zapisz i udostępnij
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
