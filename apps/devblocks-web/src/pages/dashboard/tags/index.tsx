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
import ROUTES from "@/constants/routes";

export default function DashboardKeys() {
  const router = useRouter();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllTags();
  }, []);

  const getAllTags = async () => {
    const result = await API.post(API_NAMES.autocomplete, "",
      {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
          text: ""
        },
      })
    setTags(result.message);
  }


  return withAuthenticator(
    <DashboardLayout>
      <div className="flex h-full w-full flex-col items-center justify-start text-sm">
        <span className="flex w-full flex-row items-center rounded border-2 border-pt bg-white p-2 font-mono text-base font-black shadow-[0rem_0.25rem_var(--color-primary-text)]">
          <Tag className="mr-2" />
          <div className="flex flex-col">
            Tags
            <span className="flex flex-row font-sans font-semibold">
              All the tags that are currently in use. Click on any of them to search for the tag.
            </span>
          </div>
        </span>
        <div className="mb-8 flex h-fit w-full  flex-col space-y-4 pt-4">
          <Head>
            <title>Tags | {CONFIG.siteName}</title>
          </Head>
          <div className="mt-2 flex max-h-64 bg-white shadow-box flex-wrap overflow-y-auto border-2 border-bc p-2">
            {tags.map((tag: any, index: any) => (
              <div key={tag} className="m-1 flex cursor-pointer items-center rounded bg-pc px-3 py-1 text-xs text-white" onClick={() => router.push(`${ROUTES.dashboard_endpoints}?search=${tag}`)}>
                {tag}
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </DashboardLayout>,
    router.pathname,
  );
}
