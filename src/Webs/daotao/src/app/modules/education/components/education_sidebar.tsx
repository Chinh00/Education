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
import {List, LayoutDashboard, ChartGantt, GraduationCap} from "lucide-react"
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
        <div className={"border-t-2 border-r-2 h-screen text-black pl-3 sticky top-0"}>

            <SidebarGroup>
                <SidebarGroupLabel  className={""}>Học kì</SidebarGroupLabel>
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
                <SidebarGroupLabel className={""}>Đăng ký học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_REGISTER)}>
                                <List />
                                Danh sách đăng ký học
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.SUBJECT_STUDY_SECTION)}>
                                <GraduationCap />
                                Lớp học phần
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel className={""}>Môn học</SidebarGroupLabel>
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