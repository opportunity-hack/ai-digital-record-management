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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const extension = file.name.split(".").pop();
    if (extension !== "zip") {
      alert("Please upload a .zip file");
      return;
    }

    setFile(file);
  };

  async function uploadFile(url: any, headers: any) {
    if (url && file) {
      console.log(file)
      // Use fetch to download the file using the pre-signed URL
      const formData = new FormData();
      formData.append("key", headers.key);
      formData.append("AWSAccessKeyId", headers["AWSAccessKeyId"]);
      formData.append("x-amz-security-token", headers["x-amz-security-token"]);
      formData.append("policy", headers.policy);
      formData.append("signature", headers.signature);
      formData.append("file", file, file.name);
      // console.log("HEADERS:", headers)
      // console.log(formData.get("key"))
      // console.log(formData.get("AWSAccessKeyId"))
      // console.log(formData.get("x-amz-security-token"))
      // console.log(formData.get("policy"))
      // console.log(formData.get("signature"))
      // console.log(formData.get("file"))
      // console.log("URL:", url)
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      const fileResponse = await fetch(url, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      });
      console.log(fileResponse)
    }
  }

  async function upload(e: any) {
    setMessage("");
    setLoading(true);
    if (!file) {
      setMessage("You must select a file to upload");
      setLoading(false);
      return;
    }
    try {
      const newFileName = file.name.replace(/\s/g, "-");
      const result = await API.post(API_NAMES.getUpload, "getSignedObjectUrl",
        {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          },
          body: {
            key: `zip/${newFileName}`
          },
        })
      console.log(`Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`)
      console.log(result)
      await uploadFile(result['url'], result['fields'])
      setMessage("File uploaded successfully");
      // await Storage.put(`zip/${file?.name}`, file, { contentType: "application/zip" });
    } catch (error) {
      console.error("Error uploading file: ", error);
      setMessage("Error uploading file");
    }
    setLoading(false);
  }

  return withAuthenticator(
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <Upload className="mr-2" />
          <div className="flex flex-col">
            Upload
            <span className="flex flex-row font-sans font-semibold">
              Upload documents here by clicking on the space below. This only accepts <div className="mx-2 rounded bg-pc px-2 text-white">.zip</div> files.
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
                  <div className="text-xl cursor-pointer">Click here to upload files</div>
                </>
              )}
            </label>
          </div>
          <button className="font-xl w-full rounded-sm bg-pc h-10 items-center justify-center flex py-2 text-white " type="button" onClick={upload}>
            {loading ? <Spinner /> : "Upload"}
          </button>
          <div className="text-sm font-bold text-red w-full text-center">{message}</div>
        </div>
      </div>
    </DashboardLayout>,
    router.pathname,
  );
}
