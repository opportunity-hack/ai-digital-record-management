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
      <title>Devblocks</title>
      <Navbar />
      <Hero />
      {/* STORAGE */}
      <FeatureSection
        title="STORAGE"
        imageSource={storage}
        heading="Storage"
        description="Use our Storage API to upload your data as a PDF document, power point presentaion, csv or any of the various supported formats.
        The data is used to retrieve relevant context that powers the Large Language Models to avoid hallucinations. "
        isLeft
      />
      <FeatureSection title="LLM" imageSource={llm} heading="LLM" description="Use our LLM API to generate a response from any of the major Large Language models available or bring your own API Keys." isLeft={false} />
      <FeatureSection title="LOGS" imageSource={logs} heading="Logs" description="Access logs to all of your APIs as well as various prompts used to get insights and compare results in one go." isLeft />
      <FeatureSection
        title="FILTER"
        imageSource={filter}
        heading="Filter"
        description="Use our Attribute API to create and manage various attributes that can be attached to data so it can be filtered while searching relevant information."
        isLeft={false}
      />

      {/* ANALYTICS */}
      {/* NOT REALLY: PROMPT ENGINEERING */}

      {/* CALL TO ACTION */}
      <div className="mt-48 flex w-11/12 max-w-5xl flex-col items-center justify-center rounded border-[1px] border-pt bg-white p-4 py-24 shadow-[0rem_0.5rem_var(--color-primary-text)]">
        <span className="text-center text-4xl font-bold">Start developing with LLMs</span>

        <span className="mt-10 flex w-full flex-col justify-center space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <Link className="max-w-md:w-full rounded-md bg-pc p-4 font-bold text-bg" href={routes.login}>
            Try it for Free
          </Link>
          <Link className="max-w-md:w-full rounded-md bg-pt p-4 font-bold text-bg" href={routes.docs}>
            Read the Docs
          </Link>
        </span>
      </div>
      <Footer />
    </main>
  );
}
