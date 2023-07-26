import { LucideTrash } from "lucide-react";
import { useChromeStorageLocal } from "use-chrome-storage";

import {
    Badge,
    Button,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui";

import AddSiteDialog from "./add-site";
import EditSiteDialog from "./edit-site";

const BlockedSites = () => {
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
    };

    const updateSite = (updatedSite: ISite) => {
        setSites(
            sites.map((site) => {
                if (site.id === updatedSite.id) {
                    return {
                        ...site,
                        ...updatedSite
                    };
                }

                return site;
            })
        );
    };

    return (
        <>
            <p className="scroll-m-20 text-lg font-bold tracking-tight mb-2">
                Blocked sites
            </p>
            <div className="flex flex-col divide-y divide-gray-100 mb-4">
                {sites.map((site) => (
                    <div
                        key={site.id}
                        className="py-3 flex flex-row justify-between items-center"
                    >
                        <div className="text-sm flex flex-row items-center">
                            <img
                                className="w-4 h-4 mr-2"
                                src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${site.site}`}
                            />
                            <div className="break-all">{site.site}</div>
                            {site.exact && (
                                <Badge variant="secondary" className="ml-4">
                                    Exact
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <EditSiteDialog
                                        site={site}
                                        onSiteUpdated={updateSite}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    Edit site
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="ghost">
                                        <LucideTrash
                                            size={16}
                                            onClick={() => deleteSite(site.id)}
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                    Delete site
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </div>

            <AddSiteDialog />
        </>
    );
};

export default BlockedSites;
