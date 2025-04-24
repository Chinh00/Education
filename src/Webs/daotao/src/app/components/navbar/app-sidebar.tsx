
import {Link, useNavigate} from "react-router";
import { NavUser } from "./nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from "@/app/components/ui/sidebar"
import { BadgePlus, Users, GraduationCap, Home } from "lucide-react";
import { RoutePaths } from "@/core/route_paths";
import {Box, Typography} from "@mui/material";

export function AppSidebar() {
    const nav = useNavigate()
    return (
        <Sidebar className={"w-max h-screen bg-blue-300"} collapsible={"none"} >
            <SidebarContent className={""}>
                <SidebarGroup className={"w-full"}>
                    <SidebarMenu className={"flex flex-col justify-center items-center w-full"}>
                        <SidebarMenuItem className={"cursor-pointer w-full"}>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.HOME_PATH)} className="w-full text-sidebar-foreground/70 flex flex-col h-max cursor-pointer">
                                <Box><Home size={25} /></Box>
                                <Typography fontSize={14} fontWeight={"bold"} whiteSpace={"nowrap"}>Trang chủ</Typography>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className={"cursor-pointer w-full"}>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)} className="w-full text-sidebar-foreground/70 flex flex-col h-max cursor-pointer">
                                <Box><GraduationCap size={25} /></Box>
                                <Typography fontSize={14} fontWeight={"bold"} whiteSpace={"nowrap"}>Đào tạo</Typography>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className={"cursor-pointer w-full"}>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.STUDENT_LIST)} className="w-full text-sidebar-foreground/70 flex flex-col h-max cursor-pointer">
                                <Box><Users size={25} /></Box>
                                <Typography fontSize={14} fontWeight={"bold"} whiteSpace={"nowrap"}>Sinh viên</Typography>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>

                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
