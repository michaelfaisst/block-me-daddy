import {
    Button,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from "./ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChromeStorageLocal } from "use-chrome-storage";
import { createId } from "@paralleldrive/cuid2";

import * as z from "zod";

const formSchema = z.object({
    site: z.string().url()
});

const AddSiteDialog = () => {
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            site: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setSites([...sites, { site: data.site, id: createId() }]);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add site</DialogTitle>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-8">
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
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="submit">Add</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
};

export default AddSiteDialog;