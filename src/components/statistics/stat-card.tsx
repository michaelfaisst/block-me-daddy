import { Card } from "@/components/ui";

interface StatCardProps {
    label: string;
    value: string | number;
    description?: string;
}

export function StatCard({ label, value, description }: StatCardProps) {
    return (
        <Card className="p-6">
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <p className="text-3xl font-bold">{value}</p>
                {description && (
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        </Card>
    );
}
