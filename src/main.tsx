import { createRoot } from "react-dom/client";

import App from "./lib/App";
import { ThemeProvider } from "./lib/providers/ThemeToggle";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
