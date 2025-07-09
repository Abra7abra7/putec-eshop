import { Button } from '@/components/ui/button';
import { Mail, Clock, Wine } from 'lucide-react';
import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';

export default function DegustaciePage() {
  const degustacie = [
    {
      nazov: 'Základná degustácia',
      popis: 'Prehliadka pivnice s odborným výkladom a ochutnávka 5 starostlivo vybraných vzoriek našich najobľúbenejších vín. Ideálne pre tých, ktorí sa chcú zoznámiť s našou produkciou.',
      cena: '15 € / osoba',
      trvanie: 'cca 60 minút',
      pocetVzoriek: '5 vzoriek',
      obrazok: '/images/degustacie/degustácia-x.webp',
    },
    {
      nazov: 'Rozšírená degustácia',
      popis: 'Ochutnávka 8 vzoriek vín vrátane archívnych kúskov, doplnená o tanier lokálnych syrov a domácich mäsových výrobkov. Hlbší ponor do sveta našich chutí.',
      cena: '25 € / osoba',
      trvanie: 'cca 90 minút',
      pocetVzoriek: '8 vzoriek',
      obrazok: '/images/degustacie/misa-x.webp',
    },
    {
      nazov: 'Prémiová degustácia',
      popis: 'Exkluzívna degustácia 10 vzoriek prémiových a limitovaných edícií vín. Súčasťou je bohaté občerstvenie a osobná konzultácia priamo s naším vinárom.',
      cena: '40 € / osoba',
      trvanie: 'cca 120 minút',
      pocetVzoriek: '10 vzoriek',
      obrazok: '/images/degustacie/degustácia-brano-x.webp',
    },
  ];

  const galleryImages = [
    { src: '/images/degustacie/degustácia-x.webp', alt: 'Detail na nalievanie vína' },
    { src: '/images/degustacie/sudy-x.webp', alt: 'Drevené sudy v pivnici' },
    { src: '/images/degustacie/misa-x.webp', alt: 'Občerstvenie k degustácii' },
    { src: '/images/degustacie/Brano-degustácia-x.webp', alt: 'Degustácia s vinárom' },
    { src: '/images/degustacie/IMG_5508-6-x.webp', alt: 'Poháre s vínom pripravené na degustáciu' },
    { src: '/images/degustacie/jama-x.webp', alt: 'Vstup do vínnej pivnice' },
    { src: '/images/degustacie/degustačná-x.webp', alt: 'Priestory degustačnej miestnosti' },
    { src: '/images/degustacie/degustácia-brano-x.webp', alt: 'Vinár Braňo pri výklade' },
  ];

  const faqData = [
    { question: 'Je potrebná rezervácia vopred?', answer: 'Áno, pre zabezpečenie najlepšieho zážitku a prípravu je nutné si termín degustácie rezervovať minimálne 48 hodín vopred.' },
    { question: 'Aká je minimálna a maximálna veľkosť skupiny?', answer: 'Minimálny počet osôb pre degustáciu sú 4 osoby. Pre väčšie skupiny (nad 15 osôb) nás prosím kontaktujte pre individuálnu ponuku.' },
    { question: 'Je možné degustáciu prispôsobiť?', answer: 'Samozrejme. Radi vám pripravíme degustáciu na mieru podľa vašich preferencií, napríklad zameranú len na biele vína alebo na konkrétny ročník.' },
    { question: 'Je degustácia vhodná aj pre začiatočníkov?', answer: 'Určite áno! Náš vinár prispôsobí výklad vašim znalostiam a prevedie vás svetom vína pútavou a zrozumiteľnou formou.' },
    { question: 'Môžem si u vás zakúpiť vína, ktoré ochutnám?', answer: 'Áno, všetky degustované vína si môžete po ochutnávke zakúpiť za zvýhodnenú cenu priamo v našej pivnici.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/ubytovanie/degustačná.webp"
          alt="Degustačná miestnosť vo vinárstve Pútec"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Zážitok v každom pohári</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Objavte chute našich vín priamo v srdci našej pivnice. Prevedieme vás príbehom každej fľaše.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Ochutnajte to najlepšie z našej pivnice</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pripravili sme pre vás niekoľko degustačných balíkov, ktoré vás prevedú našou produkciou. Či ste zvedavý začiatočník alebo skúsený znalec, u nás si prídete na svoje. Každá degustácia prebieha v autentických priestoroch našej pivnice a je vedená priamo naším vinárom.
            </p>
          </div>
        </div>
      </section>

      {/* Degustacie Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {degustacie.map((degustacia) => (
              <div key={degustacia.nazov} className="relative border rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-primary/50 text-white min-h-[450px]">
                <Image
                  src={degustacia.obrazok}
                  alt={`Pozadie pre ${degustacia.nazov}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="z-0 brightness-[0.4] group-hover:brightness-50 transition-all duration-300"
                />
                <div className="relative z-10 p-8 flex flex-col flex-grow bg-black/20">
                  <h3 className="text-2xl font-bold mb-4 text-primary">{degustacia.nazov}</h3>
                  <p className="flex-grow mb-6 text-white/90">{degustacia.popis}</p>
                  <div className="mt-auto space-y-4 pt-6 border-t border-white/20">
                    <div className="flex items-center"><Wine className="mr-3 h-5 w-5 text-primary/80" /><span>{degustacia.pocetVzoriek}</span></div>
                    <div className="flex items-center"><Clock className="mr-3 h-5 w-5 text-primary/80" /><span>{degustacia.trvanie}</span></div>
                    <p className="font-bold text-2xl pt-2">{degustacia.cena}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center border-t pt-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Rezervujte si svoj termín</h2>
            <p className="text-muted-foreground mb-6">
              Pre rezerváciu termínu alebo individuálnu ponuku pre väčšie skupiny nás neváhajte kontaktovať. Tešíme sa na vašu návštevu!
            </p>
            <Button asChild size="lg">
              <a href="mailto:rezervacie@putec.sk">
                <Mail className="mr-2 h-5 w-5" />
                Napíšte nám
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center text-primary mb-12">Atmosféra, ktorú si zamilujete</h2>
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
