import {
  Sidebar, SidebarContent,
  SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarRail
} from "@/app/components/ui/sidebar"
import { BadgePlus, CakeSlice, GraduationCap, ListTree, User, Timer, Home, PlusSquare } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { NavUser } from "@/app/components/navbar/nav-user.tsx";
import { useAppSelector } from "@/app/stores/hook.ts";
import { CommonState } from "@/app/stores/common_slice.ts";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import { RoutePaths } from "@/cores/route_paths.ts";
export function AppSidebar() {

  return (
    <Sidebar className={""} variant={"floating"}  >
      <SidebarContent>
        <SidebarGroup>
          {/*<SidebarGroupLabel>Quản lý sinh viên</SidebarGroupLabel>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <Home />
                  <Link to={RoutePaths.HOME}>Trang chủ</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <User />
                  <Link to={RoutePaths.STUDENT_INFORMATION}>Thông tin sinh viên</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" >
                  <ListTree />
                  <Link to={RoutePaths.STUDENT_EDUCATION}>Chương trình đào tạo</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <BadgePlus />
                  <Link to={RoutePaths.STUDENT_REGISTER}>Đăng ký nguyện vọng</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <PlusSquare />
                  <Link to={RoutePaths.STUDENT_REGISTER_NEW}>Đăng ký học mới</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <Timer />
                  <Link to={RoutePaths.STUDENT_TIMELINE}>Thời khóa biểu của tôi</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>


              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" >
                  <CakeSlice />
                  <Link to={RoutePaths.STUDENT_RESULT}>Kết quả học tập</Link>
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
