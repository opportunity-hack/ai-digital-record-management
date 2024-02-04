import { API, Amplify, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";
import AccountButton from "@/components/account/button";
import { Constants } from "@devblocks/models";
import APINames from "@/constants/api_names";
import Spinner from "@/components/common/loading-spinner";

import { CalendarMonth, LocationOn, Title, List, Tag } from "@mui/icons-material";
import withAuthenticator from "@/components/template/locked";

export default function DashboardKeys() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  const onSearch = async (event: any) => {
    event.preventDefault();
    setIsSearching(true);
    try {
      const apiResults = (await API.post(APINames.searchDocuments, "", {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
          text: searchText,
        },
      }))['message']['hits']
      setSearchResults(apiResults);
      console.log(apiResults)
    } catch (e) {
      console.error(e);
    }
    setIsSearching(false);
  }
  return withAuthenticator(
    <DashboardKeysLayout>
      <div className="flex flex-col w-full">
        <form className="flex flex-col w-full space-y-2" onSubmit={onSearch}>
          <div className="w-full h-12 shadow-box flex-row flex items-center px-2 text-base">
            <SearchIcon />
            <input className="ml-2 outline-none w-full" onChange={(e) => setSearchText(e.target.value)} />
            <button className="flex items-center justify-center w-20 h-7 bg-pc text-white rounded font-mono font-semibold text-sm outline-none border-none max-w-full -mt-0.5 outline-0 border-0" type="submit" disabled={isSearching}>
              {isSearching ? <Spinner /> : "SEARCH!"}
            </button>
          </div>

          <button className="flex items-center justify-center w-full h-12 bg-pc text-white rounded font-mono font-semibold text-sm outline-none border-none max-w-full mt-8 outline-0 border-0" type="submit" disabled={isSearching}>
            {isSearching ? <Spinner /> : "SEARCH!"}
          </button>
        </form>
        <table className="flex flex-col -space-y-1 mt-4">
          <tr className="w-full flex-row flex shadow-box">
            <th className="flex-1 space-x-2 flex items-center pl-2 py-1">
              <List />
              <text>Index</text>
            </th>
            <th className="flex-1 space-x-2 flex items-center py-1">
              <Title />
              <text>Text</text>
            </th>
            <th className="flex-1 space-x-2 flex items-center py-1">
              <CalendarMonth />
              <text>Date</text>
            </th>
            <th className="flex-1 space-x-2 flex items-center py-1">
              <LocationOn />
              <text>Location</text>
            </th>
            <th className="flex-1 space-x-2 flex items-center py-1">
              <Tag />
              <text>Tags</text>
            </th>
            {isAdmin && <th className="flex-1 space-x-2 flex items-center py-1" />}
          </tr>
          {
            searchResults.map((result: any) => {
              return (
                <tr className="w-full flex-row flex shadow-box h-32 p-2">
                  <td className="flex-1 line-clamp-4 border-r-2 border-bc p-1 overflow-y-auto">
                    {result["_id"]}
                  </td>
                  <td className="flex-1 line-clamp-2 border-r-2 border-bc p-1 overflow-y-auto">
                    {result["_source"]["text"]}
                  </td>
                  <td className="flex-1 border-r-2 border-bc p-1 overflow-y-auto">
                    {result["_source"]["date"]}
                  </td>
                  <td className="flex-1 border-r-2 border-bc p-1 overflow-y-auto">
                    {result["_source"]["location"]}
                  </td>
                  <td className="flex-1 border-r-2 border-bc p-1 overflow-y-auto">
                    {result["_source"]["tags"]}
                  </td>
                  {isAdmin &&
                    <td className="flex-1 flex items-center justify-center align-middle flex-col">
                      <button className="bg-black text-white py-1 px-4 rounded font-mono text-sm">Edit</button>
                    </td>
                  }
                </tr>
              )
            })}
        </table>
      </div>
    </DashboardKeysLayout>
  );
}
