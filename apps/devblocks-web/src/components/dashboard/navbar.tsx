import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

import DashboardItem from "@/components/dashboard/item";
import ROUTES from "@/constants/routes";
import { signOut } from "@/services/auth";
import { Tag, Upload } from "@mui/icons-material";

export default function DashboardNavbar() {
  const router = useRouter();
  const onLogout = () => {
    signOut();
    router.push(ROUTES.home);
  };
  return (
    <div className="flex h-full flex-col justify-between space-y-2  rounded border-2 border-pt bg-white px-4 py-2 shadow-[0rem_0.25rem_var(--color-primary-text)]">
      <span className="flex flex-col space-y-2">
        <span className="mt-3 pl-2 pt-2 font-mono text-xs font-black text-st">SERVICES</span>

        <DashboardItem Icon={RocketLaunchIcon} title="Getting Started" href={ROUTES.dashboard} depth={3} />
        <DashboardItem Icon={SearchIcon} title="Search" href={ROUTES.dashboard_endpoints} depth={3} />
        {/* <DashboardItem Icon={Tag} title="Tags" href={ROUTES.dashboard_tags} depth={3} /> */}

        {/* If the user is an admin, then show them the following */}
        
        <span className="mt-3 pl-2 pt-2 font-mono text-xs font-black text-st">UPLOAD</span>
        <hr className="" />
        <DashboardItem Icon={Upload} title="Upload" href={ROUTES.dashboard_upload} depth={3} />
      </span>
      <span className="space-y-4">
        {/* <DashboardItem Icon={SettingsRoundedIcon} title="Settings" href={routes.docs} depth={3} /> */}
        <DashboardItem Icon={LogoutRoundedIcon} title="Logout" href="" depth={3} onClick={onLogout} />
      </span>
    </div>
  );
}
