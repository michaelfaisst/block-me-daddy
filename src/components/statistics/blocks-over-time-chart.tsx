import { format, subDays } from "date-fns";
import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Block } from "@/dto";
import { STORAGE_KEYS } from "@/lib/constants";
import { aggregateByDay, getBlocksInRange } from "@/lib/statistics";

import { Button, ButtonGroup, Card } from "../ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface BlocksOverTimeChartProps {
    blocks: Block[];
}

type TimeRange = "7d" | "30d" | "all";

const chartConfig = {
    count: {
        label: "Blocks",
        color: "hsl(var(--primary))"
    }
};

export function BlocksOverTimeChart({ blocks }: BlocksOverTimeChartProps) {
    const [timeRange, setTimeRange, , , isInitialStateResolved] =
        useChromeStorageLocal<TimeRange>(STORAGE_KEYS.CHART_TIME_RANGE, "7d");

    const chartData = useMemo(() => {
        const today = new Date();
        let filteredBlocks = blocks;

        // Filter by time range
        if (timeRange === "7d") {
            filteredBlocks = getBlocksInRange(blocks, subDays(today, 6), today);
        } else if (timeRange === "30d") {
            filteredBlocks = getBlocksInRange(
                blocks,
                subDays(today, 29),
                today
            );
        }

        // Aggregate by day
        const aggregated = aggregateByDay(filteredBlocks);

        // Format dates for display
        return aggregated.map((item) => ({
            date: format(new Date(item.date), "MMM d"),
            count: item.count
        }));
    }, [blocks, timeRange]);

    // Don't render chart until initial state is loaded to prevent flickering
    if (!isInitialStateResolved) {
        return (
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Blocks Over Time</h3>
                    <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="flex h-[300px] items-center justify-center">
                    <div className="h-full w-full animate-pulse rounded-md bg-muted" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Blocks Over Time</h3>
                <ButtonGroup>
                    <Button
                        variant={timeRange === "7d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("7d")}
                    >
                        7 Days
                    </Button>
                    <Button
                        variant={timeRange === "30d" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("30d")}
                    >
                        30 Days
                    </Button>
                    <Button
                        variant={timeRange === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("all")}
                    >
                        All Time
                    </Button>
                </ButtonGroup>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    No data available for this time range
                </div>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient
                                id="colorCount"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-count)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-count)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke="hsl(var(--border))"
                        />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-count)"
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ChartContainer>
            )}
        </Card>
    );
}
