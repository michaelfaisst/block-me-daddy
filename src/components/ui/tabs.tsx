import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
        variant?: "default" | "underline";
    }
>(({ className, variant = "default", ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex items-center text-muted-foreground",
            variant === "default" &&
                "h-10 rounded-lg bg-muted p-1 justify-center",
            variant === "underline" &&
                "h-12 border-b border-border gap-6 justify-start w-full [will-change:transform]",
            className
        )}
        {...props}
    />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
        variant?: "default" | "underline";
    }
>(({ className, variant = "default", value, children, ...props }, ref) => {
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [isActive, setIsActive] = React.useState(false);

    React.useImperativeHandle(ref, () => triggerRef.current!);

    // Check if this trigger is active by observing the data-state attribute
    React.useEffect(() => {
        if (variant !== "underline" || !triggerRef.current) return;

        const observer = new MutationObserver(() => {
            const active =
                triggerRef.current?.getAttribute("data-state") === "active";
            setIsActive(active);
        });

        observer.observe(triggerRef.current, {
            attributes: true,
            attributeFilter: ["data-state"]
        });

        // Initial check
        setIsActive(triggerRef.current.getAttribute("data-state") === "active");

        return () => observer.disconnect();
    }, [variant]);

    return (
        <TabsPrimitive.Trigger
            ref={triggerRef}
            value={value}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variant === "default" &&
                    "rounded-md px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
                variant === "underline" &&
                    "relative px-4 py-3 data-[state=active]:text-foreground",
                className
            )}
            {...props}
        >
            {children}
            {variant === "underline" && isActive && (
                <motion.div
                    layoutId="underline"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary rounded-t-sm"
                    initial={false}
                    transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.2
                    }}
                />
            )}
        </TabsPrimitive.Trigger>
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
