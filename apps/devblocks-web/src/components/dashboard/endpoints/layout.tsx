import SearchRoundedIcon from "@mui/icons-material/VpnKeyRounded";

import DashboardLayout from "@/components/dashboard/layout";

export default function DashboardKeysLayout({ children }: { children?: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <SearchRoundedIcon className="mr-2" />
          <div className="flex flex-col">
            SEARCH
            <text className="font-sans font-semibold">
              Search for documents by entering text into the search bar below and then clicking on <text className="rounded bg-pc p-1 px-2 font-mono text-sm text-white">SEARCH!</text>.
            </text>
          </div>
        </span>
        <div className="mb-8 flex w-full flex-1 flex-row space-x-4 pt-4">
          {/* <DashboardKeysNavbar /> */}
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}
