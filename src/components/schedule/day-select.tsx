import clsx from "clsx";
import { forwardRef } from "react";

import { Schedule } from "@/dto";

const allDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface Props {
    value: Schedule["weekDays"];
    disabled?: boolean;
    onChange: (days: Schedule["weekDays"]) => void;
}

const DaysSelect = forwardRef<HTMLDivElement, Props>(({ value: days, onChange, disabled }, ref) => {
    const onDaySelect = (daySelected: boolean, dayIndex: number) => {
        if (disabled) return;

        if (daySelected) {
            onChange(days.filter((day) => day !== dayIndex));
        } else {
            onChange([...days, dayIndex].sort());
        }
    };

    return (
        <div ref={ref} className="flex flex-row flex-wrap gap-2">
            {allDays.map((day, index) => {
                const isDaySelected = days.includes(index + 1);

                return (
                    <div
                        key={day}
                        onClick={() => onDaySelect(isDaySelected, index + 1)}
                        className={clsx(
                            "h-8 w-8 flex items-center justify-center rounded-full transition-all select-none",
                            {
                                "bg-primary text-primary-foreground":
                                    isDaySelected,
                                "bg-primary-foreground": !isDaySelected,
                                "cursor-pointer": !disabled
                            }
                        )}
                    >
                        {day}
                    </div>
                );
            })}
        </div>
    );
});

DaysSelect.displayName = "DaysSelect";

export default DaysSelect;
