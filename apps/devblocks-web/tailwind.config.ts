import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        sd: "0rem 0.5rem var(--color-primary-text)]",
      },
      colors: {
        bg: "var(--color-background)",
        bc: "var(--color-border)",
        pc: "var(--color-primary)",
        sc: "var(--color-secondary)",
        pt: "var(--color-primary-text)",
        st: "var(--color-secondary-text)",
        tp: "var(--color-transparent)",
        red: "var(--color-red)",
        green: "var(--color-green)",
      },
      fontFamily: {
        sans: ["thicccboi", ...defaultTheme.fontFamily.sans],
        display: ["thicccboi", ...defaultTheme.fontFamily.sans],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
export default config;
