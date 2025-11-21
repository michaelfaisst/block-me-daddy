import { zodResolver } from "@hookform/resolvers/zod";
import { LucideEdit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

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

interface Props {
    site: Site;
    sites: Site[];
    onSiteUpdated: (site: Site) => void;
}

const EditSiteDialog = ({ site, sites, onSiteUpdated }: Props) => {
    const [open, setOpen] = useState(false);

    const form = useForm<SiteFormValues>({
        resolver: zodResolver(siteFormSchema),
        defaultValues: {
            site: site.site,
            exact: site.exact,
            blockSubdomains: site.blockSubdomains ?? true
        }
    });

    const onSubmit = (data: SiteFormValues) => {
        // Check if site already exists (excluding the current site being edited)
        const isDuplicate = sites.some(
            (s) => s.id !== site.id && s.site === data.site
        );
        if (isDuplicate) {
            form.setError("site", {
                type: "manual",
                message: "This site has already been added"
            });
            return;
        }

        // When exact is true, blockSubdomains should always be false
        const updatedSite: Site = {
            id: site.id,
            site: data.site,
            exact: data.exact,
            blockSubdomains: data.exact ? false : data.blockSubdomains
        };

        onSiteUpdated(updatedSite);
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
                        <SiteFormFields form={form} />
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
