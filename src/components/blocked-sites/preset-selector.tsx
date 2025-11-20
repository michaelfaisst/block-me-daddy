import { useState } from "react";
import { LucidePlus } from "lucide-react";
import { createId } from "@paralleldrive/cuid2";

import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    ScrollArea
} from "@/components/ui";
import { Site } from "@/dto";
import { PRESET_CATEGORIES } from "@/lib/presets";

interface PresetSelectorProps {
    existingSites: Site[];
    onPresetsSelected: (newSites: Site[]) => void;
}

const PresetSelector = ({
    existingSites,
    onPresetsSelected
}: PresetSelectorProps) => {
    const [open, setOpen] = useState(false);
    const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());

    const handleCategoryToggle = (categoryId: string, checked: boolean) => {
        const category = PRESET_CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return;

        const newSelected = new Set(selectedSites);
        if (checked) {
            category.sites.forEach((site) => newSelected.add(site));
        } else {
            category.sites.forEach((site) => newSelected.delete(site));
        }
        setSelectedSites(newSelected);
    };

    const handleSiteToggle = (site: string, checked: boolean) => {
        const newSelected = new Set(selectedSites);
        if (checked) {
            newSelected.add(site);
        } else {
            newSelected.delete(site);
        }
        setSelectedSites(newSelected);
    };

    const isCategoryChecked = (categoryId: string) => {
        const category = PRESET_CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return false;
        return category.sites.every((site) => selectedSites.has(site));
    };

    const isCategoryIndeterminate = (categoryId: string) => {
        const category = PRESET_CATEGORIES.find((c) => c.id === categoryId);
        if (!category) return false;
        const checkedCount = category.sites.filter((site) =>
            selectedSites.has(site)
        ).length;
        return checkedCount > 0 && checkedCount < category.sites.length;
    };

    const handleAddSelected = () => {
        const existingDomains = new Set(
            existingSites.map((s) => s.site.toLowerCase())
        );

        const newSites: Site[] = Array.from(selectedSites)
            .filter((site) => !existingDomains.has(site.toLowerCase()))
            .map((site) => ({
                id: createId(),
                site,
                exact: false
            }));

        onPresetsSelected(newSites);
        setSelectedSites(new Set());
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LucidePlus size={16} className="mr-2" />
                    Quick Add
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col gap-4">
                <DialogHeader>
                    <DialogTitle>Quick Add Preset Sites</DialogTitle>
                    <DialogDescription>
                        Select from popular distracting sites to block. Sites
                        already in your list will be skipped.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[50vh] pr-4">
                    <div className="space-y-6">
                        {PRESET_CATEGORIES.map((category) => (
                            <div key={category.id} className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${category.id}`}
                                        checked={isCategoryChecked(category.id)}
                                        onCheckedChange={(checked) =>
                                            handleCategoryToggle(
                                                category.id,
                                                !!checked
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm font-semibold cursor-pointer"
                                    >
                                        {category.name}
                                    </label>
                                </div>

                                <div className="ml-6 grid grid-cols-2 gap-2">
                                    {category.sites.map((site) => {
                                        const alreadyExists =
                                            existingSites.some(
                                                (s) =>
                                                    s.site.toLowerCase() ===
                                                    site.toLowerCase()
                                            );

                                        return (
                                            <div
                                                key={site}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`site-${site}`}
                                                    checked={selectedSites.has(
                                                        site
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handleSiteToggle(
                                                            site,
                                                            !!checked
                                                        )
                                                    }
                                                    disabled={alreadyExists}
                                                />
                                                <label
                                                    htmlFor={`site-${site}`}
                                                    className={`text-sm cursor-pointer ${
                                                        alreadyExists
                                                            ? "text-gray-400 line-through"
                                                            : ""
                                                    }`}
                                                >
                                                    {site}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="flex justify-between items-center pt-4 border-t">
                    <p className="text-sm text-gray-500">
                        {selectedSites.size} site(s) selected
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddSelected}
                            disabled={selectedSites.size === 0}
                        >
                            Add Selected
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PresetSelector;
