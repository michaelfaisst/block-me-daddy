import { InfoIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

import {
    Alert,
    AlertDescription,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui";
import { normalizeUrl } from "@/lib/blocking";

export const siteFormSchema = z.object({
    site: z
        .string()
        .min(1, "Site is required")
        .refine(
            (value) => {
                // Reject URLs that start with protocol or www
                if (/^https?:\/\//i.test(value) || /^www\./i.test(value)) {
                    return false;
                }
                // Use normalizeUrl to validate that the input is a valid URL
                return normalizeUrl(value) !== undefined;
            },
            {
                message:
                    "Enter a valid domain without protocol or www (e.g., youtube.com or youtube.com/watch?v=123)"
            }
        ),
    exact: z.boolean(),
    blockSubdomains: z.boolean()
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormFieldsProps {
    form: UseFormReturn<SiteFormValues>;
}

export const SiteFormFields = ({ form }: SiteFormFieldsProps) => {
    return (
        <div className="space-y-4">
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                    Enter a domain without protocol or www (e.g., youtube.com).
                    Domains are matched flexibly - blocking youtube.com will
                    also block www.youtube.com and https://youtube.com.
                </AlertDescription>
            </Alert>
            <FormField
                control={form.control}
                name="site"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Site</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="exact"
                render={({ field }) => (
                    <FormItem className="flex flex-row justify-between items-center space-y-0">
                        <div className="flex items-center gap-2">
                            <FormLabel>Exact match</FormLabel>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">
                                            When enabled, only blocks the exact
                                            URL including path. Example:
                                            youtube.com/watch?v=123 will only
                                            block that specific video, not the
                                            entire site.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="blockSubdomains"
                render={({ field }) => (
                    <FormItem className="flex flex-row justify-between items-center space-y-0">
                        <div className="flex items-center gap-2">
                            <FormLabel>Block subdomains</FormLabel>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="max-w-xs">
                                            When enabled, blocks all subdomains.
                                            Example: blocking example.com will
                                            also block sub.example.com. Only
                                            available when exact match is
                                            disabled.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={form.watch("exact")}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
