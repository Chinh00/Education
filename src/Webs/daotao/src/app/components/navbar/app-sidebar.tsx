
import {Link} from "react-router";
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
import { BadgePlus, CakeSlice, ListTree } from "lucide-react";
import { RoutePaths } from "@/core/route_paths";

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>
                <Link to={"/"} className={"text-3xl font-bold text-center"} >myTlu</Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Đăng ký học</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70">
                                    <BadgePlus />
                                    <Link to={RoutePaths.REGISTER_CONFIG_PATH}>Cấu hình đăng ký học</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <CakeSlice />
                                    <Link to={RoutePaths.REGISTER_TIMELINE_PATH}>Cấu hình thời gian đăng ký</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={RoutePaths.WISH_CONFIG}>Cấu hình nguyện vọng học</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={RoutePaths.SEMESTER_LIST}>Cấu hình kì học</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={RoutePaths.EDUCATION_LIST}>Chương trình đào tạo</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton className="text-sidebar-foreground/70" >
                                    <ListTree />
                                    <Link to={RoutePaths.CLASS_LIST}>Danh sách lớp học</Link>
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
