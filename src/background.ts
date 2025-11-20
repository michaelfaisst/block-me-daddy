import { Schedule, Site } from "@/dto";
import { getSite, isInSchedule, shouldBlockSite } from "@/lib/blocking";

chrome.action.onClicked.addListener(() => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options.html"));
    }
});

chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
    if (tab.id == undefined) return;

    const url = changeInfo.url || tab.pendingUrl || tab.url;

    // Prevent redirect loop - don't block if already on the blocked page
    if (url?.includes("blocked.html")) return;

    const enabledSettings = await chrome.storage.local.get("enabled");
    const siteSettings = (await chrome.storage.local.get("sites")) as {
        sites: Site[];
    };
    const schedulesSettings = (await chrome.storage.local.get("schedules")) as {
        schedules: Schedule[];
    };

    const shouldBlock = shouldBlockSite(
        url,
        siteSettings.sites || [],
        schedulesSettings.schedules || [],
        enabledSettings.enabled !== false
    );

    console.log("Blocking check:", {
        url,
        shouldBlock,
        enabled: enabledSettings.enabled
    });

    if (shouldBlock) {
        chrome.tabs.update(tab.id, { url: "blocked.html" });
    }
});
