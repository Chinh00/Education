import {Outlet} from "react-router";
import {SidebarInset, SidebarProvider, SidebarTrigger,} from "@/app/components/ui/sidebar"
import {Separator} from "@/app/components/ui/separator.tsx";
import {AppSidebar} from "@/app/components/navbar/app-sidebar.tsx";
import {Suspense} from "react";
import { GraduationCap } from "lucide-react";
const MainLayout = () => {
    return <>
        <SidebarProvider className={"w-full"}>
            {/*<header className="relative z-20 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">*/}
            {/*    <div className="flex items-center py-2 pr-20 pl-5 gap-4 justify-between">*/}
            {/*        <div className="flex items-center gap-3">*/}
            {/*            <div className="relative w-10 h-10">*/}
            {/*                <div className="absolute inset-0 bg-gradient-to-br from-primary to-blue-600 rounded-full animate-pulse opacity-50"></div>*/}
            {/*                <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">*/}
            {/*                    <GraduationCap size={20} className="text-primary dark:text-blue-400" />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className={"flex flex-col"}>*/}
            {/*                <h1 className="text-lg whitespace-nowrap md:text-lg font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">*/}
            {/*                    Tlu University*/}
            {/*                </h1>*/}
            {/*                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Hệ thống đào tạo</p>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</header>*/}

            <AppSidebar />
            <main className={"w-full"}>
                <SidebarInset>
                    <Outlet />
                </SidebarInset>
            </main>
        </SidebarProvider>
    </>
}

export default MainLayout;