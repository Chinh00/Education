import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router";
import {lazy, Suspense} from "react";
import { RoutePaths } from "@/core/route_paths.ts";
import LoadingScreen from "../components/screens/loading_screen.tsx";
import ProgressScreen from "../components/screens/progress_screen.tsx";
import TabLoading from "@/app/components/screens/tab_loading.tsx";
import { useAppSelector } from "../stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
const RegisterConfig = lazy(() => import("../modules/register/pages/register_config.tsx"));
const TimelineConfig = lazy(() => import("../modules/register/pages/timeline_config.tsx"));
const Login = lazy(() => import("../modules/auth/pages/login.tsx"));
const Home = lazy(() => import("../modules/home/pages/home.tsx"));
const TrainingEducations = lazy(() => import("../modules/education/pages/training_educations.tsx"));
const RegisterEducation = lazy(() => import("../modules/education/pages/register_education.tsx"));
const DashboardRegister = lazy(() => import("../modules/education/pages/dashboard_register.tsx"));
const CreateRegister = lazy(() => import("../modules/education/pages/create_register.tsx"));
const RegisterDetail = lazy(() => import("../modules/education/pages/register_detail.tsx"));
const TimelineSettings = lazy(() => import("../modules/education/pages/timeline_settings.tsx"));

const SemesterList = lazy(() => import("../modules/education/pages/semester_list.tsx"));

const SubjectList = lazy(() => import("../modules/education/pages/subject_list.tsx"));
const SubjectTimelineDetail = lazy(() => import("../modules/education/pages/subject_timeline_detail.tsx"));
const SubjectTimelineCreate = lazy(() => import("../modules/education/pages/subject_timeline_create.tsx"));




const CLASS = lazy(() => import("../modules/class/pages/class_list.tsx"));
const SEMESTER_CLASS = lazy(() => import("../modules/class/pages/semester_class.tsx"));
const WISH_CONFIG = lazy(() => import("../modules/register/pages/wish_config.tsx"));
const MainLayout = lazy(() => import("../components/layouts/main_layout.tsx"));
const NOTFOUND = lazy(() => import("../modules/system/pages/notfound_page.tsx"));
const EducationLayout = lazy(() => import("../modules/education/layouts/education_layout.tsx"));
const StudentLayout = lazy(() => import("../modules/student/layouts/student_layout.tsx"));
const StudentList = lazy(() => import("../modules/student/pages/student_list.tsx"));
const LoginPage = lazy(() => import("../modules/auth/pages/login.tsx"));


const ProtectedRoute = () => {
    const {authenticate} = useAppSelector<CommonState>(e => e.common)
    return authenticate ? <Outlet/> : <Navigate to={RoutePaths.LOGIN_PAGE}/>
}

const AuthRoute = () => {
    const {authenticate} = useAppSelector(e => e.common)
    return !authenticate ? <Outlet/> : <Navigate to={RoutePaths.HOME_PATH}/>
}


const router = createBrowserRouter([
    {
        path: "",
        element: <ProtectedRoute />,
        children: [
            {
                path: RoutePaths.HOME_PATH,
                element: <Suspense fallback={<ProgressScreen />}  key={"index"} ><MainLayout /></Suspense>,
                children: [
                    {
                        path: "",
                        element: <Suspense  fallback={<ProgressScreen  />} key={"Home"}><Home /></Suspense>,
                    },
                    {
                        path: "",
                        element: <Suspense fallback={<ProgressScreen />} key={"EducationLayout"} ><EducationLayout /></Suspense>,
                        children: [
                            {
                                path: RoutePaths.EDUCATION_TRAINING,
                                element: <Suspense fallback={<TabLoading />} key={"TrainingEducations"} ><TrainingEducations /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER,
                                element: <Suspense fallback={<TabLoading />} key={"RegisterEducation"} ><RegisterEducation /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER_DASHBOARD,
                                element: <Suspense fallback={<TabLoading />} key={"DashboardRegister"} ><DashboardRegister /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER_CONFIG,
                                element: <Suspense fallback={<TabLoading />} key={"CreateRegister"} ><CreateRegister /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER_DETAIL,
                                element: <Suspense fallback={<TabLoading />} key={"RegisterDetail"} ><RegisterDetail /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER_TIMELINE,
                                element: <Suspense fallback={<TabLoading />} key={"TimelineSettings"}><TimelineSettings /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_SEMESTER_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"SemesterList"}><SemesterList /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_SUBJECT_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectList"}><SubjectList /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_SUBJECT_TIMELINE,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectTimelineDetail"}><SubjectTimelineDetail /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_SUBJECT_TIMELINE_CREATE,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectTimelineCreate"}><SubjectTimelineCreate /></Suspense>,
                            },




                        ],
                    },

                    {
                        path: "",
                        element: <Suspense fallback={<ProgressScreen />} key={"StudentLayout"} ><StudentLayout /></Suspense>,
                        children: [
                            {
                                path: RoutePaths.STUDENT_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"StudentList"} ><StudentList /></Suspense>,
                            },
                        ],
                    },
                ],
            }
        ]
    },
    {
        path: "",
        element: <AuthRoute />,
        children: [
            {
                path: RoutePaths.LOGIN_PAGE,
                element: <Suspense fallback={<ProgressScreen />}  key={"LoginPage"}  ><LoginPage /></Suspense>,
            },
        ]
    },
    {
        path: "*",
        element: <Suspense fallback={<ProgressScreen/>}   key={"NOTFOUND"} ><NOTFOUND /></Suspense>,
    },
]);



export const RoutersProvider = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}
