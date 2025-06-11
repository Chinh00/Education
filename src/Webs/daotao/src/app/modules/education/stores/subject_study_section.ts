import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Subject} from "@/domain/subject.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
export type SubjectStudySectionState = {
    subject: Subject | undefined,
    courseClassesNew: CourseClass[] | undefined,
    scheduleItems?: ScheduleItem[] | [],
    currentStageConfig: number | undefined,
}

const subjectStudySectionState: SubjectStudySectionState = {
    subject: undefined,
    courseClassesNew: undefined,
    scheduleItems: undefined,
    currentStageConfig: 0,
}


const SubjectStudySectionSlice = createSlice({
    name: "SubjectStudySectionSlice",
    initialState: subjectStudySectionState,
    reducers: {
        setSubject: (state, action: PayloadAction<Subject | undefined>) => {
            state.subject = action.payload;
        },
        setCourseClassesNew: (state, action: PayloadAction<CourseClass[] | undefined>) => {
            state.courseClassesNew = action.payload;
        },
        setScheduleItem: (state, action: PayloadAction<ScheduleItem[] | []>) => {
            state.scheduleItems = action.payload;
        },
        setCurrentStageConfig: (state, action: PayloadAction<number | undefined>) => {
            state.currentStageConfig = action.payload;
        },
    }
})

export default SubjectStudySectionSlice.reducer
export const {setSubject, setCourseClassesNew, setScheduleItem, setCurrentStageConfig} = SubjectStudySectionSlice.actions