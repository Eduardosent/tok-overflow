"use client";
import Link from "next/link";

export function Hero() {
  const handleScrollToFeatures = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Opcional: Actualiza la URL con el hash sin recargar la página
      window.history.pushState(null, "", "#features");
    }
  };

  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Círculos decorativos de fondo (opacos) */}
      <div className="absolute top-10 left-10 w-72 h-72 md:w-96 md:h-96 bg-primary/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-80 h-80 md:w-[500px] md:h-[500px] bg-secondary/20 rounded-full blur-[120px]" />

      {/* Contenido Principal */}
      <div className="relative z-10 text-center px-4 animate-in fade-in duration-1000 max-w-7xl">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 tracking-tight md:pt-16">
          Infraestructura de tokenización <br /> 
          <span className="text-primary">abierta para todos</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed px-2">
          TOK es el ecosistema que abre las puertas para que cualquiera pueda acceder a la blockchain y la tokenización con todos sus beneficios. Ofrecemos las soluciones de la tokenización a cualquier individuo, con o sin experiencia previa, diseñadas para ser utilizadas a gran escala y de manera accesible para todos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <Link 
            href="/app" 
            className="inline-flex items-center justify-center cursor-pointer bg-primary text-white px-8 py-4 rounded-md font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
          >
            Probar Ahora
          </Link>
          <button 
            onClick={handleScrollToFeatures}
            className="inline-flex items-center justify-center cursor-pointer border border-border text-foreground px-8 py-4 rounded-md font-semibold hover:bg-surface transition-all hover:border-primary hover:text-primary"
          >
            Ver Características
          </button>
        </div>
      </div>
    </section>
  );
}