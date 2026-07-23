import type { AppProps } from "next/app";

import "@/index.css";
import { ThemeProvider } from "@/lib/providers/ThemeToggle";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
