import {Sidebar, SidebarContent,
    SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarRail} from "@/app/components/ui/sidebar"
import { RoutePaths } from "@/cores/route_paths"
import { BadgePlus, CakeSlice, ListTree, User } from "lucide-react"
import { Link } from "react-router"
import {NavUser} from "@/app/components/navbar/nav-user.tsx";
export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <Link to={"/"} className={"text-3xl font-bold text-center"} >myTlu</Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Quản lý sinh viên</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <User />
                                    <Link to={"/student/information"}>Thông tin sinh viên</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <BadgePlus />
                                    <Link to={"/student/register"}>Đăng ký học</Link>
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
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={"/student/education"}>Chương trình đào tạo</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: "Ching",
                    email: "2151062726@e.tlu.edu.vn",
                    avatar: "/avatars/shadcn.jpg",
                }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
