import Link from "next/link";

import Logo from "@/components/common/logo";
import routes from "@/constants/routes";
import { GitHub } from "@mui/icons-material";

export default function Footer() {
  return (
    <div className="mt-48 flex w-11/12 max-w-5xl flex-row items-center justify-center">
      <span className="flex flex-col font-mono justify-center items-center font-semibold space-y-4">
        <text>Made at Opportunity Hacks 2023</text>
        <Link className="flex items-center" href="https://github.com/2023-opportunity-hack/syntax-error--DigitalRecordsManagementforMuseumsandHistoricalSites">
          <GitHub />
        </Link>
      </span>
      <span />
    </div>
  );
}
