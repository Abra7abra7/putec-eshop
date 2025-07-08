import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';

export default function DegustaciePage() {
  const degustacie = [
    {
      nazov: 'Základná degustácia',
      popis: 'Prehliadka pivnice s odborným výkladom a ochutnávka 5 starostlivo vybraných vzoriek našich najobľúbenejších vín. Ideálne pre tých, ktorí sa chcú zoznámiť s našou produkciou.',
      cena: '15 € / osoba',
      trvanie: 'cca 60 minút',
    },
    {
      nazov: 'Rozšírená degustácia',
      popis: 'Ochutnávka 8 vzoriek vín vrátane archívnych kúskov, doplnená o tanier lokálnych syrov a domácich mäsových výrobkov. Hlbší ponor do sveta našich chutí.',
      cena: '25 € / osoba',
      trvanie: 'cca 90 minút',
    },
    {
      nazov: 'Prémiová degustácia',
      popis: 'Exkluzívna degustácia 10 vzoriek prémiových a limitovaných edícií vín. Súčasťou je bohaté občerstvenie a osobná konzultácia priamo s naším vinárom.',
      cena: '40 € / osoba',
      trvanie: 'cca 120 minút',
    },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1587882043687-3c5a6d3855e8?q=80&w=2070&auto=format&fit=crop', alt: 'Atmosféra degustácie' },
    { src: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=2070&auto=format&fit=crop', alt: 'Poháre s vínom' },
    { src: 'https://images.unsplash.com/photo-1568213816243-51931b1f9642?q=80&w=1974&auto=format&fit=crop', alt: 'Detail na víno a syr' },
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
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-primary">
            Degustácie v našom vinárstve
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Objavte chute našich vín priamo v srdci našej pivnice. Pripravujeme pre vás nezabudnuteľné degustácie s odborným výkladom, kde každá fľaša rozpráva svoj vlastný príbeh.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {degustacie.map((degustacia) => (
            <div key={degustacia.nazov} className="border rounded-xl p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/50 bg-card">
              <h3 className="text-2xl font-semibold mb-2 text-primary/90">{degustacia.nazov}</h3>
              <p className="text-muted-foreground flex-grow mb-4">{degustacia.popis}</p>
              <div className="mt-auto pt-4 border-t">
                <p className="font-bold text-lg">{degustacia.cena}</p>
                <p className="text-sm text-muted-foreground">{degustacia.trvanie}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20 text-center border-t pt-12 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Máte záujem o rezerváciu?</h2>
          <p className="text-muted-foreground mb-6">
            Pre rezerváciu termínu alebo individuálnu ponuku nás neváhajte kontaktovať. Tešíme sa na vašu návštevu!
          </p>
          <Button asChild size="lg">
            <a href="mailto:rezervacie@putec.sk">
              <Mail className="mr-2 h-5 w-5" />
              Kontaktujte nás e-mailom
            </a>
          </Button>
        </div>
      </div>

      {/* Galéria */}
      <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">
                    Atmosféra, ktorú si zamilujete
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

      <FaqSection title="Často kladené otázky" faqData={faqData} />
    </>
  );
}
