import Image from 'next/image';
import { FaqSection } from '@/components/faq-section';


export default function ONasPage() {
  const team = [
    {
      name: 'Vinár a hospodár',
      role: 'Strážca tradície',
      bio: 'S vášňou a odbornosťou dohliada na každý krok, od rezu viniča až po finálne dozrievanie vína v pivnici. Jeho rukami prechádza dedičstvo, ktoré s hrdosťou odovzdáva ďalej.',
      image: '/images/degustacie/Brano-degustácia-x.webp',
    },
    {
      name: 'Srdce vinárstva',
      role: 'Tvorca zážitkov',
      bio: 'Stará sa o to, aby príbeh nášho vinárstva ožil pri každej degustácii a návšteve. S úsmevom a pohostinnosťou otvára dvere do nášho sveta všetkým milovníkom vína.',
      image: '/images/ubytovanie/degustačná.webp',
    },
  ];

  const galleryImages = [
    { src: '/images/ubytovanie/dvor s kostolom.webp', alt: 'Pohľad na vinárstvo a okolie' },
    { src: '/images/degustacie/ruky-x.webp', alt: 'Poctivá práca vo vinici' },
    { src: '/images/degustacie/sudy-x.webp', alt: 'Naše víno zreje v dubových sudoch' },
    { src: '/images/degustacie/misa-x.webp', alt: 'Čerstvo oberané hrozno' },
    { src: '/images/ubytovanie/Altánok.webp', alt: 'Miesto pre oddych a degustácie' },
    { src: '/images/degustacie/degustácia-x.webp', alt: 'Pripravené na degustáciu' },
    { src: '/images/ubytovanie/IMG_6011-2.webp', alt: 'Vinice z vtáčej perspektívy' },
    { src: '/images/degustacie/jama-x.webp', alt: 'Tradičná pivnica' },
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
          src="/images/ubytovanie/dvor so sudom.webp"
          alt="Rodinné vinárstvo Pútec"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0 brightness-50"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Príbeh Písaný Vínom</h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Sme viac než len vinárstvo. Sme rodina, ktorá po generácie s láskou a vášňou pretvára dary zeme na vína s dušou.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary">Z generácie na generáciu</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Naša rodina je s vinohradníctvom spätá už po celé generácie. To, čo začalo ako malá vinica a dedova vášeň, sme postupne premenili na moderné vinárstvo, ktoré si však stále ctí tradičné postupy a odkaz našich predkov. Každý pohár nášho vína v sebe nesie kus našej histórie, tvrdej práce a nekonečnej lásky k remeslu.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-center text-primary mb-12">Ľudia za vinárstvom</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                  <Image src={member.image} alt={member.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-semibold">{member.role}</p>
                  <p className="mt-2 text-muted-foreground">{member.bio}</p>
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
