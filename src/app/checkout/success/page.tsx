'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Truck } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/features/cart/store/use-cart-store';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore(state => state.clearCart);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Tu by sme mohli overiť session s backendom
      // Pre teraz len vyčistíme košík
      clearCart();
      setIsLoading(false);
    }
  }, [sessionId, clearCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-white">Spracovávam vašu objednávku...</p>
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
            Ďakujeme za vašu objednávku!
          </h1>
          <p className="text-xl text-zinc-300 mb-8">
            Vaša objednávka bola úspešne spracovaná a bude vám doručená v najbližšom čase.
          </p>

          {/* Order Details */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-2xl font-semibold text-white mb-4">Detaily objednávky</h2>
            <div className="space-y-2 text-zinc-300">
              <p><strong>Číslo objednávky:</strong> {sessionId}</p>
              <p><strong>Dátum:</strong> {new Date().toLocaleDateString('sk-SK')}</p>
              <p><strong>Status:</strong> <span className="text-green-400">Potvrdená</span></p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Čo bude nasledovať?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <Package className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Vaša objednávka sa pripravuje</p>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Odošleme vám email s tracking číslom</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-zinc-300">Doručenie do 3-5 pracovných dní</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/">
                Pokračovať v nákupe
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/account">
                Zobraziť objednávky
              </Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-zinc-400">
            <p>Máte otázky? Kontaktujte nás na:</p>
            <p className="text-amber-600 font-semibold">info@putec.sk</p>
          </div>
        </div>
      </div>
    </div>
  );
}
