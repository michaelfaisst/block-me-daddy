chrome.action.onClicked.addListener(() => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options.html"));
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tab.id == undefined) return;

    const url = changeInfo.url || tab.pendingUrl || tab.url;

    const hostName = url ? new URL(url).hostname : null;

    if (!hostName) return;

    const sites = await chrome.storage.local.get("sites");

    if (sites.sites) {
        const site = sites.sites.find((site: any) =>
            site.site.includes(hostName)
        );

        if (site) {
            chrome.tabs.update(tab.id, { url: "blocked.html" });
        }
    }
});
