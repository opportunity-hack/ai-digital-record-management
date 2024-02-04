import SearchIcon from "@mui/icons-material/Search";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useRouter } from "next/router";

import DashboardItem from "@/components/dashboard/item";
import routes from "@/constants/routes";
import { signOut } from "@/services/auth";

export default function DashboardNavbar() {
  const router = useRouter();
  const onLogout = () => {
    signOut();
    router.push(routes.login);
  };
  return (
    <div className="flex h-full flex-col justify-between space-y-2  rounded border-2 border-pt bg-white px-4 py-2 shadow-[0rem_0.25rem_var(--color-primary-text)]">
      <span className="flex flex-col space-y-2">
        <span className="mt-3 pl-2 pt-2 font-mono text-xs font-black text-st">SERVICES</span>

        <DashboardItem Icon={RocketLaunchIcon} title="Getting Started" href={routes.dashboard} depth={3} />
        <DashboardItem Icon={SearchIcon} title="Search" href={routes.dashboard_endpoints} depth={3} />

        {/* If the user is an admin, then show them the following */}
        <hr className="" />

      </span>
      <span className="space-y-4">
        {/* <DashboardItem Icon={SettingsRoundedIcon} title="Settings" href={routes.docs} depth={3} /> */}
        <DashboardItem Icon={LogoutRoundedIcon} title="Logout" href="" depth={3} onClick={onLogout} />
      </span>
    </div>
  );
}
