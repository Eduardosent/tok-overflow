"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

export const Vision = () => {
  const t = useTranslations("Landing.Vision");

  return (
    <section id="vision" className="relative py-4 overflow-hidden bg-white">
      {/* Fondos decorativos */}
      <div className="absolute -top-20 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-secondary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-center">

          {/* Imagen */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[380px]">
              <Image
                src="/landing/vision2.png"
                alt="Visión Estratégica TOK"
                width={407}
                height={612}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="w-full">
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-8">
              {t("sectionTitle")}
            </span>

            <div className="space-y-8 text-text-secondary text-base md:text-lg leading-[1.5] md:mr-24">
              <p>
                {t("paragraph1")}
              </p>

              <p>
                {t("paragraph2")}
              </p>

              <p>
                {t("paragraph3")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};