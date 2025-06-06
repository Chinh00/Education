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
import {List, LayoutDashboard, ChartGantt, Replace} from "lucide-react"
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
                <SidebarGroupLabel  className={"text-white"}>Học kì</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.SEMESTER_LIST)}>
                                <List />
                                Danh sách kì học
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel className={"text-white"}>Đăng ký học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_REGISTER)}>
                                <List />
                                Danh sách đăng ký học
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel className={"text-white"}>Môn học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.SUBJECT_LIST)}>
                                <List />
                                Danh sách môn học
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

        </div>
    )
}
export default EducationSidebar;