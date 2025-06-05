import {BrowserRouter, createBrowserRouter, Navigate, Outlet, Route, RouterProvider, Routes} from "react-router"
import {useAppSelector } from "../stores/hook"
import { RoutePaths } from "@/cores/route_paths"
import {lazy, Suspense, useEffect} from "react"
import MainLayout from "../components/layouts/main_layout"
import ProgressScreen from "@/app/components/screens/progress_screen.tsx";
import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
const Home = lazy(() => import("../modules/home/pages/home.tsx"))
const StudentInformation = lazy(() => import("../modules/student/pages/student_information.tsx"))
const StudentEducation = lazy(() => import("../modules/student/pages/student_education.tsx"))
const StudentRegister = lazy(() => import("../modules/student/pages/register_education.tsx"))
const StudentTimeline = lazy(() => import("../modules/student/pages/student_timeline.tsx"))
const RegisterNew = lazy(() => import("../modules/student/pages/register_new.tsx"))
const EducationResult = lazy(() => import("../modules/student/pages/education_result.tsx"))
const Login = lazy(() => import('../modules/auth/pages/login.tsx'))
const LoginFirst = lazy(() => import('../modules/auth/pages/login_first.tsx'))

const ProtectedRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)


    return authenticate ? <Outlet/> : <Navigate to={RoutePaths.LOGIN}/>
}

const AuthRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return !authenticate ? <Outlet/> : <Navigate to={RoutePaths.HOME}/>
}
const ConfirmRoute = () => {
    const {data} = useGetUserInfo()
    return data?.data?.isConfirm === "False" ? <Navigate to={RoutePaths.LOGIN_FIRST}/> : <Outlet />
}

const ConfirmRouteAuth = () => {
    const {data} = useGetUserInfo()
    return data?.data?.isConfirm === "True" ? <Navigate to={RoutePaths.HOME}/> : <Outlet />
}




const router = createBrowserRouter([
    {
        path: "",
        element: <Suspense fallback={<ProgressScreen  />} key={"ProtectedRoute"}><ProtectedRoute /></Suspense>,
        children: [
            {
                path: "",
                element: <Suspense fallback={<ProgressScreen  />} key={"ConfirmRoute"}><ConfirmRoute /></Suspense>,
                children: [
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
                                path: RoutePaths.STUDENT_EDUCATION_RESULT,
                                element: <Suspense fallback={<ProgressScreen  />} key={"EducationResult"}><EducationResult /></Suspense>,
                            },
                            {
                                path: RoutePaths.STUDENT_EDUCATION,
                                element: <Suspense fallback={<ProgressScreen  />} key={"StudentEducation"}><StudentEducation /></Suspense>,
                            },
                            {
                                path: RoutePaths.STUDENT_REGISTER,
                                element: <Suspense fallback={<ProgressScreen  />} key={"StudentRegister"}><StudentRegister /></Suspense>,
                            },
                            {
                                path: RoutePaths.STUDENT_TIMELINE,
                                element: <Suspense fallback={<ProgressScreen  />} key={"StudentTimeline"}><StudentTimeline /></Suspense>,
                            },
                            {
                                path: RoutePaths.STUDENT_REGISTER_NEW,
                                element: <Suspense fallback={<ProgressScreen  />} key={"RegisterNew"}><RegisterNew /></Suspense>,
                            },
                            
                        


                        ],
                    },
                ]
            },
            {
                path: "",
                element: <Suspense fallback={<ProgressScreen  />} key={"ConfirmRouteAuth"}><ConfirmRouteAuth /></Suspense>,
                children: [
                    {
                        path: RoutePaths.LOGIN_FIRST,
                        element: <Suspense fallback={<ProgressScreen  />} key={"StudentResult"}><LoginFirst /></Suspense>,
                    },
                ]
            }

        ]
    },

    {
        path: "",
        element: <Suspense fallback={<ProgressScreen  />} key={"AuthRoute"}><AuthRoute /></Suspense>,
        children: [
            {
                path: RoutePaths.LOGIN,
                element: <Suspense fallback={<ProgressScreen  />} key={"StudentResult"}><Login /></Suspense>,
            },
        ]
    }


]);



export const RoutersProvider = () => {
    return <>
        <RouterProvider router={router} />
    </>
}