import Image from "next/image";
import Link from "next/link";

import routes from "@/constants/routes";
import heroImage from "@public/images/landing/hero.svg";

export default function Hero() {
  return (
    <div className="mt-24 flex w-11/12 max-w-5xl justify-center">
      <span className="flex w-full flex-col items-center lg:flex-row lg:justify-between">
        <span className=" flex flex-col justify-center font-bold">
          <h1 className="text-6xl font-bold max-lg:text-center">Preservation Partners of the Fox Valley</h1>
          <h1 className="text-4xl font-bold text-pc font-mono max-lg:text-center">Search Engine</h1>
          <span className="mt-8 flex flex-col space-y-2 max-lg:justify-center sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link className="max-w-sm:w-full rounded-md bg-pc p-4 text-bg" href={routes.login}>
              Get Started
            </Link>
          </span>
        </span>
        <Image className="flex w-10/12 max-w-3xl mt-6" src={heroImage} alt="" />
      </span>
    </div>
  );
}
