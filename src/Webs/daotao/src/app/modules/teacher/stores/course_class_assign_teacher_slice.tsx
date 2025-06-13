import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Subject} from "@/domain/subject.ts";
import {Key} from "react";
import {CourseClass} from "@/domain/course_class.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
export type CourseClassAssignTeacherState = {
    subject: Subject | undefined,
    selectedRowKeysChildren: Key[],
    selectedRowKeysParents: Key[],
    courseClasses: Record<string, CourseClass>,
    timelines: Record<string, SlotTimeline>,
}

const courseClassAssignTeacherSlice: CourseClassAssignTeacherState = {
    subject: undefined,
    selectedRowKeysChildren: [],
    selectedRowKeysParents: [],
    courseClasses: {},
    timelines: {}
}


const CourseClassAssignTeacherSlice = createSlice({
    name: "CourseClassAssignTeacherSlice",
    initialState: courseClassAssignTeacherSlice,
    reducers: {
        setSubject: (state, action: PayloadAction<Subject | undefined>) => {
            state.subject = action.payload;
        },
        setSelectedRowKeysChildren: (state, action: PayloadAction<Key[]>) => {
            state.selectedRowKeysChildren = action.payload;
        },
        setSelectedRowKeysParents: (state, action: PayloadAction<Key[]>) => {
            state.selectedRowKeysParents = action.payload;
        },
        setCourseClasses: (state, action: PayloadAction<Record<string, CourseClass>>) => {
            state.courseClasses = action.payload;
        },
        setTimelines: (state, action: PayloadAction<Record<string, SlotTimeline>>) => {
            state.timelines = action.payload;
        },
    }
})

export default CourseClassAssignTeacherSlice.reducer
export const {
    setSubject,
    setCourseClasses,
    setSelectedRowKeysChildren,
    setSelectedRowKeysParents
} = CourseClassAssignTeacherSlice.actions