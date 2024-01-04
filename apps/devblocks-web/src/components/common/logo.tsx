import Image from "next/image";
import Link from "next/link";

import routes from "@/constants/routes";
import logo from "@public/images/logo.svg";

export default function Logo({ className, hideText }: { className?: string; hideText?: boolean }) {
  return (
    <Link className={`flex flex-row items-center font-sans font-bold ${className}`} href={routes.home}>
      <Image className="mr-4 max-w-sm" src={logo} alt="" height={40} />
      <span className={hideText ? "hidden md:flex" : ""}>devblocks</span>
    </Link>
  );
}
