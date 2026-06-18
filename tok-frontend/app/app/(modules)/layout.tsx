"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useBalances, useCreatedCoins } from "@/hooks/queries";

interface Props {
  children: ReactNode;
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ModulesLayout({ children }: Props) {
  const router = useRouter();
  const account = useCurrentAccount();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {data,sui,mist} = useBalances();

  console.log(data, sui, mist)

  const goBackToModules = () => {
    router.back();
    setSidebarOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fcff] text-[#071126]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/logo1.png"
          alt=""
          width={430}
          height={430}
          className="absolute -left-28 top-20 opacity-[0.025]"
        />

        <Image
          src="/logo2.png"
          alt=""
          width={360}
          height={360}
          className="absolute -right-12 bottom-4 opacity-[0.03]"
        />

        <div className="absolute left-1/2 top-0 h-[430px] w-[430px] -translate-x-1/2 rounded-full bg-[#00A8FF]/[0.06] blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[#d9eefc]/80 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile: flecha back + hamburguesa. Sin logo. */}
            <button
              type="button"
              onClick={goBackToModules}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9eefc] bg-white text-[#5d6b86] shadow-sm transition hover:border-[#00A8FF]/40 hover:text-[#00A8FF] lg:hidden"
              aria-label="Go back"
            >
              <ArrowLeft size={21} />
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d9eefc] bg-white text-[#5d6b86] shadow-sm transition hover:border-[#00A8FF]/40 hover:text-[#00A8FF] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            {/* Desktop: back con texto + logo */}
            <button
              type="button"
              onClick={goBackToModules}
              className="hidden h-11 items-center gap-2 rounded-2xl border border-[#d9eefc] bg-white px-4 text-sm font-semibold text-[#5d6b86] shadow-sm transition hover:border-[#00A8FF]/40 hover:text-[#00A8FF] lg:flex"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={goBackToModules}
              className="hidden items-center gap-2 transition-opacity hover:opacity-80 lg:flex"
            >
              <Image src="/logo1.png" alt="TOK" width={38} height={38} />

              <span className="text-[17px] font-extrabold tracking-tight">
                TOK
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {account ? (
              <div className="hidden rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 md:block">
                {formatAddress(account.address)}
              </div>
            ) : (
              <div className="hidden rounded-full border border-[#d8eefc] bg-[#f4fbff] px-3 py-2 text-xs font-semibold text-[#5d6b86] md:block">
                Disconnected
              </div>
            )}

            <div className="[&_button]:!h-11 [&_button]:!rounded-2xl [&_button]:!border-0 [&_button]:!bg-[#00A8FF] [&_button]:!px-4 [&_button]:!text-sm [&_button]:!font-bold [&_button]:!text-white [&_button]:!shadow-sm [&_button]:hover:!opacity-90">
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-[#071126]/30 backdrop-blur-sm"
          />

          <aside className="absolute left-0 top-0 h-full w-[310px] max-w-[82vw] border-r border-[#d9eefc] bg-white shadow-2xl">
            <div className="flex h-[76px] items-center justify-between border-b border-[#e8f4fd] px-5">
              <button
                type="button"
                onClick={goBackToModules}
                className="flex items-center gap-3"
              >
                <Image src="/logo1.png" alt="TOK" width={38} height={38} />
                <span className="text-lg font-extrabold">TOK</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4fbff] text-[#5d6b86]"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2 p-5">
              <div className="my-4 h-px bg-[#e8f4fd]" />

              <div className="rounded-2xl border border-[#d8eefc] bg-[#f4fbff] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b8ca8]">
                  Wallet
                </p>

                <p className="mt-2 text-sm font-bold text-[#071126]">
                  {account ? formatAddress(account.address) : "Disconnected"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-4">
        {children}
      </main>
    </div>
  );
}