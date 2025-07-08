import { FaqSection } from '@/components/faq-section';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function KontaktPage() {

  const faqData = [
    { question: 'Je potrebná rezervácia na návštevu?', answer: 'Áno, pre degustácie aj ubytovanie je potrebná rezervácia vopred. Zabezpečíte si tak, že sa vám budeme môcť naplno venovať a pripraviť pre vás ten najlepší zážitok.' },
    { question: 'Dá sa u vás platiť kartou?', answer: 'Áno, akceptujeme platbu v hotovosti aj všetkými bežnými platobnými kartami.' },
    { question: 'Je vinárstvo bezbariérové?', answer: 'Naše hlavné priestory vrátane degustačnej miestnosti sú čiastočne prístupné, avšak historická pivnica má obmedzený prístup. Pre viac informácií o konkrétnych potrebách nás, prosím, kontaktujte vopred.' },
    { question: 'Môžem si u vás kúpiť víno aj bez degustácie?', answer: 'Samozrejme. Počas otváracích hodín si môžete prísť kúpiť víno so sebou. Radi vám s výberom poradíme.' },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">Kontaktujte Nás</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Máte otázky alebo si chcete rezervovať zážitok? Neváhajte nás kontaktovať. Sme tu pre vás.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column: Contact Details & Hours */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><MapPin className="h-6 w-6 mr-3 text-primary"/> Adresa</h2>
              <p className="text-muted-foreground text-lg">
                Vinohradnícka 123<br />
                902 01 Pezinok<br />
                Slovensko
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><Phone className="h-6 w-6 mr-3 text-primary"/> Telefón</h2>
              <a href="tel:+4219XXYYYZZZ" className="text-muted-foreground text-lg hover:text-primary transition-colors">+421 9XX YYY ZZZ</a>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><Mail className="h-6 w-6 mr-3 text-primary"/> E-mail</h2>
              <a href="mailto:rezervacie@putec.sk" className="text-muted-foreground text-lg hover:text-primary transition-colors">rezervacie@putec.sk</a>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center"><Clock className="h-6 w-6 mr-3 text-primary"/> Otváracie Hodiny</h2>
              <ul className="text-muted-foreground text-lg space-y-1">
                <li>Pondelok - Piatok: 10:00 - 18:00</li>
                <li>Sobota: 10:00 - 14:00 (alebo podľa dohody)</li>
                <li>Nedeľa: Zatvorené</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">Návštevy a degustácie mimo otváracích hodín sú možné po telefonickej dohode.</p>
            </div>
          </div>

          {/* Right Column: Map */}
          <div className="h-80 md:h-full w-full rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.636991126983!2d17.26930931563498!3d48.28956197923614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c9b1fe7b1a4c3%3A0x3b8a5c3d4e3b1b3b!2sPezinok!5e0!3m2!1ssk!2ssk!4v1678886400000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <FaqSection title="Časté otázky k návšteve" faqData={faqData} />
    </>
  );
}
