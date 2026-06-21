"use client";
import React from 'react';
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Landing.Footer");

  return (
    <footer className="w-full bg-white border-t border-slate-100 py-16 px-6 font-sans text-slate-500">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
        
        {/* Izquierda: Logo, Eslogan y Copyright */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center gap-3">
            <img 
              src="/logo1.png" 
              alt="Logo TOK" 
              className="h-7 w-auto object-contain"
            />
            <span className="text-xl font-bold text-slate-900 tracking-tight">TOK</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {t("description")}
          </p>
          <div className="text-xs text-slate-400 pt-2">
            © {new Date().getFullYear()} TOK. {t("copyright")}
          </div>
        </div>

        {/* Derecha: Redes Sociales con Encabezado Descriptivo */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t("socialsTitle")}
          </h4>
          <div className="flex items-center gap-3">
            {/* Twitter / X */}
            <a 
              href="https://x.com/tokenizatesv" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all duration-200 border border-slate-100 flex items-center justify-center"
              aria-label="X (Twitter)"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Telegram */}
            <a 
              href="https://t.me/+hd45AGiA7NcwZTJh" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all duration-200 border border-slate-100 flex items-center justify-center"
              aria-label="Telegram"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.46 2.75-2.67.01-.03.01-.13-.05-.18-.06-.05-.14-.03-.2-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
              </svg>
            </a>

            {/* Discord */}
            <a 
              href="https://discord.gg/fJht6aCE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all duration-200 border border-slate-100 flex items-center justify-center"
              aria-label="Discord"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.298 12.298 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/company/130284021" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-slate-50 hover:bg-primary/10 text-slate-400 hover:text-primary rounded-xl transition-all duration-200 border border-slate-100 flex items-center justify-center"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}