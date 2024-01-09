import { useState } from "react";

import Coding from "./coding";

export default function MultiTabCoding({ className, options, values }: any) {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <div className={`rounded-b-lg border-b-8 border-[#1e1e1e] ${className}`}>
      <div className="flex flex-row rounded-t-lg bg-black p-2 font-mono text-sm text-white">
        {options.map((option: string, index: number) => {
          return (
            <button className={`cursor-pointer border-b-2 px-2 py-1 ${tabIndex === index ? "border-[#dcdcaf]" : "border-black"}`} onClick={() => setTabIndex(index)} key={option} type="button">
              {option}
            </button>
          );
        })}
      </div>
      <Coding value={values[tabIndex]} />
    </div>
  );
}
