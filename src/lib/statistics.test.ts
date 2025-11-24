import { parseISO } from "date-fns";
import { describe, expect, it } from "vitest";

import { Block, Site } from "@/dto";
import {
    aggregateByDay,
    aggregateByDayOfWeek,
    aggregateByHour,
    aggregateByTimeOfDay,
    aggregateByWeekAndWeekday,
    getBlocksInRange,
    getTopBlockedSites
} from "@/lib/statistics";

describe("statistics", () => {
    // Mock data
    const mockSites: Site[] = [
        { id: "1", site: "facebook.com", exact: false },
        { id: "2", site: "twitter.com", exact: false },
        { id: "3", site: "reddit.com", exact: false }
    ];

    const mockBlocks: Block[] = [
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

    describe("getBlocksInRange", () => {
        it("should return all blocks within the date range", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-07T23:59:59");

            const result = getBlocksInRange(mockBlocks, startDate, endDate);

            expect(result).toHaveLength(5);
            expect(result.map((a) => a.id)).toEqual([
                "a1",
                "a2",
                "a3",
                "a4",
                "a5"
            ]);
        });

        it("should return only blocks on a single day", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-06T23:59:59");

            const result = getBlocksInRange(mockBlocks, startDate, endDate);

            expect(result).toHaveLength(3);
            expect(result.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
        });

        it("should return empty array when no blocks in range", () => {
            const startDate = parseISO("2025-01-01T00:00:00");
            const endDate = parseISO("2025-01-05T23:59:59");

            const result = getBlocksInRange(mockBlocks, startDate, endDate);

            expect(result).toHaveLength(0);
        });

        it("should include blocks throughout the entire day when given the same start and end date", () => {
            const startDate = parseISO("2025-01-06T09:00:00");
            const endDate = parseISO("2025-01-06T09:00:00");

            const result = getBlocksInRange(mockBlocks, startDate, endDate);

            // Should include all blocks on Jan 6th since endOfDay extends to 23:59:59
            expect(result).toHaveLength(3);
            expect(result.map((a) => a.id)).toEqual(["a1", "a2", "a3"]);
        });

        it("should include blocks at the end of the range", () => {
            const startDate = parseISO("2025-01-08T00:00:00");
            const endDate = parseISO("2025-01-08T23:59:59");

            const result = getBlocksInRange(mockBlocks, startDate, endDate);

            expect(result).toHaveLength(1);
            expect(result[0].id).toBe("a6");
        });

        it("should handle empty blocks array", () => {
            const startDate = parseISO("2025-01-06T00:00:00");
            const endDate = parseISO("2025-01-07T23:59:59");

            const result = getBlocksInRange([], startDate, endDate);

            expect(result).toHaveLength(0);
        });
    });

    describe("aggregateByDay", () => {
        it("should aggregate blocks by day", () => {
            const result = aggregateByDay(mockBlocks);

            expect(result).toHaveLength(3);
            expect(result).toEqual([
                { date: "2025-01-06", count: 3 },
                { date: "2025-01-07", count: 2 },
                { date: "2025-01-08", count: 1 }
            ]);
        });

        it("should handle empty blocks array", () => {
            const result = aggregateByDay([]);

            expect(result).toHaveLength(0);
        });

        it("should sort dates chronologically", () => {
            const unorderedBlocks: Block[] = [
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

            const result = aggregateByDay(unorderedBlocks);

            expect(result[0].date).toBe("2025-01-06");
            expect(result[1].date).toBe("2025-01-07");
            expect(result[2].date).toBe("2025-01-08");
        });

        it("should count multiple blocks on the same day", () => {
            const sameDay: Block[] = [
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
        it("should aggregate blocks by hour", () => {
            const result = aggregateByHour(mockBlocks);

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

        it("should handle multiple blocks in the same hour", () => {
            const sameHour: Block[] = [
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
            const result = aggregateByHour(mockBlocks);

            for (let i = 0; i < 24; i++) {
                expect(result[i].hour).toBe(i);
            }
        });

        it("should handle midnight and late night hours", () => {
            const lateNight: Block[] = [
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
        it("should aggregate blocks by day of week", () => {
            const result = aggregateByDayOfWeek(mockBlocks);

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
            const result = aggregateByDayOfWeek(mockBlocks);

            expect(result[0].day).toBe("Monday");
            expect(result[1].day).toBe("Tuesday");
            expect(result[2].day).toBe("Wednesday");
            expect(result[3].day).toBe("Thursday");
            expect(result[4].day).toBe("Friday");
            expect(result[5].day).toBe("Saturday");
            expect(result[6].day).toBe("Sunday");
        });

        it("should handle Sunday correctly", () => {
            const sunday: Block[] = [
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
            const multiWeek: Block[] = [
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
            const hourResult = aggregateByHour(mockBlocks);
            const timeOfDayResult = aggregateByTimeOfDay(mockBlocks);

            expect(timeOfDayResult).toEqual(hourResult);
        });
    });

    describe("getTopBlockedSites", () => {
        it("should return top sites sorted by count descending", () => {
            const result = getTopBlockedSites(mockBlocks, mockSites, 10);

            expect(result).toHaveLength(3);
            expect(result[0].site.id).toBe("1"); // Facebook - 3 blocks
            expect(result[0].count).toBe(3);
            expect(result[1].site.id).toBe("2"); // Twitter - 2 blocks
            expect(result[1].count).toBe(2);
            expect(result[2].site.id).toBe("3"); // Reddit - 1 block
            expect(result[2].count).toBe(1);
        });

        it("should limit results to the specified limit", () => {
            const result = getTopBlockedSites(mockBlocks, mockSites, 2);

            expect(result).toHaveLength(2);
            expect(result[0].site.id).toBe("1");
            expect(result[1].site.id).toBe("2");
        });

        it("should handle limit larger than available sites", () => {
            const result = getTopBlockedSites(mockBlocks, mockSites, 100);

            expect(result).toHaveLength(3);
        });

        it("should handle empty blocks array", () => {
            const result = getTopBlockedSites([], mockSites, 10);

            expect(result).toHaveLength(0);
        });

        it("should handle empty sites array", () => {
            const result = getTopBlockedSites(mockBlocks, [], 10);

            expect(result).toHaveLength(0);
        });

        it("should exclude sites that don't exist in the sites list", () => {
            const blocksWithUnknownSite: Block[] = [
                {
                    id: "a1",
                    timestamp: Date.now(),
                    siteId: "999",
                    url: "https://unknown.com"
                }
            ];

            const result = getTopBlockedSites(
                blocksWithUnknownSite,
                mockSites,
                10
            );

            expect(result).toHaveLength(0);
        });

        it("should handle ties in count correctly", () => {
            const tiedBlocks: Block[] = [
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

            const result = getTopBlockedSites(tiedBlocks, mockSites, 2);

            expect(result).toHaveLength(2);
            expect(result[0].count).toBe(1);
            expect(result[1].count).toBe(1);
        });

        it("should return sites with full metadata", () => {
            const result = getTopBlockedSites(mockBlocks, mockSites, 1);

            expect(result[0].site).toEqual({
                id: "1",
                site: "facebook.com",
                exact: false
            });
        });

        it("should handle single site with multiple blocks", () => {
            const singleSite: Block[] = [
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

    describe("aggregateByWeekAndWeekday", () => {
        it("should aggregate blocks by week and weekday", () => {
            const result = aggregateByWeekAndWeekday(mockBlocks);

            // 2025-01-06 is Monday (weekday 1) in week 2 of 2025
            // 2025-01-07 is Tuesday (weekday 2) in week 2 of 2025
            // 2025-01-08 is Wednesday (weekday 3) in week 2 of 2025
            expect(result).toContainEqual({
                week: 2,
                year: 2025,
                weekday: 1,
                weekdayName: "Monday",
                count: 3
            });
            expect(result).toContainEqual({
                week: 2,
                year: 2025,
                weekday: 2,
                weekdayName: "Tuesday",
                count: 2
            });
            expect(result).toContainEqual({
                week: 2,
                year: 2025,
                weekday: 3,
                weekdayName: "Wednesday",
                count: 1
            });
        });

        it("should handle blocks spanning multiple weeks", () => {
            const multiWeek: Block[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-06T09:00:00").getTime(), // Week 2, Monday
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-13T09:00:00").getTime(), // Week 3, Monday
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2025-01-20T09:00:00").getTime(), // Week 4, Monday
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByWeekAndWeekday(multiWeek);

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({
                week: 2,
                year: 2025,
                weekday: 1,
                weekdayName: "Monday",
                count: 1
            });
            expect(result[1]).toEqual({
                week: 3,
                year: 2025,
                weekday: 1,
                weekdayName: "Monday",
                count: 1
            });
            expect(result[2]).toEqual({
                week: 4,
                year: 2025,
                weekday: 1,
                weekdayName: "Monday",
                count: 1
            });
        });

        it("should handle empty blocks array", () => {
            const result = aggregateByWeekAndWeekday([]);
            expect(result).toEqual([]);
        });

        it("should aggregate multiple blocks on same week/weekday", () => {
            const sameDay: Block[] = [
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
                    timestamp: parseISO("2025-01-06T18:00:00").getTime(),
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByWeekAndWeekday(sameDay);

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual({
                week: 2,
                year: 2025,
                weekday: 1,
                weekdayName: "Monday",
                count: 3
            });
        });

        it("should sort results by year, week, then weekday", () => {
            const unsorted: Block[] = [
                {
                    id: "a1",
                    timestamp: parseISO("2025-01-08T09:00:00").getTime(), // Week 2, Wednesday
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a2",
                    timestamp: parseISO("2025-01-06T09:00:00").getTime(), // Week 2, Monday
                    siteId: "1",
                    url: "https://facebook.com"
                },
                {
                    id: "a3",
                    timestamp: parseISO("2024-12-30T09:00:00").getTime(), // Week 1, Monday
                    siteId: "1",
                    url: "https://facebook.com"
                }
            ];

            const result = aggregateByWeekAndWeekday(unsorted);

            expect(result[0].year).toBe(2025);
            expect(result[0].week).toBe(1);
            expect(result[1].year).toBe(2025);
            expect(result[1].week).toBe(2);
            expect(result[1].weekday).toBe(1);
            expect(result[2].year).toBe(2025);
            expect(result[2].week).toBe(2);
            expect(result[2].weekday).toBe(3);
        });
    });
});
