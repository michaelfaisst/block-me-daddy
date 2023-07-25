import { useChromeStorageLocal } from "use-chrome-storage";

import BlockedSites from "../components/blocked-sites";
import { Label, Switch } from "../components/ui";

const OptionsPage = () => {
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>("enabled");

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

            <BlockedSites />
        </div>
    );
};

export default OptionsPage;
