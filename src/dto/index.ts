import { z } from "zod";

/**
 * Schema for a blocked site configuration
 * @property id - Unique identifier (CUID)
 * @property site - Domain or URL to block (e.g., "facebook.com")
 * @property exact - If true, only blocks exact URL match; if false, blocks entire domain
 * @property blockSubdomains - If true, blocks all subdomains of the site (e.g., blocking "example.com" also blocks "sub.example.com")
 */
export const siteSchema = z.object({
    id: z.string(),
    site: z.string(),
    exact: z.boolean().default(false),
    blockSubdomains: z.boolean().default(true).optional()
});

/**
 * TypeScript type for a blocked site
 */
export type Site = z.infer<typeof siteSchema>;

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Schema for a blocking schedule configuration
 * @property id - Unique identifier (CUID)
 * @property weekDays - Array of day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
 * @property timeFrom - Start time in HH:mm format (24-hour)
 * @property timeTo - End time in HH:mm format (24-hour)
 */
export const scheduleSchema = z.object({
    id: z.string(),
    weekDays: z.array(z.number()),
    timeFrom: z.string().regex(timeRegex, "Invalid time"),
    timeTo: z.string().regex(timeRegex, "Invalid time")
});

/**
 * TypeScript type for a blocking schedule
 */
export type Schedule = z.infer<typeof scheduleSchema>;

/**
 * Schema for a block attempt record
 * @property id - Unique identifier (CUID)
 * @property timestamp - Unix timestamp in milliseconds when the block occurred
 * @property siteId - Reference to the blocked site ID
 * @property url - Full URL that was attempted to be accessed
 */
export const blockAttemptSchema = z.object({
    id: z.string(),
    timestamp: z.number(),
    siteId: z.string(),
    url: z.string()
});

/**
 * TypeScript type for a block attempt
 */
export type BlockAttempt = z.infer<typeof blockAttemptSchema>;

/**
 * Schema for statistics data storage
 * @property blockAttempts - Array of all block attempt records
 */
export const statisticsSchema = z.object({
    blockAttempts: z.array(blockAttemptSchema)
});

/**
 * TypeScript type for statistics data
 */
export type Statistics = z.infer<typeof statisticsSchema>;
