import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';
import { Globe, Heart, Leaf } from 'lucide-react';

export default function ONasPage() {
  const team = [
    {
      name: 'Ján Pútec',
      role: 'Zakladateľ & Vinár',
      bio: 'Ján zdedil lásku k vínu po svojom otcovi a pretavil ju do rodinného vinárstva. Jeho víziou je spájať tradičné postupy s modernými poznatkami a tvoriť vína, ktoré rozprávajú príbeh nášho kraja.',
      image: 'https://images.unsplash.com/photo-1562788869-4cf32760b725?q=80&w=2070&auto=format&fit=crop',
    },
    {
      name: 'Mária Pútecová',
      role: 'Starostlivosť o hostí & Marketing',
      bio: 'Mária je srdcom nášho vinárstva. Stará sa o to, aby sa každý hosť u nás cítil ako doma. Organizuje degustácie a s láskou sa venuje marketingu, aby sa o našich vínach dozvedel celý svet.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1557697199-4315e21419a4?q=80&w=1935&auto=format&fit=crop', alt: 'Naše vinice v lete' },
    { src: 'https://images.unsplash.com/photo-1519671482749-b09f7232f241?q=80&w=2070&auto=format&fit=crop', alt: 'Sudy v našej pivnici' },
    { src: 'https://images.unsplash.com/photo-1563640236439-2313a5b8a08a?q=80&w=1974&auto=format&fit=crop', alt: 'Detail hrozna' },
    { src: 'https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=2070&auto=format&fit=crop', alt: 'Práca vo vinici' },
  ];

  const faqData = [
    { question: 'Kde sa nachádzajú vaše vinice?', answer: 'Naše vinice sa rozprestierajú na slnečných svahoch Malých Karpát, v regióne s bohatou vinohradníckou históriou, ktorá dáva našim vínam jedinečný minerálny charakter.' },
    { question: 'Aké odrody hrozna pestujete?', answer: 'Zameriavame sa na tradičné odrody typické pre náš región, ako sú Veltlínske zelené, Rizling rýnsky, Frankovka modrá a Svätovavrinecké. Experimentujeme však aj s novými odrodami.' },
    { question: 'Je vaše vinárstvo otvorené pre verejnosť?', answer: 'Áno, radi vás privítame na našich degustáciách alebo v rámci ubytovania. Pre návštevu je však potrebná rezervácia vopred, aby sme sa vám mohli plne venovať.' },
    { question: 'Používate pri výrobe vína udržateľné postupy?', answer: 'Rešpekt k prírode je základom našej filozofie. Snažíme sa minimalizovať chemické postreky, podporujeme biodiverzitu vo viniciach a využívame postupy integrovanej produkcie.' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1533073526-748938941433?q=80&w=2070&auto=format&fit=crop"
          alt="Rodinné vinárstvo Pútec"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Príbeh Písaný Vínom</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Sme viac než len vinárstvo. Sme rodina, ktorá po generácie s láskou a vášňou pretvára dary zeme na vína s dušou.
          </p>
        </div>
      </section>

      {/* Our Story & Philosophy */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Naša Cesta</h2>
              <p className="text-muted-foreground mt-4 text-lg">
                História nášho vinárstva sa začala písať pred viac ako 50 rokmi, keď náš starý otec zasadil prvé korene viniča. Dnes, už tretia generácia, pokračujeme v jeho odkaze. Spájame osvedčené, tradičné postupy s modernými poznatkami a technológiami, aby sme z každého strapca hrozna dostali to najlepšie.
              </p>
            </div>
            <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden order-1 md:order-2">
                <Image 
                    src="https://images.unsplash.com/photo-1621269942312-0713123b3997?q=80&w=1964&auto=format&fit=crop" 
                    alt="História vinárstva" 
                    layout="fill" 
                    objectFit="cover"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary mb-10">Naše Hodnoty</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="flex flex-col items-center">
                    <Leaf className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Rešpekt k Prírode</h3>
                    <p className="text-muted-foreground">Veríme, že kvalitné víno sa rodí vo vinici. Hospodárime s úctou k pôde a ekosystému, ktorý nám dáva to najcennejšie.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Heart className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Rodinná Tradícia</h3>
                    <p className="text-muted-foreground">Sme hrdí na naše korene. Vedomosti a skúsenosti si odovzdávame z generácie na generáciu a do každej fľaše vkladáme kus seba.</p>
                </div>
                <div className="flex flex-col items-center">
                    <Globe className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-2xl font-semibold mb-2">Poctivosť a Kvalita</h3>
                    <p className="text-muted-foreground">Od rezu viniča až po fľašovanie, naša práca je precízna a poctivá. Nerobíme kompromisy a našim cieľom je vaša maximálna spokojnosť.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-12 md:py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Spoznajte Nás</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative h-32 w-32 rounded-full overflow-hidden shrink-0">
                    <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
                </div>
                <div>
                    <h3 className="text-2xl font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Momentky z nášho života</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      <FaqSection title="Zaujíma vás viac?" faqData={faqData} />
    </>
  );
}
