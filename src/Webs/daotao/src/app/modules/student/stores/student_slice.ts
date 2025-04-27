import {Query} from "@/infrastructure/query.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StudentState = {
    query: Query,
    educationQuery: Query
}

const educationState: StudentState = {
    query: {
        Includes: ["InformationBySchool", "PersonalInformation"]
    } as Query,
    educationQuery: {

    } as Query

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
        },
        setEducationQuery: (state, action: PayloadAction<Query>) => {
            state.educationQuery = action.payload;
        },

    }
})

export default StudentSlice.reducer
export const {setQuery, setEducationQuery} = StudentSlice.actions