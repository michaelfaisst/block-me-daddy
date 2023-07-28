import { zodResolver } from "@hookform/resolvers/zod";
import { LucideEdit, LucideSave, LucideTrash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Schedule, scheduleSchema } from "@/dto";

import {
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

    const form = useForm<Schedule>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: schedule
    });

    const handleSubmit = (schedule: Schedule) => {
        setEditMode(false);
        onChange(schedule);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card className="relative">
                    <Button
                        variant="ghostDestructive"
                        size="sm"
                        className="absolute right-1 top-1 z-10"
                        type="button"
                        onClick={() => onRemove(schedule)}
                    >
                        <LucideTrash className="h-4 w-4" />
                    </Button>
                    <CardHeader className="relative">
                        <CardTitle className="text-xl">Schedule</CardTitle>
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

                        <FormLabel className="mb-1">Time</FormLabel>

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
