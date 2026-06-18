"use client";

import {
  Coins,
  Lock,
  ImageIcon,
  Copyright,
  Trophy,
  GraduationCap,
  Code2,
  Rocket,
  ShieldCheck,
  Repeat,
  Landmark,
  ChartCandlestick,
  HandCoins,
  KeyRound,
  Building2,
  Store,
  Gem,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Token Creation",
    description: "Crea y emite tokens fácilmente.",
    icon: Coins,
  },
  {
    title: "Staking",
    description: "Agrega staking a cualquier token.",
    icon: Lock,
  },
  {
    title: "Vesting",
    description: "Libera tokens automáticamente.",
    icon: ShieldCheck,
  },
  {
    title: "NFT Collections",
    description: "Crea colecciones NFT.",
    icon: ImageIcon,
  },

  {
    title: "Copyright",
    description: "Seguimiento legal de creaciones.",
    icon: Copyright,
  },
  {
    title: "Betting",
    description: "Apuestas para deportes y juegos.",
    icon: Trophy,
  },
  {
    title: "TOK Learn",
    description: "Aprende blockchain y gana.",
    icon: GraduationCap,
  },

  {
    title: "TOK Dev & SDK",
    description: "SDK para desarrolladores.",
    icon: Code2,
  },
  {
    title: "TOK Launchpad",
    description: "Launchpad descentralizado.",
    icon: Rocket,
  },
  {
    title: "Regulated Launchpad",
    description: "Emisiones reguladas.",
    icon: ShieldCheck,
  },
  {
    title: "DEX",
    description: "Exchange descentralizado.",
    icon: Repeat,
  },

  {
    title: "CEX",
    description: "Exchange centralizado.",
    icon: Landmark,
  },
  {
    title: "Tokenized Exchange",
    description: "Mercado tokenizado.",
    icon: ChartCandlestick,
  },
  {
    title: "Lending",
    description: "Liquidez con colateral.",
    icon: HandCoins,
  },

  {
    title: "Renting",
    description: "Modelos tokenizados.",
    icon: KeyRound,
  },
  {
    title: "Real State",
    description: "Inversión inmobiliaria.",
    icon: Building2,
  },
  {
    title: "Marketplace",
    description: "Compra y venta de activos.",
    icon: Store,
  },
  {
    title: "TOK Securities",
    description: "Repartición de ganancias.",
    icon: Gem,
  },

  {
    title: "More in the Future",
    description: "Más innovación por venir.",
    icon: Sparkles,
  },
];

const rows = [
  features.slice(0, 4),
  features.slice(4, 7),
  features.slice(7, 11),
  features.slice(11, 14),
  features.slice(14, 18),
  features.slice(18, 19),
];

function HexCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <div
      className="
        group
        relative
        transition-all
        duration-300
        hover:drop-shadow-[0_0_22px_rgba(0,174,255,0.28)]
      "
    >
      <div className="relative w-[260px] sm:w-[280px] lg:w-[290px] h-[200px] sm:h-[210px] lg:h-[220px]">
        {/* Border */}
        <div
          className="
            absolute inset-0
            bg-primary
            transition-all duration-300
            group-hover:shadow-[0_0_22px_rgba(0,174,255,0.18)]
          "
          style={{
            clipPath:
              "polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0% 50%)",
          }}
        />

        {/* Inner */}
        <div
          className="
            absolute inset-[1.7px]
            bg-white
            flex flex-col
            items-center
            justify-center
            text-center
            px-6 sm:px-7
          "
          style={{
            clipPath:
              "polygon(25% 4%,75% 4%,100% 50%,75% 96%,25% 96%,0% 50%)",
          }}
        >
          <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-primary stroke-[1.8] mb-3 transition-transform duration-300 group-hover:scale-110" />

          <h3 className="text-[16px] sm:text-[18px] font-bold text-foreground leading-tight max-w-[190px]">
            {title}
          </h3>

          <p className="mt-2 text-[13px] sm:text-[14px] text-text-secondary leading-relaxed max-w-[190px] sm:max-w-[200px]">
            {description}
          </p>

          <div className="mt-3 h-[3px] w-12 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

export const Features = () => {
  return (
    <section id="features" className="relative py-12 overflow-hidden bg-white">
      {/* Background blur */}
      <div className="absolute top-0 left-0 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-secondary/10 rounded-full blur-[120px]" />
      
      {/* TOK Logos Background */}
<div className="absolute inset-0 pointer-events-none select-none overflow-hidden">

  {/* Top Left */}
  <Image
    src="/logo1.png"
    alt=""
    width={90}
    height={90}
    className="
      absolute
      top-[8%]
      left-[4%]
      rotate-[18deg]
      opacity-[0.35]
    "
  />

  {/* Top Right */}
  <Image
    src="/logo2.png"
    alt=""
    width={95}
    height={95}
    className="
      absolute
      top-[10%]
      right-[6%]
      -rotate-[22deg]
      opacity-[0.45]
    "
  />

  {/* Middle Left */}
  <Image
    src="/logo2.png"
    alt=""
    width={80}
    height={80}
    className="
      absolute
      top-[38%]
      left-[2%]
      rotate-[42deg]
      opacity-[0.5]
    "
  />

  {/* Center Right */}
  <Image
    src="/logo1.png"
    alt=""
    width={100}
    height={100}
    className="
      absolute
      top-[48%]
      right-[3%]
      -rotate-[16deg]
      opacity-[0.2]
    "
  />

  {/* Bottom Left */}
  <Image
    src="/logo1.png"
    alt=""
    width={90}
    height={90}
    className="
      absolute
      bottom-[12%]
      left-[14%]
      rotate-[34deg]
      opacity-[0.4]
    "
  />

  {/* Bottom Right */}
  <Image
    src="/logo2.png"
    alt=""
    width={85}
    height={85}
    className="
      absolute
      bottom-[8%]
      right-[16%]
      -rotate-[38deg]
      opacity-[0.3]
    "
  />
</div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-8 lg:mb-4">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
            Funcionalidades de{" "}
            <span className="text-primary">TOK</span>
          </h2>

          <p className="mt-5 text-text-secondary text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Un ecosistema completo e integrado para crear,
            gestionar, invertir e intercambiar activos
            digitales y del mundo real.
          </p>
        </div>

        {/* MOBILE / TABLET */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center lg:hidden">
          {features.map((item) => (
            <HexCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        {/* DESKTOP HONEYCOMB */}
        <div className="hidden lg:flex flex-col items-center">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`
                flex justify-center
                ${rowIndex !== 0 ? "-mt-[19px]" : ""}
              `}
            >
              {row.map((item) => (
                <HexCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};