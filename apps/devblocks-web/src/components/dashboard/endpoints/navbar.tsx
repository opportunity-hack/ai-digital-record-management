import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import VpnKeyRoundedIcon from "@mui/icons-material/VpnKeyRounded";

import ROUTES from "@/constants/routes";
import DashboardItem from "../item";

export default function DashboardKeysNavbar() {
  return (
    <div className="shadow-box flex h-full flex-col justify-between  space-y-2 rounded  border-2 border-pt bg-white px-4">
      <span className="flex flex-col space-y-2">
        <span className="mt-3 pl-2 pt-2 font-mono text-xs font-black text-st">ENDPOINTS</span>

        {/* <DashboardItem
                    Icon={BarChartRoundedIcon}
                    title="Overview"
                    href={routes.dashboard_endpoints_overview}
                    depth={4}
                /> */}
        <DashboardItem Icon={CodeRoundedIcon} title="APIs" href={ROUTES.dashboard_endpoints_api} depth={4} />
        <DashboardItem Icon={VpnKeyRoundedIcon} title="Keys" href={ROUTES.dashboard_endpoints_keys} depth={4} />
      </span>
    </div>
  );
}
