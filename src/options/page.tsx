import { GithubIcon } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";

import iconUrl from "../../assets/icon48.png";
import AboutDialog from "../components/about-dialog";
import { BlockingStatusIndicator } from "../components/blocking-status-indicator";
import { SettingsTab } from "../components/settings-tab";
import { StatisticsDashboard } from "../components/statistics";
import { ThemeToggle } from "../components/theme-toggle";
import {
    Button,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "../components/ui";

const OptionsPage = () => {
    const openGithub = () => {
        window.open(
            "https://github.com/michaelfaisst/block-me-daddy",
            "_blank"
        );
    };

    return (
        <>
            <Toaster position="bottom-center" />
            <div className="min-h-screen flex flex-col">
                <div className="flex-1">
                    <div className="container pt-6 md:pt-12">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                            <div className="flex items-center gap-4 md:gap-6">
                                <img
                                    src={iconUrl}
                                    alt="Block me daddy icon"
                                    className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                                />
                                <h1 className="scroll-m-20 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter">
                                    Block me daddy
                                </h1>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <BlockingStatusIndicator />

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
                                    <TooltipContent>
                                        Toggle theme
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                        <p className="scroll-m-20 text-sm md:text-base text-gray-500 dark:text-gray-400 mb-8 md:mb-12">
                            Block sites like youtube, facebook, instagram and
                            all the other nasty sites that suck all productivity
                            out of you.
                        </p>
                    </div>

                    <Tabs defaultValue="settings" className="mb-12 md:mb-16">
                        <TabsList
                            variant="underline"
                            className="mb-6 md:mb-8 sticky top-0 z-10 bg-background"
                        >
                            <div className="container">
                                <TabsTrigger
                                    variant="underline"
                                    value="settings"
                                >
                                    Settings
                                </TabsTrigger>
                                <TabsTrigger
                                    variant="underline"
                                    value="statistics"
                                >
                                    Statistics
                                </TabsTrigger>
                            </div>
                        </TabsList>

                        <div className="container">
                            <TabsContent value="settings">
                                <SettingsTab />
                            </TabsContent>

                            <TabsContent value="statistics">
                                <StatisticsDashboard />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                <div className="container">
                    <footer className="pt-6 md:pt-8 pb-6 md:pb-12 border-t">
                        <div className="flex justify-center">
                            <AboutDialog />
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default OptionsPage;
