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
