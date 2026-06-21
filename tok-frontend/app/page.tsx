import { Features, Footer, Hero, Navbar, Pillars, TokenSection, Vision } from "@/components/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Pillars />
      <Vision />
      <Features />
      <TokenSection />
      <Footer />
    </div>
  );
}
