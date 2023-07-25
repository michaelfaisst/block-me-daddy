import { LucideEdit, LucideTrash } from "lucide-react";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Button } from "../ui";
import AddSiteDialog from "./add-site";

const BlockedSites = () => {
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
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
                            <div>{site.site}</div>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Button variant="ghost">
                                <LucideEdit size={16} />
                            </Button>
                            <Button variant="ghost">
                                <LucideTrash
                                    size={16}
                                    onClick={() => deleteSite(site.id)}
                                />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <AddSiteDialog />
        </>
    );
};

export default BlockedSites;
