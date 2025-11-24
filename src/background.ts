import { createId } from "@paralleldrive/cuid2";

import { BlockAttempt, Schedule, Site, Statistics } from "@/dto";
import { getSite, shouldBlockSite } from "@/lib/blocking";
import { STORAGE_KEYS, URLS } from "@/lib/constants";

/**
 * Saves a block attempt to storage
 * @param blockAttempt - The block attempt record to save
 */
async function saveBlockAttempt(blockAttempt: BlockAttempt): Promise<void> {
    try {
        const storage = await chrome.storage.local.get([
            STORAGE_KEYS.STATISTICS
        ]);
        const statistics: Statistics = (storage[
            STORAGE_KEYS.STATISTICS
        ] as Statistics) || {
            blockAttempts: []
        };

        statistics.blockAttempts.push(blockAttempt);

        await chrome.storage.local.set({
            [STORAGE_KEYS.STATISTICS]: statistics
        });
    } catch (error) {
        console.error("Failed to save block attempt:", error);
    }
}

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

    if (storage[STORAGE_KEYS.ENABLED] === false) return;

    const shouldBlock = shouldBlockSite(
        url,
        (storage[STORAGE_KEYS.SITES] as Site[]) || [],
        (storage[STORAGE_KEYS.SCHEDULES] as Schedule[]) || [],
        storage[STORAGE_KEYS.ENABLED] !== false
    );

    console.log("Blocking check:", {
        url,
        shouldBlock,
        enabled: storage[STORAGE_KEYS.ENABLED]
    });

    if (shouldBlock) {
        // Track the block attempt
        const sites = (storage[STORAGE_KEYS.SITES] as Site[]) || [];
        const matchedSite = getSite(url, sites);

        if (matchedSite) {
            const blockAttempt: BlockAttempt = {
                id: createId(),
                timestamp: Date.now(),
                siteId: matchedSite.id,
                url: url
            };

            // Save asynchronously without blocking the redirect
            saveBlockAttempt(blockAttempt);
        }

        chrome.tabs.update(tab.id, { url: URLS.BLOCKED_PAGE });
    }
});
