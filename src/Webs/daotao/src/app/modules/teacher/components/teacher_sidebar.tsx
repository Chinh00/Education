import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {useEffect} from "react";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {
    Sidebar, SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton, SidebarMenuItem
} from "@/app/components/ui/sidebar.tsx";
import {List, Calendar} from "lucide-react"
import {useNavigate} from "react-router";
import { RoutePaths } from "@/core/route_paths";
const EducationSidebar = () => {
    const dispatch = useAppDispatch();
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, groupName: "Quản lý đào tạo"}));
    }, []);
    const nav = useNavigate()

    return (
        <div className={"h-[250vh] bg-[#0c458d] text-white pl-3"}>
            <SidebarGroup>
                <SidebarGroupLabel className={"text-white"}>Lớp học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.TEACHER_SUBJECT_LIST)}>
                                <List />
                                Danh sách lớp mở
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.TEACHER_TIMELINE)}>
                                <Calendar />
                                Thời khóa biểu giáo viên
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>


        </div>
    )
}
export default EducationSidebar;