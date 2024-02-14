import type { AppProps } from "next/app";

import { initialize } from "@/services/setup";

import "@/styles/globals.css";
import "react-day-picker/dist/style.css";

initialize();
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
