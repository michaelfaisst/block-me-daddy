import { LucideEdit, LucideTrash } from "lucide-react";
import AddSiteDialog from "../components/add-site";
import { Button, Label, Switch } from "../components/ui";
import { useChromeStorageLocal } from "use-chrome-storage";

const OptionsPage = () => {
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>("enabled");

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
    };

    return (
        <div className="container mt-12">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                Block me daddy
            </h1>
            <p className="scroll-m-20 text-base text-gray-500 mb-12">
                Block sites like youtube, facebook, instagram and all these
                other nasty sites that suck all productivity out of you
            </p>

            <div className="mb-10">
                <p className="scroll-m-20 text-lg font-bold tracking-tight mb-4">
                    General settings
                </p>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="airplane-mode"
                        checked={enabled}
                        onCheckedChange={(checked) => setEnabled(checked)}
                    />
                    <Label htmlFor="airplane-mode">Blocking enabled</Label>
                </div>
            </div>

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
        </div>
    );
};

export default OptionsPage;
