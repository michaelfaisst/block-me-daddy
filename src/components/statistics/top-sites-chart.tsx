import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Block, Site } from "@/dto";
import { STORAGE_KEYS, URLS } from "@/lib/constants";
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

    // Truncate long URLs to fit in the chart
    // Max width is ~180px for text (200px total - 20px for favicon and margin)
    // Each character is roughly 5-6px, so max ~30-35 characters
    const maxLength = 25;
    const displayValue =
        payload.value.length > maxLength
            ? `${payload.value.slice(0, maxLength - 1)}…`
            : payload.value;

    return (
        <g transform={`translate(${x},${y})`}>
            <title>{payload.value}</title>
            <image
                x={-200}
                y={-8}
                width={16}
                height={16}
                href={`${URLS.FAVICON_API}${payload.value}`}
            />
            <text
                x={-178}
                y={0}
                dy={4}
                textAnchor="start"
                fill="currentColor"
                className="text-xs fill-muted-foreground"
            >
                {displayValue}
            </text>
        </g>
    );
};

export function TopSitesChart({ blocks, sites }: TopSitesChartProps) {
    const [limit, setLimit, , , isInitialStateResolved] =
        useChromeStorageLocal<TopSitesLimit>(
            STORAGE_KEYS.CHART_TOP_SITES_LIMIT,
            10
        );

    const chartData = useMemo(() => {
        const topSites = getTopBlockedSites(blocks, sites, limit);

        return topSites.map((item) => ({
            site: item.site.site,
            count: item.count
        }));
    }, [blocks, sites, limit]);

    // Calculate dynamic height based on number of items
    // Each bar needs about 40px of height to look good
    const chartHeight = useMemo(() => {
        const itemHeight = 40;
        const minHeight = 200;
        const maxHeight = 800;
        const calculatedHeight = chartData.length * itemHeight;

        return Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
    }, [chartData.length]);

    // Don't render chart until initial state is loaded to prevent flickering
    if (!isInitialStateResolved) {
        return (
            <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Top Blocked Sites</h3>
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
                    className="w-full"
                    style={{ height: `${chartHeight}px` }}
                >
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 200 }}
                    >
                        <CartesianGrid
                            horizontal={false}
                            stroke="hsl(var(--border))"
                        />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="site"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={20}
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
