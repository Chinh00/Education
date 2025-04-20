import { Query } from "@/infrastructure/query";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
export type EducationState = {
    query: Query
}

const educationState: EducationState = {
    query: {
    } as Query,
}


const EducationSlice = createSlice({
    name: "common",
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

export default EducationSlice.reducer
export const {setQuery} = EducationSlice.actions