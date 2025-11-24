import { useChromeStorageLocal } from "use-chrome-storage";

import BlockedSites from "./blocked-sites";
import ImportExport from "./import-export";
import Schedules from "./schedule";
import { Label, Switch } from "./ui";

export function SettingsTab() {
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>(
        "enabled",
        true
    );

    return (
        <div className="space-y-12 md:space-y-16">
            <div>
                <p className="scroll-m-20 text-xl md:text-2xl font-bold tracking-tight mb-4">
                    General settings
                </p>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="airplane-mode"
                        checked={enabled}
                        onCheckedChange={(checked) => setEnabled(checked)}
                    />
                    <Label htmlFor="airplane-mode">Blocking enabled</Label>
                </div>
            </div>

            <div>
                <BlockedSites />
            </div>

            <div>
                <Schedules />
            </div>

            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="scroll-m-20 text-xl md:text-2xl font-bold tracking-tight">
                        Import & Export
                    </p>
                    <ImportExport />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Export your sites and schedules to a JSON file or import
                    them from a backup.
                </p>
            </div>
        </div>
    );
}
