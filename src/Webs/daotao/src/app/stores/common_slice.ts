import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserInfo} from "@/domain/user_info.ts";
export type GroupFuncName = {
    groupName?: string,
    itemName?: string,
}
export type CommonState = {
    authenticate: boolean,
    groupFuncName?: GroupFuncName
    roleName?: string,
    userInfo?: UserInfo,

}

const commonState: CommonState = {
    authenticate: false,
    groupFuncName: {
        groupName: "default",
        itemName: "default",
    },
    
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
        },
        setRoleName: (state, action: PayloadAction<string>) => {
            state.roleName = action.payload;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        }
        

    }
})

export default CommonSlice.reducer
export const {setAuthenticate, setGroupFuncName, setRoleName, setUserInfo} = CommonSlice.actions