import { ScheduleItem } from "@/app/modules/register/pages/course_class_config.tsx";

export function getOverlappingPairs(items: ScheduleItem[]): {itemA: ScheduleItem, itemB: ScheduleItem, overlapSlots: number[]}[] {
    const result: {itemA: ScheduleItem, itemB: ScheduleItem, overlapSlots: number[]}[] = [];
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            const a = items[i];
            const b = items[j];
            // Cùng ngày và cùng phòng
            if (a.dayIndex !== b.dayIndex) continue;
            if (!a.roomCode || !b.roomCode) continue;
            if (a.roomCode !== b.roomCode) continue;
            // overlap nếu slot giao nhau
            if (a.endSlot >= b.startSlot && b.endSlot >= a.startSlot) {
                const overlapStart = Math.max(a.startSlot, b.startSlot);
                const overlapEnd = Math.min(a.endSlot, b.endSlot);
                const overlapSlots = [];
                for (let k = overlapStart; k <= overlapEnd; k++) overlapSlots.push(k);
                result.push({ itemA: a, itemB: b, overlapSlots });
            }
        }
    }
    return result;
}