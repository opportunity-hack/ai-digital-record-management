import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";

export default function Accordion({ title, body, className, startActive }: any) {
  const [active, setActive] = useState<boolean>(startActive);
  return (
    <div className={`cursor-pointer ${className}`}>
      <button className="mb-2 flex flex-row items-center space-x-4 font-mono text-sm font-bold" onClick={() => setActive(!active)} type="button">
        {active ? <RemoveIcon /> : <AddIcon />}
        <span>{title}</span>
      </button>
      <div className={active ? "visible" : "hidden"}>{body}</div>
    </div>
  );
}
