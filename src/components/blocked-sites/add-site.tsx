import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { InfoIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChromeStorageLocal } from "use-chrome-storage";
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
    site: z
        .string()
        .min(1, "Site is required")
        .regex(
            /^(?!https?:\/\/)(?!www\.)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
            "Enter a domain without protocol or www (e.g., youtube.com)"
        ),
    exact: z.boolean()
});

interface AddSiteDialogProps {
    onSiteAdded: (site: Site) => void;
}

const AddSiteDialog = ({ onSiteAdded }: AddSiteDialogProps) => {
    const [open, setOpen] = useState(false);
    const [sites] = useChromeStorageLocal<Site[]>("sites", []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            site: "",
            exact: false
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // Check if site already exists
        const isDuplicate = sites.some((s) => s.site === data.site);
        if (isDuplicate) {
            form.setError("site", {
                type: "manual",
                message: "This site has already been added"
            });
            return;
        }

        const newSite = { id: createId(), site: data.site, exact: data.exact };
        onSiteAdded(newSite);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <PlusIcon className="w-4 h-4 mr-2" /> Add site
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add site</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <Alert>
                                <InfoIcon className="h-4 w-4" />
                                <AlertDescription>
                                    Enter a domain without protocol or www
                                    (e.g., youtube.com). Domains are matched
                                    flexibly - blocking youtube.com will also
                                    block www.youtube.com and
                                    https://youtube.com.
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
                            <Button type="submit">Add</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddSiteDialog;
