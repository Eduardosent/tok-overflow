import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between bg-gradient-to-b from-primary/50 to-primary/10">
      {/* Lado izquierdo: Logo */}
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo1.png"
            alt="TOK Logo"
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Lado derecho: Links */}
      <div className="flex gap-8">
        <Link 
          href="/app" 
          className="text-primary border border-primary bg-white hover:bg-primary hover:text-white px-4 py-2 rounded-3xl transition-colors"
        >
          Comenzar
        </Link>
      </div>
    </nav>
  );
}