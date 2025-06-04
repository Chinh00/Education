import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type CommonState = {
    authenticate: boolean,
    isConfirm: boolean
}

const commonState: CommonState = {
    authenticate: false,
    isConfirm: false,
}

const CommonSlice = createSlice({
    name: "common",
    initialState: commonState,
    reducers: {
        setAuthenticate: (state, action: PayloadAction<boolean>) => {
            state.authenticate = action.payload
        },
        setIsConfirm: (state, action: PayloadAction<boolean>) => {
            state.isConfirm = action.payload
        }
        
    }
})

export default CommonSlice.reducer
export const {setAuthenticate, setIsConfirm} = CommonSlice.actions