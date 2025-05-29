import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { Outlet } from "react-router";
import { Separator } from "@/app/components/ui/separator.tsx";
import { AppSidebar } from "@/app/components/navbar/app-sidebar.tsx";
import { GraduationCap } from "lucide-react";
import { NavUser } from "@/app/components/navbar/nav-user.tsx";
import {Container} from "@mui/material";
const MainLayout = () => {
  return <div className={"w-full"}>

    <SidebarProvider className={"flex w-full relative"}>
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
