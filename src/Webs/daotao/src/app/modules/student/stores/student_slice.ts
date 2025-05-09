import {Query} from "@/infrastructure/query.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type StudentState = {
    studentListSelected?: {
        courseCode?: string
        departmentCode?: string
        specialityCode?: string
        classCode?: string
    }
}

const educationState: StudentState = {
    studentListSelected: {

    }

}


const StudentSlice = createSlice({
    name: "student",
    initialState: educationState,
    reducers: {


        setStudentListSearch(state, action: PayloadAction<{
            courseCode?: string
            departmentCode?: string
            specialityCode?: string
            classCode?: string
        }>) {
            state.studentListSelected = action.payload;
        }



    }
})

export default StudentSlice.reducer
export const {setStudentListSearch} = StudentSlice.actions