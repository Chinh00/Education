import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from "@/app/components/ui/sidebar.tsx";
import {RoutePaths} from "@/core/route_paths.ts";
import {List} from "lucide-react";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import {useNavigate} from "react-router";

const StudentSidebar = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, groupName: "Quản lý sinh viên"}));
    }, []);
    const nav = useNavigate()
    return (
        <div className={"pl-2  h-screen  "}>
            <SidebarGroup>
                <SidebarGroupLabel className={""}>Sinh viên</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.STUDENT_LIST)}>
                                <List />
                                Danh sách sinh viên
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </div>
    )
}
export default StudentSidebar