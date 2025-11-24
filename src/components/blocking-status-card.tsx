import { StatusIndicator } from "./status-indicator";
import { Card, Switch } from "./ui";

interface BlockingStatusCardProps {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
}

export function BlockingStatusCard({
    enabled,
    onToggle
}: BlockingStatusCardProps) {
    return (
        <Card
            className={`p-4 transition-colors ${
                enabled ? "bg-primary text-primary-foreground" : ""
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <StatusIndicator enabled={enabled} />
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
