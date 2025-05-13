import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type DashboardState = {
    semesterSelected?: string
}
const initialState: DashboardState = {
    semesterSelected: undefined,
}


const DashboardRegisterSlice = createSlice({
    name: "dashboard-register",
    initialState: initialState,
    reducers: {
        setSemesterSelected: (state, action: PayloadAction<string>) => {
            state.semesterSelected = action.payload;
        }
    }
})

export default DashboardRegisterSlice.reducer
export const {setSemesterSelected} = DashboardRegisterSlice.actions

