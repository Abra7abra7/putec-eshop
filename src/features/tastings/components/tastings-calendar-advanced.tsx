'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Utensils, Bed, Wine, User, Mail, Phone, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createTastingCheckout } from '../actions/create-tasting-checkout';
import type { TastingPackage, AvailableTimeSlot, BookingFormData } from '../types';

interface TastingsCalendarAdvancedProps {
  packages: TastingPackage[];
  timeSlots: AvailableTimeSlot[];
}

export function TastingsCalendarAdvanced({ packages, timeSlots }: TastingsCalendarAdvancedProps) {
  const [selectedPackage, setSelectedPackage] = useState<TastingPackage | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<AvailableTimeSlot['sessions'][0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    number_of_people: 1,
    special_requests: ''
  });
  const { toast } = useToast();

  // Navigácia kalendára
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  // Generovanie kalendára pre aktuálny mesiac
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Kontrola dostupnosti termínov pre dátum
  const getAvailableSessionsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return timeSlots.filter(slot => slot.date === dateString);
  };

  // Kontrola, či je dátum v minulosti
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Kontrola, či je dátum pondelok (zatvorené)
  const isMonday = (date: Date) => {
    return date.getDay() === 1;
  };

  // Formátovanie dátumu
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('sk-SK', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Formátovanie času
  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Formátovanie ceny
  const formatPrice = (price: number) => {
    return `€${(price / 100).toFixed(2)}`;
  };

  // Počet dostupných miest
  const getAvailableSpots = (session: AvailableTimeSlot['sessions'][0]) => {
    return session.max_capacity - session.current_bookings;
  };

  // Handler pre výber dátumu
  const handleDateSelect = (date: Date) => {
    if (isDateInPast(date) || isMonday(date)) return;
    
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setSelectedTime('');
    setSelectedSession(null);
    setShowBookingForm(false);
  };

  // Handler pre výber času
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedSession(null);
    setShowBookingForm(false);
  };

  // Handler pre výber session
  const handleSessionSelect = (session: AvailableTimeSlot['sessions'][0]) => {
    setSelectedSession(session);
    setShowBookingForm(true);
  };

  // Handler pre checkout
  const handleCheckout = async () => {
    if (!selectedSession) return;
    
    setIsCheckoutLoading(true);
    try {
      const result = await createTastingCheckout(selectedSession.id, formData);
      
      if (result.success && result.url) {
        toast({
          title: "🔄 Presmerovávam na Stripe",
          description: "Presmerovávam vás na bezpečnú platobnú bránu...",
          variant: "default",
        });
        
        setTimeout(() => {
          window.location.href = result.url;
        }, 1000);
      } else {
        toast({
          title: "❌ Chyba pri checkout",
          description: result.error || "Nepodarilo sa vytvoriť checkout session",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Chyba pri checkout",
        description: "Nepodarilo sa spustiť checkout proces",
        variant: "destructive",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🍷 Rezervácia degustácie - Pokročilý kalendár
        </h2>
        <p className="text-zinc-300">
          Vyberte si degustáciu a rezervujte si termín v našom kalendári
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
                  onClick={() => setSelectedPackage(package_)}
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

        {/* Step 2: Calendar */}
        <div className="lg:col-span-3">
          {selectedPackage ? (
            <div className="bg-zinc-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Krok 2: Výber termínu
              </h3>

              {/* Calendar Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousMonth}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Predchádzajúci
                </Button>
                
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white capitalize">{monthName}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToToday}
                    className="text-amber-600 hover:text-amber-500"
                  >
                    Dnes
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextMonth}
                  className="flex items-center gap-2"
                >
                  Ďalší
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-zinc-400 p-2">
                    {day}
                  </div>
                ))}
                
                {calendarDays.map((date, index) => {
                  const isPast = isDateInPast(date);
                  const isMondayClosed = isMonday(date);
                  const isSelected = selectedDate === date.toISOString().split('T')[0];
                  const availableSessions = getAvailableSessionsForDate(date);
                  const hasAvailableSessions = availableSessions.length > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`
                        p-2 text-center cursor-pointer rounded-lg transition-all
                        ${isPast || isMondayClosed 
                          ? 'text-zinc-600 bg-zinc-700 cursor-not-allowed' 
                          : isSelected 
                            ? 'bg-amber-600 text-white' 
                            : hasAvailableSessions 
                              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                              : 'text-zinc-400 hover:bg-zinc-700'
                        }
                      `}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      {hasAvailableSessions && (
                        <div className="text-xs mt-1">
                          {availableSessions.length} termínov
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-3">Dostupné časy pre {new Date(selectedDate).toLocaleDateString('sk-SK')}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {getAvailableSessionsForDate(new Date(selectedDate))
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((slot) => (
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
                    {getAvailableSessionsForDate(new Date(selectedDate))
                      .find(slot => slot.time === selectedTime)
                      ?.sessions.map((session) => (
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
                                {formatDate(new Date(selectedDate))} o {selectedTime}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulár */}
            <div className="space-y-4">
              <h4 className="font-medium text-white mb-3">Kontaktné údaje</h4>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <User className="inline h-4 w-4 mr-2" />
                  Meno a priezvisko *
                </label>
                <Input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                  placeholder="Vaše meno a priezvisko"
                  className="bg-zinc-700 border-zinc-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                  placeholder="vas@email.sk"
                  className="bg-zinc-700 border-zinc-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-2" />
                  Telefón
                </label>
                <Input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                  placeholder="+421 XXX XXX XXX"
                  className="bg-zinc-700 border-zinc-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <Users className="inline h-4 w-4 mr-2" />
                  Počet osôb *
                </label>
                <Input
                  type="number"
                  min="1"
                  max={getAvailableSpots(selectedSession)}
                  value={formData.number_of_people}
                  onChange={(e) => setFormData({...formData, number_of_people: parseInt(e.target.value) || 1})}
                  className="bg-zinc-700 border-zinc-600 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-2" />
                  Špeciálne požiadavky
                </label>
                <Textarea
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  placeholder="Alergia, preferencie, poznámky..."
                  className="bg-zinc-700 border-zinc-600 text-white"
                  rows={3}
                />
              </div>
            </div>
            
            {/* Súhrn */}
            <div>
              <h4 className="font-medium text-white mb-3">Súhrn rezervácie</h4>
              <div className="space-y-2 text-sm text-zinc-300 mb-4">
                <p><strong>Dátum:</strong> {new Date(selectedDate).toLocaleDateString('sk-SK')}</p>
                <p><strong>Čas:</strong> {selectedTime}</p>
                <p><strong>Trvanie:</strong> {selectedSession.package?.duration_minutes} minút</p>
                <p><strong>Cena za osobu:</strong> {formatPrice(selectedSession.package?.price || 0)}</p>
                <p><strong>Počet osôb:</strong> {formData.number_of_people}</p>
                <p><strong>Celková cena:</strong> <span className="text-amber-400 font-bold">{formatPrice((selectedSession.package?.price || 0) * formData.number_of_people)}</span></p>
                <p><strong>Dostupné miesta:</strong> {getAvailableSpots(selectedSession)}</p>
              </div>
              
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isCheckoutLoading || !formData.customer_name || !formData.customer_email}
                onClick={handleCheckout}
              >
                {isCheckoutLoading ? 'Spracovávam...' : '💳 Pokračovať k platbe'}
              </Button>
              
              <p className="text-xs text-zinc-400 mt-2">
                * Povinné polia
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
