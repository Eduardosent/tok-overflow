"use client";
import React from 'react';
import Image from 'next/image';
import { useTranslations } from "next-intl";

interface PillarProps {
  title: string;
  description: string;
  image: string;
}

const PillarCard: React.FC<PillarProps> = ({ title, description, image }) => (
  <div className="flex-1 bg-secondary rounded-xl transition-all duration-300 ease-in-out hover:bg-primary hover:h-[420px] h-[400px] text-white flex flex-col shadow-lg overflow-hidden">
    {/* Imagen con 'sizes' para optimizar el rendimiento */}
    <div className="w-full h-60 relative">
      <Image 
        src={image} 
        alt={title} 
        fill 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover" 
      />
    </div>
    <div className="p-5 flex flex-col">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export const Pillars: React.FC = () => {
  const t = useTranslations("Landing.Pillars");

  const pillars: PillarProps[] = [
    {
      title: t("pillar1Title"),
      description: t("pillar1Desc"),
      image: "/landing/pilar1.png"
    },
    {
      title: t("pillar2Title"),
      description: t("pillar2Desc"),
      image: "/landing/pilar2.png"
    },
    {
      title: t("pillar3Title"),
      description: t("pillar3Desc"),
      image: "/landing/pilar3.png"
    }
  ];

  return (
    <section id="pillars" className="bg-white py-20 relative overflow-hidden">
      {/* 4 Círculos decorativos grandes y distribuidos */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary opacity-20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary font-bold mb-12 text-center text-gray-900">
          {t("sectionTitle")}
        </h2>
        <div className="flex flex-col md:flex-row items-end gap-6">
          {pillars.map((pillar, index) => (
            <PillarCard 
              key={index} 
              title={pillar.title} 
              description={pillar.description}
              image={pillar.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;