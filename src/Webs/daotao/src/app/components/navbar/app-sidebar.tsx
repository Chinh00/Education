
import {Link, useLocation, useNavigate} from "react-router";
import { NavUser } from "./nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger
} from "@/app/components/ui/sidebar"

import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import {useAppDispatch} from "@/app/stores/hook.ts";
import {useEffect} from "react";
import {setAuthenticate, setRoleName} from "@/app/stores/common_slice.ts";


import {
    GraduationCap,
    Settings,
    Users,
    Home,
    LogOut,
} from "lucide-react"
import {RoutePaths} from "@/core/route_paths.ts";
import { Avatar } from "antd";
import Auth from "@/infrastructure/utils/auth.ts";

export function AppSidebar() {
    const nav = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()

    const {data, isLoading, isPending} = useGetUserInfo()

    useEffect(() => {
        if (data) {
            dispatch(setRoleName(data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]))
        }
    }, [data, isLoading, isPending]);


    if (data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "department-admin") {
        return <Sidebar variant={"inset"} collapsible="icon"  style={{backgroundColor: "#0c458d", width: "75px"}} >
            <SidebarContent className={"bg-[#0c458d] pt-4"}>
                <SidebarMenu className={"flex flex-col gap-2 bg-[#0c458d]"}>
                    <SidebarMenuItem  className={""}>

                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"inset-0 cursor-pointer mx-auto "} >
                            <Avatar  />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"cursor-pointer mx-auto "} >
                            <Home  className="scale-150 mx-auto hover:text-black text-white transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.STUDENT_LIST)} tooltip="Sinh viên"  className={"inset-0 cursor-pointer mx-auto "} >
                            <Users  className="scale-150 mx-auto hover:text-black text-white transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>







                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={"bg-[#124485]"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => {
                            dispatch(setAuthenticate(false))
                            Auth.ClearCookie()
                        }} tooltip="Đăng xuất" className={"mx-auto cursor-pointer"}>
                            {/*<Settings className="h-5 w-5" />*/}
                            <LogOut className={"scale-150"} />
                            <span>Cài đặt</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>

    }

    if (data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "admin") return (
        <Sidebar variant={"inset"} collapsible="icon"  style={{backgroundColor: "#0c458d", width: "75px"}} >
            <SidebarContent className={"bg-[#0c458d] pt-4"}>
                <SidebarMenu className={"flex flex-col gap-2 bg-[#0c458d]"}>
                    <SidebarMenuItem  className={""}>

                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"inset-0 cursor-pointer mx-auto "} >
                            <Avatar  />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"cursor-pointer mx-auto "} >
                            <Home  className="scale-150 mx-auto hover:text-black text-white transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.EDUCATION_DASHBOARD)} tooltip="Đào tạo"  className={"inset-0 cursor-pointer mx-auto "} >
                            <GraduationCap  className="scale-150 mx-auto hover:text-black text-white transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.STUDENT_LIST)} tooltip="Sinh viên"  className={"inset-0 cursor-pointer mx-auto "} >
                            <Users  className="scale-150 mx-auto hover:text-black text-white transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>







                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={"bg-[#124485]"}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => {
                            dispatch(setAuthenticate(false))
                            Auth.ClearCookie()
                        }} tooltip="Đăng xuất" className={"mx-auto cursor-pointer"}>
                            {/*<Settings className="h-5 w-5" />*/}
                            <LogOut className={"scale-150"} />
                            <span>Cài đặt</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
