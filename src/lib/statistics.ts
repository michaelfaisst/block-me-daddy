import {
    endOfDay,
    format,
    getDay,
    getHours,
    isAfter,
    isBefore,
    startOfDay
} from "date-fns";

import { BlockAttempt, Site } from "@/dto";

/**
 * Filters block attempts within a specific date range
 * @param attempts - Array of all block attempts
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns Filtered array of block attempts
 */
export function getBlockAttemptsInRange(
    attempts: BlockAttempt[],
    startDate: Date,
    endDate: Date
): BlockAttempt[] {
    const start = startOfDay(startDate);
    const end = endOfDay(endDate);

    return attempts.filter((attempt) => {
        const attemptDate = new Date(attempt.timestamp);
        return !isBefore(attemptDate, start) && !isAfter(attemptDate, end);
    });
}

/**
 * Aggregates block attempts by day
 * @param attempts - Array of block attempts to aggregate
 * @returns Array of objects with date string (YYYY-MM-DD) and count
 */
export function aggregateByDay(
    attempts: BlockAttempt[]
): { date: string; count: number }[] {
    const dayMap = new Map<string, number>();

    attempts.forEach((attempt) => {
        const date = format(new Date(attempt.timestamp), "yyyy-MM-dd");
        dayMap.set(date, (dayMap.get(date) || 0) + 1);
    });

    return Array.from(dayMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Aggregates block attempts by hour (0-23)
 * @param attempts - Array of block attempts to aggregate
 * @returns Array of objects with hour (0-23) and count
 */
export function aggregateByHour(
    attempts: BlockAttempt[]
): { hour: number; count: number }[] {
    const hourMap = new Map<number, number>();

    // Initialize all hours to 0
    for (let i = 0; i < 24; i++) {
        hourMap.set(i, 0);
    }

    attempts.forEach((attempt) => {
        const hour = getHours(new Date(attempt.timestamp));
        hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });

    return Array.from(hourMap.entries())
        .map(([hour, count]) => ({ hour, count }))
        .sort((a, b) => a.hour - b.hour);
}

/**
 * Aggregates block attempts by day of week
 * @param attempts - Array of block attempts to aggregate
 * @returns Array of objects with day name and count
 */
export function aggregateByDayOfWeek(
    attempts: BlockAttempt[]
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

    attempts.forEach((attempt) => {
        const dayIndex = getDay(new Date(attempt.timestamp));
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
 * Aggregates block attempts by time of day (hour 0-23)
 * Same as aggregateByHour but with more descriptive name for UI
 * @param attempts - Array of block attempts to aggregate
 * @returns Array of objects with hour (0-23) and count
 */
export function aggregateByTimeOfDay(
    attempts: BlockAttempt[]
): { hour: number; count: number }[] {
    return aggregateByHour(attempts);
}

/**
 * Gets the top most-blocked sites with their counts
 * @param attempts - Array of block attempts
 * @param sites - Array of all blocked sites (for metadata)
 * @param limit - Maximum number of sites to return
 * @returns Array of objects with site and count, sorted by count descending
 */
export function getTopBlockedSites(
    attempts: BlockAttempt[],
    sites: Site[],
    limit: number
): { site: Site; count: number }[] {
    const siteCountMap = new Map<string, number>();

    // Count attempts per site ID
    attempts.forEach((attempt) => {
        siteCountMap.set(
            attempt.siteId,
            (siteCountMap.get(attempt.siteId) || 0) + 1
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
