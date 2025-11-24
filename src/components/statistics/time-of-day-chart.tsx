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

        // Format hours for better display (e.g., 0 -> 12am, 13 -> 1pm)
        return aggregated.map((item) => {
            const hour = item.hour;
            const ampm = hour >= 12 ? "pm" : "am";
            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            return {
                hour: `${displayHour}${ampm}`,
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
