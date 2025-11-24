import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Block } from "@/dto";
import { aggregateByTimeOfDay } from "@/lib/statistics";

import { Card } from "../ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface TimeOfDayChartProps {
    blocks: Block[];
}

const chartConfig = {
    count: {
        label: "Blocks",
        color: "hsl(var(--primary))"
    }
};

export function TimeOfDayChart({ blocks }: TimeOfDayChartProps) {
    const chartData = useMemo(() => {
        const aggregated = aggregateByTimeOfDay(blocks);

        // Format hours in 24-hour format (e.g., 0 -> 00:00, 13 -> 13:00)
        return aggregated.map((item) => {
            const hourStr = item.hour.toString().padStart(2, "0");
            const nextHourStr = ((item.hour + 1) % 24)
                .toString()
                .padStart(2, "0");
            return {
                hour: `${hourStr}:00`,
                hourRange: `${hourStr}:00 - ${nextHourStr}:00`,
                count: item.count
            };
        });
    }, [blocks]);

    return (
        <Card className="p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Blocks by Time of Day</h3>
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
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(_, payload) => {
                                        if (payload && payload.length > 0) {
                                            return payload[0].payload.hourRange;
                                        }
                                        return "";
                                    }}
                                />
                            }
                        />
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
