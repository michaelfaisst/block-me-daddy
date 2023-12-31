import { useAutoAnimate } from "@formkit/auto-animate/react";
import { createId } from "@paralleldrive/cuid2";
import { LucideMegaphone, LucidePlus } from "lucide-react";
import { useRef } from "react";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Schedule } from "@/dto";

import AnimatePresence from "../animate-presence";
import { Alert, AlertDescription, AlertTitle, Button } from "../ui";
import ScheduleCard from "./card";

const Schedules = () => {
    const [schedules, setSchedules] = useChromeStorageLocal<Schedule[]>(
        "schedules",
        []
    );

    const [animationParent] = useAutoAnimate<HTMLDivElement>({
        duration: 150
    });

    const listEndRef = useRef<HTMLDivElement>(null);

    const onScheduleChanged = (schedule: Schedule) => {
        setSchedules((schedules) =>
            schedules.map((s) => {
                if (s.id === schedule.id) {
                    return schedule;
                }

                return s;
            })
        );
    };

    const addNewSchedule = () => {
        setSchedules((schedules) => [
            ...schedules,
            {
                id: createId(),
                weekDays: [1, 2, 3, 4, 5],
                timeFrom: "09:00",
                timeTo: "17:00"
            }
        ]);

        setTimeout(() => {
            listEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 150);
    };

    const removeSchedule = async (schedule: Schedule) => {
        setSchedules((schedules) => [
            ...schedules.filter((s) => s.id !== schedule.id)
        ]);
    };

    return (
        <>
            <div>
                <p className="scroll-m-20 text-2xl font-bold tracking-tight mb-2">
                    Schedule
                </p>
            </div>
            <p className="scroll-m-20 text-sm text-gray-500 dark:text-gray-400 mb-6">
                Define different schedules for when you want to stop
                procrastinating and do some real work. If the current time falls
                within any of the schedules, we will block the websites you have
                chosen.
            </p>

            <AnimatePresence visible={schedules.length === 0}>
                <div className="pb-6">
                    <Alert>
                        <LucideMegaphone className="h-4 w-4 mr-4" />
                        <AlertTitle>You have no schedules yet!</AlertTitle>
                        <AlertDescription className="text-secondary-foreground">
                            If you don't have any schedule, we will block the
                            sites you chosen all the time (as long as blocking
                            is enabled). To add a schedule, click the button
                            below.
                        </AlertDescription>
                    </Alert>
                </div>
            </AnimatePresence>

            <Button className="mb-6" onClick={() => addNewSchedule()}>
                <LucidePlus className="h-4 w-4 mr-2" />
                Add schedule
            </Button>

            <div className="grid grid-cols-4 gap-4" ref={animationParent}>
                {schedules.map((schedule) => (
                    <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onChange={onScheduleChanged}
                        onRemove={removeSchedule}
                    />
                ))}
            </div>
            <div ref={listEndRef} />
        </>
    );
};

export default Schedules;
