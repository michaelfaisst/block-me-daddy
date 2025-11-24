import {
    addDays,
    getDay,
    getHours,
    getMinutes,
    isAfter,
    isBefore,
    isEqual,
    parse,
    setHours,
    setMinutes,
    setSeconds,
    subDays
} from "date-fns";

import { Schedule, Site } from "@/dto";

export interface StorageData {
    sites?: Site[];
    schedules?: Schedule[];
    enabled?: boolean;
}

/**
 * Normalizes hostname by removing www prefix for consistent comparison
 * @param hostname - The hostname to normalize
 * @returns The normalized hostname without www prefix
 */
export const normalizeHostname = (hostname: string): string => {
    return hostname.replace(/^www\./i, "");
};

/**
 * Ensures a URL has a protocol (https by default)
 * @param url - The URL to check
 * @returns URL with protocol prepended if missing
 */
export const ensureProtocol = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

/**
 * Normalizes a URL for consistent comparison by:
 * - Ensuring https protocol
 * - Removing www prefix from hostname
 * - Preserving path and query parameters
 * @param url - The URL to normalize
 * @returns Normalized URL string or undefined if invalid
 */
export const normalizeUrl = (url: string): string | undefined => {
    try {
        const urlWithProtocol = ensureProtocol(url);
        const parsedUrl = new URL(urlWithProtocol);
        const normalizedHostname = normalizeHostname(parsedUrl.hostname);

        // Reconstruct URL with normalized hostname and https protocol
        return `https://${normalizedHostname}${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    } catch {
        return undefined;
    }
};

/**
 * Finds a matching site in the blocked sites list
 * @param url - The URL to check
 * @param sites - Array of blocked sites to check against
 * @returns The matching Site object or undefined if no match
 */
export const getSite = (
    url: string | undefined,
    sites: Site[]
): Site | undefined => {
    // Early return: no URL or no sites to check
    if (!url || !sites || sites.length === 0) return undefined;

    let hostName: string;
    try {
        hostName = new URL(url).hostname;
    } catch {
        // Early return: invalid URL
        return undefined;
    }

    const normalizedHostName = normalizeHostname(hostName);

    const site = sites.find((site) => {
        try {
            // Ensure the stored site has a protocol before parsing
            const siteUrlWithProtocol = ensureProtocol(site.site);
            const blockedURL = new URL(siteUrlWithProtocol);
            const normalizedBlockedHostName = normalizeHostname(
                blockedURL.hostname
            );

            if (!site.exact) {
                // Check for exact hostname match first
                if (normalizedBlockedHostName === normalizedHostName) {
                    return true;
                }

                // If blockSubdomains is enabled (default true), check if the current hostname is a subdomain
                const shouldBlockSubdomains =
                    site.blockSubdomains !== undefined
                        ? site.blockSubdomains
                        : true;
                if (shouldBlockSubdomains) {
                    // Check if normalizedHostName ends with .normalizedBlockedHostName
                    // e.g., "michael.faisst.io" ends with ".faisst.io"
                    return normalizedHostName.endsWith(
                        `.${normalizedBlockedHostName}`
                    );
                }

                return false;
            }

            // For exact match, normalize both URLs for comparison
            // This handles www, protocol variations while still matching exact paths
            const normalizedStoredUrl = normalizeUrl(site.site);
            const normalizedBrowserUrl = normalizeUrl(url);

            // Warn if normalization fails to help debug configuration issues
            if (!normalizedStoredUrl) {
                console.warn(
                    `Failed to normalize stored site URL: ${site.site}`
                );
                return false;
            }
            if (!normalizedBrowserUrl) {
                console.warn(`Failed to normalize browser URL: ${url}`);
                return false;
            }

            return normalizedStoredUrl === normalizedBrowserUrl;
        } catch (error) {
            // If the stored site URL is malformed, skip it
            console.warn(`Malformed site URL in storage: ${site.site}`, error);
            return false;
        }
    });

    return site;
};

/**
 * Checks if the current time falls within any of the configured schedules
 * @param schedules - Array of schedule configurations
 * @param now - The current date/time to check (defaults to current time)
 * @returns True if current time is within any schedule, or if no schedules configured
 */
export const isInSchedule = (
    schedules: Schedule[],
    now: Date = new Date()
): boolean => {
    // Early return: no schedules means always active
    if (!schedules || schedules.length === 0) {
        return true;
    }

    const weekDay = getDay(now);

    const schedule = schedules.find((schedule) => {
        const startTime = parse(schedule.timeFrom, "HH:mm", now);
        const endTime = parse(schedule.timeTo, "HH:mm", now);

        const nowTime = setSeconds(
            setMinutes(setHours(now, getHours(now)), getMinutes(now)),
            0
        );
        const start = setSeconds(
            setMinutes(
                setHours(now, getHours(startTime)),
                getMinutes(startTime)
            ),
            0
        );
        let end = setSeconds(
            setMinutes(setHours(now, getHours(endTime)), getMinutes(endTime)),
            0
        );

        // Handle overnight schedules (e.g., 08:00 to 00:00 or 22:00 to 02:00)
        const isOvernightSchedule = isBefore(end, start) || isEqual(end, start);

        if (isOvernightSchedule) {
            end = addDays(end, 1);

            // For overnight schedules, we could be in two scenarios:
            // 1. Current time is >= start time (same day as start) - check current weekday
            // 2. Current time is < start time (could be overflow from yesterday) - check previous weekday

            if (isBefore(nowTime, start)) {
                // We're before the start time on current day
                // Check if we're in the overflow from previous day
                const previousWeekDay = getDay(subDays(now, 1));
                if (!schedule.weekDays.includes(previousWeekDay)) {
                    return false;
                }
                // Adjust comparison - we need to check against yesterday's schedule
                const yesterday = subDays(now, 1);
                const yesterdayStart = setSeconds(
                    setMinutes(
                        setHours(yesterday, getHours(startTime)),
                        getMinutes(startTime)
                    ),
                    0
                );
                const yesterdayEnd = setSeconds(
                    setMinutes(
                        setHours(now, getHours(endTime)),
                        getMinutes(endTime)
                    ),
                    0
                );

                return (
                    (isAfter(nowTime, yesterdayStart) ||
                        isEqual(nowTime, yesterdayStart)) &&
                    (isBefore(nowTime, yesterdayEnd) ||
                        isEqual(nowTime, yesterdayEnd))
                );
            } else {
                // We're at or after the start time on current day
                // This is the normal case for overnight schedule
                if (!schedule.weekDays.includes(weekDay)) {
                    return false;
                }
                return (
                    (isAfter(nowTime, start) || isEqual(nowTime, start)) &&
                    (isBefore(nowTime, end) || isEqual(nowTime, end))
                );
            }
        } else {
            // Regular schedule, just check current day
            if (!schedule.weekDays.includes(weekDay)) {
                return false;
            }
            return (
                (isAfter(nowTime, start) || isEqual(nowTime, start)) &&
                (isBefore(nowTime, end) || isEqual(nowTime, end))
            );
        }
    });

    return schedule !== undefined;
};

/**
 * Determines if a site should be blocked based on configuration
 * @param url - The URL to check
 * @param sites - Array of blocked sites
 * @param schedules - Array of schedule configurations
 * @param enabled - Whether blocking is globally enabled
 * @param now - Optional current date/time for testing
 * @returns True if the site should be blocked
 */
export const shouldBlockSite = (
    url: string | undefined,
    sites: Site[],
    schedules: Schedule[],
    enabled: boolean,
    now?: Date
): boolean => {
    // Early return: blocking disabled
    if (enabled === false) return false;

    // Early return: no URL to check
    if (!url) return false;

    const site = getSite(url, sites);

    // Early return: site not in block list
    if (!site) return false;

    // Early return: site is disabled
    const isSiteEnabled = site.enabled !== undefined ? site.enabled : true;
    if (!isSiteEnabled) return false;

    const inSchedule = isInSchedule(schedules, now);

    return inSchedule;
};
