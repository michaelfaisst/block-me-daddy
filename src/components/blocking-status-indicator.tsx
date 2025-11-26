import { useChromeStorageLocal } from "use-chrome-storage";

import { StatusIndicator } from "./status-indicator";

export function BlockingStatusIndicator() {
    const [enabled] = useChromeStorageLocal<boolean>("enabled", true);

    return (
        <div className="flex items-center gap-2">
            <StatusIndicator enabled={enabled} />
            <span className="text-xs font-medium">
                {enabled ? "Blocking" : "Disabled"}
            </span>
        </div>
    );
}
