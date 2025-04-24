import Header from "@/app/components/header/header.tsx";
import { Outlet } from "react-router";
import loadable from "@loadable/component";
const EducationSidebar = loadable(() => import('../components/education_sidebar.tsx'), {
    fallback: <div>Loading...</div>,
})
const EducationLayout = () => {
    return <>
        <div className={"grid grid-cols-12 "} style={{flexWrap: "nowrap"}}>
            <div className={"col-span-12"}><Header /></div>
            <div className={"col-span-2"}><EducationSidebar /></div>
            <div className={"col-span-10 h-screen p-4 border-t-2 relative"}>

                <Outlet />
            </div>
        </div>
    </>
}
export default EducationLayout;