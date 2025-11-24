import {
    endOfDay,
    format,
    getDay,
    getHours,
    isAfter,
    isBefore,
    startOfDay
} from "date-fns";

import { Block, Site } from "@/dto";

/**
 * Filters blocks within a specific date range
 * @param blocks - Array of all blocks
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns Filtered array of blocks
 */
export function getBlocksInRange(
    blocks: Block[],
    startDate: Date,
    endDate: Date
): Block[] {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    return blocks.filter((block) => {
        const blockDate = new Date(block.timestamp);
        return !isBefore(blockDate, start) && !isAfter(blockDate, end);
    });
}

/**
 * Aggregates blocks by day
 * @param blocks - Array of blocks to aggregate
 * @returns Array of objects with date string (YYYY-MM-DD) and count
 */
export function aggregateByDay(
    blocks: Block[]
): { date: string; count: number }[] {
    const dayMap = new Map<string, number>();

    blocks.forEach((block) => {
        const date = format(new Date(block.timestamp), "yyyy-MM-dd");
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
    });

    return Array.from(dayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregates blocks by hour (0-23)
 * @param blocks - Array of blocks to aggregate
 * @returns Array of objects with hour (0-23) and count
 */
export function aggregateByHour(
    blocks: Block[]
): { hour: number; count: number }[] {
    const hourMap = new Map<number, number>();

    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
        hourMap.set(i, 0);
    }

    blocks.forEach((block) => {
        const hour = getHours(new Date(block.timestamp));
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    return Array.from(hourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour - b.hour);
}

/**
 * Aggregates blocks by day of week
 * @param blocks - Array of blocks to aggregate
 * @returns Array of objects with day name and count
 */
export function aggregateByDayOfWeek(
    blocks: Block[]
): { day: string; count: number }[] {
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const dayMap = new Map<number, number>();

    // Initialize all days to 0
    for (let i = 0; i < 7; i++) {
        dayMap.set(i, 0);
    }

    blocks.forEach((block) => {
        const dayIndex = getDay(new Date(block.timestamp));
        dayMap.set(dayIndex, (dayMap.get(dayIndex) || 0) + 1);
    });

    return Array.from(dayMap.entries())
        .map(([dayIndex, count]) => ({
            day: dayNames[dayIndex],
            count
        }))
        .sort((a, b) => {
            // Sort Monday-Sunday (Monday = index 1)
            const aIndex = dayNames.indexOf(a.day);
            const bIndex = dayNames.indexOf(b.day);
            const adjustedA = aIndex === 0 ? 7 : aIndex;
            const adjustedB = bIndex === 0 ? 7 : bIndex;
            return adjustedA - adjustedB;
        });
}

/**
 * Aggregates blocks by time of day (hour 0-23)
 * Same as aggregateByHour but with more descriptive name for UI
 * @param blocks - Array of blocks to aggregate
 * @returns Array of objects with hour (0-23) and count
 */
export function aggregateByTimeOfDay(
    blocks: Block[]
): { hour: number; count: number }[] {
    return aggregateByHour(blocks);
}

/**
 * Gets the top most-blocked sites with their counts
 * @param blocks - Array of blocks
 * @param sites - Array of all blocked sites (for metadata)
 * @param limit - Maximum number of sites to return
 * @returns Array of objects with site and count, sorted by count descending
 */
export function getTopBlockedSites(
    blocks: Block[],
    sites: Site[],
    limit: number
): { site: Site; count: number }[] {
    const siteCountMap = new Map<string, number>();

    // Count blocks per site ID
    blocks.forEach((block) => {
        siteCountMap.set(
            block.siteId,
            (siteCountMap.get(block.siteId) || 0) + 1
        );
    });

    // Map to site objects with counts
    const siteCounts: { site: Site; count: number }[] = [];

    siteCountMap.forEach((count, siteId) => {
        const site = sites.find((s) => s.id === siteId);
        if (site) {
            siteCounts.push({ site, count });
        }
    });

    // Sort by count descending and limit
    return siteCounts.sort((a, b) => b.count - a.count).slice(0, limit);
}

/**
 * Gets Chrome storage usage information
 * @returns Object with used bytes, total quota, and percentage
 */
export async function getStorageUsage(): Promise<{
    used: number;
    total: number;
    percentage: number;
}> {
    const QUOTA_BYTES = 10 * 1024 * 1024; // 10 MB in bytes

    try {
        const used = await chrome.storage.local.getBytesInUse(null);
        const percentage = (used / QUOTA_BYTES) * 100;

        return {
            used,
            total: QUOTA_BYTES,
            percentage
        };
    } catch (error) {
        console.error("Failed to get storage usage:", error);
        return {
            used: 0,
            total: QUOTA_BYTES,
            percentage: 0
        };
    }
}
