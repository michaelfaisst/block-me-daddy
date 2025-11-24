import { CalendarIcon, GlobeIcon, SettingsIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type SettingsSidebarSection = "general" | "blocked-sites" | "schedules";

interface SettingsSidebarProps {
    activeSection: SettingsSidebarSection;
    onSectionChange: (section: SettingsSidebarSection) => void;
}

interface SidebarItem {
    id: SettingsSidebarSection;
    label: string;
    icon: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
    {
        id: "general",
        label: "General",
        icon: <SettingsIcon className="w-4 h-4" />
    },
    {
        id: "blocked-sites",
        label: "Blocked Sites",
        icon: <GlobeIcon className="w-4 h-4" />
    },
    {
        id: "schedules",
        label: "Schedules",
        icon: <CalendarIcon className="w-4 h-4" />
    }
];

export function SettingsSidebar({
    activeSection,
    onSectionChange
}: SettingsSidebarProps) {
    return (
        <nav className="w-full md:w-48 lg:w-56 flex-shrink-0">
            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {sidebarItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            "hover:bg-accent hover:text-accent-foreground",
                            activeSection === item.id
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
