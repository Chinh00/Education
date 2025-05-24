import loadable from "@loadable/component";
import Header from "@/app/components/header/header.tsx";
import {Outlet} from "react-router";

const RegisterSidebar = loadable(() => import('../components/register_sidebar.tsx'), {
    fallback: <div>Loading...</div>,
})

const RegisterLayout = () => {
    return <>
        <div className={"grid grid-cols-12 w-full relative"} style={{flexWrap: "nowrap"}}>
            <div className={"col-span-12 "}><Header /></div>
            <div className={"col-span-2 h-full w-full"}><RegisterSidebar /></div>
            <div className={"col-span-10 h-screen p-4 border-t-2 relative w-full"}>
                <Outlet />
            </div>
        </div>
    </>
}
export default RegisterLayout;