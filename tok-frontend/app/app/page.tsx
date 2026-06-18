"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
} from "lucide-react";

const backgroundLogos = [
  {
    src: "/logo1.png",
    className:
      "top-[6%] left-[6%] w-[55px] sm:w-[70px] rotate-[18deg] opacity-[0.04]",
  },
  {
    src: "/logo2.png",
    className:
      "top-[12%] right-[10%] w-[70px] sm:w-[90px] -rotate-[22deg] opacity-[0.05]",
  },
  {
    src: "/logo1.png",
    className:
      "bottom-[15%] left-[8%] w-[65px] sm:w-[80px] rotate-[35deg] opacity-[0.04]",
  },
  {
    src: "/logo2.png",
    className:
      "bottom-[10%] right-[6%] w-[75px] sm:w-[95px] -rotate-[12deg] opacity-[0.04]",
  },
  {
    src: "/logo1.png",
    className:
      "top-[42%] left-[22%] w-[45px] sm:w-[60px] rotate-[55deg] opacity-[0.03]",
  },
  {
    src: "/logo2.png",
    className:
      "top-[58%] right-[22%] w-[55px] sm:w-[75px] -rotate-[40deg] opacity-[0.03]",
  },
];

const modules = [
  {
    href: "/app/factory",
    icon: "/icons/factory.png",
    title: "TOK Factory",
    description:
      "Create and deploy fungible tokens with configurable supply, metadata and permissions.",
  },
  {
    href: "/app/staking",
    icon: "/icons/staking.png",
    title: "TOK Staking",
    description:
      "Create and manage staking pools with flexible or locked options and configurable APR.",
  },
  {
    href: "/app/vesting",
    icon: "/icons/vesting.png",
    title: "TOK Vesting",
    description:
      "Set up vesting schedules with cliff periods and linear token release for any recipient.",
  },
];

const futureModules = [
  "NFT Collections",
  "Launchpad",
  "DEX",
  "Marketplace",
  "TOK Learn",
  "Securities",
];

export default function AppPage() {
  return (
    <main className="relative h-screen overflow-hidden bg-white">
      {/* Blur background */}
      <div className="absolute -top-24 -left-24 h-[340px] w-[340px] rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute -bottom-24 -right-24 h-[340px] w-[340px] rounded-full bg-cyan-400/10 blur-[110px]" />

      {/* TOK logos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {backgroundLogos.map((logo, index) => (
          <Image
            key={index}
            src={logo.src}
            alt=""
            width={100}
            height={100}
            className={`absolute select-none ${logo.className}`}
          />
        ))}
      </div>

      {/* Content */}
      <section className="relative z-10 flex h-full flex-col items-center justify-between px-5 py-6 sm:px-8 sm:py-8">
        {/* Top */}
        <div className="flex flex-col items-center">
          {/* Brand */}
          <div className="mb-5 flex items-center gap-3">
            <Image src="/logo1.png" alt="TOK" width={40} height={40} />
            <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
              TOK Ecosystem
            </span>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Available Functionalities
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-text-secondary">
              Access the currently available TOK modules.
            </p>
          </div>
        </div>

        {/* Center cards */}
        <div className="flex w-full max-w-[900px] flex-col gap-3 sm:flex-row sm:gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="
                group
                relative
                flex-1
                overflow-hidden
                rounded-[28px]
                border
                border-primary/20
                bg-white/85
                p-4
                sm:p-5
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-primary/40
                hover:shadow-[0_0_40px_rgba(0,174,255,0.12)]
              "
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-2">
                  <Image
                    src={mod.icon}
                    alt={mod.title}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    {mod.title}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-text-secondary">
                    {mod.description}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div className="w-full max-w-[900px] text-center">
          <p className="mb-4 text-[11px] sm:text-sm font-medium uppercase tracking-[0.18em] text-text-secondary">
            Future Modules
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {futureModules.map((item) => (
              <div
                key={item}
                className="
                  rounded-full
                  border
                  border-gray-200
                  bg-gray-50/80
                  px-3
                  py-1.5
                  sm:px-4
                  sm:py-2
                  text-xs
                  sm:text-sm
                  text-gray-500
                "
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}