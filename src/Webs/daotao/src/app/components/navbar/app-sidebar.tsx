
import {Link, useLocation, useNavigate} from "react-router";
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
import {setAuthenticate, setRoleName, setUserInfo} from "@/app/stores/common_slice.ts";
import TluIcon from "@/asssets/icons/tlu_icon.png"

import {
    GraduationCap,
    Settings,
    Users,
    Home,
    LogOut,
    AtSign
} from "lucide-react"
import {RoutePaths} from "@/core/route_paths.ts";
import { Avatar } from "antd";
import Auth from "@/infrastructure/utils/auth.ts";
import {Image} from "antd"
export function AppSidebar() {
    const nav = useNavigate()
    const dispatch = useAppDispatch()

    const {data, isLoading, isPending} = useGetUserInfo()

    useEffect(() => {
        if (data) {
            dispatch(setRoleName(data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]))
            dispatch(setUserInfo(data?.data))
        }
    }, [data, isLoading, isPending]);


    

    return (
        <Sidebar variant={"sidebar"} collapsible="icon"  style={{backgroundColor: "transparent"}} >
            <SidebarContent className={" pt-4" }  style={{backgroundColor: "transparent"}}>
                <SidebarMenu className={"flex flex-col gap-2 "}  style={{backgroundColor: "transparent"}}>
                    <SidebarMenuItem className={""}  style={{backgroundColor: "transparent"}}>

                        <SidebarMenuButton  style={{backgroundColor: "transparent"}} size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"inset-0 cursor-pointer mx-auto bg-white"} >
                            <Image src={TluIcon} />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.HOME_PATH)} tooltip="Trang chủ"  className={"cursor-pointer mx-auto "} >
                            <Home  className="scale-150 mx-auto hover:text-black  transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {data?.data?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "admin" && (
                        <>
                            
                            <SidebarMenuItem  className={""}>
                                <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.EDUCATION_DASHBOARD)} tooltip="Đào tạo"  className={"inset-0 cursor-pointer mx-auto "} >
                                    <GraduationCap  className="scale-150 mx-auto hover:text-black transition-all" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem  className={""}>
                                <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.STUDENT_LIST)} tooltip="Sinh viên"  className={"inset-0 cursor-pointer mx-auto "} >
                                    <Users  className="scale-150 mx-auto hover:text-black  transition-all" />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </>
                    )}


                    <SidebarMenuItem  className={""}>
                        <SidebarMenuButton size={"lg"} onClick={() => nav(RoutePaths.TEACHER_SUBJECT_LIST)} tooltip="Bộ môn"  className={"cursor-pointer mx-auto "} >
                            <AtSign  className="scale-150 mx-auto hover:text-black  transition-all" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>




                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className={""}>
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
