import { Wifi, ParkingSquare, Wind, Coffee, Tv, Utensils, BedDouble } from 'lucide-react';
import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';
import { BookingForm } from '@/components/booking-form';

export default function UbytovaniePage() {
  const izby = [
    {
      nazov: 'Dvojlôžková izba Standard',
      popis: 'Útulná izba pre dve osoby s manželskou posteľou, modernou kúpeľňou a výhľadom do tichého dvora. Ideálna pre páry hľadajúce pokojný oddych po dni strávenom degustáciou.',
      cena: 'od 70 € / noc',
      obrazok: '/images/ubytovanie/Izba interier.webp',
    },
    {
      nazov: 'Apartmán s výhľadom na vinice',
      popis: 'Priestranný apartmán s oddelenou spálňou, plne vybavenou kuchynkou, obývacou časťou a súkromným balkónom s nádherným výhľadom priamo na naše vinice. Dokonalá voľba pre náročnejších hostí.',
      cena: 'od 110 € / noc',
      obrazok: '/images/ubytovanie/IMG_5835.webp',
    },
  ];

  const vybavenie = [
    { ikona: Wifi, nazov: 'Bezplatné Wi-Fi' },
    { ikona: ParkingSquare, nazov: 'Súkromné parkovisko' },
    { ikona: Wind, nazov: 'Klimatizácia' },
    { ikona: Coffee, nazov: 'Bohaté raňajky v cene' },
    { ikona: Tv, nazov: 'Smart TV s Netflixom' },
    { ikona: Utensils, nazov: 'Možnosť večere' },
    { ikona: BedDouble, nazov: 'Pohodlné postele' },
  ];

  const galleryImages = [
    { src: '/images/ubytovanie/Altánok.webp', alt: 'Altánok s posedením' },
    { src: '/images/ubytovanie/dvor s kostolom.webp', alt: 'Pohľad na dvor s kostolom v pozadí' },
    { src: '/images/ubytovanie/kuchyna.webp', alt: 'Plne vybavená kuchynka v apartmáne' },
    { src: '/images/ubytovanie/Izba interier.webp', alt: 'Interiér izby' },
    { src: '/images/ubytovanie/dvor so sudom.webp', alt: 'Dvor s dreveným sudom' },
    { src: '/images/ubytovanie/Kuchyna linka.webp', alt: 'Detail kuchynskej linky v apartmáne' },
    { src: '/images/ubytovanie/IMG_5787.webp', alt: 'Interiér ubytovania' },
    { src: '/images/ubytovanie/IMG_6011-2.webp', alt: 'Pohľad na vinárstvo z diaľky' },
  ];

  const faqData = [
    { question: 'Aký je čas príchodu (check-in) a odchodu (check-out)?', answer: 'Check-in je možný od 14:00. Check-out je do 10:00. V prípade potreby neskoršieho odchodu alebo skoršieho príchodu nás prosím kontaktujte.' },
    { question: 'Sú raňajky zahrnuté v cene pobytu?', answer: 'Áno, všetci naši hostia majú v cene pobytu zahrnuté bohaté raňajky pripravené z lokálnych surovín.' },
    { question: 'Je parkovanie bezpečné a spoplatnené?', answer: 'Parkovanie je pre našich hostí k dispozícii zadarmo na súkromnom, monitorovanom parkovisku priamo v areáli vinárstva.' },
    { question: 'Môžem si so sebou zobrať domáce zviera?', answer: 'Po dohode a za malý poplatok sú u nás vítané aj menšie, dobre vychované domáce zvieratá. Prosím, informujte nás o tom vopred.' },
    { question: 'Je v okolí možnosť stravovania?', answer: 'Okrem našich raňajok a možnosti objednať si degustačnú večeru vám radi odporučíme najlepšie reštaurácie v blízkom okolí.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/ubytovanie/dvor s kostolom.webp"
          alt="Pohľad na dvor vinárstva Pútec s kostolom v pozadí"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Pohodlie s výhľadom na vinice</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Prebuďte sa do tichého rána s pohľadom na nekonečné rady viniča a vychutnajte si pokojnú atmosféru nášho rodinného vinárstva.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Váš druhý domov</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Doprajte si oddych a prespite v našich útulných izbách a apartmánoch. Či už ste u nás na jednu noc alebo celý týždeň, postaráme sa o váš maximálny komfort, aby ste sa u nás cítili ako doma.
            </p>
          </div>
        </div>
      </section>

      {/* Izby Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {izby.map((izba) => (
              <div key={izba.nazov} className="bg-background rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative w-full h-72">
                  <Image src={izba.obrazok} alt={izba.nazov} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 text-primary">{izba.nazov}</h3>
                  <p className="text-muted-foreground mb-6">{izba.popis}</p>
                  <p className="font-bold text-2xl">{izba.cena}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vybavenie Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center text-primary mb-12">Pre váš maximálny komfort</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-8 max-w-6xl mx-auto text-center">
            {vybavenie.map((item) => (
              <div key={item.nazov} className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <item.ikona className="h-8 w-8 text-primary" />
                </div>
                <span className="font-medium text-muted-foreground text-sm">{item.nazov}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rezervacia Section */}
      <section id="rezervacia" className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary mb-4">Rezervujte si svoj pobyt</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              Overte si dostupnosť a rezervujte si svoj termín pohodlne a rýchlo cez náš online rezervačný systém.
            </p>
            <BookingForm />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center text-primary mb-12">Nahliadnite do našich priestorov</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group shadow-md">
                <Image src={img.src} alt={img.alt} fill style={{ objectFit: 'cover' }} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection title="Často kladené otázky" faqData={faqData} />
    </>
  );
}
