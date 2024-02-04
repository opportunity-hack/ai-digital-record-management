import Link from "next/link";

import FeatureSection from "@/components/modules/index/feature-section";
import Footer from "@/components/modules/index/footer";
import Hero from "@/components/modules/index/hero";
import Navbar from "@/components/modules/index/navbar";
import routes from "@/constants/routes";
import filter from "@public/images/landing/filter.svg";
import llm from "@public/images/landing/llm.svg";
import logs from "@public/images/landing/logs.svg";
import storage from "@public/images/landing/storage.svg";

export default function Home() {
  return (
    <main className="flex flex-col items-center align-middle">
      <title>Preservation Partners of the Fox Valley</title>
      <Navbar />
      <Hero />
      <Footer/>

    </main>
  );
}
