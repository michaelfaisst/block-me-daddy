import {
    addWeeks,
    getISOWeek,
    getISOWeekYear,
    setDay,
    setISOWeek,
    setISOWeekYear
} from "date-fns";
import { useEffect, useMemo, useRef } from "react";

import { Block } from "@/dto";
import { aggregateByWeekAndWeekday } from "@/lib/statistics";

import {
    Card,
    ScrollArea,
    ScrollBar,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "../ui";

interface BlocksHeatmapProps {
    blocks: Block[];
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function BlocksHeatmap({ blocks }: BlocksHeatmapProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const { chartData, maxCount, uniqueWeeks } = useMemo(() => {
        // Aggregate all blocks by week and weekday
        const aggregated = aggregateByWeekAndWeekday(blocks);

        // Generate all weeks from one year ago to current week
        const uniqueWeeks: string[] = [];
        const currentDate = new Date();

        // Start from 52 weeks ago
        let iterDate = addWeeks(currentDate, -52);

        // Generate 53 weeks total (weeks 0-52 inclusive: 52 weeks ago through current week)
        for (let i = 0; i <= 52; i++) {
            const year = getISOWeekYear(iterDate);
            const week = getISOWeek(iterDate);
            const weekStr = `${year}-W${week.toString().padStart(2, "0")}`;

            // Only add if not already added (to handle duplicate weeks at year boundaries)
            if (!uniqueWeeks.includes(weekStr)) {
                uniqueWeeks.push(weekStr);
            }

            iterDate = addWeeks(iterDate, 1);
        }

        // Find max count for color scaling
        const maxCount = Math.max(...aggregated.map((item) => item.count), 1);

        // Create a map for quick lookup: key = "week-weekday", value = count
        const dataMap = new Map<string, number>();
        aggregated.forEach((item) => {
            const weekStr = `${item.year}-W${item.week.toString().padStart(2, "0")}`;
            const key = `${weekStr}-${item.weekday}`;
            dataMap.set(key, item.count);
        });

        // Build chart data: array of weekday objects, each containing counts for all weeks
        // Map Sunday (0) to index 6, Monday (1) to index 0, etc.
        const chartData = dayNames.map((dayName, displayIndex) => {
            // Convert display index (0=Mon, 6=Sun) to JS weekday (0=Sun, 1=Mon)
            const weekdayIndex = displayIndex === 6 ? 0 : displayIndex + 1;
            const obj: { day: string; [key: string]: number | string } = {
                day: dayName
            };
            uniqueWeeks.forEach((weekStr) => {
                const key = `${weekStr}-${weekdayIndex}`;
                obj[weekStr] = dataMap.get(key) || 0;
            });
            return obj;
        });

        return { chartData, maxCount, uniqueWeeks };
    }, [blocks]);

    // Scroll to the right on mount
    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollElement) {
                scrollElement.scrollLeft = scrollElement.scrollWidth;
            }
        }
    }, [uniqueWeeks]);

    // Get color based on intensity
    const getColor = (value: number): string => {
        if (value === 0) return "hsl(var(--muted))";
        const intensity = value / maxCount;

        // Color scale from light to dark primary color
        if (intensity < 0.2) return "hsl(var(--primary) / 0.2)";
        if (intensity < 0.4) return "hsl(var(--primary) / 0.4)";
        if (intensity < 0.6) return "hsl(var(--primary) / 0.6)";
        if (intensity < 0.8) return "hsl(var(--primary) / 0.8)";
        return "hsl(var(--primary))";
    };

    if (chartData.length === 0 || uniqueWeeks.length === 0) {
        return (
            <Card className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Block Heat Map</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Blocks by week and day of week
                    </p>
                </div>
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    No data available
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Block Heat Map</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Blocks by week and day of week
                </p>
            </div>

            <div className="flex gap-2">
                {/* Y-axis labels - fixed on the left */}
                <div className="flex-shrink-0">
                    {/* Spacer for week labels row - match exact height */}
                    <div className="h-[1.5rem] mb-2" />
                    {/* Weekday labels */}
                    <div className="space-y-1">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="h-8 flex items-center justify-end pr-2 text-xs text-muted-foreground"
                            >
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scrollable heatmap */}
                <ScrollArea ref={scrollRef} className="flex-1">
                    <div className="inline-block min-w-full pb-4">
                        {/* Week labels at top */}
                        <div className="flex gap-1 mb-2">
                            {uniqueWeeks.map((week) => (
                                <div
                                    key={week}
                                    className="w-8 h-6 flex items-center justify-center text-xs text-muted-foreground font-medium"
                                >
                                    {week.split("-W")[1]}
                                </div>
                            ))}
                        </div>

                        {/* Heat map grid */}
                        <TooltipProvider delayDuration={0}>
                            <div className="space-y-1">
                                {chartData.map((dayData) => (
                                    <div
                                        key={dayData.day}
                                        className="flex gap-1"
                                    >
                                        {uniqueWeeks.map((week) => {
                                            const value = dayData[
                                                week
                                            ] as number;
                                            // Parse week string (e.g., "2024-W47") to get year and week number
                                            const [yearStr, weekStr] =
                                                week.split("-W");
                                            const year = parseInt(yearStr);
                                            const weekNum = parseInt(weekStr);

                                            // Get the weekday index (0=Sun, 1=Mon, etc.)
                                            const displayIndex =
                                                dayNames.indexOf(
                                                    dayData.day as string
                                                );
                                            const weekdayIndex =
                                                displayIndex === 6
                                                    ? 0
                                                    : displayIndex + 1;

                                            // Create date from year, week, and weekday
                                            let date = new Date();
                                            date = setISOWeekYear(date, year);
                                            date = setISOWeek(date, weekNum);
                                            date = setDay(date, weekdayIndex);

                                            // Format date according to user's locale
                                            const formattedDate =
                                                date.toLocaleDateString();

                                            return (
                                                <Tooltip key={week}>
                                                    <TooltipTrigger asChild>
                                                        <div
                                                            className="w-8 h-8 rounded-sm border border-border"
                                                            style={{
                                                                backgroundColor:
                                                                    getColor(
                                                                        value
                                                                    )
                                                            }}
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="font-semibold">
                                                            {formattedDate}
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            {value}{" "}
                                                            {value === 1
                                                                ? "block"
                                                                : "blocks"}
                                                        </div>
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </TooltipProvider>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            {/* Legend - outside scroll container */}
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                    <div
                        key={intensity}
                        className="w-4 h-4 rounded-sm border border-border"
                        style={{
                            backgroundColor:
                                intensity === 0
                                    ? "hsl(var(--muted))"
                                    : `hsl(var(--primary) / ${intensity})`
                        }}
                    />
                ))}
                <span>More</span>
            </div>
        </Card>
    );
}
