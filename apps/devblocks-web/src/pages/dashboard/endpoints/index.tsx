/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Edit, List, LocationOn, Tag, Title } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { API, Auth } from "aws-amplify";
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
          <tr className="shadow-box flex w-full flex-row">
            <th className="flex flex-1 items-center space-x-2 py-1 pl-2">
              <List />
              <text>Index</text>
            </th>
            <th className="flex flex-1 items-center space-x-2 py-1">
              <Title />
              <text>Text</text>
            </th>
            <th className="flex flex-1 items-center space-x-2 py-1">
              <CalendarMonth />
              <text>Date</text>
            </th>
            <th className="flex flex-1 items-center space-x-2 py-1">
              <LocationOn />
              <text>Location</text>
            </th>
            <th className="flex flex-1 items-center space-x-2 py-1">
              <Tag />
              <text>Tags</text>
            </th>
            {isAdmin && (
              <th className="flex flex-1 items-center space-x-2 py-1">
                <Edit /> <text>Actions</text>
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
                <td className="flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.tags}</td>
                {isAdmin && (
                  <td className="flex flex-1 flex-col items-center justify-center align-middle">
                    <button className="rounded bg-black px-4 py-1 font-mono text-sm text-white" type="button">
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </table>
      </div>
    </DashboardKeysLayout>,
    router.pathname,
  );
}
