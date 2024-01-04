import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ElementType } from "react";

type DashboardItemParameters = {
  Icon: ElementType;
  title: string;
  href: string;
  depth: number;
  onClick?: any;
};

// Using depth is suuuuuper hacky
export default function DashboardItem({ Icon, title, href, depth, onClick }: DashboardItemParameters) {
  const pathname = usePathname();
  const isPath = pathname.split("/").slice(0, depth).toString() === href.split("/").slice(0, depth).toString();

  return (
    <Link className={`flex items-center justify-start space-x-2 rounded p-2 outline-none ${isPath ? "font-bold text-pc" : "font-semibold text-st"}`} href={href} onClick={onClick}>
      <Icon className={`rounded  p-[0.25rem] text-3xl  ${isPath ? "bg-pc text-white" : "text-st"}`} />
      <span className="pr-16 font-sans text-sm ">{title}</span>
    </Link>
  );
}
