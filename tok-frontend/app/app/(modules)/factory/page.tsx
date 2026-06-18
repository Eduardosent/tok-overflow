"use client";

import { useState } from "react";
import { FactoryTabs, MyTokens, NewToken } from "@/components/app/modules/factory";

export default function FactoryPage() {
  // 1. Definimos el estado aquí
  const [view, setView] = useState<'my-tokens' | 'new'>('my-tokens');
    
  return (
    <main>
      {/* 2. Le pasamos el estado y la función para cambiarlo */}
      <FactoryTabs currentTab={view} onTabChange={setView}/>
      
      <div className="pt-4">
        {view === 'my-tokens' ? (
          <MyTokens onSwitchToNew={() => setView('new')} />
        ) : (
          <NewToken />
        )}
      </div>
    </main>
  );
}