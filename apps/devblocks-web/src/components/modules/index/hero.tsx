import Image from "next/image";
import Link from "next/link";

import routes from "@/constants/routes";
import heroImage from "@public/images/landing/hero.svg";

export default function Hero() {
  return (
    <div className="mt-24 flex w-11/12 max-w-5xl justify-center">
      <span className="flex w-full flex-col items-center lg:flex-row lg:justify-between">
        <span className=" flex flex-col justify-center font-bold">
          <h1 className="text-6xl font-bold max-lg:text-center">Backend as a Service for LLMs</h1>
          <p className="mt-8 text-xl font-normal max-lg:text-center">The most straightforward approach for developing and expanding generative AI applications using foundational models.</p>
          <span className="mt-8 flex flex-col space-y-2 max-lg:justify-center sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link className="max-w-sm:w-full rounded-md bg-pc p-4 text-bg" href={routes.login}>
              Try it for Free
            </Link>
            <Link className="max-w-sm:w-full rounded-md border-bc bg-pt p-4 text-bg" href={routes.docs}>
              Documentation
            </Link>
          </span>
        </span>
        <Image className="flex w-screen max-w-3xl " src={heroImage} alt="" />
      </span>
    </div>
  );
}
