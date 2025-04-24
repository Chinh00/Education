import {Query} from "@/infrastructure/query.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StudentState = {
    query: Query
}

const educationState: StudentState = {
    query: {
        Includes: ["InformationBySchool"]
    } as Query,
}


const StudentSlice = createSlice({
    name: "student",
    initialState: educationState,
    reducers: {
        // setAuthenticate: (state, action: PayloadAction<boolean>) => {
        //     state.authenticate = action.payload
        // }
        setQuery: (state, action: PayloadAction<Query>) => {
            state.query = action.payload;
        }
    }
})

export default StudentSlice.reducer
export const {setQuery} = StudentSlice.actions