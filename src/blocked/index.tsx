import "@fontsource-variable/inter";
import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "../context/theme";
import "../index.css";
import BlockedPage from "./page";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <BlockedPage />
        </ThemeProvider>
    </React.StrictMode>
);
