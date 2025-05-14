import {Outlet} from "react-router";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/app/components/ui/sidebar"
import {Separator} from "@/app/components/ui/separator.tsx";
import {AppSidebar} from "@/app/components/navbar/app-sidebar.tsx";
import {Suspense} from "react";
import { GraduationCap } from "lucide-react";
const MainLayout = () => {
    return <>
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className={"w-full"}>
                <SidebarInset >
                    <Outlet />
                </SidebarInset>
            </div>

        </SidebarProvider>
    </>
}

export default MainLayout;