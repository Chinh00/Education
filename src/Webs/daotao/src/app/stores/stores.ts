import {combineReducers, configureStore} from "@reduxjs/toolkit";
import CommonReducer from "./common_slice.ts"
import EducationReducer from "@/app/modules/education/stores/education_slice.ts"
import SubjectStudySectionReducer from "@/app/modules/education/stores/subject_study_section.ts"
import StudentReducer from "@/app/modules/student/stores/student_slice.ts"
import CourseClassAssignTeacherSliceReducer from "@/app/modules/teacher/stores/course_class_assign_teacher_slice.tsx"

import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from "redux-persist"

const rootReducer = combineReducers({
    common: persistReducer({
        key: "common",
        storage: storage,
        blacklist: ["currentChildSemester", "currentParentSemester"]
    }, CommonReducer),
    education: EducationReducer,
    subjectStudySectionReducer: SubjectStudySectionReducer,
    student: StudentReducer,
    courseClassAssignTeacherSliceReducer: CourseClassAssignTeacherSliceReducer,

})
const rootConfig = {
    key: 'root',
    storage,
    blacklist: ["education", "student", "subjectStudySectionReducer", "courseClassAssignTeacherSliceReducer"]
}
const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const persistor = persistStore(store)


export default store