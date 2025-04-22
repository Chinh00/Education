import {BrowserRouter, createBrowserRouter, Navigate, Outlet, Route, RouterProvider, Routes} from "react-router"
import {useAppSelector } from "../stores/hook"
import { RoutePaths } from "@/cores/route_paths"
import {lazy, Suspense} from "react"
import LoadingScreen from "../components/screens/loading_screen"
import IndexLayout from "../components/layouts/index_layout"
import MainLayout from "../components/layouts/main_layout"
import ProgressScreen from "@/app/components/screens/progress_screen.tsx";
import {CommonState} from "@/app/stores/common_slice.ts";
const Home = lazy(() => import("../modules/home/pages/home.tsx"))
const RegisterEducation = lazy(() => import("../modules/student/pages/register_education.tsx"))
const StudentInformation = lazy(() => import("../modules/student/pages/student_information.tsx"))
const StudentResult = lazy(() => import("../modules/student/pages/student_result.tsx"))
const StudentEducation = lazy(() => import("../modules/student/pages/student_education.tsx"))
const StudentRegister = lazy(() => import("../modules/student/pages/register_education.tsx"))
const Login = lazy(() => import('../modules/auth/pages/login.tsx'))

const ProtectedRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return authenticate ? <Outlet/> : <Navigate to={RoutePaths.LOGIN}/>
}

const AuthRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return !authenticate ? <Outlet/> : <Navigate to={RoutePaths.HOME}/>
}

const router = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={<ProgressScreen />}  key={"MainLayout"} ><MainLayout /></Suspense>,
        children: [
            {
                path: RoutePaths.HOME,
                element: <Suspense fallback={<ProgressScreen  />} key={"Home"}><Home /></Suspense>,
            },
            {
                path: RoutePaths.STUDENT_INFORMATION,
                element: <Suspense fallback={<ProgressScreen  />} key={"StudentInformation"}><StudentInformation /></Suspense>,
            },
            {
                path: RoutePaths.STUDENT_RESULT,
                element: <Suspense fallback={<ProgressScreen  />} key={"StudentResult"}><StudentResult /></Suspense>,
            },
            {
                path: RoutePaths.STUDENT_EDUCATION,
                element: <Suspense fallback={<ProgressScreen  />} key={"StudentEducation"}><StudentEducation /></Suspense>,
            },
            {
                path: RoutePaths.STUDENT_REGISTER,
                element: <Suspense fallback={<ProgressScreen  />} key={"StudentEducation"}><StudentRegister /></Suspense>,
            },


        ],
    },
    {
        path: RoutePaths.LOGIN,
        element: <Suspense fallback={<ProgressScreen  />} key={"StudentResult"}><Login /></Suspense>,
    },
]);



export const RoutersProvider = () => {
    return <>
        <RouterProvider router={router} />
    </>
}