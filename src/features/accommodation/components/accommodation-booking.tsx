'use client';

import { useEffect } from 'react';
import { Bed, MapPin, Star, Wifi, Car, Utensils } from 'lucide-react';

export function AccommodationBooking() {
  useEffect(() => {
    // Load Previo script
    const script = document.createElement('script');
    script.src = 'https://booking.previo.app/iframe/';
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🏨 Ubytovanie v Srdci Viníc
        </h2>
        <p className="text-xl text-zinc-300 mb-6">
          Zažite neopakovateľnú atmosféru nášho vinárstva a ubytujte sa v komfortných apartmánoch s výhľadom na vinice.
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="flex flex-col items-center text-zinc-300">
            <Bed className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">Komfortné izby</span>
          </div>
          <div className="flex flex-col items-center text-zinc-300">
            <MapPin className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">Výhľad na vinice</span>
          </div>
          <div className="flex flex-col items-center text-zinc-300">
            <Star className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">4-hvězdičkové</span>
          </div>
          <div className="flex flex-col items-center text-zinc-300">
            <Wifi className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">Bezplatné WiFi</span>
          </div>
          <div className="flex flex-col items-center text-zinc-300">
            <Car className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">Parkovanie</span>
          </div>
          <div className="flex flex-col items-center text-zinc-300">
            <Utensils className="h-6 w-6 text-amber-600 mb-2" />
            <span className="text-sm">Snídane</span>
          </div>
        </div>
      </div>

      {/* Accommodation Info */}
      <div className="bg-zinc-800 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">O našom ubytovaní</h3>
            <div className="space-y-3 text-zinc-300">
              <p>
                Naše apartmány sa nachádzajú v srdci vinárstva, kde sa tradícia stretáva s moderným komfortom. 
                Každá izba je vybavená všetkým, čo potrebujete pre príjemný pobyt.
              </p>
              <p>
                <strong>Výhody ubytovania:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Komfortné apartmány s výhľadom na vinice</li>
                <li>Bezplatné WiFi a parkovanie</li>
                <li>Ráno snídane s domácimi produktmi</li>
                <li>Blízko degustácie a vína</li>
                <li>Ideálne pre rodiny aj páry</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Kontaktné informácie</h3>
            <div className="space-y-3 text-zinc-300">
              <p><strong>Adresa:</strong> Putecká 123, Bratislava</p>
              <p><strong>Telefón:</strong> +421 XXX XXX XXX</p>
              <p><strong>Email:</strong> ubytovanie@putec.sk</p>
              <p><strong>Check-in:</strong> 14:00 - 20:00</p>
              <p><strong>Check-out:</strong> do 10:00</p>
            </div>
            
            <div className="mt-6 p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
              <h4 className="font-semibold text-amber-400 mb-2">💡 Tip pre hostí</h4>
              <p className="text-sm text-zinc-300">
                Kombinujte ubytovanie s degustáciou vína a získajte 10% zľavu na ubytovanie!
                Rezervujte si obe služby v rovnaký deň.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Previo Booking Iframe */}
      <div className="bg-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          📅 Rezervácia ubytovania
        </h3>
        <p className="text-center text-zinc-400 mb-6">
          Vyberte si termín a typ izby pomocou nášho rezervačného systému
        </p>
        
        <div className="relative">
          {/* Loading placeholder */}
          <div className="absolute inset-0 bg-zinc-700 rounded-lg flex items-center justify-center z-10" id="loading-placeholder">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-white">Načítavam rezervačný systém...</p>
            </div>
          </div>
          
          {/* Previo iframe */}
          <iframe 
            src="https://booking.previo.app/?hotId=782975" 
            scrolling="no" 
            frameBorder="0" 
            width="100%" 
            height="2000" 
            name="previo-booking-iframe" 
            id="previo-booking-iframe" 
            allowTransparency={true}
            onLoad={() => {
              // Hide loading placeholder when iframe loads
              const placeholder = document.getElementById('loading-placeholder');
              if (placeholder) {
                placeholder.style.display = 'none';
              }
            }}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 bg-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Často kladené otázky</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Môžem zrušiť rezerváciu?</h4>
            <p className="text-zinc-300 text-sm">
              Áno, rezerváciu môžete zrušiť bezplatne do 24 hodín pred príchodom.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Akceptujete domáce zvieratá?</h4>
            <p className="text-zinc-300 text-sm">
              Áno, domáce zvieratá sú vítané za príplatok 15€/noc.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Je možné skorý check-in?</h4>
            <p className="text-zinc-300 text-sm">
              Skorý check-in je možný podľa dostupnosti. Kontaktujte nás vopred.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
