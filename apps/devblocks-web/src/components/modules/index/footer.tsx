import Link from "next/link";

import Logo from "@/components/common/logo";
import routes from "@/constants/routes";

export default function Footer() {
  return (
    <div className="mt-24 flex w-11/12 max-w-5xl flex-row">
      <span className="flex flex-col">
        <Logo className="text-3xl" />
        <Link className="max-w-sm:w-full my-8 items-center justify-center rounded-md bg-pc p-4 text-center font-black text-bg" href={routes.login}>
          Try Devblocks for Free
        </Link>
      </span>
      <span />
    </div>
  );
}
