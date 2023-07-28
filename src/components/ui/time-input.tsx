import * as React from "react";
import {
    NumberFormatBase,
    NumberFormatBaseProps,
    usePatternFormat
} from "react-number-format";

import { cn } from "@/lib/utils";

export interface TimeInputProps extends NumberFormatBaseProps {}

const TimeInput = ({ className, type, ...props }: TimeInputProps) => {
    const { format, ...rest } = usePatternFormat({
        ...props,
        format: "##:##"
    });

    const internalFormat = (value: string) => {
        if (!format) return "";

        let hour = value.slice(0, 2);
        let minute = value.slice(2, 4);

        if (hour.length === 1 && parseInt(hour) > 2) {
            hour = `0${hour}`;
        } else if (hour.length === 2 && parseInt(hour) > 23) {
            hour = "23";
        }

        if (
            (minute.length === 1 && parseInt(minute) > 5) ||
            (minute.length === 2 && parseInt(minute) > 59)
        ) {
            minute = "59";
        }

        return format(`${hour}${minute}`);
    };

    return (
        <NumberFormatBase
            format={internalFormat}
            className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...rest}
        />
    );
};

TimeInput.displayName = "TimeInput";

export { TimeInput };
