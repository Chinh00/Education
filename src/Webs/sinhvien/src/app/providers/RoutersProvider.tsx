import {BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router"
import {useAppSelector } from "../stores/hook"
import { RoutePaths } from "@/cores/route_paths"
import {lazy, Suspense} from "react"
import LoadingScreen from "../components/screens/loading_screen"
import IndexLayout from "../components/layouts/index_layout"
import MainLayout from "../components/layouts/main_layout"
const Home = lazy(() => import("../modules/home/pages/home.tsx"))
const RegisterEducation = lazy(() => import("../modules/student/pages/register_education.tsx"))
const StudentInformation = lazy(() => import("../modules/student/pages/student_information.tsx"))
const StudentResult = lazy(() => import("../modules/student/pages/student_result.tsx"))
const Login = lazy(() => import("../modules/student/pages/student_result.tsx"))

const ProtectedRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return authenticate ? <Outlet/> : <Navigate to={RoutePaths.LOGIN.PATH}/>
}

const AuthRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return !authenticate ? <Outlet/> : <Navigate to={RoutePaths.HOME.PATH}/>
}
export const RoutersProvider = () => {
    return <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                <Route element={<IndexLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route path={"/"} element={<MainLayout />}>
                            <Route path="" element={<Home />} />
                            <Route path={"/student"} >
                                <Route path="register" element={<RegisterEducation />} />
                                <Route path="information" element={<StudentInformation />} />
                                <Route path="result" element={<StudentResult />} />
                            </Route>
                        </Route>
                    </Route>
                    <Route element={<AuthRoute />}>
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    </BrowserRouter>
}