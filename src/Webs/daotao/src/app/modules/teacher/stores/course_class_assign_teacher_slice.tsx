import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Subject} from "@/domain/subject.ts";
import {Key} from "react";
import {CourseClass} from "@/domain/course_class.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {Staff} from "@/domain/staff.ts";
export type CourseClassAssignTeacherState = {
    subject: Subject | undefined,
    selectedRowKeysChildren: Key[],
    selectedRowKeysParents: Key[],
    courseClasses: Record<string, CourseClass>,
    timelines: Record<string, SlotTimeline>,
    teacherSelected: Record<string, Staff>,
    teacherAssignments: Record<string, string>
}

const courseClassAssignTeacherSlice: CourseClassAssignTeacherState = {
    subject: undefined,
    selectedRowKeysChildren: [],
    selectedRowKeysParents: [],
    courseClasses: {},
    timelines: {},
    teacherSelected: {},
    teacherAssignments: {}
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
        setTeacherSelected: (state, action: PayloadAction<Record<string, Staff>>) => {
            state.teacherSelected = action.payload;
        },
        setTeacherAssignments: (state, action: PayloadAction<Record<string, string>>) => {
            state.teacherAssignments = action.payload;
        }
    }
})

export default CourseClassAssignTeacherSlice.reducer
export const {
    setSubject,
    setCourseClasses,
    setSelectedRowKeysChildren,
    setSelectedRowKeysParents,
    setTeacherSelected,
    setTeacherAssignments,
    setTimelines
} = CourseClassAssignTeacherSlice.actions