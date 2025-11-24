import { parseISO } from "date-fns";
import { describe, expect, it } from "vitest";

import { BlockAttempt, Site } from "@/dto";
import {
    aggregateByDay,
    aggregateByDayOfWeek,
    aggregateByHour,
    aggregateByTimeOfDay,
    getBlockAttemptsInRange,
    getTopBlockedSites
} from "@/lib/statistics";

describe("statistics", () => {
    // Mock data
    const mockSites: Site[] = [
        { id: "1", site: "facebook.com", exact: false },
        { id: "2", site: "twitter.com", exact: false },
        { id: "3", site: "reddit.com", exact: false }
    ];

    const mockAttempts: BlockAttempt[] = [
        {
            id: "a1",
            timestamp: parseISO("2025-01-06T09:30:00").getTime(),
            siteId: "1",
            url: "https://facebook.com"
        },
        {
            id: "a2",
            timestamp: parseISO("2025-01-06T14:15:00").getTime(),
            siteId: "1",
            url: "https://facebook.com/feed"
        },
        {
            id: "a3",
            timestamp: parseISO("2025-01-06T16:45:00").getTime(),
            siteId: "2",
            url: "https://twitter.com"
        },
        {
            id: "a4",
            timestamp: parseISO("2025-01-07T10:00:00").getTime(),
            siteId: "1",
            url: "https://facebook.com"
        },
        {
            id: "a5",
            timestamp: parseISO("2025-01-07T11:30:00").getTime(),
            siteId: "3",
            url: "https://reddit.com"
        },
        {
            id: "a6",
            timestamp: parseISO("2025-01-08T15:20:00").getTime(),
            siteId: "2",
            url: "https://twitter.com"
        }
    ];

    describe("getBlockAttemptsInRange", () => {
        it("should return all attempts within the date range", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-07T23:59:59");

            const result = getBlockAttemptsInRange(
                mockAttempts,
                startDate,
                endDate
            );

            expect(result).toHaveLength(5);
            expect(result.map((a) => a.id)).toEqual([
                "a1",
                "a2",
                "a3",
                "a4",
                "a5"
            ]);
        });

        it("should return only attempts on a single day", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-06T23:59:59");

            const result = getBlockAttemptsInRange(
                mockAttempts,
                startDate,
                endDate
            );

            expect(result).toHaveLength(3);
            expect(result.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
        });

        it("should return empty array when no attempts in range", () => {
            const startDate = parseISO("2025-01-01T00:00:00");
            const endDate = parseISO("2025-01-05T23:59:59");

            const result = getBlockAttemptsInRange(
                mockAttempts,
                startDate,
                endDate
            );

            expect(result).toHaveLength(0);
        });

        it("should include attempts throughout the entire day when given the same start and end date", () => {
            const startDate = parseISO("2025-01-06T09:00:00");
            const endDate = parseISO("2025-01-06T09:00:00");

            const result = getBlockAttemptsInRange(
                mockAttempts,
                startDate,
                endDate
            );

            // Should include all attempts on Jan 6th since endOfDay extends to 23:59:59
            expect(result).toHaveLength(3);
            expect(result.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
        });

        it("should include attempts at the end of the range", () => {
            const startDate = parseISO("2025-01-08T00:00:00");
            const endDate = parseISO("2025-01-08T23:59:59");

            const result = getBlockAttemptsInRange(
                mockAttempts,
                startDate,
                endDate
            );

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("a6");
        });

        it("should handle empty attempts array", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-07T23:59:59");

            const result = getBlockAttemptsInRange([], startDate, endDate);

            expect(result).toHaveLength(0);
        });
    });

    describe("aggregateByDay", () => {
        it("should aggregate attempts by day", () => {
            const result = aggregateByDay(mockAttempts);

            expect(result).toHaveLength(3);
            expect(result).toEqual([
                { date: "2025-01-06", count: 3 },
                { date: "2025-01-07", count: 2 },
                { date: "2025-01-08", count: 1 }
            ]);
        });

        it("should handle empty attempts array", () => {
            const result = aggregateByDay([]);

            expect(result).toHaveLength(0);
        });

        it("should sort dates chronologically", () => {
            const unorderedAttempts: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-08T10:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-06T10:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2025-01-07T10:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByDay(unorderedAttempts);

            expect(result[0].date).toBe("2025-01-06");
            expect(result[1].date).toBe("2025-01-07");
            expect(result[2].date).toBe("2025-01-08");
        });

        it("should count multiple attempts on the same day", () => {
            const sameDay: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-06T09:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-06T14:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2025-01-06T20:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByDay(sameDay);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({ date: "2025-01-06", count: 3 });
        });
    });

    describe("aggregateByHour", () => {
        it("should aggregate attempts by hour", () => {
            const result = aggregateByHour(mockAttempts);

            expect(result).toHaveLength(24);
            expect(result[9]).toEqual({ hour: 9, count: 1 }); // a1
            expect(result[10]).toEqual({ hour: 10, count: 1 }); // a4
            expect(result[11]).toEqual({ hour: 11, count: 1 }); // a5
            expect(result[14]).toEqual({ hour: 14, count: 1 }); // a2
            expect(result[15]).toEqual({ hour: 15, count: 1 }); // a6
            expect(result[16]).toEqual({ hour: 16, count: 1 }); // a3
        });

        it("should initialize all hours to 0", () => {
            const result = aggregateByHour([]);

            expect(result).toHaveLength(24);
            result.forEach((item, index) => {
                expect(item.hour).toBe(index);
                expect(item.count).toBe(0);
            });
        });

        it("should handle multiple attempts in the same hour", () => {
            const sameHour: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-06T14:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-06T14:30:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2025-01-06T14:59:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByHour(sameHour);

            expect(result[14]).toEqual({ hour: 14, count: 3 });
        });

        it("should sort hours from 0 to 23", () => {
            const result = aggregateByHour(mockAttempts);

            for (let i = 0; i < 24; i++) {
                expect(result[i].hour).toBe(i);
            }
        });

        it("should handle midnight and late night hours", () => {
            const lateNight: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-06T00:30:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-06T23:45:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByHour(lateNight);

            expect(result[0]).toEqual({ hour: 0, count: 1 });
            expect(result[23]).toEqual({ hour: 23, count: 1 });
        });
    });

    describe("aggregateByDayOfWeek", () => {
        it("should aggregate attempts by day of week", () => {
            const result = aggregateByDayOfWeek(mockAttempts);

            expect(result).toHaveLength(7);
            // 2025-01-06 is Monday, 2025-01-07 is Tuesday, 2025-01-08 is Wednesday
            expect(result[0]).toEqual({ day: "Monday", count: 3 }); // Jan 6
            expect(result[1]).toEqual({ day: "Tuesday", count: 2 }); // Jan 7
            expect(result[2]).toEqual({ day: "Wednesday", count: 1 }); // Jan 8
            expect(result[3]).toEqual({ day: "Thursday", count: 0 });
            expect(result[4]).toEqual({ day: "Friday", count: 0 });
            expect(result[5]).toEqual({ day: "Saturday", count: 0 });
            expect(result[6]).toEqual({ day: "Sunday", count: 0 });
        });

        it("should initialize all days to 0", () => {
            const result = aggregateByDayOfWeek([]);

            expect(result).toHaveLength(7);
            result.forEach((item) => {
                expect(item.count).toBe(0);
            });
        });

        it("should sort days from Monday to Sunday", () => {
            const result = aggregateByDayOfWeek(mockAttempts);

            expect(result[0].day).toBe("Monday");
            expect(result[1].day).toBe("Tuesday");
            expect(result[2].day).toBe("Wednesday");
            expect(result[3].day).toBe("Thursday");
            expect(result[4].day).toBe("Friday");
            expect(result[5].day).toBe("Saturday");
            expect(result[6].day).toBe("Sunday");
        });

        it("should handle Sunday correctly", () => {
            const sunday: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-05T10:00:00").getTime(), // Sunday
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByDayOfWeek(sunday);

            expect(result[6]).toEqual({ day: "Sunday", count: 1 });
        });

        it("should aggregate multiple weeks of data", () => {
            const multiWeek: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-06T10:00:00").getTime(), // Monday week 1
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-13T10:00:00").getTime(), // Monday week 2
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2025-01-20T10:00:00").getTime(), // Monday week 3
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByDayOfWeek(multiWeek);

            expect(result[0]).toEqual({ day: "Monday", count: 3 });
        });
    });

    describe("aggregateByTimeOfDay", () => {
        it("should be equivalent to aggregateByHour", () => {
            const hourResult = aggregateByHour(mockAttempts);
            const timeOfDayResult = aggregateByTimeOfDay(mockAttempts);

            expect(timeOfDayResult).toEqual(hourResult);
        });
    });

    describe("getTopBlockedSites", () => {
        it("should return top sites sorted by count descending", () => {
            const result = getTopBlockedSites(mockAttempts, mockSites, 10);

            expect(result).toHaveLength(3);
            expect(result[0].site.id).toBe("1"); // Facebook - 3 attempts
            expect(result[0].count).toBe(3);
            expect(result[1].site.id).toBe("2"); // Twitter - 2 attempts
            expect(result[1].count).toBe(2);
            expect(result[2].site.id).toBe("3"); // Reddit - 1 attempt
            expect(result[2].count).toBe(1);
        });

        it("should limit results to the specified limit", () => {
            const result = getTopBlockedSites(mockAttempts, mockSites, 2);

            expect(result).toHaveLength(2);
            expect(result[0].site.id).toBe("1");
            expect(result[1].site.id).toBe("2");
        });

        it("should handle limit larger than available sites", () => {
            const result = getTopBlockedSites(mockAttempts, mockSites, 100);

            expect(result).toHaveLength(3);
        });

        it("should handle empty attempts array", () => {
            const result = getTopBlockedSites([], mockSites, 10);

            expect(result).toHaveLength(0);
        });

        it("should handle empty sites array", () => {
            const result = getTopBlockedSites(mockAttempts, [], 10);

            expect(result).toHaveLength(0);
        });

        it("should exclude sites that don't exist in the sites list", () => {
            const attemptsWithUnknownSite: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: Date.now(),
                    siteId: "999",
                    url: "https://unknown.com"
                }
            ];

            const result = getTopBlockedSites(
                attemptsWithUnknownSite,
                mockSites,
                10
            );

            expect(result).toHaveLength(0);
        });

        it("should handle ties in count correctly", () => {
            const tiedAttempts: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: Date.now(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: Date.now(),
                    siteId: "2",
                    url: "https://twitter.com"
                },
                {
                    id: "a3",
                    timestamp: Date.now(),
                    siteId: "3",
                    url: "https://reddit.com"
                }
            ];

            const result = getTopBlockedSites(tiedAttempts, mockSites, 2);

            expect(result).toHaveLength(2);
            expect(result[0].count).toBe(1);
            expect(result[1].count).toBe(1);
        });

        it("should return sites with full metadata", () => {
            const result = getTopBlockedSites(mockAttempts, mockSites, 1);

            expect(result[0].site).toEqual({
                id: "1",
                site: "facebook.com",
                exact: false
            });
        });

        it("should handle single site with multiple attempts", () => {
            const singleSite: BlockAttempt[] = [
                {
                    id: "a1",
                    timestamp: Date.now(),
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: Date.now(),
                    siteId: "1",
                    url: "https://facebook.com/feed"
                },
                {
                    id: "a3",
                    timestamp: Date.now(),
                    siteId: "1",
                    url: "https://facebook.com/profile"
                }
            ];

            const result = getTopBlockedSites(singleSite, mockSites, 10);

            expect(result).toHaveLength(1);
            expect(result[0].site.id).toBe("1");
            expect(result[0].count).toBe(3);
        });
    });
});
