import { Button } from '@/components/ui/button';
import { Mail, Wifi, ParkingSquare, Wind, Coffee, Tv, Utensils, BedDouble } from 'lucide-react';
import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';

export default function UbytovaniePage() {
  const izby = [
    {
      nazov: 'Dvojlôžková izba Standard',
      popis: 'Útulná izba pre dve osoby s manželskou posteľou, modernou kúpeľňou a výhľadom do tichého dvora. Ideálna pre páry hľadajúce pokojný oddych po dni strávenom degustáciou.',
      cena: 'od 70 € / noc',
      obrazok: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2070&auto=format&fit=crop',
    },
    {
      nazov: 'Apartmán s výhľadom na vinice',
      popis: 'Priestranný apartmán s oddelenou spálňou, plne vybavenou kuchynkou, obývacou časťou a súkromným balkónom s nádherným výhľadom priamo na naše vinice. Dokonalá voľba pre náročnejších hostí.',
      cena: 'od 110 € / noc',
      obrazok: 'https://images.unsplash.com/photo-1585412727339-3490d9d68e8e?q=80&w=2070&auto=format&fit=crop',
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
    { src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop', alt: 'Interiér izby' },
    { src: 'https://images.unsplash.com/photo-1590490359854-dfba5d72b66b?q=80&w=1974&auto=format&fit=crop', alt: 'Detail postele a dekorácií' },
    { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop', alt: 'Moderná kúpeľňa' },
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
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-primary">
            Pohodlie s výhľadom na vinice
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Doprajte si oddych a prespite v našich útulných izbách. Prebuďte sa do tichého rána s pohľadom na nekonečné rady viniča a vychutnajte si pokojnú atmosféru nášho rodinného vinárstva.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-2">
          {izby.map((izba) => (
            <div key={izba.nazov} className="border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-card">
              <div className="relative w-full h-64 bg-muted">
                <Image src={izba.obrazok} alt={izba.nazov} layout="fill" objectFit="cover" />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold mb-2 text-primary/90">{izba.nazov}</h3>
                <p className="text-muted-foreground flex-grow mb-4">{izba.popis}</p>
                <p className="font-bold text-lg mt-auto pt-4 border-t">{izba.cena}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center bg-card/50 py-12 rounded-xl">
          <h2 className="text-3xl font-bold mb-8">Vybavenie pre váš maximálny komfort</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {vybavenie.map((item) => (
              <div key={item.nazov} className="flex flex-col items-center gap-3 text-muted-foreground">
                <item.ikona className="h-8 w-8 text-primary" />
                <span className="font-medium">{item.nazov}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-20 text-center border-t pt-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Rezervujte si svoj pobyt</h2>
          <p className="text-muted-foreground mb-6">
            Pre overenie dostupnosti a rezerváciu nás neváhajte kontaktovať. Radi vám pripravíme ponuku na mieru.
          </p>
          <Button asChild size="lg">
            <a href="mailto:ubytovanie@putec.sk">
              <Mail className="mr-2 h-5 w-5" />
              Zistiť dostupnosť
            </a>
          </Button>
        </div>
      </div>

      {/* Galéria */}
      <section className="w-full pb-12 md:pb-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                    Nahliadnite do našich priestorov
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((image, index) => (
                    <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg group">
                        <Image 
                            src={image.src} 
                            alt={image.alt} 
                            layout="fill" 
                            objectFit="cover" 
                            className="transition-transform duration-300 group-hover:scale-110"
                        />
                    </div>
                ))}
            </div>
        </div>
      </section>

      <FaqSection title="Všetko, čo potrebujete vedieť" faqData={faqData} />
    </>
  );
}
