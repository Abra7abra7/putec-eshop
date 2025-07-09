import { FaqSection } from '@/components/faq-section';
import { Mail, Phone, Clock, Building } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function KontaktPage() {

  const faqData = [
    { question: 'Je potrebná rezervácia na návštevu?', answer: 'Áno, pre degustácie aj ubytovanie je potrebná rezervácia vopred. Zabezpečíte si tak, že sa vám budeme môcť naplno venovať a pripraviť pre vás ten najlepší zážitok.' },
    { question: 'Dá sa u vás platiť kartou?', answer: 'Áno, akceptujeme platbu v hotovosti aj všetkými bežnými platobnými kartami.' },
    { question: 'Je vinárstvo bezbariérové?', answer: 'Naše hlavné priestory vrátane degustačnej miestnosti sú čiastočne prístupné, avšak historická pivnica má obmedzený prístup. Pre viac informácií o konkrétnych potrebách nás, prosím, kontaktujte vopred.' },
    { question: 'Môžem si u vás kúpiť víno aj bez degustácie?', answer: 'Samozrejme. Počas otváracích hodín si môžete prísť kúpiť víno so sebou. Radi vám s výberom poradíme.' },
  ];

  const contactDetails = [
    { icon: Building, title: 'Adresa', lines: ['Pezinská 154', '90201 Vinosady'] },
    { icon: Phone, title: 'Telefón', lines: ['+421 911 250 400'], link: 'tel:+421911250400' },
    { icon: Phone, title: 'Zákaznícka linka (8-20h)', lines: ['+421 902 144 074'], link: 'tel:+421902144074' },
    { icon: Mail, title: 'E-mail', lines: ['info@vinoputec.sk'], link: 'mailto:info@vinoputec.sk' },
    { icon: Clock, title: 'Otváracie Hodiny', lines: ['Po - Pia: 10:00 - 18:00', 'So: 10:00 - 14:00 (alebo podľa dohody)', 'Ne: Zatvorené'] },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image
          src="/images/ubytovanie/dvor-s-kostolom.webp"
          alt="Vinárstvo Pútec"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Spojte sa s nami</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Máte otázky alebo si chcete rezervovať zážitok? Neváhajte nás kontaktovať. Sme tu pre vás.
          </p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contactDetails.map((detail) => (
              <div key={detail.title} className="bg-card p-8 rounded-xl shadow-md text-center flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                  <detail.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-primary/90">{detail.title}</h3>
                <div className="text-muted-foreground">
                  {detail.link ? (
                    <a href={detail.link} className="hover:text-primary transition-colors">{detail.lines[0]}</a>
                  ) : (
                    detail.lines.map((line) => <p key={line}>{line}</p>)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Map Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Napíšte nám</h2>
            <p className="mt-4 text-lg text-muted-foreground">Vyplňte formulár nižšie a my sa vám ozveme čo najskôr.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <form className="space-y-6 bg-background p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input placeholder="Vaše meno" className="h-12" />
                <Input type="email" placeholder="Váš e-mail" className="h-12" />
              </div>
              <Input placeholder="Predmet správy" className="h-12" />
              <Textarea placeholder="Vaša správa..." rows={6} />
              <Button type="submit" size="lg" className="w-full">Odoslať správu</Button>
            </form>
            <div className="h-96 lg:h-full w-full rounded-xl overflow-hidden shadow-lg">
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
      </section>

      {/* FAQ Section */}
      <FaqSection title="Časté otázky k návšteve" faqData={faqData} />
    </>
  );
}
