import { LucideDownload, LucideUpload } from "lucide-react";
import { useRef } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";
import { z } from "zod";

import {
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui";
import { Schedule, Site, scheduleSchema, siteSchema } from "@/dto";

const exportSchema = z.object({
    sites: z.array(siteSchema),
    schedules: z.array(scheduleSchema)
});

type ExportData = z.infer<typeof exportSchema>;

const ImportExport = () => {
    const [sites] = useChromeStorageLocal<Site[]>("sites", []);
    const [schedules] = useChromeStorageLocal<Schedule[]>("schedules", []);
    const [, setSites] = useChromeStorageLocal<Site[]>("sites", []);
    const [, setSchedules] = useChromeStorageLocal<Schedule[]>("schedules", []);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const exportData: ExportData = {
            sites,
            schedules
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `block-me-daddy-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const content = await file.text();
            const data = JSON.parse(content);

            const validatedData = exportSchema.parse(data);

            setSites(validatedData.sites);
            setSchedules(validatedData.schedules);

            alert(
                `Successfully imported ${validatedData.sites.length} site(s) and ${validatedData.schedules.length} schedule(s)!`
            );
        } catch (error) {
            if (error instanceof z.ZodError) {
                alert(
                    `Invalid file format: ${error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`
                );
            } else if (error instanceof SyntaxError) {
                alert("Invalid JSON file");
            } else {
                alert("Failed to import file");
            }
            console.error("Import error:", error);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="flex gap-2">
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
            />

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleExport}>
                        <LucideDownload size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Export sites and schedules</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleImport}>
                        <LucideUpload size={16} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Import sites and schedules</TooltipContent>
            </Tooltip>
        </div>
    );
};

export default ImportExport;
