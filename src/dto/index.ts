interface ISite {
    id: string;
    site: string;
    exact: boolean;
}

interface ISchedule {
    id: string;
    weekDays: number[];
    timeFrom: string;
    timeTo: string;
}
