import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/app/components/ui/sidebar"
import { Outlet } from "react-router";
import {Separator} from "@/app/components/ui/separator.tsx";
import {AppSidebar} from "@/app/components/navbar/app-sidebar.tsx";
const MainLayout = () => {
    return <>
        <SidebarProvider>
            <AppSidebar />
            <main className={"w-full"}>
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            {/*{*/}
                            {/*    Object.entries(RoutePaths).map(([key, value]) => {*/}
                            {/*        */}
                            {/*        if (location.pathname.includes(value.PATH) )*/}
                            {/*        {*/}
                            {/*            return <Breadcrumb key={key}>*/}
                            {/*                <BreadcrumbList>*/}
                            {/*                    <BreadcrumbItem className="hidden md:block">*/}
                            {/*                        <BreadcrumbLink href="#">*/}
                            {/*                            {value.DESCRIPTION}*/}
                            {/*                        </BreadcrumbLink>*/}
                            {/*                    </BreadcrumbItem>*/}
                            {/*                </BreadcrumbList>*/}
                            {/*            </Breadcrumb>                                        */}
                            {/*        }*/}
                            {/*    })*/}
                            {/*}*/}


                        </div>
                    </header>
                    <div className={"p-5"}>
                        <Outlet />
                    </div>
                </SidebarInset>

            </main>
        </SidebarProvider>
    </>
}

export default MainLayout;