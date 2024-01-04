import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";

export default function DashboardEndpointsKeys() {
  return (
    <DashboardKeysLayout>
      <div className="shadow-box w-full">
        <h1 className="font-mono text-lg font-bold">API Key</h1>
        <p className="max-w-lg pt-4 text-base font-semibold">Below, you will find your confidential API key. Make sure you keep your key safe and secure 🔒.</p>
        <p className="max-w-lg pb-8 pt-4 text-base">Do your best to prevent yourself from distributing your API Keys or exposing it within browser or client-side code.</p>

        <table className="shadow-box">
          <caption className="rounded-t bg-pt p-2 font-bold text-white">API Keys</caption>
          <tbody>
            <tr className="border-b-2 border-pt text-left font-mono text-sm">
              <th className="w-16 pl-2" scope="row">
                NAME
              </th>
              <th className="w-32 pl-2" scope="row">
                KEY
              </th>
              <th className="pl-2" scope="row">
                CREATED
              </th>
              <th className="pl-2" scope="row">
                LAST USED
              </th>
            </tr>
            <tr className="text-left font-sans font-semibold">
              <td className="w-16 pl-2">Alfre</td>
              <td className="line-clamp-1 w-32 text-ellipsis pl-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique quibusdam numquam illum assumenda alias maxime dignissimos perspiciatis dolorum adipisci autem recusandae minus in, nam vitae, quisquam beatae ipsa incidunt
                aperiam?
              </td>
              <td className="w-36 pl-2">12/01/2023</td>
              <td className="w-36 pl-2">12/01/2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardKeysLayout>
  );
}
