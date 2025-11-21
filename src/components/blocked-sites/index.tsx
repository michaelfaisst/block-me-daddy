import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LucideMegaphone, LucideTrash } from "lucide-react";
import { useState } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    Button,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui";
import { Site } from "@/dto";
import { ANIMATION, PAGINATION, STORAGE_KEYS } from "@/lib/constants";

import AnimatePresence from "../animate-presence";
import AddSiteDialog from "./add-site";
import EditSiteDialog from "./edit-site";
import PresetSelector from "./preset-selector";

const BlockedSites = () => {
    const [sites, setSites] = useChromeStorageLocal<Site[]>(
        STORAGE_KEYS.SITES,
        []
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useChromeStorageLocal<number>(
        STORAGE_KEYS.ITEMS_PER_PAGE,
        PAGINATION.DEFAULT_ITEMS_PER_PAGE
    );
    const [animationParent] = useAutoAnimate({
        duration: ANIMATION.DEFAULT_DURATION
    });

    const deleteSite = (id: string) => {
        setSites(sites.filter((site) => site.id !== id));
    };

    const updateSite = (updatedSite: Site) => {
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

    const addPresetSites = (newSites: Site[]) => {
        const updatedSites = [...sites, ...newSites];
        setSites(updatedSites);
        // Jump to last page after adding sites
        const newTotalPages = Math.ceil(updatedSites.length / itemsPerPage);
        setCurrentPage(newTotalPages);
    };

    const addSite = (newSite: Site) => {
        const updatedSites = [...sites, newSite];
        setSites(updatedSites);
        // Jump to last page after adding site
        const newTotalPages = Math.ceil(updatedSites.length / itemsPerPage);
        setCurrentPage(newTotalPages);
    };

    const totalPages = Math.ceil(sites.length / itemsPerPage);
    // Ensure current page is within valid range
    const validCurrentPage =
        totalPages > 0 && currentPage > totalPages ? 1 : currentPage;
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedSites = sites.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxPagesToShow = PAGINATION.MAX_PAGES_TO_SHOW;
        const validPage = validCurrentPage;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (validPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (validPage >= totalPages - 2) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push("...");
                pages.push(validPage - 1);
                pages.push(validPage);
                pages.push(validPage + 1);
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <>
            <div className="flex items-center justify-between gap-8 mb-4">
                <div>
                    <p className="scroll-m-20 text-2xl font-bold tracking-tight mb-2">
                        Blocked sites
                    </p>
                    <p className="scroll-m-20 text-sm text-gray-500 dark:text-gray-400">
                        Here you can list all sites that you want to block while
                        blocking is enabled.
                    </p>
                </div>
                <div className="flex gap-2">
                    <PresetSelector
                        existingSites={sites}
                        onPresetsSelected={addPresetSites}
                    />
                    <AddSiteDialog onSiteAdded={addSite} />
                </div>
            </div>

            <AnimatePresence visible={sites.length === 0}>
                <Alert>
                    <LucideMegaphone className="h-4 w-4 mr-4" />
                    <AlertTitle>You have no blocked sites yet!</AlertTitle>
                    <AlertDescription className="text-secondary-foreground">
                        Add your first site by clicking the button below.
                        Afterall, this extension would be pretty useless if you
                        don&apos;t block any sites 🤓
                    </AlertDescription>
                </Alert>
            </AnimatePresence>

            {sites.length > 0 && (
                <div className="flex items-center justify-between gap-8 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Show
                        </span>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            per page
                        </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {sites.length} {sites.length === 1 ? "site" : "sites"}{" "}
                        total
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2 mb-4" ref={animationParent}>
                {paginatedSites.map((site) => (
                    <div
                        key={site.id}
                        className="px-4 py-2.5 flex flex-row justify-between items-center bg-card border rounded-xl"
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
                            {!site.exact && (site.blockSubdomains ?? true) && (
                                <Badge variant="secondary" className="ml-4">
                                    Block subdomains
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <EditSiteDialog
                                site={site}
                                sites={sites}
                                onSiteUpdated={updateSite}
                            />

                            <Button
                                variant="ghostDestructive"
                                onClick={() => deleteSite(site.id)}
                            >
                                <LucideTrash size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mb-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    aria-disabled={validCurrentPage === 1}
                                    className={
                                        validCurrentPage === 1
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === "..." ? (
                                        <span className="px-4">...</span>
                                    ) : (
                                        <PaginationLink
                                            onClick={() =>
                                                setCurrentPage(page as number)
                                            }
                                            isActive={validCurrentPage === page}
                                            className="cursor-pointer"
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    aria-disabled={
                                        validCurrentPage === totalPages
                                    }
                                    className={
                                        validCurrentPage === totalPages
                                            ? "pointer-events-none opacity-50"
                                            : "cursor-pointer"
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </>
    );
};

export default BlockedSites;
