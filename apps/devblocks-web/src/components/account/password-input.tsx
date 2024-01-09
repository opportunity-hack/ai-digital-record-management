import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useState } from "react";

type AccountPasswordInputParameters = {
  placeholder?: string;
  value?: string;
  onChange?: (event: any) => void;
};

export default function AccountPasswordInput({ placeholder, value, onChange }: AccountPasswordInputParameters) {
  const [visible, setVisible] = useState<boolean>();
  return (
    <div className="flex h-11 w-full flex-row items-center space-x-2 rounded border-2 border-bc bg-white px-2 outline-pc">
      <input className="w-full outline-none" placeholder={placeholder} type={visible ? "text" : "password"} value={value} onChange={onChange} />
      <button className="cursor-pointer rounded p-1 hover:bg-bc" onClick={() => setVisible(!visible)} type="button">
        {visible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
      </button>
    </div>
  );
}
