import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {useEffect} from "react";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton, SidebarMenuItem
} from "@/app/components/ui/sidebar.tsx";
import {List, LayoutDashboard} from "lucide-react"
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
        <div className={"pl-2 border-t-2 border-r-2 h-screen"}>
            <SidebarGroup>
                <SidebarGroupLabel>Chương trình đào tạo</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)}>
                                <List />
                                Danh sách đào tạo
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>Đăng ký học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_REGISTER)}>
                                <List />
                                Danh sách đăng ký học
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_REGISTER_DASHBOARD)}>
                                <LayoutDashboard />
                                Thống kê đăng ký học
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </div>
    )
}
export default EducationSidebar;