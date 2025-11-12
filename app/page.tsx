import Link from "next/link"
import { Button, Card } from "@/components/ui"
import { Vote, Plus } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-6">
            <Vote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Szybka Ankietka
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto mb-8">
            Szybkie ankiety dla mieszkańców. Utwórz ankietę w 30 sekund, zbierz opinie natychmiast.
          </p>
          
          <Link href="/create">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              Utwórz nową ankietę
            </Button>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Stworzone dla urzędów miast i organizacji lokalnych
        </p>
      </div>
    </div>
  )
}
