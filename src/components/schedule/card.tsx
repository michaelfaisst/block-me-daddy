import { zodResolver } from "@hookform/resolvers/zod";
import { LucideEdit, LucideSave, LucideTrash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Schedule, scheduleSchema } from "@/dto";
import { isInSchedule } from "@/lib/blocking";

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    TimeInput
} from "../ui";
import DaysSelect from "./day-select";

interface Props {
    schedule: Schedule;
    onChange: (schedule: Schedule) => void;
    onRemove: (schedule: Schedule) => void;
}

const ScheduleCard = ({ schedule, onChange, onRemove }: Props) => {
    const [editMode, setEditMode] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const form = useForm<Schedule>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: schedule
    });

    // Check if schedule is currently active
    useEffect(() => {
        const checkActive = () => {
            setIsActive(isInSchedule([schedule]));
        };

        checkActive();
        const interval = setInterval(checkActive, 20000); // Check every 20 seconds

        return () => clearInterval(interval);
    }, [schedule]);

    const handleSubmit = (schedule: Schedule) => {
        setEditMode(false);
        onChange(schedule);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card
                    className={
                        isActive
                            ? "relative border-gray-400 dark:border-gray-600"
                            : "relative"
                    }
                >
                    <CardHeader className="relative">
                        <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-xl">Schedule</CardTitle>
                            <div className="flex items-center gap-1">
                                {isActive && (
                                    <Badge className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-0 flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white dark:bg-gray-900 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-gray-900"></span>
                                        </span>
                                        Active now
                                    </Badge>
                                )}
                                <Button
                                    variant="ghostDestructive"
                                    size="sm"
                                    type="button"
                                    onClick={() => onRemove(schedule)}
                                >
                                    <LucideTrash className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="weekDays"
                            render={({ field }) => (
                                <FormItem className="mb-8">
                                    <FormLabel>Days</FormLabel>
                                    <FormControl>
                                        <DaysSelect
                                            disabled={!editMode}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1 block">
                            Time
                        </label>

                        <div className="mt-1">
                            {editMode ? (
                                <div className="flex gap-2">
                                    <FormField
                                        control={form.control}
                                        name="timeFrom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <TimeInput
                                                        {...field}
                                                        disabled={!editMode}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <span className="mt-[10px]">-</span>
                                    <FormField
                                        control={form.control}
                                        name="timeTo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <TimeInput
                                                        {...field}
                                                        disabled={!editMode}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            ) : (
                                <div className="h-9 text-lg font-bold tracking-tight flex items-center">
                                    {schedule.timeFrom} - {schedule.timeTo}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        {editMode ? (
                            <Button className="flex-1" type="submit">
                                <LucideSave className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="flex-1"
                                type="button"
                                onClick={(e) => {
                                    setEditMode(true);
                                    e.stopPropagation();
                                    e.preventDefault();
                                }}
                            >
                                <LucideEdit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default ScheduleCard;
