
import {Link, useLocation, useNavigate} from "react-router";
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
    const location = useLocation()
    return (
        <Sidebar className={"w-max h-screen bg-emerald-500 "} collapsible={"none"} >
            <SidebarContent className={""}>
                <SidebarGroup className={"w-full"}>
                    <SidebarMenu className={"flex flex-col justify-center items-center w-full"}>
                        <SidebarMenuItem className={"cursor-pointer w-full "}>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.HOME_PATH)} className="w-full text-sidebar-foreground/70 flex flex-col h-max cursor-pointer">
                                <Box><Home size={25}  className={"text-white"}/></Box>
                                <Typography className={"text-white"} fontSize={14} fontWeight={"bold"} whiteSpace={"nowrap"}>Trang chủ</Typography>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className={`cursor-pointer w-full ${location.pathname.startsWith("/education") && "bg-white rounded-md"} `}>
                            <SidebarMenuButton onClick={() => nav(RoutePaths.EDUCATION_TRAINING)} className="w-full text-sidebar-foreground/70 flex flex-col h-max cursor-pointer">
                                <Box><GraduationCap size={25} /></Box>
                                <Typography fontSize={14} fontWeight={"bold"} whiteSpace={"nowrap"}>Đào tạo</Typography>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className={`cursor-pointer w-full ${location.pathname.startsWith("/student") && "bg-white rounded-md"}`}>
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
