import { GlobeIcon, HeartIcon, InfoIcon, MailIcon } from "lucide-react";
import { useState } from "react";

import {
    Button,
    Card,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui";

const AboutDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    About
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>About</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Card className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <HeartIcon className="w-4 h-4 text-red-500" />
                                <span className="font-semibold">
                                    MADE WITH LOVE BY
                                </span>
                            </div>
                            <div className="font-bold text-lg">
                                Michael Faisst
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MailIcon className="w-4 h-4" />
                                    <span>michael@faisst.io</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GlobeIcon className="w-4 h-4" />
                                    <a
                                        href="https://michael.faisst.io"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        michael.faisst.io
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex gap-3">
                            <InfoIcon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                                This extension is a private fun project without
                                advertising, profit motive, or commercial
                                purpose. All your data is stored locally in your
                                browser - no tracking, no collection, no BS.
                            </p>
                        </div>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AboutDialog;
