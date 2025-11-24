import { Check, Moon, Sun } from "lucide-react";
import { forwardRef } from "react";

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui";
import { useTheme } from "@/context/theme";

export const ThemeToggle = forwardRef<HTMLButtonElement>((props, ref) => {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" ref={ref} {...props}>
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Check
                        className={`mr-2 h-4 w-4 ${theme === "light" ? "opacity-100" : "opacity-0"}`}
                    />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Check
                        className={`mr-2 h-4 w-4 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
                    />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Check
                        className={`mr-2 h-4 w-4 ${theme === "system" ? "opacity-100" : "opacity-0"}`}
                    />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

ThemeToggle.displayName = "ThemeToggle";
