import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Subject} from "@/domain/subject.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {Key} from "react";
export type SubjectStudySectionState = {
    subject: Subject | undefined,
    courseClasses: Record<string, CourseClass>,
    currentStageConfig: number | undefined,
    timelines: Record<string, SlotTimeline>,
    courseClassesTimelines: Record<string, string[]>,
    selectedRowKeysChildren: Key[],
    selectedRowKeysParents: Key[],
}

const subjectStudySectionState: SubjectStudySectionState = {
    subject: undefined,
    courseClasses: {},
    currentStageConfig: 0,
    timelines: {},
    courseClassesTimelines: {},
    selectedRowKeysChildren: [],
    selectedRowKeysParents: []
}


const SubjectStudySectionSlice = createSlice({
    name: "SubjectStudySectionSlice",
    initialState: subjectStudySectionState,
    reducers: {
        setSubject: (state, action: PayloadAction<Subject | undefined>) => {
            state.subject = action.payload;
        },
        setCourseClasses: (state, action: PayloadAction<Record<string, CourseClass>>) => {
            state.courseClasses = action.payload;
        },
        setCurrentStageConfig: (state, action: PayloadAction<number | undefined>) => {
            state.currentStageConfig = action.payload;
        },
        setTimelines: (state, action: PayloadAction<Record<string, SlotTimeline>>) => {
            state.timelines = action.payload;
        },
        setCourseClassesTimelines: (state, action: PayloadAction<Record<string, string[]>>) => {
            state.courseClassesTimelines = action.payload;
        },
        setSelectedRowKeysChildren: (state, action: PayloadAction<Key[]>) => {
            state.selectedRowKeysChildren = action.payload;
        },
        setSelectedRowKeysParents: (state, action: PayloadAction<Key[]>) => {
            state.selectedRowKeysParents = action.payload;
        },
    }
})

export default SubjectStudySectionSlice.reducer
export const {setSubject,
    setTimelines, setCourseClasses, setCurrentStageConfig, setCourseClassesTimelines, setSelectedRowKeysParents, setSelectedRowKeysChildren} = SubjectStudySectionSlice.actions