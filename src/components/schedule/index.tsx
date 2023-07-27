import { Schedule } from "@/dto";

import ScheduleCard from "./card";

const Schedules = () => {
    const dummySchedules: Schedule[] = [
        {
            id: "1",
            weekDays: [1, 2, 3, 4, 5],
            timeFrom: "08:00",
            timeTo: "12:00"
        },
        {
            id: "2",
            weekDays: [1, 2],
            timeFrom: "13:00",
            timeTo: "17:00"
        }
    ];

    return (
        <>
            <p className="scroll-m-20 text-2xl font-bold tracking-tight mb-2">
                Schedule
            </p>
            <p className="scroll-m-20 text-sm text-gray-500 dark:text-gray-400 mb-4">
                Define different schedules for when you want to stop
                procrastinating and do some real work. If the current time falls
                within any of the schedules, we will block the websites you have
                chosen.
            </p>
            <div className="grid grid-cols-4 gap-4">
                {dummySchedules.map((schedule) => (
                    <ScheduleCard schedule={schedule} />
                ))}
            </div>
        </>
    );
};

export default Schedules;
