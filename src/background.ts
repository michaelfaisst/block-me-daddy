import { Schedule, Site } from "@/dto";
import { shouldBlockSite } from "@/lib/blocking";
import { STORAGE_KEYS, URLS } from "@/lib/constants";

/**
 * Opens the extension options page when the extension icon is clicked
 */
chrome.action.onClicked.addListener(() => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL(URLS.OPTIONS_PAGE));
    }
});

/**
 * Monitors tab updates and blocks sites based on user configuration
 * Optimized with early returns and batched storage reads
 */
chrome.tabs.onUpdated.addListener(async (_, changeInfo, tab) => {
    // Early return: tab ID must exist
    if (tab.id == undefined) return;

    const url = changeInfo.url || tab.pendingUrl || tab.url;

    if (!url || url.includes(URLS.BLOCKED_PAGE)) return;

    const storage = await chrome.storage.local.get([
        STORAGE_KEYS.ENABLED,
        STORAGE_KEYS.SITES,
        STORAGE_KEYS.SCHEDULES
    ]);

    const enabled =
        (storage[STORAGE_KEYS.ENABLED] as boolean | undefined) ?? true;

    if (enabled === false) return;

    const shouldBlock = shouldBlockSite(
        url,
        (storage[STORAGE_KEYS.SITES] as Site[]) || [],
        (storage[STORAGE_KEYS.SCHEDULES] as Schedule[]) || [],
        enabled
    );

    console.log("Blocking check:", {
        url,
        shouldBlock,
        enabled
    });

    if (shouldBlock) {
        chrome.tabs.update(tab.id, { url: URLS.BLOCKED_PAGE });
    }
});
