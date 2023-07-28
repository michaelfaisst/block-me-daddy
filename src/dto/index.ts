import { z } from "zod";

export const siteSchema = z.object({
    id: z.string(),
    site: z.string(),
    exact: z.boolean().default(false)
});

export type Site = z.infer<typeof siteSchema>;

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export const scheduleSchema = z.object({
    id: z.string(),
    weekDays: z.array(z.number()),
    timeFrom: z.string().regex(timeRegex, "Invalid time"),
    timeTo: z.string().regex(timeRegex, "Invalid time")
});

export type Schedule = z.infer<typeof scheduleSchema>;
