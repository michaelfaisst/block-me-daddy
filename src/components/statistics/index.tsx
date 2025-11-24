import { subDays, subHours } from "date-fns";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Site, Statistics } from "@/dto";
import { STORAGE_KEYS } from "@/lib/constants";
import { getBlocksInRange } from "@/lib/statistics";

import { BlocksOverTimeChart } from "./blocks-over-time-chart";
import { DayOfWeekChart } from "./day-of-week-chart";
import { StatCard } from "./stat-card";
import { TimeOfDayChart } from "./time-of-day-chart";
import { TopSitesChart } from "./top-sites-chart";

export function StatisticsDashboard() {
    const [statistics] = useChromeStorageLocal<Statistics>(
        STORAGE_KEYS.STATISTICS,
        {
            blocks: []
        }
    );

    const [sites] = useChromeStorageLocal<Site[]>(STORAGE_KEYS.SITES, []);

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Statistics</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard label="Total Blocks" value={totalBlocks} />
                <StatCard
                    label="Today"
                    value={blocksToday.length}
                    description="Blocks today"
                />
                <StatCard
                    label="This Week"
                    value={blocksThisWeek.length}
                    description="Blocks this week"
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
        </div>
    );
}
