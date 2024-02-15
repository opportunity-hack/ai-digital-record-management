/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Close, CloseRounded, Edit, EditNote, List, LocationOn, Tag, Title, Upload, UploadFile } from "@mui/icons-material";
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
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const extension = file.name.split(".").pop();
    if (extension !== "zip") {
      alert("Please upload a .zip file");
      return;
    }

    setFile(file);
  };

  async function upload(e: any) {
    if (!file) {
      return;
    }
    try {
      await Storage.put(`zip/${file?.name}`, file, { contentType: "application/zip" });
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return withAuthenticator(
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <Upload className="mr-2" />
          <div className="flex flex-col">
            Upload
            <span className="flex flex-row font-sans font-semibold">
              Upload documents here by dropping <div className="mx-2 rounded bg-pc px-2 text-white">.zip</div> files into the space below
            </span>
          </div>
        </span>
        <div className="mb-8 flex h-fit w-full  flex-col space-y-4 pt-4">
          {/* <DashboardKeysNavbar /> */}
          <Head>
            <title>Upload | {CONFIG.siteName}</title>
          </Head>
          <div className="shadow-box flex h-64 w-full flex-col items-center justify-center">
            <label htmlFor="fileInput" className="clas flex flex-col items-center justify-center space-y-2">
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }} // Hide the default file input appearance
                onChange={handleFileChange}
              />
              {file ? (
                <div>Selected file: {file.name}</div>
              ) : (
                <>
                  <UploadFile className="text-7xl" />
                  <div className="text-xl">Drop files here</div>
                </>
              )}
            </label>
          </div>
          <button className="font-xl w-full rounded-sm bg-pc py-2 text-white " type="button" onClick={upload}>
            Upload
          </button>
        </div>
      </div>
    </DashboardLayout>,
    router.pathname,
  );
}
