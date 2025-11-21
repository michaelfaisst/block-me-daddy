import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChromeStorageLocal } from "use-chrome-storage";

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Form
} from "@/components/ui";
import { Site } from "@/dto";

import { SiteFormFields, SiteFormValues, siteFormSchema } from "./site-form";

interface AddSiteDialogProps {
    onSiteAdded: (site: Site) => void;
}

const AddSiteDialog = ({ onSiteAdded }: AddSiteDialogProps) => {
    const [open, setOpen] = useState(false);
    const [sites] = useChromeStorageLocal<Site[]>("sites", []);

    const form = useForm<SiteFormValues>({
        resolver: zodResolver(siteFormSchema),
        defaultValues: {
            site: "",
            exact: false,
            blockSubdomains: true
        }
    });

    const onSubmit = (data: SiteFormValues) => {
        // Check if site already exists
        const isDuplicate = sites.some((s) => s.site === data.site);
        if (isDuplicate) {
            form.setError("site", {
                type: "manual",
                message: "This site has already been added"
            });
            return;
        }

        const newSite = {
            id: createId(),
            site: data.site,
            exact: data.exact,
            // When exact is true, blockSubdomains should always be false
            blockSubdomains: data.exact ? false : data.blockSubdomains
        };
        onSiteAdded(newSite);
        setOpen(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
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
                        <SiteFormFields form={form} />
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
