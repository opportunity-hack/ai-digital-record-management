import Footer from "@/components/modules/index/footer";
import Hero from "@/components/modules/index/hero";
import Navbar from "@/components/modules/index/navbar";
import CONFIG from "@/constants/config";

export default function Home() {
  return (
    <main className="flex flex-col items-center align-middle">
      <title>{CONFIG.siteName}</title>
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
