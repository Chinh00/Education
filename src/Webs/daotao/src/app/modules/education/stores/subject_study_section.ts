import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Subject} from "@/domain/subject.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
export type SubjectStudySectionState = {
    subject: Subject | undefined,
    courseClassesNew: CourseClass[] | undefined,
    scheduleItem?: ScheduleItem | undefined,
}

const subjectStudySectionState: SubjectStudySectionState = {
    subject: undefined,
    courseClassesNew: undefined,
    scheduleItem: undefined,
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
        setScheduleItem: (state, action: PayloadAction<ScheduleItem | undefined>) => {
            state.scheduleItem = action.payload;
        }
    }
})

export default SubjectStudySectionSlice.reducer
export const {setSubject, setCourseClassesNew, setScheduleItem} = SubjectStudySectionSlice.actions