'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Utensils, Bed, Wine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { TastingPackage, AvailableTimeSlot } from '../types';

interface TastingsCalendarProps {
  packages: TastingPackage[];
  timeSlots: AvailableTimeSlot[];
}

export function TastingsCalendar({ packages, timeSlots }: TastingsCalendarProps) {
  const [selectedPackage, setSelectedPackage] = useState<TastingPackage | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<AvailableTimeSlot['sessions'][0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { toast } = useToast();

  // Get available dates from timeSlots
  const availableDates = [...new Set(timeSlots.map(slot => slot.date))].sort();

  // Get available times for selected date
  const availableTimesForDate = timeSlots
    .filter(slot => slot.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Get sessions for selected date and time
  const sessionsForDateTime = timeSlots.find(
    slot => slot.date === selectedDate && slot.time === selectedTime
  )?.sessions || [];

  const handlePackageSelect = (package_: TastingPackage) => {
    setSelectedPackage(package_);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedSession(null);
    setShowBookingForm(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setSelectedSession(null);
    setShowBookingForm(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedSession(null);
    setShowBookingForm(false);
  };

  const handleSessionSelect = (session: AvailableTimeSlot['sessions'][0]) => {
    setSelectedSession(session);
    setShowBookingForm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sk-SK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(2)}`;
  };

  const getAvailableSpots = (session: AvailableTimeSlot['sessions'][0]) => {
    return session.max_capacity - session.current_bookings;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🍷 Rezervácia degustácie
        </h2>
        <p className="text-zinc-300">
          Vyberte si degustáciu a rezervujte si termín v našom kalendári
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Package Selection */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Wine className="h-5 w-5 text-amber-600" />
              Krok 1: Výber degustácie
            </h3>
            
            <div className="space-y-4">
              {packages.map((package_) => (
                <div
                  key={package_.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPackage?.id === package_.id
                      ? 'border-amber-600 bg-amber-600/10'
                      : 'border-zinc-600 hover:border-zinc-500'
                  }`}
                  onClick={() => handlePackageSelect(package_)}
                >
                  <h4 className="font-semibold text-white mb-2">{package_.name}</h4>
                  <p className="text-sm text-zinc-400 mb-3">{package_.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-amber-600 font-bold">{formatPrice(package_.price)}</span>
                    <div className="flex items-center gap-4 text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {package_.duration_minutes}min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        max {package_.max_people}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-xs text-zinc-500">
                    {package_.includes_food && (
                      <span className="flex items-center gap-1">
                        <Utensils className="h-3 w-3" />
                        Občerstvenie
                      </span>
                    )}
                    {package_.includes_accommodation && (
                      <span className="flex items-center gap-1">
                        <Bed className="h-3 w-3" />
                        Ubytovanie
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Date & Time Selection */}
        <div className="lg:col-span-2">
          {selectedPackage ? (
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Krok 2: Výber termínu
              </h3>

              {/* Date Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-white mb-3">Dostupné dátumy</h4>
                <div className="grid grid-cols-7 gap-2">
                  {availableDates.slice(0, 7).map((date) => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      className={`h-12 ${
                        selectedDate === date 
                          ? 'bg-amber-600 hover:bg-amber-700' 
                          : 'hover:bg-zinc-700'
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-center">
                        <div className="text-xs text-zinc-400">
                          {new Date(date).toLocaleDateString('sk-SK', { weekday: 'short' })}
                        </div>
                        <div className="font-semibold">
                          {new Date(date).getDate()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">Dostupné časy</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {availableTimesForDate.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={selectedTime === slot.time ? "default" : "outline"}
                        className={`h-12 ${
                          selectedTime === slot.time 
                            ? 'bg-amber-600 hover:bg-amber-700' 
                            : 'hover:bg-zinc-700'
                        }`}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Selection */}
              {selectedDate && selectedTime && (
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">Dostupné termíny</h4>
                  <div className="space-y-3">
                    {sessionsForDateTime.map((session) => (
                      <div
                        key={session.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedSession?.id === session.id
                            ? 'border-amber-600 bg-amber-600/10'
                            : 'border-zinc-600 hover:border-zinc-500'
                        }`}
                        onClick={() => handleSessionSelect(session)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-white">{session.package?.name}</h5>
                            <p className="text-sm text-zinc-400">
                              {formatDate(session.start_time)} o {formatTime(session.time || '')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-600 font-bold">
                              {formatPrice(session.package?.price || 0)}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {getAvailableSpots(session)} miest k dispozícii
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-zinc-800 rounded-lg p-6 text-center">
              <Calendar className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">
                Najprv vyberte typ degustácie
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form */}
      {showBookingForm && selectedSession && (
        <div className="mt-8 bg-zinc-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            🎯 Rezervácia: {selectedSession.package?.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-3">Detaily termínu</h4>
              <div className="space-y-2 text-sm text-zinc-300">
                <p><strong>Dátum:</strong> {formatDate(selectedSession.start_time)}</p>
                <p><strong>Čas:</strong> {formatTime(selectedTime)}</p>
                <p><strong>Trvanie:</strong> {selectedSession.package?.duration_minutes} minút</p>
                <p><strong>Cena:</strong> {formatPrice(selectedSession.package?.price || 0)}</p>
                <p><strong>Dostupné miesta:</strong> {getAvailableSpots(selectedSession)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-3">Ďalšie kroky</h4>
              <p className="text-sm text-zinc-400 mb-4">
                Pre dokončenie rezervácie budete presmerovaný na platobnú bránu Stripe.
              </p>
              
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  toast({
                    title: "🎯 Rezervácia pripravená",
                    description: "Presmerovávam vás na platobnú bránu...",
                    variant: "default",
                  });
                  // Tu by sme implementovali checkout pre degustáciu
                }}
              >
                💳 Pokračovať k platbe
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
