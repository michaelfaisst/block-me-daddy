import { createId } from "@paralleldrive/cuid2";
import { LucidePlus } from "lucide-react";
import { useChromeStorageLocal } from "use-chrome-storage";

import { Schedule } from "@/dto";

import { Button } from "../ui";
import ScheduleCard from "./card";

const Schedules = () => {
    const [schedules, setSchedules] = useChromeStorageLocal<Schedule[]>(
        "schedules",
        []
    );

    const onScheduleChanged = (schedule: Schedule) => {
        console.log(schedule);
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
            <Button className="mb-6" onClick={() => addNewSchedule()}>
                <LucidePlus className="h-4 w-4 mr-2" />
                Add schedule
            </Button>
            <div className="grid grid-cols-4 gap-4">
                {schedules.map((schedule) => (
                    <ScheduleCard
                        key={schedule.id}
                        schedule={schedule}
                        onChange={onScheduleChanged}
                        onRemove={removeSchedule}
                    />
                ))}
            </div>
        </>
    );
};

export default Schedules;
