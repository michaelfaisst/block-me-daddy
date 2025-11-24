import { createId } from "@paralleldrive/cuid2";

import { Block, Schedule, Site, Statistics } from "@/dto";
import { getSite, shouldBlockSite } from "@/lib/blocking";
import { STORAGE_KEYS, URLS } from "@/lib/constants";

/**
 * Saves a block to storage
 * @param block - The block record to save
 */
async function saveBlock(block: Block): Promise<void> {
    try {
        const storage = await chrome.storage.local.get([
            STORAGE_KEYS.STATISTICS
        ]);

        let statistics: Statistics = storage[
            STORAGE_KEYS.STATISTICS
        ] as Statistics;

        // Initialize statistics if it doesn't exist or is malformed
        if (
            !statistics ||
            !statistics.blocks ||
            !Array.isArray(statistics.blocks)
        ) {
            statistics = {
                blocks: []
            };
        }

        console.log("Current statistics before save:", statistics);

        statistics.blocks.push(block);

        await chrome.storage.local.set({
            [STORAGE_KEYS.STATISTICS]: statistics
        });

        console.log(
            "Block saved successfully. Total blocks:",
            statistics.blocks.length
        );
    } catch (error) {
        console.error("Failed to save block:", error);
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
        // Track the block
        const sites = (storage[STORAGE_KEYS.SITES] as Site[]) || [];
        const matchedSite = getSite(url, sites);

        console.log("Block triggered:", { url, matchedSite });

        if (matchedSite) {
            const block: Block = {
                id: createId(),
                timestamp: Date.now(),
                siteId: matchedSite.id,
                url: url
            };

            console.log("Saving block:", block);
            // Save asynchronously without blocking the redirect
            saveBlock(block);
        } else {
            console.warn("Block triggered but no matched site found");
        }

        chrome.tabs.update(tab.id, { url: URLS.BLOCKED_PAGE });
    }
});
