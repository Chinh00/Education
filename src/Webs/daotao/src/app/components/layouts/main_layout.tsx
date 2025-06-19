import {Outlet} from "react-router";
import {SidebarInset, SidebarProvider,} from "@/app/components/ui/sidebar"
import {AppSidebar} from "@/app/components/navbar/app-sidebar.tsx";
import AdminBackground from "@/asssets/images/admin_background.jpg"

const MainLayout = () => {
    return <>
        <div
            className="fixed top-0 left-0 w-screen h-screen opacity-40"
            style={{
                backgroundImage: `url(${AdminBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center", // Tuỳ chọn cho căn giữa hình
                backgroundRepeat: "no-repeat", // Tuỳ chọn tránh lặp lại hình
            }}
        />
        <SidebarProvider defaultOpen={false} style={{backgroundColor: "transparent"}}>
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