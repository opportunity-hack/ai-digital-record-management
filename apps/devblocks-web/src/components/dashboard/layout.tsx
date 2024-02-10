import DashboardNavbar from "./navbar";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return (
    <main className="flex h-screen flex-row items-center bg-bg p-4 align-middle">
      <DashboardNavbar />
      <span className="ml-4 flex h-full flex-1 flex-col">{children}</span>
    </main>
  );
}
