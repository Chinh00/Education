import dayjs from "dayjs";

export function DateTimeFormat(date?: string, formatString: string = "HH:mm:ss DD-MM-YYYY") {
    return dayjs(date).format(formatString)
}

export const timeSlots = [
    { id: "slot-1", period: "Tiết 1", time: "(07:00→07:50)" },
    { id: "slot-2", period: "Tiết 2", time: "(07:55→08:45)" },
    { id: "slot-3", period: "Tiết 3", time: "(08:50→09:40)" },
    { id: "slot-4", period: "Tiết 4", time: "(09:45→10:35)" },
    { id: "slot-5", period: "Tiết 5", time: "(10:40→11:30)" },
    { id: "slot-6", period: "Tiết 6", time: "(11:35→12:25)" },
    { id: "slot-7", period: "Tiết 7", time: "(12:55→13:40)" },
    { id: "slot-8", period: "Tiết 8", time: "(13:50→14:40)" },
    { id: "slot-9", period: "Tiết 9", time: "(14:45→15:35)" },
    { id: "slot-10", period: "Tiết 10", time: "(15:40→16:30)" },
    { id: "slot-11", period: "Tiết 11", time: "(16:35→17:25)" },
    { id: "slot-12", period: "Tiết 12", time: "(17:30→18:20)" },
    { id: "slot-13", period: "Tiết 13", time: "(18:50→19:40)" },
    { id: "slot-14", period: "Tiết 14", time: "(19:45→20:35)" },
    { id: "slot-15", period: "Tiết 15", time: "(20:40→21:30)" },
]

export const daysOfWeek = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"]