import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type CommonState = {
    authenticate: boolean,
    pageLoaded: boolean,
}

const commonState: CommonState = {
    authenticate: false,
    pageLoaded: false,
}

const CommonSlice = createSlice({
    name: "common",
    initialState: commonState,
    reducers: {
        setAuthenticate: (state, action: PayloadAction<boolean>) => {
            state.authenticate = action.payload
        },
        setPageLoaded: (state, action: PayloadAction<boolean>) => {
            state.pageLoaded = action.payload
        },

    }
})

export default CommonSlice.reducer
export const {setAuthenticate, setPageLoaded} = CommonSlice.actions