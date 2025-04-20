import {BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes} from "react-router";
import {lazy, Suspense} from "react";
import IndexLayout from "../components/layouts/index_layout.tsx";
import { RoutePaths } from "@/core/route_paths.ts";
import LoadingScreen from "../components/screens/loading_screen.tsx";
const RegisterConfig = lazy(() => import("../modules/register/pages/register_config.tsx"));
const TimelineConfig = lazy(() => import("../modules/register/pages/timeline_config.tsx"));
const Login = lazy(() => import("../modules/auth/pages/login.tsx"));
const Home = lazy(() => import("../modules/home/pages/home.tsx"));
const Education = lazy(() => import("../modules/education/pages/education_list.tsx"));
const CLASS = lazy(() => import("../modules/class/pages/class_list.tsx"));
const SEMESTER_CLASS = lazy(() => import("../modules/class/pages/semester_class.tsx"));
const WISH_CONFIG = lazy(() => import("../modules/register/pages/wish_config.tsx"));
const SEMESTER = lazy(() => import("../modules/semester/pages/semester_list.tsx"));
const MainLayout = lazy(() => import("../components/layouts/main_layout.tsx"));

const router = createBrowserRouter([
    {
        path: RoutePaths.HOME_PATH,
        element: <Suspense fallback={<div>Loading...</div>}><MainLayout /></Suspense>,
        children: [
            {
                path: "",
                element: <Suspense  fallback={<div>Loading...</div>} key={""}><Home /></Suspense>,
            },
            {
                path: RoutePaths.REGISTER_CONFIG_PATH,
                element: <Suspense fallback={<div>Loading...</div>} key={RoutePaths.REGISTER_CONFIG_PATH} ><RegisterConfig /></Suspense>,
            },
            {
                path: RoutePaths.SEMESTER_LIST,
                element: <Suspense fallback={<div>Loading...</div>} key={RoutePaths.SEMESTER_LIST} ><SEMESTER /></Suspense>,
            },

        ],
    },
]);


//
// export const RoutersProvider = () => {
//     return <BrowserRouter>
//         <Suspense fallback={<LoadingScreen />}>
//             <Routes>
//                 <Route element={<IndexLayout />}>
//                     <Route path={"/"} element={<MainLayout />}>
//                         <Route path={RoutePaths.HOME_PATH} element={<Home />} />
//                         <Route path={RoutePaths.REGISTER_CONFIG_PATH} element={<RegisterConfig />} />
//                         <Route path={RoutePaths.REGISTER_TIMELINE_PATH} element={<TimelineConfig />} />
//                         <Route path={RoutePaths.EDUCATION_LIST} element={<Education />} />
//                         <Route path={RoutePaths.CLASS_LIST} element={<CLASS />} />
//                         <Route path={RoutePaths.WISH_CONFIG} element={<WISH_CONFIG />} />
//                         <Route path={RoutePaths.SEMESTER_LIST} element={<SEMESTER />} />
//                         <Route path={RoutePaths.CLASS_SEMESTER_LIST} element={<SEMESTER_CLASS />} />
//                     </Route>
//                     <Route path="/login" element={<Login />} />
//                 </Route>
//             </Routes>
//         </Suspense>
//     </BrowserRouter>
// }
export const RoutersProvider = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
