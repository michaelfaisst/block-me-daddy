import { LucideEdit, LucideTrash } from "lucide-react";
import AddSiteDialog from "../components/add-site";
import { Button, Dialog, DialogTrigger } from "../components/ui";
import { useChromeStorageLocal } from "use-chrome-storage";

const OptionsPage = () => {
    const [sites, setSites] = useChromeStorageLocal<ISite[]>("sites", []);

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
    };

    return (
        <div className="container mt-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                Block me daddy
            </h1>
            <p className="scroll-m-20 text-base text-gray-500 mb-8">
                Block sites like youtube, twitch and all these other nasty sites
                that suck all productivity out of you
            </p>

            <div className="flex flex-col divide-y divide-gray-100 mb-4">
                {sites.map((site) => (
                    <div
                        key={site.id}
                        className="py-3 flex flex-row justify-between items-center"
                    >
                        <div className="text-sm">{site.site}</div>
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

            <Dialog>
                <DialogTrigger>
                    <Button>Add site</Button>
                </DialogTrigger>
                <AddSiteDialog />
            </Dialog>
        </div>
    );
};

export default OptionsPage;
