import React from "react";
import ReactDOM from "react-dom/client";

import { ThemeProvider } from "../context/theme";
import "../index.css";
import OptionsPage from "./page";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <OptionsPage />
        </ThemeProvider>
    </React.StrictMode>
);
