import { GithubIcon } from "lucide-react";
import { useChromeStorageLocal } from "use-chrome-storage";

import BlockedSites from "../components/blocked-sites";
import { ThemeToggle } from "../components/theme-toggle";
import {
    Button,
    Label,
    Switch,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "../components/ui";

const OptionsPage = () => {
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>("enabled");

    const openGithub = () => {
        window.open(
            "https://github.com/michaelfaisst/block-me-daddy",
            "_blank"
        );
    };

    return (
        <div className="container mt-12">
            <div className="flex flex-row items-center justify-between">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
                    Block me daddy
                </h1>
                <div className="flex flex-row items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={openGithub}
                            >
                                <GithubIcon className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Open source code on GitHub
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger>
                            <ThemeToggle />
                        </TooltipTrigger>
                        <TooltipContent>Toggle theme</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <p className="scroll-m-20 text-base text-gray-500 mb-12">
                Block sites like youtube, facebook, instagram and all these
                other nasty sites that suck all productivity out of you.
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
