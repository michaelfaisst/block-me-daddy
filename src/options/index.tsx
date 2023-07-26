import "@fontsource-variable/inter";
import React from "react";
import ReactDOM from "react-dom/client";

import { TooltipProvider } from "@/components/ui";
import { ThemeProvider } from "@/context/theme";

import "../index.css";
import OptionsPage from "./page";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeProvider>
            <TooltipProvider>
                <OptionsPage />
            </TooltipProvider>
        </ThemeProvider>
    </React.StrictMode>
);
