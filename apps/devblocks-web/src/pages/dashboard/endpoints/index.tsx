/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Edit, List, LocationOn, Tag, Title } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { API, Auth, Storage } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import Spinner from "@/components/common/loading-spinner";
import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";
import withAuthenticator from "@/components/template/locked";
import API_NAMES from "@/constants/api-names";
import CONFIG from "@/constants/config";

export default function DashboardKeys() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  const onSearch = async (event: any) => {
    event.preventDefault();
    setIsSearching(true);
    try {
      const apiResults = (
        await API.post(API_NAMES.searchDocuments, "", {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          },
          body: {
            text: searchText,
          },
        })
      ).message.hits;
      setSearchResults(apiResults);
      console.log(apiResults);
    } catch (e) {
      console.error(e);
    }
    setIsSearching(false);
  };

  function downloadBlob(blob: any, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  // usage
  async function download(objectKey: string) {

    try {
      const result = await Storage.get(objectKey, { download: true, region: "us-west-2", expires: 3600 });
      console.log(result)
      downloadBlob(result.Body, objectKey);
    } catch (e) { console.error(e); }
  }

  return withAuthenticator(
    <DashboardKeysLayout>
      <Head>
        <title>Search | {CONFIG.siteName}</title>
      </Head>
      <div className="flex w-full flex-col">
        <form className="flex w-full flex-col space-y-2" onSubmit={onSearch}>
          <div className="shadow-box flex h-12 w-full flex-row items-center px-2 text-base">
            <SearchIcon />
            <input className="ml-2 w-full outline-none" onChange={(e) => setSearchText(e.target.value)} />
            <button className="-mt-0.5 flex h-7 w-20 max-w-full items-center justify-center rounded border-0 border-none bg-pc font-mono text-sm font-semibold text-white outline-none outline-0" type="submit" disabled={isSearching}>
              {isSearching ? <Spinner /> : "SEARCH!"}
            </button>
          </div>

          <button className="mt-8 flex h-12 w-full max-w-full items-center justify-center rounded border-0 border-none bg-pc font-mono text-sm font-semibold text-white outline-none outline-0" type="submit" disabled={isSearching}>
            {isSearching ? <Spinner /> : "SEARCH!"}
          </button>
        </form>
        <table className="mt-4 flex flex-col -space-y-1">
          <tbody>
            <tr className="shadow-box flex w-full flex-row text-xs">
              <th className="flex flex-1 items-center space-x-2 py-1 pl-2 font-mono">
                <List />
                <div>INDEX</div>
              </th>
              <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                <Title />
                <div>TEXT</div>
              </th>
              <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                <CalendarMonth />
                <div>DATE</div>
              </th>
              <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                <LocationOn />
                <div>LOCATION</div>
              </th>
              <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                <Tag />
                <div>TAGS</div>
              </th>
              {isAdmin && (
                <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                  <Edit /> <div>ACTIONS</div>
                </th>
              )}
            </tr>
            {searchResults.map((result: any) => {
              return (
                <tr className="shadow-box flex h-32 w-full flex-row p-2" key={result._id}>
                  <td className="line-clamp-4 flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._id}</td>
                  <td className="line-clamp-2 flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.text}</td>
                  <td className="flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.date}</td>
                  <td className="flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.location}</td>
                  <td className="flex max-w-sm flex-1 flex-row flex-wrap overflow-y-auto border-r-2 border-bc p-1">
                    {result._source.tags?.map((tag: string) => {
                      return (
                        <div className="mb-2 mr-2 h-fit w-fit rounded-sm bg-black p-0.5 font-mono text-xs font-bold text-white" key={result._id + tag}>
                          {tag}
                        </div>
                      );
                    })}
                  </td>

                  <td className="flex flex-1 flex-col items-center justify-center space-y-2 align-middle font-mono text-xs  font-bold">
                    {isAdmin && (
                      <button className="rounded bg-black px-4 py-1 text-white" type="button">
                        Edit
                      </button>)}
                    < button className="rounded bg-black px-4 py-1 text-white" type="button" onClick={() => download(result._source.objectKey)}>
                      Download
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardKeysLayout >,
    router.pathname,
  );
}
