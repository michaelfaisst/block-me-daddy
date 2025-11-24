import { useChromeStorageLocal } from "use-chrome-storage";

export function BlockingStatusIndicator() {
    const [enabled] = useChromeStorageLocal<boolean>("enabled", true);

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
                <div
                    className={`w-2 h-2 rounded-full ${
                        enabled ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
                {enabled && (
                    <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping" />
                )}
            </div>
            <span className="text-xs font-medium">
                {enabled ? "Blocking" : "Disabled"}
            </span>
        </div>
    );
}
