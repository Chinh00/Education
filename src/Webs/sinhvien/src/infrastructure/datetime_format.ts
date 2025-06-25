import { isAfter, isBefore, isEqual, parseISO } from 'date-fns';
import dayjs from "dayjs";


export function DateTimeFormat(date?: string, formatString: string = "HH:mm:ss DD-MM-YYYY") {
    return dayjs(date).format(formatString)
}


export function isNowBetweenServerTime(startUTC: string = "2025-04-26T17:00:00", endUTC: string = "2025-04-26T17:00:00"): boolean {
    const now = new Date();
    const start = parseISO(startUTC);
    const end = parseISO(endUTC);
    return (isAfter(now, start) || isEqual(now, start))
        && (isBefore(now, end) || isEqual(now, end));
}

export function weeksBetween(date1: Date, date2: Date, roundMethod: "floor" | "ceil" | "round" = "floor"): number {
    // Đảm bảo date1 nhỏ hơn date2
    const start = date1 < date2 ? date1 : date2;
    const end = date1 < date2 ? date2 : date1;

    // Số mili giây trong 1 tuần
    const msInWeek = 7 * 24 * 60 * 60 * 1000;
    const diffInMs = end.getTime() - start.getTime();

    switch (roundMethod) {
        case "ceil":
            return Math.ceil(diffInMs / msInWeek);
        case "round":
            return Math.round(diffInMs / msInWeek);
        case "floor":
        default:
            return Math.floor(diffInMs / msInWeek);
    }
}
