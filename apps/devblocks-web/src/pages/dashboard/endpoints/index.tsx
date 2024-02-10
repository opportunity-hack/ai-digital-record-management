/* eslint no-underscore-dangle: "off" */

import { CalendarMonth, Close, CloseRounded, Edit, EditNote, List, LocationOn, Tag, Title } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { API, Auth, Storage } from "aws-amplify";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from 'react-day-picker';
import { format, set } from 'date-fns';

import Spinner from "@/components/common/loading-spinner";
import DashboardKeysLayout from "@/components/dashboard/endpoints/layout";
import withAuthenticator from "@/components/template/locked";
import API_NAMES from "@/constants/api-names";
import CONFIG from "@/constants/config";
import TagInput from "@/components/dashboard/endpoints/tag-input";
import Accordion from "@/components/dashboard/accordion";

export default function DashboardKeys() {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);

  const [modalActive, setModalActive] = useState(false);
  const [editId, setEditId] = useState("");
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState(null);
  const [editTags, setEditTags] = useState([]);
  const [editBucket, setEditBucket] = useState("");
  const [editObjectKey, setEditObjectKey] = useState("");
  const [editInProgress, setEditInProgress] = useState(false)
  const [dateIsFocused, setDateIsFocused] = useState(false);


  const [advancedDate, setAdvancedDate] = useState(null);
  const [advancedTags, setAdvancedTags] = useState([]);
  const [advancedIsActive, setAdvancedIsActive] = useState(false);
  const [advancedDateIsFocused, setAdvancedDateIsFocused] = useState(false);

  console.log(editText);
  let footer = <p>Please pick a day.</p>;
  if (editDate) {
    footer = <p>You picked {format(editDate, 'PP')}.</p>;
  }

  const onSearch = async (event: any) => {
    try { event.preventDefault(); } catch (error) { }
    setIsSearching(true);
    try {
      const apiResults = (
        await API.post(API_NAMES.searchDocuments, "", {
          headers: {
            Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
          },
          body: {
            text: searchText,
            date: advancedIsActive && advancedDate,
            tags: advancedIsActive && advancedTags,
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

  const editRow = (row: any) => {
    setEditId(row._id);
    setEditText(row._source.text);
    setEditDate(new Date(row._source.date));
    setModalActive(true);
    setEditTags(row._source.tags);
    setEditBucket(row._source.bucketName);
    setEditObjectKey(row._source.objectKey);
  };

  function downloadBlob(blob: any, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }

  // usage
  async function download(objectKey: string) {
    try {
      const result = await Storage.get(objectKey, { download: true, region: "us-west-2", expires: 3600 });
      console.log(result);
      downloadBlob(result.Body, objectKey);
    } catch (e) {
      console.error(e);
    }
  }

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setDateIsFocused(false);
    }
  }
  const handleFocus = () => {
    setDateIsFocused(true);
  }

  const handleAdvancedBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setAdvancedDateIsFocused(false);
    }
  }

  const editDocument = async () => {
    setEditInProgress(true)
    try {
      const result = await API.post(API_NAMES.editDocument, "", {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
          text: editText,
          date: editDate,
          tags: editTags,
          bucketName: editBucket,
          objectKey: editObjectKey,
        },
      })
      setEditInProgress(false)
      onSearch()
      console.log(result);
    } catch (e) {
      console.error(e);
    }
  }

  const accordionClick = () => {
    setAdvancedIsActive(!advancedIsActive);
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
          {/* <Accordion onClick={accordionClick} className="shadow-box pl-4 pr-4 pt-4 pb-2 justify-center flex flex-col " body={
            <div className="flex flex-row w-full space-x-2">
              <label className="flex-1" htmlFor="date" onFocus={()=>setAdvancedDateIsFocused(true)} onBlur={handleAdvancedBlur}>
                <div>Date</div>
                <div className="flex-row flex w-full rounded-sm border-2 border-bc p-2 outline-none">
                  <input className="outline-none flex-1" name="date" readOnly value={advancedDate ? format(advancedDate, 'MM/dd/yy') : ""} />
                  {advancedDate && <button type="button" onClick={() => {setAdvancedDate(null); setAdvancedDateIsFocused(false)}}><CloseRounded /></button>}
                </div>
                {advancedDateIsFocused && <DayPicker
                  className="absolute color-black bg-white p-2 shadow-box"
                  mode="single"
                  selected={advancedDate}
                  onSelect={setAdvancedDate}
                  footer={footer}
                  showOutsideDays
                  fixedWeeks />}
              </label>
              {/* <label className="mt-2" htmlFor="location">
              <div>Location</div>
              <input className="w-full rounded-sm border-2 border-bc p-2 outline-none" name="location" />
            </label> 
              <label className="flex-1" htmlFor="tags">
                <div>Tags</div>
                <TagInput tags={advancedTags} setTags={setAdvancedTags} />
              </label>

            </div>} title="Advanced Search Options" /> */}

          <button className="mt-8 flex h-12 w-full max-w-full items-center justify-center rounded border-0 border-none bg-pc font-mono text-sm font-semibold text-white outline-none outline-0" type="submit" disabled={isSearching}>
            {isSearching ? <Spinner /> : "SEARCH!"}
          </button>

        </form>
        <table className="mt-4 flex flex-col -space-y-1">
          <tbody className="shadow-box max-h-[calc(50vh)] flex-1 overflow-y-auto">
            <tr className="flex w-full flex-row border-b-2 border-black text-xs">
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
              {/* <th className="flex flex-1 items-center space-x-2 py-1 font-mono">
                <LocationOn />
                <div>LOCATION</div>
              </th> */}
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
                <tr className="flex h-32 w-full flex-row border-b-2 border-black p-2" key={result._id}>
                  <td className="line-clamp-4 flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._id}</td>
                  <td className="line-clamp-2 flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.text}</td>
                  <td className="flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.date ? format(new Date(result._source.date), "MM/dd/yy") : ""}</td>
                  {/* <td className="flex-1 overflow-y-auto border-r-2 border-bc p-1">{result._source.location}</td> */}
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
                      <button className="rounded bg-black px-4 py-1 text-white" type="button" onClick={() => editRow(result)}>
                        Edit
                      </button>
                    )}
                    <button className="rounded bg-black px-4 py-1 text-white" type="button" onClick={() => download(result._source.objectKey)}>
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modalActive && (
        <div className="absolute -left-4 top-0  flex h-full w-full items-center justify-center">
          <div className="absolute h-full w-full bg-black opacity-50" />
          <div className="shadow-box absolute flex w-11/12 max-w-xl flex-col p-4">
            <div className="flex flex-row items-center space-x-2 font-semibold">
              <Edit />
              <div>Edit Document Extraction</div>
              <div className="flex flex-1 flex-col items-end justify-center">
                <button onClick={() => setModalActive(false)} type="button" aria-label="close modal">
                  <Close />
                </button>
              </div>
            </div>

            <label className="mt-2" htmlFor="text">
              <div>Text</div>
              <textarea className="h-24 w-full resize-none rounded-sm border-2 border-bc p-2 outline-none" name="text" value={editText} onChange={(event) => setEditText(event.target.value)} />
            </label>
            <label className="mt-2" htmlFor="date" onFocus={handleFocus} onBlur={handleBlur}>
              <div>Date</div>
              <input className="w-full rounded-sm border-2 border-bc p-2 outline-none" name="date" readOnly value={editDate ? format(editDate, 'MM/dd/yy') : ""} />
              {dateIsFocused && <DayPicker
                className="left-0 absolute color-black bg-white p-2 shadow-box"
                mode="single"
                selected={editDate}
                onSelect={setEditDate}
                footer={footer}
                showOutsideDays
                fixedWeeks />}
            </label>
            {/* <label className="mt-2" htmlFor="location">
              <div>Location</div>
              <input className="w-full rounded-sm border-2 border-bc p-2 outline-none" name="location" />
            </label> */}
            <label className="mt-2" htmlFor="tags">
              <div>Tags</div>
              <TagInput tags={editTags} setTags={setEditTags} />
            </label>
            <button className="flex items-center justify-center h-10 mt-4 rounded bg-pc p-2 font-mono font-semibold text-white" type="button" onClick={editDocument}>
              {editInProgress ? <Spinner /> : "SUBMIT"}
            </button>
          </div>
        </div>
      )}
    </DashboardKeysLayout>,
    router.pathname,
  );
}
