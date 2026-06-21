"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// Added createPortal and Clock, Droplets (for faucet icon)
import { createPortal } from "react-dom";
import { ArrowRight, Info, Clock, Droplets, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const backgroundLogos = [
  {
    src: "/logo1.png",
    className: "top-[6%] left-[6%] w-[55px] sm:w-[70px] rotate-[18deg] opacity-[0.04]",
  },
  {
    src: "/logo2.png",
    className: "top-[12%] right-[10%] w-[70px] sm:w-[90px] -rotate-[22deg] opacity-[0.05]",
  },
  {
    src: "/logo1.png",
    className: "bottom-[15%] left-[8%] w-[65px] sm:w-[80px] rotate-[35deg] opacity-[0.04]",
  },
  {
    src: "/logo2.png",
    className: "bottom-[10%] right-[6%] w-[75px] sm:w-[95px] -rotate-[12deg] opacity-[0.04]",
  },
  {
    src: "/logo1.png",
    className: "top-[42%] left-[22%] w-[45px] sm:w-[60px] rotate-[55deg] opacity-[0.03]",
  },
  {
    src: "/logo2.png",
    className: "top-[58%] right-[22%] w-[55px] sm:w-[75px] -rotate-[40deg] opacity-[0.03]",
  },
];

const modules = [
  {
    href: "/app/factory",
    icon: "/icons/factory.png",
    title: "TOK Factory",
    description: "Create and deploy fungible tokens with configurable supply, metadata and permissions.",
    isComingSoon: false,
  },
  {
    href: "/app/fees",
    icon: "/icons/fee1.png",
    title: "TOK Fees",
    description: "Create and manage your own dynamic fee structure to charge for your services.",
    isComingSoon: true,
  },
  {
    href: "/app/staking",
    icon: "/icons/staking.png",
    title: "TOK Staking",
    description: "Create and manage staking pools with flexible or locked options and configurable APR.",
    isComingSoon: true,
  },
  {
    href: "/app/vesting",
    icon: "/icons/vesting.png",
    title: "TOK Vesting",
    description: "Set up vesting schedules with cliff periods and linear token release for any recipient.",
    isComingSoon: false,
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

const recommendedFaucets = [
  { name: "N1Stake Faucet", url: "https://faucet.n1stake.com/" },
  { name: "SuiLearn Faucet", url: "https://faucet.suilearn.io/" },
];

export default function AppPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFaucetModalOpen, setIsFaucetModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // To ensure document is available for portal

  // Handle portal mounting safely
  useEffect(() => {
    setMounted(true);
    // Create portal root if it doesn't exist
    if (!document.getElementById("portal-root")) {
      const portalDiv = document.createElement("div");
      portalDiv.id = "portal-root";
      document.body.appendChild(portalDiv);
    }
    return () => setMounted(false);
  }, []);

  // Auto-hide toast after 3.5 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Prevent navigation and trigger feedback if module is under development
  const handleModuleClick = (e: React.MouseEvent, isComingSoon: boolean, title: string) => {
    if (isComingSoon) {
      e.preventDefault();
      setToastMessage(`${title} will be available very soon.`);
    }
  };

  const toggleFaucetModal = () => setIsFaucetModalOpen(!isFaucetModalOpen);

  // --- Portal Component ---
  const FaucetModalPortal = () => {
    if (!mounted) return null;
    const portalRoot = document.getElementById("portal-root");
    if (!portalRoot) return null;

    return createPortal(
      <AnimatePresence>
        {isFaucetModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFaucetModal}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Card - Fixed center of screen */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-primary/20 bg-white p-6 shadow-2xl shadow-primary/10"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Droplets size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">Recommended Faucets</h3>
                      <p className="text-xs text-text-secondary mt-0.5">Need SUI for transactions? Use these trusted links.</p>
                    </div>
                  </div>
                  <button onClick={toggleFaucetModal} className="group h-8 w-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                    <X size={18} className="text-text-secondary group-hover:text-foreground" />
                  </button>
                </div>

                {/* Faucet List */}
                <div className="space-y-3">
                  {recommendedFaucets.map((faucet) => (
                    <a
                      key={faucet.url}
                      href={faucet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Droplets size={16} className="text-primary" />
                        </div>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{faucet.name}</span>
                      </div>
                      <ExternalLink size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>

                <div className="mt-6 text-center text-[11px] text-text-secondary leading-relaxed px-2">
                    Note: These faucets are commonly recommended within the SUI ecosystem. Always ensure you are connecting to official and trusted domains.
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      portalRoot
    );
  };
  // --- End Portal Component ---


  return (
    <>
      <main className="relative h-screen overflow-hidden bg-white">
        {/* Toast Notification Container */}
        <div className="absolute top-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4 pointer-events-none">
          <AnimatePresence mode="wait">
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-white/95 px-4 py-3.5 shadow-xl shadow-primary/5 backdrop-blur-md pointer-events-auto"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Info size={16} className="text-primary" />
                </div>
                <p className="text-xs font-semibold text-slate-800 tracking-tight">
                  {toastMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Ambient background blur elements */}
        <div className="absolute -top-24 -left-24 h-[340px] w-[340px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -bottom-24 -right-24 h-[340px] w-[340px] rounded-full bg-cyan-400/10 blur-[110px]" />

        {/* Decorative background branding assets */}
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

        {/* Main layout container */}
        <section className="relative z-10 flex h-full flex-col items-center px-5 py-6 sm:px-8 sm:py-8">
          {/* Header section - Main container for header */}
          <div className="relative flex flex-col items-center w-full max-w-[940px]">
            {/* Header Content */}
            <div className="flex flex-col items-center mb-1 sm:mb-2">
                {/* Brand identity wrapper */}
                <div className="mb-5 flex items-center gap-3">
                  <Image src="/logo1.png" alt="TOK" width={40} height={40} />
                  <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                    TOK Ecosystem
                  </span>
                </div>

                {/* Marketing text content */}
                <div className="text-center relative">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    Available Functionalities
                  </h1>
                  <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-text-secondary">
                    Access the currently available TOK modules.
                  </p>
                </div>
            </div>

            {/* --- Pulsating Faucet Button --- */}
            <motion.button
              onClick={toggleFaucetModal}
              className={`
                z-30
                flex items-center gap-2.5
                rounded-full
                border
                border-cyan-400/30
                bg-white/80
                backdrop-blur-md
                pl-3.5 pr-4
                h-10 sm:h-11
                text-sm sm:text-base font-semibold text-foreground
                shadow-lg shadow-cyan-400/5
                transition-all
                duration-300
                hover:border-cyan-400/50
                hover:bg-cyan-50/50
                hover:shadow-cyan-400/10

                /* Mobile: fixed corner placement, smaller size */
                fixed
                top-2
                right-3
                h-8
                gap-1.5
                pl-2.5
                pr-3
                text-xs

                /* Desktop: fixed to the right edge of the viewport (never leaves screen),
                   vertically centered on the header, slightly smaller than before */
                sm:right-4
                sm:top-1/5
                sm:-translate-y-1/2
                sm:h-10
                sm:gap-2
                sm:pl-3
                sm:pr-3.5
                sm:text-sm
              `}
              animate={{
                scale: [1, 1.03, 1], // Small pulsating effect
              }}
              transition={{
                duration: 2.2, // Time per cycle
                repeat: Infinity, // Loop infinitely
                ease: "easeInOut",
              }}
            >
              <Droplets size={14} className="text-cyan-400 shrink-0 sm:hidden" />
              <Droplets size={18} className="text-cyan-400 shrink-0 hidden sm:block" />
              <span className="block sm:hidden">Need SUI?</span>
              <span className="hidden sm:block">Need SUI Faucet?</span>
            </motion.button>
            {/* --- End Pulsating Faucet Button --- */}
          </div>

          {/* Core feature matrix grid */}
          <div className="grid w-full max-w-[940px] grid-cols-1 gap-4 sm:grid-cols-2 my-3 sm:my-4">
            {modules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.isComingSoon ? "#" : mod.href}
                onClick={(e) => handleModuleClick(e, mod.isComingSoon, mod.title)}
                className="
                  group
                  relative
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
                  cursor-pointer
                "
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Module representation icon */}
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-2">
                    <Image
                      src={mod.icon}
                      alt={mod.title}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>

                  {/* Module descriptions */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      {mod.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-text-secondary">
                      {mod.description}
                    </p>
                  </div>

                  {/* Conditional status indicator layout */}
                  {mod.isComingSoon ? (
                    <Clock className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary" />
                  ) : (
                    <ArrowRight className="mt-1 h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Upcoming roadmap pipeline section */}
          <div className="w-full max-w-[940px] text-center mt-auto">
            <p className="mb-2 text-[10px] sm:text-xs font-medium uppercase tracking-[0.18em] text-text-secondary">
              Future Modules
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {futureModules.map((item) => (
                <div
                  key={item}
                  className="
                    rounded-full
                    border
                    border-gray-200
                    bg-gray-50/80
                    px-2.5
                    py-1
                    sm:px-3
                    sm:py-1.5
                    text-[10px]
                    sm:text-xs
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

      {/* Render the Faucet Modal via Portal at the end */}
      <FaucetModalPortal />
    </>
  );
}