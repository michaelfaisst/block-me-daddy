import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { LucideEdit } from "lucide-react";
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
    FormItem,
    FormLabel
} from "../ui";

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const ScheduleCard = ({ schedule }: { schedule: Schedule }) => {
    const form = useForm<Schedule>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: schedule
    });

    const onSubmit = (data: Schedule) => {
        console.log(data);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormItem className="mb-8">
                            <FormLabel>Days</FormLabel>
                            <FormControl>
                                <div className="flex flex-row flex-wrap gap-2">
                                    {days.map((day, index) => {
                                        const isDayIncluded =
                                            schedule.weekDays.includes(
                                                index + 1
                                            );

                                        return (
                                            <div
                                                className={clsx(
                                                    "h-8 w-8 flex items-center justify-center rounded-full",
                                                    {
                                                        "bg-primary text-primary-foreground":
                                                            isDayIncluded,
                                                        "bg-primary-foreground":
                                                            !isDayIncluded
                                                    }
                                                )}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </FormControl>
                        </FormItem>

                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <div className="text-lg font-bold tracking-tight">
                                    {schedule.timeFrom} - {schedule.timeTo}
                                </div>
                            </FormControl>
                        </FormItem>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <Button variant="outline">
                    <LucideEdit className="h-4 w-4 mr-2" />
                    Edit
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ScheduleCard;
