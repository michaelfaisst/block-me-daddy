import { Card, Switch } from "./ui";

interface ProtectionStatusCardProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export function ProtectionStatusCard({
    enabled,
    onToggle
}: ProtectionStatusCardProps) {
    return (
        <Card
            className={`p-4 transition-colors ${
                enabled ? "bg-primary text-primary-foreground" : ""
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
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
                    <span className="text-sm font-medium">
                        {enabled ? "Blocking enabled" : "Blocking disabled"}
                    </span>
                </div>
                <Switch
                    id="protection-toggle"
                    checked={enabled}
                    onCheckedChange={onToggle}
                    className={
                        enabled
                            ? "data-[state=checked]:bg-primary-foreground [&>span]:data-[state=checked]:bg-primary"
                            : ""
                    }
                />
            </div>
        </Card>
    );
}
