import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserInfo} from "@/domain/user_info.ts";
import {Semester} from "@/domain/semester.ts";
export type GroupFuncName = {
    groupName?: string,
    itemName?: string,
}
export type CommonState = {
    authenticate: boolean,
    groupFuncName?: GroupFuncName
    roleName?: string,
    userInfo?: UserInfo,
    currentParentSemester: Semester | undefined,
    currentChildSemester: Semester[] | undefined,
}

const commonState: CommonState = {
    authenticate: false,
    groupFuncName: {
        groupName: "default",
        itemName: "default",
    },
    currentParentSemester: undefined,
    currentChildSemester: undefined,
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
        },
        setCurrentSemester: (state, action: PayloadAction<{ parentSemester?: Semester, childSemesters?: Semester[] }>) => {
            state.currentParentSemester = action.payload.parentSemester;
            state.currentChildSemester = action.payload.childSemesters;
        },
       
        

    }
})

export default CommonSlice.reducer
export const {setAuthenticate, setGroupFuncName, setRoleName, setUserInfo, setCurrentSemester} = CommonSlice.actions