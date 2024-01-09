import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import CodeMirror from "@uiw/react-codemirror";

import theme from "./theme";

export default function Coding({ value, onChange }: any) {
  return <CodeMirror style={{ borderRadius: "3rem" }} className="rounded-b-lg" value={value} extensions={[python(), javascript()]} theme={theme} onChange={onChange} editable={false} />;
}
