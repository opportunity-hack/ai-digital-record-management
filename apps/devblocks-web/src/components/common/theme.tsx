import { vscodeDarkInit } from "@uiw/codemirror-theme-vscode";

const theme = vscodeDarkInit({
  settings: {
    caret: "#c6c6c6",
    fontFamily: "monospace",
  },
});

export default theme;
