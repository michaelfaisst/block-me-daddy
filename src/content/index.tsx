import React from "react";
import ReactDOM from "react-dom";
import Content from "./page";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

const test = await chrome.storage.local.get("sites");
console.log(test);

ReactDOM.render(
    <React.StrictMode>
        <Content />
    </React.StrictMode>,
    root
);
