import Link from "next/link";
import Image from "next/image";

export default function VestingPage() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500 flex flex-col items-center">
      {/* Short Context Intro */}
      <div className="text-center max-w-xl mx-auto">
        <p className="text-text-secondary text-sm leading-relaxed px-4">
          Vesting contracts securely lock and release tokens linearly over time. This system ensures structured distributions for team allocations or investor agreements, allowing participants to claim their unlocked shares safely.
        </p>
      </div>

      {/* Navigation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl justify-center">
        {/* Sent Vestings Card */}
        <Link 
          href="/app/vesting/sent"
          className="group flex flex-col items-center text-center p-4 bg-background border border-border rounded-xl transition-all hover:border-primary hover:shadow-md cursor-pointer aspect-square max-w-[180px] mx-auto w-full justify-center"
        >
          <div className="mb-3">
            <Image 
              src="/icons/vesting-up.png" 
              alt="Sent Vestings" 
              width={72} 
              height={72} 
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
              Sent Vestings
            </h2>
            <p className="text-[11px] text-text-secondary leading-tight">
              Manage distributed contracts and track lockups.
            </p>
          </div>
        </Link>

        {/* Received Vestings Card */}
        <Link 
          href="/app/vesting/received"
          className="group flex flex-col items-center text-center p-4 bg-background border border-border rounded-xl transition-all hover:border-primary hover:shadow-md cursor-pointer aspect-square max-w-[180px] mx-auto w-full justify-center"
        >
          <div className="mb-3">
            <Image 
              src="/icons/vesting-down.png" 
              alt="Received Vestings" 
              width={72} 
              height={72} 
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
              Received Vestings
            </h2>
            <p className="text-[11px] text-text-secondary leading-tight">
              Check timelines and claim unlocked tokens.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}