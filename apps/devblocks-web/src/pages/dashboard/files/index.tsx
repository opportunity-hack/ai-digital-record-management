/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Close, CloseRounded, Edit, EditNote, List, LocationOn, Receipt, Tag, Title, Upload, UploadFile } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { API, Auth, Storage } from "aws-amplify";
import { format, set } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

import Spinner from "@/components/common/loading-spinner";
import Accordion from "@/components/dashboard/accordion";
import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";
import TagInput from "@/components/dashboard/endpoints/tag-input";
import DashboardLayout from "@/components/dashboard/layout";
import withAuthenticator from "@/components/template/locked";
import API_NAMES from "@/constants/api-names";
import CONFIG from "@/constants/config";

export default function DashboardKeys() {
  const router = useRouter();
  const [fileNames, setFileNames] = useState([]);

  useEffect(() => {
    getAllTags();
  }, []);

  async function downloadUrl(url: any, filename: string) {
    try {
      if (url) {
        // Use fetch to download the file using the pre-signed URL
        const fileResponse = await fetch(url, {
          // headers: {
          //   Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          // },
        });
        const blob = await fileResponse.blob();

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  // usage
  async function download(objectKey: string) {
    try {
      const result = await API.post(API_NAMES.getPresigned, "getSignedObjectUrl",
        {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          },
          body: {
            key: objectKey
          },
        })
      // const result = await Storage.get(objectKey, { download: false, region: "us-west-1", expires: 3600 });
      console.log("PRESIGNED URL:", result);
      // downloadBlob(result, objectKey);
      downloadUrl(result, objectKey);
    } catch (e) {
      console.error(e);
    }
  }

  const getAllTags = async () => {
    const result = await API.get(API_NAMES.getPresigned, "listObjects",
      {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
        },
      })
    setFileNames(result.slice(1));
  }


  return withAuthenticator(
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <Receipt className="mr-2" />
          <div className="flex flex-col">
            Files
            <span className="flex flex-row font-sans font-semibold">
              The list of files in the system.
            </span>
          </div>
        </span>
        <div className="mb-8 flex h-fit w-full  flex-col space-y-4 pt-4">
          <Head>
            <title>Tags | {CONFIG.siteName}</title>
          </Head>
          <div className="mt-2 flex max-h-96 h-full bg-white shadow-box flex-wrap overflow-y-auto border-2 border-bc px-2 pb-2">
            <div className="font-bold sticky top-0 w-full p-2 bg-white">FILES</div>

            {fileNames.map((fileName: any, index: any) => (
              <div key={fileName} className="border-b-2 p-2 w-full justify-between items-center flex">
                <div>{fileName}</div>
                <button className="bg-black text-white p-1 rounded font-semibold" type="button" onClick={() => download(fileName)}>Download</button>
              </div>
            ))}

          </div>
          
        </div>
      </div>
    </DashboardLayout>,
    router.pathname,
  );
}
