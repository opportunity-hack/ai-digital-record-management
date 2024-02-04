import { GitHub } from "@mui/icons-material";
import Link from "next/link";

import Logo from "@/components/common/logo";
import ROUTES from "@/constants/routes";

export default function Footer() {
  return (
    <div className="mt-48 flex w-11/12 max-w-5xl flex-row items-center justify-center">
      <span className="flex flex-col items-center justify-center space-y-4 font-mono font-semibold">
        <text>Made at Opportunity Hacks 2023</text>
        <Link className="flex items-center" href="https://github.com/2023-opportunity-hack/syntax-error--DigitalRecordsManagementforMuseumsandHistoricalSites">
          <GitHub />
        </Link>
      </span>
      <span />
    </div>
  );
}
