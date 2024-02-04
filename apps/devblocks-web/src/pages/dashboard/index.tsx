import MultiTabCoding from "@/components/common/multitab-coding";
import Accordion from "@/components/dashboard/accordion";
import DashboardLayout from "@/components/dashboard/layout";
import routes from "@/constants/routes";
import { Auth } from "aws-amplify";
import { useRouter } from "next/router";

export default function Dashboard() {
  // If user is not logged in, redirect to login page
  const router = useRouter();
  if (!Auth.currentAuthenticatedUser()) {
    router.push(routes.login);
  }
  return (
    <DashboardLayout>
      <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">GETTING STARTED</span>
      <span className="shadow-box mt-4 flex flex-col p-4">
        <h1 className="mb-2 font-mono text-lg font-bold">Welcome to Preservation Partners of the Fox Valley's Search Engine! </h1>
        <p className="font-semibold">
          We are thrilled to have you on board. Get ready for an incredible experience as you explore all the features. <br />
        </p>
        <p>If you have any questions or need assistance, feel free to reach out. </p>
      </span>
      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion
          title="Searching for files"
          body={
            <>
              <div>Searching</div>
            </>
          }
          startActive
        />
      </span>
      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion
          title="Uploading files"
          body={
            <>
              <div>Searching</div>
            </>
          }
          startActive
        />
      </span>
    </DashboardLayout>
  );
}
