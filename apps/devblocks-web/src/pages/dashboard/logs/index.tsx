/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Close, CloseRounded, Edit, EditNote, History, List, LocationOn, Receipt, StorageOutlined, Tag, Title, Upload, UploadFile } from "@mui/icons-material";
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
import { log } from "console";

export default function DashboardKeys() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    getRecentLogs();
  }, []);

  const getRecentLogs = async () => {
    const result = await API.get(API_NAMES.getPresigned, "recentLogs",
      {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
        },
      })
    console.log(result["logs"])
    setLogs(result["logs"])
  }

  function formatDate(date: Date) {
    // Extract date components
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 to month as it starts from 0
    const day = ('0' + date.getDate()).slice(-2);
    const year = ('' + date.getFullYear());
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    // Construct formatted date string with time zone
    const formattedDate = `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }

  return withAuthenticator(
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <StorageOutlined className="mr-2" />
          <div className="flex flex-col">
            Logs
          </div>
        </span>
        <div className="mb-8 flex h-fit w-full  flex-col space-y-4 pt-4">
          <Head>
            <title>Logs | {CONFIG.siteName}</title>
          </Head>
          <div className="mt-2 flex max-h-96 h-full bg-white shadow-box flex-wrap overflow-y-auto border-2 border-bc px-2 pb-2">
            <div className="font-bold sticky top-0 w-full p-2 bg-white">Logs</div>
            {
              logs ?
                logs.map((log, index) => {
                  return (
                    <div key={index} className="flex w-full p-2 bg-white">
                      <div className="flex flex-col w-full">
                        <span className="font-bold">{formatDate(new Date(log["timestamp"]))}</span>
                        <span className="text-xs whitespace-pre-line	">{log["message"]}</span>
                      </div>
                    </div>
                  )
                }) : 
                <div>Retrieving logs...</div>
            }
          </div>

        </div>
      </div>
    </DashboardLayout>,
    router.pathname,
  );
}
