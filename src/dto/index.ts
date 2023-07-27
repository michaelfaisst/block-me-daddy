import { z } from "zod";

export const siteSchema = z.object({
    id: z.string(),
    site: z.string(),
    exact: z.boolean().default(false)
});

export type Site = z.infer<typeof siteSchema>;

export const scheduleSchema = z.object({
    id: z.string(),
    weekDays: z.array(z.number()),
    timeFrom: z.string(),
    timeTo: z.string()
});

export type Schedule = z.infer<typeof scheduleSchema>;
