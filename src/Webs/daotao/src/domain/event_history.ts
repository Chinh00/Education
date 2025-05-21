import {ChangeDetail} from "@/domain/change_detail.ts";

export interface EventHistory {
    performedByName: string;
    createdAt: string;
    eventName: string;
    changeDetails: ChangeDetail[];
}