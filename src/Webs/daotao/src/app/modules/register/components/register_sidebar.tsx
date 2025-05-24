import {memo, useState} from "react";
import {Steps, Typography} from "antd";
import {
    CakeSlice,
    CalendarSync,
    BookUp,
    UserPen,
    ListEnd
} from "lucide-react"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton,
    SidebarMenuItem
} from "@/app/components/ui/sidebar.tsx";
import {RoutePaths} from "@/core/route_paths.ts";
import {useLocation, useNavigate} from "react-router";

const RegisterSidebar = () => {


    const {pathname} = useLocation()
    const nav = useNavigate()
    return (
        <div className={"h-[250vh] bg-[#0c458d] text-white pl-3"}>
            <SidebarGroup >
                <SidebarGroupLabel className={"text-white"}>Đăng ký học</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(pathname?.split("/").filter(c => c != "timeline").join("/"))}>
                                <CakeSlice color={"white"}  />
                                Lấy nguyện vọng sinh viên
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(pathname + "/timeline")}>
                                <CalendarSync color={"white"}  />
                                Lập thời khóa biểu
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)}>
                                <BookUp color={"white"}  />
                                Xếp giáo viên vào lớp học
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)}>
                                <UserPen color={"white"}  />
                                Sinh viên thay đổi lớp học
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)}>
                                <ListEnd color={"white"}  />
                                Kết thúc
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </div>
    )
}
export default memo(RegisterSidebar);