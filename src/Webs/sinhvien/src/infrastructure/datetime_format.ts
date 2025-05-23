import { isAfter, isBefore, isEqual, parseISO } from 'date-fns';
import dayjs from "dayjs";


export function DateTimeFormat(date: string, formatString: string = "HH:mm:ss DD-MM-YYYY") {
    return dayjs(date).format(formatString)
}


export function isNowBetweenServerTime(startUTC: string = "2025-04-26T17:00:00", endUTC: string = "2025-04-26T17:00:00"): boolean {
    const now = new Date();
    const start = parseISO(startUTC);
    const end = parseISO(endUTC);
    return (isAfter(now, start) || isEqual(now, start))
        && (isBefore(now, end) || isEqual(now, end));
}
