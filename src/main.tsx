import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/providers/ThemeToggle";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
);
