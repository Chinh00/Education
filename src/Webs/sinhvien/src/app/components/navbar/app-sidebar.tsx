import {Sidebar, SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail} from "@/app/components/ui/sidebar"
import {BadgePlus, CakeSlice, GraduationCap, ListTree, User} from "lucide-react"
import {Link, useNavigate} from "react-router"
import {NavUser} from "@/app/components/navbar/nav-user.tsx";
import {useAppSelector} from "@/app/stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import toast from "react-hot-toast";
import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import {RoutePaths} from "@/cores/route_paths.ts";
export function AppSidebar() {

    return (
        <Sidebar className={"relative h-full"}>
            <SidebarContent>
                <SidebarGroup>
                    {/*<SidebarGroupLabel>Quản lý sinh viên</SidebarGroupLabel>*/}
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <User />
                                    <Link to={"/student/information"}>Thông tin sinh viên</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={"/student/education"}>Chương trình đào tạo</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <BadgePlus />
                                    <Link to={"/student/register"}>Đăng môn học</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <CakeSlice />
                                    <Link to={"/student/register"}>Đăng ký nguyện vọng học</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <CakeSlice />
                                    <Link to={"/student/result"}>Kết quả học tập</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
