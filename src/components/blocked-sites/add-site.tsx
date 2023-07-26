import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChromeStorageLocal } from "use-chrome-storage";
import * as z from "zod";

import {
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

const formSchema = z.object({
    site: z.string().url(),
    exact: z.boolean().default(false)
});

const AddSiteDialog = () => {
    const [open, setOpen] = useState(false);
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            site: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setSites([
            ...sites,
            { id: createId(), site: data.site, exact: data.exact }
        ]);
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
