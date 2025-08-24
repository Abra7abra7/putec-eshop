'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Wine, Calendar, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function TastingSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId && bookingId) {
      setIsLoading(false);
    }
  }, [sessionId, bookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-white">Spracovávam vašu rezerváciu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Rezervácia degustácie potvrdená! 🍷
          </h1>
          <p className="text-xl text-zinc-300 mb-8">
            Vaša rezervácia bola úspešne spracovaná a zaplatená.
          </p>

          {/* Booking Details */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-white mb-4">Detaily rezervácie</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Číslo rezervácie:</strong> {bookingId}</p>
              <p><strong>Stripe session:</strong> {sessionId}</p>
              <p><strong>Dátum:</strong> {new Date().toLocaleDateString('sk-SK')}</p>
              <p><strong>Status:</strong> <span className="text-green-400">Potvrdená a zaplatená</span></p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Čo bude nasledovať?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <Wine className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Odošleme vám email s potvrdením</p>
              </div>
              <div className="text-center">
                <Calendar className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Pripomenieme vám termín 24h vopred</p>
              </div>
              <div className="text-center">
                <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Príďte na adresu: Putecká 123, Bratislava</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/#degustacia">
                Rezervovať ďalšiu degustáciu
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                Späť na hlavnú stránku
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-zinc-400">
            <p>Máte otázky? Kontaktujte nás na:</p>
            <p className="text-amber-600 font-semibold">info@putec.sk</p>
            <p className="text-sm mt-2">Alebo telefonicky: +421 XXX XXX XXX</p>
          </div>
        </div>
      </div>
    </div>
  );
}
