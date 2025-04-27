import {Query} from "@/infrastructure/query.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StudentState = {
    filters: {
        courseCode?: string
        departmentCode?: string
        specialityCode?: string,
        classCode?: string
        educationCode?: string
    },
    classQuery: Query
}

const educationState: StudentState = {
    filters: {

    },
    classQuery: {

    }

}


const StudentSlice = createSlice({
    name: "student",
    initialState: educationState,
    reducers: {
        // setAuthenticate: (state, action: PayloadAction<boolean>) => {
        //     state.authenticate = action.payload
        // }
        setFilters: (state, action: PayloadAction<{
            courseCode?: string
            departmentCode?: string
            specialityCode?: string,
            classCode?: string
            educationCode?: string

        }>) => {
            state.filters = action.payload;
        },
        setClassQuery(state, action: PayloadAction<Query>) {
            state.classQuery = action.payload;
        }


    }
})

export default StudentSlice.reducer
export const {setFilters, setClassQuery} = StudentSlice.actions