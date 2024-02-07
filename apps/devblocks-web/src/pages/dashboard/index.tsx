import type { Metadata } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import Accordion from "@/components/dashboard/accordion";
import DashboardLayout from "@/components/dashboard/layout";
import withAuthenticator from "@/components/template/locked";
import CONFIG from "@/constants/config";
import searchTabInstructions from "@public/images/dashboard/search-tab-instructions.png";

export const metadata: Metadata = {
  title: `${CONFIG.siteName} | Getting Started`,
  description: "...",
};

export default function Dashboard() {
  const router = useRouter();
  // If user is not logged in, show a locked screen
  return withAuthenticator(
    <DashboardLayout>
      <Head>
        <title>Getting Started | {CONFIG.siteName}</title>
      </Head>
      <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">GETTING STARTED</span>
      <span className="shadow-box mt-4 flex flex-col p-4">
        <h1 className="mb-2 font-mono text-lg font-bold">Welcome to {CONFIG.siteName}&apos;s Search Engine! </h1>
        <p className="font-semibold">
          We are thrilled to have you on board. Get ready for an incredible experience as you explore all the features. <br />
        </p>
        <p>If you have any questions or need assistance, feel free to reach out. </p>
      </span>
      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion
          title="Searching for files"
          body={
            <div>
              This website&apos;s search functionality is located by clicking on the tab &apos;Search&apos; on the navbar on the left.
              <Image className="my-4 rounded border-2 border-black" src={searchTabInstructions} alt="Search Tab Instructions" />
              There, the users would be able to search for files using various fields such as the text, location or date.
            </div>
          }
        />
      </span>
      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion
          title={
            <div className="flex flex-row">
              <div className="mr-2 rounded bg-pc px-4 text-white">ADMIN</div>
              Uploading files
            </div>
          }
          body={<div>Searching</div>}
        />
      </span>
    </DashboardLayout>,
    router.pathname,
  );
}
