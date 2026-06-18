import { Features, Hero, Navbar, Pillars, Vision } from "@/components/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Pillars />
      <Vision />
      <Features />
    </div>
  );
}
