import dayjs from "dayjs";

export function DateTimeFormat(date: string, formatString: string = "HH:mm:ss DD-MM-YYYY") {
    return dayjs(date).format(formatString)
}