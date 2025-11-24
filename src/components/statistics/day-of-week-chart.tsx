import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Block } from "@/dto";
import { aggregateByDayOfWeek } from "@/lib/statistics";

import { Card } from "../ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface DayOfWeekChartProps {
    blocks: Block[];
}

const chartConfig = {
    count: {
        label: "Blocks",
        color: "hsl(var(--primary))"
    }
};

export function DayOfWeekChart({ blocks }: DayOfWeekChartProps) {
    const chartData = useMemo(() => {
        const aggregated = aggregateByDayOfWeek(blocks);

        // Shorten day names for better display
        return aggregated.map((item) => ({
            day: item.day.slice(0, 3), // Mon, Tue, Wed, etc.
            count: item.count
        }));
    }, [blocks]);

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Blocks by Day of Week</h3>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                    No data available
                </div>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="h-[250px] w-full"
                >
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="day"
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
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={4}
                        />
                    </BarChart>
                </ChartContainer>
            )}
        </Card>
    );
}
