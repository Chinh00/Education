import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { Outlet } from "react-router";
import { Separator } from "@/app/components/ui/separator.tsx";
import { AppSidebar } from "@/app/components/navbar/app-sidebar.tsx";
import { GraduationCap } from "lucide-react";
import { NavUser } from "@/app/components/navbar/nav-user.tsx";
import {Container} from "@mui/material";
const MainLayout = () => {
  return <div className={"w-full"}>
    {/*<header className="sticky z-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">*/}
    {/*  <div className="mx-auto py-3 px-4">*/}
    {/*    <div className="flex items-center gap-4 justify-between">*/}

    {/*      <div className="flex items-center gap-3">*/}
    {/*        <div className="relative w-10 h-10">*/}
    {/*          <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-full animate-pulse opacity-50"></div>*/}
    {/*          <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">*/}
    {/*            <GraduationCap size={20} className="text-primary dark:text-blue-400" />*/}
    {/*          </div>*/}
    {/*        </div>*/}
    {/*        <div>*/}
    {/*          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">*/}
    {/*            Thuỷ Lợi University*/}
    {/*          </h1>*/}
    {/*          <p className="text-xs text-gray-500 dark:text-gray-400">Trường đại học Thuỷ lợi</p>*/}
    {/*        </div>*/}
    {/*      </div>*/}
    {/*      <NavUser/>*/}

    {/*    </div>*/}
    {/*  </div>*/}
    {/*</header>*/}
    <SidebarProvider className={"flex w-full"}>
      <AppSidebar />
      <SidebarInset className={" relative flex-1"}>
        {/*<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">*/}
        {/*    <div className="flex items-center gap-2 px-4">*/}
        {/*        /!*<SidebarTrigger className="-ml-1" />*!/*/}
        {/*        /!*<Separator orientation="vertical" className="mr-2 h-4" />*!/*/}

        {/*    </div>*/}
        {/*</header>*/}
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  </div>
}

export default MainLayout;
