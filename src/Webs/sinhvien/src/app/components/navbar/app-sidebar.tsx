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
  SidebarRail,
  useSidebar
} from "@/app/components/ui/sidebar"
import { BadgePlus, CakeSlice, GraduationCap, ListTree, User, Timer, Home, PlusSquare } from "lucide-react"
import { Link, useNavigate } from "react-router"
import {Image} from "antd"
import TluIcon from "@/assets/icons/tlu_icon.png"
import { RoutePaths } from "@/cores/route_paths.ts";
export function AppSidebar() {
  const {state} = useSidebar()
  const nav = useNavigate()
  return (
    <Sidebar className={""} variant={"sidebar"}  collapsible={"icon"} >
      <SidebarContent>
        <SidebarGroup>
          {/*<SidebarGroupLabel>Quản lý sinh viên</SidebarGroupLabel>*/}
          <SidebarGroupContent>
            <SidebarMenu>
              {
                !(state === "collapsed") && <SidebarMenuItem>
                    <div className="flex items-center gap-3 pl-2">
                      <div className="relative w-10 h-10">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-full animate-pulse opacity-50"></div>
                        <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                          <Image src={TluIcon} preview={false} width={150} />
                        </div>
                      </div>
                      <div>
                        <h1 className=" font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                          Thuỷ Lợi University
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Trường đại học Thuỷ lợi</p>
                      </div>
                    </div>
                  </SidebarMenuItem>
              }
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => nav(RoutePaths.HOME)} className="text-sidebar-foreground/70">
                  <Home />
                  Trang chủ
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_INFORMATION)}>
                  <User />
                  Thông tin sinh viên
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_EDUCATION)} >
                  <ListTree />
                  Chương trình đào tạo
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_REGISTER)} >
                  <BadgePlus />
                  Đăng ký nguyện vọng
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_REGISTER_NEW)}>
                  <PlusSquare />
                  Đăng ký học mới
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_TIMELINE)}>
                  <Timer />
                  Kết quả đăng ký học
                </SidebarMenuButton>
              </SidebarMenuItem>


              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70" onClick={() => nav(RoutePaths.STUDENT_EDUCATION_RESULT)}>
                  <CakeSlice />
                  Kết quả học tập
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
