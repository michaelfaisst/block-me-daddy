import { createId } from "@paralleldrive/cuid2";
import {
    endOfDay,
    endOfWeek,
    startOfDay,
    startOfWeek,
    subDays,
    subWeeks
} from "date-fns";
import { ChartColumn, FlaskConical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Block, Site, Statistics } from "@/dto";
import { STORAGE_KEYS } from "@/lib/constants";
import { getBlocksInRange, getStorageUsage } from "@/lib/statistics";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { BlocksHeatmap } from "./blocks-heatmap";
import { BlocksOverTimeChart } from "./blocks-over-time-chart";
import { DayOfWeekChart } from "./day-of-week-chart";
import { StatCard } from "./stat-card";
import { TimeOfDayChart } from "./time-of-day-chart";
import { TopSitesChart } from "./top-sites-chart";

export function StatisticsDashboard() {
    const [statistics, setStatistics] = useChromeStorageLocal<Statistics>(
        STORAGE_KEYS.STATISTICS,
        {
            blocks: []
        }
    );

    const [sites] = useChromeStorageLocal<Site[]>(STORAGE_KEYS.SITES, []);
    const [storageInfo, setStorageInfo] = useState<{
        used: number;
        total: number;
        percentage: number;
    } | null>(null);

    useEffect(() => {
        // Load storage usage info
        getStorageUsage().then(setStorageInfo);
    }, [statistics]);

    const totalBlocks = statistics.blocks.length;
    const now = new Date();

    // Today: from start of today to now
    const todayStart = startOfDay(now);
    const blocksToday = getBlocksInRange(statistics.blocks, todayStart, now);

    // Yesterday: entire previous day
    const yesterdayStart = startOfDay(subDays(now, 1));
    const yesterdayEnd = endOfDay(subDays(now, 1));
    const blocksYesterday = getBlocksInRange(
        statistics.blocks,
        yesterdayStart,
        yesterdayEnd
    );

    // This week: from start of week (Monday) to now
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const blocksThisWeek = getBlocksInRange(statistics.blocks, weekStart, now);

    // Last week: entire previous week (Monday to Sunday)
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const blocksLastWeek = getBlocksInRange(
        statistics.blocks,
        lastWeekStart,
        lastWeekEnd
    );

    const todayTrend = blocksToday.length - blocksYesterday.length;
    const weekTrend = blocksThisWeek.length - blocksLastWeek.length;

    const handleClearStatistics = () => {
        setStatistics({ blocks: [] });
    };

    const generateTestBlocks = () => {
        if (sites.length === 0) {
            toast.error("Please add at least one site first!");
            return;
        }

        const testBlocks: Block[] = [];
        const now = Date.now();
        const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

        for (let i = 0; i < 5000; i++) {
            // Random timestamp within the last 30 days
            const timestamp =
                thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo);

            // Pick a random site
            const site = sites[Math.floor(Math.random() * sites.length)];

            // Generate variations of the URL
            const paths = [
                "",
                "/home",
                "/feed",
                "/explore",
                "/profile",
                "/settings",
                "/posts/123",
                "/watch?v=xyz",
                "/news/article"
            ];
            const path = paths[Math.floor(Math.random() * paths.length)];

            testBlocks.push({
                id: createId(),
                timestamp: Math.floor(timestamp),
                siteId: site.id,
                url: `https://${site.site}${path}`
            });
        }

        const updatedStatistics = {
            blocks: [...statistics.blocks, ...testBlocks]
        };
        setStatistics(updatedStatistics);
        toast.success(`Generated ${testBlocks.length} test block entries!`);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    // Generate Test Data button (dev mode only)
    const generateTestDataButton = import.meta.env.DEV && sites.length > 0 && (
        <Button
            variant="outline"
            size="sm"
            onClick={generateTestBlocks}
            title="Generate 5000 test block entries (Dev only)"
        >
            <FlaskConical className="mr-2 h-4 w-4" />
            Generate Test Data
        </Button>
    );

    if (totalBlocks === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold">Statistics</h2>
                    {generateTestDataButton}
                </div>

                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                    <ChartColumn className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No Statistics Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Start blocking sites to see your productivity statistics
                        here. Your block attempts will be tracked and visualized
                        with charts and insights.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold">Statistics</h2>
                <div className="flex items-center gap-4">
                    {storageInfo && (
                        <div className="text-xs text-muted-foreground">
                            Storage: {formatBytes(storageInfo.used)} /{" "}
                            {formatBytes(storageInfo.total)} (
                            {storageInfo.percentage.toFixed(1)}%)
                            {storageInfo.percentage > 80 && (
                                <span className="ml-2 text-yellow-600 dark:text-yellow-500 font-medium">
                                    ⚠ Storage usage is high
                                </span>
                            )}
                            {storageInfo.percentage > 90 && (
                                <span className="ml-2 text-red-600 dark:text-red-500 font-medium">
                                    ⚠ Storage nearly full
                                </span>
                            )}
                        </div>
                    )}
                    <div className="flex gap-2">
                        {generateTestDataButton}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghostDestructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Clear All Statistics
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete all your
                                        statistics data. This action cannot be
                                        undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleClearStatistics}
                                    >
                                        Delete All Statistics
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total Blocks" value={totalBlocks} />
                <StatCard
                    label="Today"
                    value={blocksToday.length}
                    description="Since midnight"
                    trend={{
                        value: todayTrend,
                        comparison: "yesterday"
                    }}
                />
                <StatCard
                    label="This Week"
                    value={blocksThisWeek.length}
                    description="Since Monday"
                    trend={{
                        value: weekTrend,
                        comparison: "last week"
                    }}
                />
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <BlocksOverTimeChart blocks={statistics.blocks} />
                <BlocksHeatmap blocks={statistics.blocks} />
                <TopSitesChart blocks={statistics.blocks} sites={sites} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <DayOfWeekChart blocks={statistics.blocks} />
                    <TimeOfDayChart blocks={statistics.blocks} />
                </div>
            </div>
        </div>
    );
}
