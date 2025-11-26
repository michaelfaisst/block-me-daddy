import { useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

import BlockedSites from "./blocked-sites";
import { BlockingStatusCard } from "./blocking-status-card";
import ImportExport from "./import-export";
import Schedules from "./schedule";
import { SettingsSidebar, SettingsSidebarSection } from "./settings-sidebar";

export function SettingsTab() {
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>(
        "enabled",
        true
    );
    const [activeSection, setActiveSection] =
        useState<SettingsSidebarSection>("general");

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <SettingsSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
            />

            <div className="flex-1 min-w-0">
                {activeSection === "general" && (
                    <div className="space-y-8">
                        <div>
                            <p className="scroll-m-20 text-xl md:text-2xl font-bold tracking-tight mb-4">
                                General settings
                            </p>
                            <BlockingStatusCard
                                enabled={enabled}
                                onToggle={(checked) => setEnabled(checked)}
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <p className="scroll-m-20 text-xl md:text-2xl font-bold tracking-tight">
                                    Import & Export
                                </p>
                                <ImportExport />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Export your sites and schedules to a JSON file
                                or import them from a backup.
                            </p>
                        </div>
                    </div>
                )}

                {activeSection === "blocked-sites" && (
                    <div>
                        <BlockedSites />
                    </div>
                )}

                {activeSection === "schedules" && (
                    <div>
                        <Schedules />
                    </div>
                )}
            </div>
        </div>
    );
}
