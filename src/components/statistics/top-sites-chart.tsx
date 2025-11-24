import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Block, Site } from "@/dto";
import { URLS } from "@/lib/constants";
import { getTopBlockedSites } from "@/lib/statistics";

import { Button, ButtonGroup, Card } from "../ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface TopSitesChartProps {
    blocks: Block[];
    sites: Site[];
}

type TopSitesLimit = 5 | 10 | 20;

const chartConfig = {
    count: {
        label: "Blocks",
        color: "hsl(var(--primary))"
    }
};

// Custom tick component to show site favicon and name
interface CustomTickProps {
    x?: number;
    y?: number;
    payload?: { value: string };
}

const CustomYAxisTick = ({ x = 0, y = 0, payload }: CustomTickProps) => {
    if (!payload) return null;

    return (
        <g transform={`translate(${x},${y})`}>
            <image
                x={-120}
                y={-8}
                width={16}
                height={16}
                href={`${URLS.FAVICON_API}${payload.value}`}
            />
            <text
                x={-98}
                y={0}
                dy={4}
                textAnchor="start"
                fill="currentColor"
                className="text-xs fill-muted-foreground"
            >
                {payload.value}
            </text>
        </g>
    );
};

export function TopSitesChart({ blocks, sites }: TopSitesChartProps) {
    const [limit, setLimit] = useState<TopSitesLimit>(10);

    const chartData = useMemo(() => {
        const topSites = getTopBlockedSites(blocks, sites, limit);

        return topSites.map((item) => ({
            site: item.site.site,
            count: item.count
        }));
    }, [blocks, sites, limit]);

    return (
        <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Top Blocked Sites</h3>
                <ButtonGroup>
                    <Button
                        variant={limit === 5 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLimit(5)}
                    >
                        Top 5
                    </Button>
                    <Button
                        variant={limit === 10 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLimit(10)}
                    >
                        Top 10
                    </Button>
                    <Button
                        variant={limit === 20 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLimit(20)}
                    >
                        Top 20
                    </Button>
                </ButtonGroup>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    No blocked sites data available
                </div>
            ) : (
                <ChartContainer
                    config={chartConfig}
                    className="h-[300px] w-full"
                >
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 120 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                        />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="site"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={120}
                            tick={<CustomYAxisTick />}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={4}
                            barSize={25}
                        />
                    </BarChart>
                </ChartContainer>
            )}
        </Card>
    );
}
