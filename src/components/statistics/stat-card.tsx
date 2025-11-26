import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { Card } from "@/components/ui";

interface StatCardProps {
    label: string;
    value: string | number;
    description?: string;
    trend?: {
        value: number;
        comparison: string;
    };
}

export function StatCard({ label, value, description, trend }: StatCardProps) {
    const getTrendIcon = () => {
        if (!trend) return null;

        if (trend.value > 0) {
            return <ArrowUp className="h-4 w-4" />;
        } else if (trend.value < 0) {
            return <ArrowDown className="h-4 w-4" />;
        } else {
            return <Minus className="h-4 w-4" />;
        }
    };

    const getTrendColor = () => {
        if (!trend) return "";

        if (trend.value > 0) {
            return "text-red-600 dark:text-red-500";
        } else if (trend.value < 0) {
            return "text-green-600 dark:text-green-500";
        } else {
            return "text-muted-foreground";
        }
    };

    const getTrendText = () => {
        if (!trend) return "";

        const absValue = Math.abs(trend.value);
        const sign = trend.value > 0 ? "+" : trend.value < 0 ? "-" : "";

        return `${sign}${absValue} vs ${trend.comparison}`;
    };

    return (
        <Card className="p-6">
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold">{value}</p>
                    {trend && (
                        <div
                            className={`flex items-center gap-1 text-xs font-medium pb-1 ${getTrendColor()}`}
                        >
                            {getTrendIcon()}
                            <span>{getTrendText()}</span>
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </Card>
    );
}
