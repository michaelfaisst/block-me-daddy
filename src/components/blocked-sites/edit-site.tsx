import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, LucideEdit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Alert,
    AlertDescription,
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Switch
} from "@/components/ui";
import { Site } from "@/dto";

const formSchema = z.object({
    id: z.string(),
    site: z.string().min(1, "Site is required").refine((value) => {
        // Allow domain names with or without protocol
        const domainPattern = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
        const urlPattern = /^https?:\/\//;
        
        return domainPattern.test(value) || urlPattern.test(value);
    }, "Please enter a valid domain (e.g., youtube.com)"),
    exact: z.boolean()
});

interface Props {
    site: Site;
    onSiteUpdated: (site: Site) => void;
}

const EditSiteDialog = ({ site, onSiteUpdated }: Props) => {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...site
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Store the original user input without normalization
        onSiteUpdated(data);
        setOpen(false);
        form.reset(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <LucideEdit size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit site</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertDescription>
                                    Enter a domain without protocol (e.g., youtube.com). 
                                    Domains are matched flexibly - blocking youtube.com will also block www.youtube.com and https://youtube.com.
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
                                        <FormLabel>Exact match</FormLabel>
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
                        </div>
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditSiteDialog;
