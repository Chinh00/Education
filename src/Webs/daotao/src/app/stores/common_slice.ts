import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type CommonState = {
    authenticate: boolean
}

const commonState: CommonState = {
    authenticate: false
}

const CommonSlice = createSlice({
    name: "common",
    initialState: commonState,
    reducers: {
        setAuthenticate: (state, action: PayloadAction<boolean>) => {
            state.authenticate = action.payload
        }
    }
})

export default CommonSlice.reducer
export const {setAuthenticate} = CommonSlice.actions