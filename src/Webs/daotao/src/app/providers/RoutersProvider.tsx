import {createBrowserRouter, RouterProvider} from "react-router";
import {lazy, Suspense} from "react";
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
const NOTFOUND = lazy(() => import("../modules/system/pages/notfound_page.tsx"));

const router = createBrowserRouter([
    {
        path: RoutePaths.HOME_PATH,
        element: <Suspense fallback={<LoadingScreen />}  key={"index"} ><MainLayout /></Suspense>,
        children: [
            {
                path: "",
                element: <Suspense  fallback={<LoadingScreen  />} key={"Home"}><Home /></Suspense>,
            },
            {
                path: RoutePaths.EDUCATION_LIST,
                element: <Suspense fallback={<LoadingScreen />} key={"Education"} ><Education /></Suspense>,
            },
            {
                path: RoutePaths.REGISTER_TIMELINE_PATH,
                element: <Suspense  fallback={<LoadingScreen  />} key={"TimelineConfig"} ><TimelineConfig /></Suspense>,
            },
            {
                path: RoutePaths.CLASS_LIST,
                element: <Suspense  fallback={<LoadingScreen />}  key={"CLASS"} ><CLASS /></Suspense>,
            },
            {
                path: RoutePaths.CLASS_SEMESTER_LIST,
                element: <Suspense  fallback={<LoadingScreen  />} key={"SEMESTER_CLASS"}><SEMESTER_CLASS /></Suspense>,
            },
            {
                path: RoutePaths.WISH_CONFIG,
                element: <Suspense  fallback={<LoadingScreen />}  key={"WISH_CONFIG"}><WISH_CONFIG /></Suspense>,
            },
            {
                path: RoutePaths.REGISTER_CONFIG_PATH,
                element: <Suspense fallback={<LoadingScreen />}  key={"RegisterConfig"}  ><RegisterConfig /></Suspense>,
            },
            {
                path: RoutePaths.SEMESTER_LIST,
                element: <Suspense fallback={<LoadingScreen/>}   key={"SEMESTER"} ><SEMESTER /></Suspense>,
            },
            {
                path: "*",
                element: <Suspense fallback={<LoadingScreen/>}   key={"NOTFOUND"} ><NOTFOUND /></Suspense>,
            },

        ],
    },
]);



export const RoutersProvider = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
