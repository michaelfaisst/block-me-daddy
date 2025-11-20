import { getDay, getHours, getMinutes, parse, setHours, setMinutes, setSeconds, addDays, subDays, isAfter, isBefore, isEqual } from "date-fns";

import { Schedule, Site } from "@/dto";

export interface StorageData {
    sites?: Site[];
    schedules?: Schedule[];
    enabled?: boolean;
}

// Helper function to normalize hostname by removing www prefix
const normalizeHostname = (hostname: string): string => {
    return hostname.replace(/^www\./i, '');
};

// Helper function to ensure URL has a protocol
const ensureProtocol = (url: string): string => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const getSite = (url: string | undefined, sites: Site[]): Site | undefined => {
    const hostName = url ? new URL(url).hostname : null;
    if (!hostName) return;

    const normalizedHostName = normalizeHostname(hostName);

    const site = sites.find((site) => {
        // Ensure the stored site has a protocol before parsing
        const siteUrlWithProtocol = ensureProtocol(site.site);
        const blockedURL = new URL(siteUrlWithProtocol);
        const normalizedBlockedHostName = normalizeHostname(blockedURL.hostname);

        if (!site.exact) {
            return normalizedBlockedHostName === normalizedHostName;
        }

        return site.site == url;
    });

    return site;
};

export const isInSchedule = (schedules: Schedule[], now: Date = new Date()): boolean => {
    if (!schedules || schedules.length === 0) {
        return true;
    }

    const weekDay = getDay(now);

    const schedule = schedules.find((schedule) => {
        const startTime = parse(schedule.timeFrom, "HH:mm", now);
        const endTime = parse(schedule.timeTo, "HH:mm", now);

        const nowTime = setSeconds(setMinutes(setHours(now, getHours(now)), getMinutes(now)), 0);
        const start = setSeconds(setMinutes(setHours(now, getHours(startTime)), getMinutes(startTime)), 0);
        let end = setSeconds(setMinutes(setHours(now, getHours(endTime)), getMinutes(endTime)), 0);

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
                const yesterdayStart = setSeconds(setMinutes(setHours(yesterday, getHours(startTime)), getMinutes(startTime)), 0);
                const yesterdayEnd = setSeconds(setMinutes(setHours(now, getHours(endTime)), getMinutes(endTime)), 0);
                
                return (isAfter(nowTime, yesterdayStart) || isEqual(nowTime, yesterdayStart)) && 
                       (isBefore(nowTime, yesterdayEnd) || isEqual(nowTime, yesterdayEnd));
            } else {
                // We're at or after the start time on current day
                // This is the normal case for overnight schedule
                if (!schedule.weekDays.includes(weekDay)) {
                    return false;
                }
                return (isAfter(nowTime, start) || isEqual(nowTime, start)) && 
                       (isBefore(nowTime, end) || isEqual(nowTime, end));
            }
        } else {
            // Regular schedule, just check current day
            if (!schedule.weekDays.includes(weekDay)) {
                return false;
            }
            return (isAfter(nowTime, start) || isEqual(nowTime, start)) && 
                   (isBefore(nowTime, end) || isEqual(nowTime, end));
        }
    });

    return schedule != undefined;
};

export const shouldBlockSite = (
    url: string | undefined,
    sites: Site[],
    schedules: Schedule[],
    enabled: boolean,
    now?: Date
): boolean => {
    // Default to enabled if not set
    if (enabled === false) return false;

    const site = getSite(url, sites);
    const inSchedule = isInSchedule(schedules, now);

    return !!(site && inSchedule);
};
