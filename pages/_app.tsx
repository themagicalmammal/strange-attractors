import type { AppProps } from "next/app";

import { ThemeProvider } from "@/lib/providers/ThemeToggle";

import "@/index.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
