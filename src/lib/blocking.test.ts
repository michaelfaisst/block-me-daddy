import { describe, expect, it } from "vitest";
import { parseISO } from "date-fns";
import { getSite, isInSchedule, shouldBlockSite } from "@/lib/blocking";
import { Site, Schedule } from "@/dto";

describe("blocking logic", () => {
    describe("getSite", () => {
        const mockSites: Site[] = [
            { id: "1", site: "https://facebook.com", exact: false },
            { id: "2", site: "https://twitter.com/specific-page", exact: true },
            { id: "3", site: "https://reddit.com", exact: false },
            { id: "4", site: "https://youtube.com/watch?v=123", exact: true }
        ];

        it("should return undefined for undefined URL", () => {
            const result = getSite(undefined, mockSites);
            expect(result).toBeUndefined();
        });

        it("should match hostname when exact is false", () => {
            const result = getSite("https://facebook.com/some/path", mockSites);
            expect(result).toBeDefined();
            expect(result?.id).toBe("1");
        });

        it("should match hostname for different paths when exact is false", () => {
            const result = getSite("https://facebook.com/another/path?query=param", mockSites);
            expect(result).toBeDefined();
            expect(result?.id).toBe("1");
        });

        it("should match exact URL when exact is true", () => {
            const result = getSite("https://twitter.com/specific-page", mockSites);
            expect(result).toBeDefined();
            expect(result?.id).toBe("2");
        });

        it("should not match different URL when exact is true", () => {
            const result = getSite("https://twitter.com/different-page", mockSites);
            expect(result).toBeUndefined();
        });

        it("should not match path variations when exact is true", () => {
            const result = getSite("https://youtube.com/watch?v=456", mockSites);
            expect(result).toBeUndefined();
        });

        it("should not match unlisted sites", () => {
            const result = getSite("https://google.com", mockSites);
            expect(result).toBeUndefined();
        });

        it("should handle www subdomain correctly with non-exact match", () => {
            const result = getSite("https://www.facebook.com/path", mockSites);
            expect(result).toBeDefined(); // www.facebook.com should match facebook.com
            expect(result?.id).toBe("1");
        });

        it("should match site with www when URL has no www", () => {
            const sitesWithWww: Site[] = [
                { id: "1", site: "https://www.youtube.com", exact: false }
            ];
            const result = getSite("https://youtube.com/watch", sitesWithWww);
            expect(result).toBeDefined(); // youtube.com should match www.youtube.com
            expect(result?.id).toBe("1");
        });

        it("should match both directions of www variants", () => {
            const sites: Site[] = [
                { id: "1", site: "https://example.com", exact: false }
            ];
            const resultWithWww = getSite("https://www.example.com", sites);
            const resultWithoutWww = getSite("https://example.com", sites);
            
            expect(resultWithWww).toBeDefined();
            expect(resultWithoutWww).toBeDefined();
            expect(resultWithWww?.id).toBe("1");
            expect(resultWithoutWww?.id).toBe("1");
        });

        it("should work with sites stored without protocol", () => {
            const sites: Site[] = [
                { id: "1", site: "youtube.com", exact: false },
                { id: "2", site: "github.com", exact: false }
            ];
            const result1 = getSite("https://youtube.com/watch", sites);
            const result2 = getSite("https://www.youtube.com/watch", sites);
            const result3 = getSite("https://github.com/user/repo", sites);
            
            expect(result1).toBeDefined();
            expect(result1?.id).toBe("1");
            expect(result2).toBeDefined();
            expect(result2?.id).toBe("1");
            expect(result3).toBeDefined();
            expect(result3?.id).toBe("2");
        });

        it("should match sites with or without www when stored without protocol", () => {
            const sites: Site[] = [
                { id: "1", site: "example.com", exact: false }
            ];
            const result1 = getSite("https://example.com", sites);
            const result2 = getSite("https://www.example.com", sites);
            
            expect(result1).toBeDefined();
            expect(result1?.id).toBe("1");
            expect(result2).toBeDefined();
            expect(result2?.id).toBe("1");
        });

        it("should match first occurrence when multiple sites match", () => {
            const duplicateSites: Site[] = [
                { id: "1", site: "https://facebook.com", exact: false },
                { id: "2", site: "https://facebook.com/specific", exact: true }
            ];
            const result = getSite("https://facebook.com/other", duplicateSites);
            expect(result?.id).toBe("1"); // First match wins
        });

        it("should handle empty sites array", () => {
            const result = getSite("https://facebook.com", []);
            expect(result).toBeUndefined();
        });
    });

    describe("isInSchedule", () => {
        it("should return true when no schedules are defined", () => {
            const result = isInSchedule([]);
            expect(result).toBe(true);
        });

        it("should return true when schedules is undefined", () => {
            const result = isInSchedule(undefined as any);
            expect(result).toBe(true);
        });

        it("should return true when current time is within schedule", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5], // Mon-Fri
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Monday at 12:00
            const now = parseISO("2025-01-06T12:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(true);
        });

        it("should return false when current time is before schedule", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5],
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Monday at 08:00
            const now = parseISO("2025-01-06T08:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(false);
        });

        it("should return false when current time is after schedule", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5],
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Monday at 18:00
            const now = parseISO("2025-01-06T18:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(false);
        });

        it("should return true at exact start time", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1],
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Monday at 09:00:00
            const now = parseISO("2025-01-06T09:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(true);
        });

        it("should return true at exact end time", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1],
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Monday at 17:00:00
            const now = parseISO("2025-01-06T17:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(true);
        });

        it("should return false when weekday doesn't match", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5], // Mon-Fri
                    timeFrom: "09:00",
                    timeTo: "17:00"
                }
            ];

            // Sunday at 12:00
            const now = parseISO("2025-01-05T12:00:00");
            const result = isInSchedule(schedules, now);
            expect(result).toBe(false);
        });

        it("should handle overnight schedules (e.g., 22:00 to 02:00)", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5, 6, 0],
                    timeFrom: "22:00",
                    timeTo: "02:00"
                }
            ];

            // Monday at 23:00 (should be in schedule)
            const now1 = parseISO("2025-01-06T23:00:00");
            expect(isInSchedule(schedules, now1)).toBe(true);

            // Tuesday at 01:00 (should be in schedule, after midnight)
            const now2 = parseISO("2025-01-07T01:00:00");
            expect(isInSchedule(schedules, now2)).toBe(true);

            // Tuesday at 03:00 (should not be in schedule)
            const now3 = parseISO("2025-01-07T03:00:00");
            expect(isInSchedule(schedules, now3)).toBe(false);
        });

        it("should handle schedule ending at midnight", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5],
                    timeFrom: "08:00",
                    timeTo: "00:00"
                }
            ];

            // Monday at 20:00
            const now1 = parseISO("2025-01-06T20:00:00");
            expect(isInSchedule(schedules, now1)).toBe(true);

            // Tuesday at 00:00 (midnight - should be in schedule)
            const now2 = parseISO("2025-01-07T00:00:00");
            expect(isInSchedule(schedules, now2)).toBe(true);

            // Tuesday at 01:00 (after midnight - should not be in schedule)
            const now3 = parseISO("2025-01-07T01:00:00");
            expect(isInSchedule(schedules, now3)).toBe(false);
        });

        it("should match any of multiple schedules", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [1, 2, 3, 4, 5], // Weekdays
                    timeFrom: "09:00",
                    timeTo: "17:00"
                },
                {
                    id: "2",
                    weekDays: [0, 6], // Weekends
                    timeFrom: "10:00",
                    timeTo: "14:00"
                }
            ];

            // Monday at 12:00 (matches first schedule)
            const now1 = parseISO("2025-01-06T12:00:00");
            expect(isInSchedule(schedules, now1)).toBe(true);

            // Sunday at 12:00 (matches second schedule)
            const now2 = parseISO("2025-01-05T12:00:00");
            expect(isInSchedule(schedules, now2)).toBe(true);

            // Sunday at 16:00 (doesn't match any)
            const now3 = parseISO("2025-01-05T16:00:00");
            expect(isInSchedule(schedules, now3)).toBe(false);
        });

        it("should handle all weekdays (0-6)", () => {
            const schedules: Schedule[] = [
                {
                    id: "1",
                    weekDays: [0], // Sunday
                    timeFrom: "10:00",
                    timeTo: "12:00"
                }
            ];

            // Sunday at 11:00
            const now = parseISO("2025-01-05T11:00:00");
            expect(isInSchedule(schedules, now)).toBe(true);
        });
    });

    describe("shouldBlockSite", () => {
        const mockSites: Site[] = [
            { id: "1", site: "https://facebook.com", exact: false }
        ];

        const mockSchedules: Schedule[] = [
            {
                id: "1",
                weekDays: [1, 2, 3, 4, 5],
                timeFrom: "09:00",
                timeTo: "17:00"
            }
        ];

        it("should return false when blocking is disabled", () => {
            const now = parseISO("2025-01-06T12:00:00"); // Monday at 12:00
            const result = shouldBlockSite(
                "https://facebook.com",
                mockSites,
                mockSchedules,
                false,
                now
            );
            expect(result).toBe(false);
        });

        it("should return false when site is not in blocked list", () => {
            const now = parseISO("2025-01-06T12:00:00");
            const result = shouldBlockSite(
                "https://google.com",
                mockSites,
                mockSchedules,
                true,
                now
            );
            expect(result).toBe(false);
        });

        it("should return false when not in schedule", () => {
            const now = parseISO("2025-01-05T12:00:00"); // Sunday at 12:00
            const result = shouldBlockSite(
                "https://facebook.com",
                mockSites,
                mockSchedules,
                true,
                now
            );
            expect(result).toBe(false);
        });

        it("should return true when site is blocked and in schedule", () => {
            const now = parseISO("2025-01-06T12:00:00"); // Monday at 12:00
            const result = shouldBlockSite(
                "https://facebook.com/some/path",
                mockSites,
                mockSchedules,
                true,
                now
            );
            expect(result).toBe(true);
        });

        it("should return true when no schedules exist (always block)", () => {
            const result = shouldBlockSite(
                "https://facebook.com",
                mockSites,
                [],
                true
            );
            expect(result).toBe(true);
        });

        it("should handle edge case with empty sites array", () => {
            const now = parseISO("2025-01-06T12:00:00");
            const result = shouldBlockSite(
                "https://facebook.com",
                [],
                mockSchedules,
                true,
                now
            );
            expect(result).toBe(false);
        });

        it("should handle undefined URL", () => {
            const now = parseISO("2025-01-06T12:00:00");
            const result = shouldBlockSite(
                undefined,
                mockSites,
                mockSchedules,
                true,
                now
            );
            expect(result).toBe(false);
        });

        it("should work with exact URL matching", () => {
            const exactSites: Site[] = [
                { id: "1", site: "https://youtube.com/watch?v=123", exact: true }
            ];
            const now = parseISO("2025-01-06T12:00:00");
            
            // Exact match
            const result1 = shouldBlockSite(
                "https://youtube.com/watch?v=123",
                exactSites,
                mockSchedules,
                true,
                now
            );
            expect(result1).toBe(true);

            // Different URL - should not block
            const result2 = shouldBlockSite(
                "https://youtube.com/watch?v=456",
                exactSites,
                mockSchedules,
                true,
                now
            );
            expect(result2).toBe(false);
        });
    });
});
