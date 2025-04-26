import {createBrowserRouter, RouterProvider} from "react-router";
import {lazy, Suspense} from "react";
import { RoutePaths } from "@/core/route_paths.ts";
import LoadingScreen from "../components/screens/loading_screen.tsx";
import ProgressScreen from "../components/screens/progress_screen.tsx";
import TabLoading from "@/app/components/screens/tab_loading.tsx";
const RegisterConfig = lazy(() => import("../modules/register/pages/register_config.tsx"));
const TimelineConfig = lazy(() => import("../modules/register/pages/timeline_config.tsx"));
const Login = lazy(() => import("../modules/auth/pages/login.tsx"));
const Home = lazy(() => import("../modules/home/pages/home.tsx"));
const TrainingEducations = lazy(() => import("../modules/education/pages/training_educations.tsx"));
const RegisterEducation = lazy(() => import("../modules/education/pages/register_education.tsx"));
const DashboardRegister = lazy(() => import("../modules/education/pages/dashboard_register.tsx"));
const CreateRegister = lazy(() => import("../modules/education/pages/create_register.tsx"));
const CLASS = lazy(() => import("../modules/class/pages/class_list.tsx"));
const SEMESTER_CLASS = lazy(() => import("../modules/class/pages/semester_class.tsx"));
const WISH_CONFIG = lazy(() => import("../modules/register/pages/wish_config.tsx"));
const SEMESTER = lazy(() => import("../modules/semester/pages/semester_list.tsx"));
const MainLayout = lazy(() => import("../components/layouts/main_layout.tsx"));
const NOTFOUND = lazy(() => import("../modules/system/pages/notfound_page.tsx"));
const EducationLayout = lazy(() => import("../modules/education/layouts/education_layout.tsx"));
const StudentLayout = lazy(() => import("../modules/student/layouts/student_layout.tsx"));
const StudentList = lazy(() => import("../modules/student/pages/student_list.tsx"));

const router = createBrowserRouter([
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







            {
                path: RoutePaths.REGISTER_TIMELINE_PATH,
                element: <Suspense  fallback={<ProgressScreen  />} key={"TimelineConfig"} ><TimelineConfig /></Suspense>,
            },
            {
                path: RoutePaths.CLASS_LIST,
                element: <Suspense  fallback={<ProgressScreen />}  key={"CLASS"} ><CLASS /></Suspense>,
            },
            {
                path: RoutePaths.CLASS_SEMESTER_LIST,
                element: <Suspense  fallback={<ProgressScreen  />} key={"SEMESTER_CLASS"}><SEMESTER_CLASS /></Suspense>,
            },
            {
                path: RoutePaths.WISH_CONFIG,
                element: <Suspense  fallback={<ProgressScreen />}  key={"WISH_CONFIG"}><WISH_CONFIG /></Suspense>,
            },
            {
                path: RoutePaths.REGISTER_CONFIG_PATH,
                element: <Suspense fallback={<ProgressScreen />}  key={"RegisterConfig"}  ><RegisterConfig /></Suspense>,
            },
            {
                path: RoutePaths.SEMESTER_LIST,
                element: <Suspense fallback={<ProgressScreen/>}   key={"SEMESTER"} ><SEMESTER /></Suspense>,
            },
            {
                path: "*",
                element: <Suspense fallback={<ProgressScreen/>}   key={"NOTFOUND"} ><NOTFOUND /></Suspense>,
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
