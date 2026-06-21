"use client";
import React from 'react';
import { useTranslations } from "next-intl";

export function TokenSection() {
  const t = useTranslations("Landing.TokenSection");

  return (
    <section id="token" className="w-full bg-white py-4 px-6 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Encabezado Compacto */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="/logo1.png" 
            alt="Logo TOK" 
            className="h-8 w-auto object-contain"
          />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("sectionTitle")}
          </h2>
        </div>

        {/* Descripción */}
        <p className="text-base text-slate-600 leading-relaxed max-w-3xl mb-8">
          {t("mainDescription")}
        </p>

        {/* Contenedor Grid Alineado al Inicio (items-start) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contenido Técnico */}
          <div className="lg:col-span-2 space-y-5">
            {/* Utility Token */}
            <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-full">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t("utility.title")}
              </h3>
              <p className="text-sm text-slate-600 mb-1">
                {t("utility.desc")}
              </p>
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <span className="font-semibold">{t("utility.label")}</span> {t("utility.value")}
                </span>
              </p>
            </div>

            {/* Transición a Security */}
            <div className="relative pl-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-full">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {t("security.title")}
              </h3>
              <p className="text-sm text-slate-600 mb-1">
                {t("security.desc")}
              </p>
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>
                  <span className="font-semibold">{t("security.label")}</span> {t("security.value")}
                </span>
              </p>
            </div>
          </div>

          {/* Tarjeta Única de Datos del Token */}
          <div className="relative bg-primary text-white rounded-2xl p-5 shadow-sm flex flex-col justify-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/80 mb-3 pb-1.5 border-b border-white/10">
              {t("card.title")}
            </h4>
            
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:space-y-3 lg:gap-0">
              <div>
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">
                  {t("card.supplyLabel")}
                </p>
                <p className="text-2xl font-black tracking-tight">
                  {t("card.supplyValue")}
                </p>
              </div>
              
              <div className="lg:pt-2 lg:border-t lg:border-white/10">
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">
                  {t("card.salesLabel")}
                </p>
                <p className="text-2xl font-black tracking-tight">
                  {t("card.salesValue")}
                </p>
              </div>

              <div className="col-span-2 pt-2 border-t border-white/10 lg:col-span-1">
                <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">
                  {t("card.launchLabel")}
                </p>
                <p className="text-xl font-bold tracking-tight mt-0.5">
                  {t("card.launchValue")} <span className="text-xs font-normal text-white/80">{t("card.launchDetail")}</span>
                </p>
              </div>
            </div>

            <span className="absolute bottom-2 right-3 text-[11px] font-medium text-white/50 italic">
              {t("card.footerText")}
            </span>
          </div>

        </div>

        {/* Nota Legal Compacta */}
        <div className="mt-8 bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-600">{t("legal.label")}</span> {t("legal.text")}
          </p>
        </div>

      </div>
    </section>
  );
}