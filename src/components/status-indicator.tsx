interface StatusIndicatorProps {
    enabled: boolean;
}

export function StatusIndicator({ enabled }: StatusIndicatorProps) {
    return (
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
    );
}
