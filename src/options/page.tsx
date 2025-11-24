import { GithubIcon } from "lucide-react";
import { useChromeStorageLocal } from "use-chrome-storage";

import Schedules from "@/components/schedule";

import AboutDialog from "../components/about-dialog";
import BlockedSites from "../components/blocked-sites";
import ImportExport from "../components/import-export";
import { StatisticsDashboard } from "../components/statistics";
import { ThemeToggle } from "../components/theme-toggle";
import {
    Button,
    Label,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "../components/ui";

const OptionsPage = () => {
    const [enabled, setEnabled] = useChromeStorageLocal<boolean>(
        "enabled",
        true
    );

    const openGithub = () => {
        window.open(
            "https://github.com/michaelfaisst/block-me-daddy",
            "_blank"
        );
    };

    return (
        <div className="container py-6 md:py-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter">
                    Block me daddy
                </h1>
                <div className="flex flex-row items-center gap-2">
                    <ImportExport />

                    <Tooltip>
                        <TooltipTrigger asChild>
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
                        <TooltipTrigger asChild>
                            <ThemeToggle />
                        </TooltipTrigger>
                        <TooltipContent>Toggle theme</TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <p className="scroll-m-20 text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 md:mb-12">
                Block sites like youtube, facebook, instagram and all the other
                nasty sites that suck all productivity out of you.
            </p>

            <Tabs defaultValue="settings" className="mb-12 md:mb-16">
                <TabsList className="mb-6 w-full grid grid-cols-2">
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="statistics">Statistics</TabsTrigger>
                </TabsList>

                <TabsContent
                    value="settings"
                    className="space-y-12 md:space-y-16"
                >
                    <div>
                        <p className="scroll-m-20 text-xl md:text-2xl font-bold tracking-tight mb-4">
                            General settings
                        </p>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="airplane-mode"
                                checked={enabled}
                                onCheckedChange={(checked) =>
                                    setEnabled(checked)
                                }
                            />
                            <Label htmlFor="airplane-mode">
                                Blocking enabled
                            </Label>
                        </div>
                    </div>

                    <div>
                        <BlockedSites />
                    </div>

                    <div>
                        <Schedules />
                    </div>
                </TabsContent>

                <TabsContent value="statistics">
                    <StatisticsDashboard />
                </TabsContent>
            </Tabs>

            <footer className="mt-12 md:mt-16 pt-6 md:pt-8 border-t">
                <div className="flex justify-center">
                    <AboutDialog />
                </div>
            </footer>
        </div>
    );
};

export default OptionsPage;
