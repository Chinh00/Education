import {combineReducers, configureStore} from "@reduxjs/toolkit";
import CommonReducer from "./common_slice.ts"
import EducationReducer from "@/app/modules/education/stores/education_slice.ts"
import StudentReducer from "@/app/modules/student/stores/student_slice.ts"
import Dashboard_register_slice from "@/app/modules/education/stores/dashboard_register_slice.ts"

import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from "redux-persist"

const rootReducer = combineReducers({
    common: persistReducer({
        key: "common",
        storage: storage,
        blacklist: ["groupFuncName"]
    }, CommonReducer),
    education: EducationReducer,
    student: StudentReducer,
    dashboardRegister: Dashboard_register_slice

})
const rootConfig = {
    key: 'root',
    storage,
    blacklist: ["education", "student", "dashboardRegister"]
}
const store = configureStore({
    reducer: persistReducer(rootConfig, rootReducer),
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    })
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const persistor = persistStore(store)


export default store