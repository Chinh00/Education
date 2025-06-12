import Header from "@/app/components/header/header.tsx";
import { Outlet } from "react-router";
import loadable from "@loadable/component";
const EducationSidebar = loadable(() => import('../components/education_sidebar.tsx'), {
    fallback: <div>Loading...</div>,
})
const EducationLayout = () => {
    return <>
        <div className={"grid grid-cols-12 w-full relative"} style={{flexWrap: "nowrap"}}>
            <div className={"col-span-12 sticky top-0 z-10"}><Header /></div>
            <div className={"col-span-2 w-full sticky top-0"}>
                <EducationSidebar />
            </div>
            <div className={"col-span-10  p-4 border-t-2 relative w-full"}>
                <Outlet />
            </div>
        </div>
    </>
}
export default EducationLayout;