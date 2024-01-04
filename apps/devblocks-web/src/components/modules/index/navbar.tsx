import Link from "next/link";

import Logo from "@/components/common/logo";
import routes from "@/constants/routes";

export default function Navbar() {
  return (
    <nav className="flex w-full flex-col items-center justify-center py-4">
      <span className="flex w-11/12 max-w-5xl flex-row items-center justify-between">
        <Logo className="text-2xl" hideText />
        <span className="flex items-center justify-center space-x-3">
          <Link className="hidden rounded border-pt bg-pt px-4 py-1 font-sans font-semibold text-bg duration-100 active:scale-100 md:flex" href={routes.login}>
            Sign in
          </Link>
          <Link className="rounded border-pc bg-pc px-4 py-1 font-sans font-semibold text-white duration-100  active:scale-100" href={routes.login}>
            Get Started
          </Link>
        </span>
      </span>
    </nav>
  );
}
