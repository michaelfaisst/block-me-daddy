import { subDays, subHours } from "date-fns";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Site, Statistics } from "@/dto";
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
    const [isLoading, setIsLoading] = useState(true);
    const [storageInfo, setStorageInfo] = useState<{
        used: number;
        total: number;
        percentage: number;
    } | null>(null);

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Load storage usage info
        getStorageUsage().then(setStorageInfo);
    }, [statistics]);

    const totalBlocks = statistics.blocks.length;
    const now = new Date();
    const blocksToday = getBlocksInRange(
        statistics.blocks,
        subHours(now, 24),
        now
    );
    const blocksThisWeek = getBlocksInRange(
        statistics.blocks,
        subDays(now, 7),
        now
    );

    const handleClearStatistics = () => {
        setStatistics({ blocks: [] });
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                        Loading statistics...
                    </p>
                </div>
            </div>
        );
    }

    if (totalBlocks === 0) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold">Statistics</h2>
                </div>

                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
                    <div className="text-6xl">📊</div>
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear All Statistics
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete all your statistics
                                data. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearStatistics}>
                                Delete All Statistics
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Total Blocks" value={totalBlocks} />
                <StatCard
                    label="Today"
                    value={blocksToday.length}
                    description="Last 24 hours"
                />
                <StatCard
                    label="This Week"
                    value={blocksThisWeek.length}
                    description="Last 7 days"
                />
            </div>

            {/* Charts */}
            <div className="space-y-4">
                <BlocksOverTimeChart blocks={statistics.blocks} />
                <TopSitesChart blocks={statistics.blocks} sites={sites} />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <DayOfWeekChart blocks={statistics.blocks} />
                    <TimeOfDayChart blocks={statistics.blocks} />
                </div>
            </div>

            {/* Storage Usage */}
            {storageInfo && (
                <div className="text-xs text-muted-foreground text-center py-2">
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
                            ⚠ Storage nearly full - consider clearing old data
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
