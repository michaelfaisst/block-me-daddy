import { z } from "zod";

/**
 * Schema for a blocked site configuration
 * @property id - Unique identifier (CUID)
 * @property site - Domain or URL to block (e.g., "facebook.com")
 * @property exact - If true, only blocks exact URL match; if false, blocks entire domain
 * @property blockSubdomains - If true, blocks all subdomains of the site (e.g., blocking "example.com" also blocks "sub.example.com")
 * @property enabled - If true, the site will be blocked when global blocking is enabled; if false, the site will not be blocked
 */
export const siteSchema = z.object({
    id: z.string(),
    site: z.string(),
    exact: z.boolean().default(false),
    blockSubdomains: z.boolean().default(true).optional(),
    enabled: z.boolean().default(true).optional()
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
 * Schema for a block record
 * @property id - Unique identifier (CUID)
 * @property timestamp - Unix timestamp in milliseconds when the block occurred
 * @property siteId - Reference to the blocked site ID
 * @property url - Full URL that was blocked
 */
export const blockSchema = z.object({
    id: z.string(),
    timestamp: z.number(),
    siteId: z.string(),
    url: z.string()
});

/**
 * TypeScript type for a block
 */
export type Block = z.infer<typeof blockSchema>;

/**
 * Schema for statistics data storage
 * @property blocks - Array of all block records
 */
export const statisticsSchema = z.object({
    blocks: z.array(blockSchema)
});

/**
 * TypeScript type for statistics data
 */
export type Statistics = z.infer<typeof statisticsSchema>;
