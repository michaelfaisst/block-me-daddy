import { useChromeStorageLocal } from "use-chrome-storage";

import { Statistics } from "@/dto";
import { STORAGE_KEYS } from "@/lib/constants";

import { StatCard } from "./stat-card";

export function StatisticsDashboard() {
    const [statistics] = useChromeStorageLocal<Statistics>(
        STORAGE_KEYS.STATISTICS,
        {
            blockAttempts: []
        }
    );

    const totalBlocks = statistics.blockAttempts.length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Statistics</h2>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard label="Total Blocks" value={totalBlocks} />
                <StatCard label="Today" value={0} description="Blocks today" />
                <StatCard
                    label="This Week"
                    value={0}
                    description="Blocks this week"
                />
            </div>

            {/* Charts will be added in Phase 3 */}
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p>Charts coming soon...</p>
                <p className="mt-2 text-sm">
                    Block Attempts Over Time, Top Sites, and more
                </p>
            </div>
        </div>
    );
}
