import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";

import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";

export default function DashboardKeys() {
  const [apiKey, setApiKey] = useState<string>("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

  return (
    <DashboardKeysLayout>
      <div className="shadow-box w-full flex-1 p-12">
        <h1 className="font-mono text-lg font-bold">API Keys</h1>
        <p className="max-w-lg pt-4 text-base font-semibold">Below, you will find your confidential API keys. Make sure you keep your keys safe and secure 🔒.</p>
        <p className="max-w-lg pb-8 pt-4 text-base">Do your best to prevent yourself from distributing your API Keys or exposing it within browser or client-side code.</p>

        <div className="shadow-box w-full max-w-lg">
          <div className="rounded-t bg-pt p-2 text-center font-bold text-white">API Key</div>
          <div className="p-2 text-center font-semibold">{apiKey}</div>
        </div>
      </div>
    </DashboardKeysLayout>
  );
}
