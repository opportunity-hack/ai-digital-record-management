import MultiTabCoding from "@/components/common/multitab-coding";
import Accordion from "@/components/dashboard/accordion";
import DashboardLayout from "@/components/dashboard/layout";
import curlPresigned from "@public/code-snippets/get-presigned-url/curl";
// Upload file documentation
import pythonPresigned from "@public/code-snippets/get-presigned-url/python";
import typescriptPresigned from "@public/code-snippets/get-presigned-url/typescript";
import curlListDocs from "@public/code-snippets/list-docs/curl";
import pythonListDocs from "@public/code-snippets/list-docs/python";
import typescriptListDocs from "@public/code-snippets/list-docs/typescript";
import curlQuery from "@public/code-snippets/query/curl";
// Query documentation
import pythonQuery from "@public/code-snippets/query/python";
import typescriptQuery from "@public/code-snippets/query/typescript";
import curlUpload from "@public/code-snippets/upload/curl";
import pythonUpload from "@public/code-snippets/upload/python";
import typescriptUpload from "@public/code-snippets/upload/typescript";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">GETTING STARTED</span>
      <span className="shadow-box mt-4 flex flex-col p-4">
        <h1 className="mb-2 font-mono text-lg font-bold">Welcome to Presevation Partners of the Fox Valley's Search Engine! </h1>
        <p className="font-semibold">
          We are thrilled to have you on board. Get ready for an incredible experience as you explore all the features. <br />
        </p>
        <p>If you have any questions or need assistance, feel free to reach out. </p>
      </span>
      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion
          title="Upload files"
          body={
            <>
              <MultiTabCoding className="mb-2 mt-4" options={["Python", "Typescript", "cURL"]} values={[pythonPresigned, typescriptPresigned, curlPresigned]} />
              <MultiTabCoding className="mb-2 mt-4" options={["Python", "Typescript", "cURL"]} values={[pythonUpload, typescriptUpload, curlUpload]} />
            </>
          }
          startActive
        />
      </span>

      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion title="List documents" body={<MultiTabCoding className="mb-2 mt-4" options={["Python", "Typescript", "cURL"]} values={[pythonListDocs, typescriptListDocs, curlListDocs]} />} />
      </span>

      <span className="shadow-box mt-4 flex flex-col p-4 pb-2">
        <Accordion title="Query models" body={<MultiTabCoding className="mb-2 mt-4" options={["Python", "Typescript", "cURL"]} values={[pythonQuery, typescriptQuery, curlQuery]} />} />
      </span>
    </DashboardLayout>
  );
}
