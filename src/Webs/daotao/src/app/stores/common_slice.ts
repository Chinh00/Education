import {createSlice, PayloadAction} from "@reduxjs/toolkit";
export type GroupFuncName = {
    groupName?: string,
    itemName?: string,
}
export type CommonState = {
    authenticate: boolean,
    groupFuncName?: GroupFuncName
}

const commonState: CommonState = {
    authenticate: false,
    groupFuncName: {
        groupName: "default",
        itemName: "default",
    }
}

const CommonSlice = createSlice({
    name: "common",
    initialState: commonState,
    reducers: {
        setAuthenticate: (state, action: PayloadAction<boolean>) => {
            state.authenticate = action.payload
        },
        setGroupFuncName: (state, action: PayloadAction<GroupFuncName>) => {
            return {
                ...state,
                groupFuncName: action.payload,
            };
        }

    }
})

export default CommonSlice.reducer
export const {setAuthenticate, setGroupFuncName} = CommonSlice.actions