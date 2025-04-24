import Header from "@/app/components/header/header.tsx";
import {Outlet} from "react-router";
import loadable from "@loadable/component";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
const StudentSidebar = loadable(() => import('../components/student_sidebar.tsx'), {
    fallback: <div>Loading...</div>,
})
const StudentLayout = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, groupName: "Quản lý sinh viên"}));
    }, []);


    return (
        <>
            <div className={"grid grid-cols-12 "} style={{flexWrap: "nowrap"}}>
                <div className={"col-span-12"}><Header /></div>
                <div className={"col-span-2"}><StudentSidebar /></div>
                <div className={"col-span-10 h-screen p-4 border-t-2 relative"}>

                    <Outlet />
                </div>
            </div>
        </>
    )
}
export default StudentLayout