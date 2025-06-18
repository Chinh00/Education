import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router";
import {lazy, Suspense} from "react";
import { RoutePaths } from "@/core/route_paths.ts";
import LoadingScreen from "../components/screens/loading_screen.tsx";
import ProgressScreen from "../components/screens/progress_screen.tsx";
import TabLoading from "@/app/components/screens/tab_loading.tsx";
import { useAppSelector } from "../stores/hook.ts";
import {CommonState} from "@/app/stores/common_slice.ts";
const Home = lazy(() => import("../modules/home/pages/home.tsx"));
const RegisterEducation = lazy(() => import("../modules/education/pages/register_education.tsx"));
const CreateRegister = lazy(() => import("../modules/education/pages/create_register.tsx"));
const RegisterDetail = lazy(() => import("../modules/education/pages/register_detail.tsx"));

const CourseClassDetail = lazy(() => import("../modules/education/pages/courseclass_detail.tsx"));

const SemesterList = lazy(() => import("../modules/education/pages/semester_list.tsx"));
const SemesterCreate = lazy(() => import("../modules/education/pages/semester_create.tsx"));

const SubjectList = lazy(() => import("../modules/subject/pages/subject_list.tsx"));
const SubjectDetail = lazy(() => import("../modules/subject/pages/subject_detail.tsx"));




const MainLayout = lazy(() => import("../components/layouts/main_layout.tsx"));
const EducationLayout = lazy(() => import("../modules/education/layouts/education_layout.tsx"));
const EducationDashboard = lazy(() => import("../modules/education/pages/education_dashboard.tsx"));
const SubjectStudySection = lazy(() => import("../modules/education/pages/subject_study_section.tsx"));
const Course_class_list = lazy(() => import("../modules/education/pages/course_class_list.tsx"));
const RoomList = lazy(() => import("../modules/room/pages/room_list.tsx"));


const RegisterLayout = lazy(() => import("../modules/register/layouts/register_layout.tsx"));
const RegisterTimeline = lazy(() => import("../modules/register/pages/register_timeline.tsx"));
const CourseClassConfig = lazy(() => import("../modules/register/pages/course_class_config.tsx"));
const CreateRegisterPeriod = lazy(() => import("../modules/education/pages/create_register_period.tsx"));
const RegisterPeriodResult = lazy(() => import("../modules/education/pages/register_period_result.tsx"));
const Course_class_section_config = lazy(() => import("../modules/education/pages/course_class_section_config.tsx"));

const NOTFOUND = lazy(() => import("../modules/system/pages/notfound_page.tsx"));
const StudentLayout = lazy(() => import("../modules/student/layouts/student_layout.tsx"));
const StudentList = lazy(() => import("../modules/student/pages/student_list.tsx"));
const LoginPage = lazy(() => import("../modules/auth/pages/login.tsx"));


const TeacherSubjectList = lazy(() => import("../modules/teacher/pages/subject_list.tsx"));
const TeacherTimeline = lazy(() => import("../modules/teacher/pages/teacher_timeline.tsx"));
const TeacherLayout = lazy(() => import("../modules/teacher/layouts/teacher_layout.tsx"));
const DepartmentList = lazy(() => import("../modules/teacher/pages/department_list.tsx"));


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
                                path: RoutePaths.EDUCATION_DASHBOARD,
                                element: <Suspense fallback={<TabLoading />} key={"EducationDashboard"} ><EducationDashboard /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER,
                                element: <Suspense fallback={<TabLoading />} key={"RegisterEducation"} ><RegisterEducation /></Suspense>,
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
                                path: RoutePaths.SEMESTER_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"SemesterList"}><SemesterList /></Suspense>,
                            },
                            {
                                path: RoutePaths.SEMESTER_CREATE,
                                element: <Suspense fallback={<TabLoading />} key={"SemesterCreate"}><SemesterCreate /></Suspense>,
                            },
                            
                            {
                                path: RoutePaths.SUBJECT_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectList"}><SubjectList /></Suspense>,
                            },
                            {
                                path: RoutePaths.SUBJECT_DETAIL,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectDetail"}><SubjectDetail /></Suspense>,
                            },
                            {
                                path: RoutePaths.EDUCATION_REGISTER_COURSE_DETAIL,
                                element: <Suspense fallback={<TabLoading />} key={"CourseClassDetail"}><CourseClassDetail /></Suspense>,
                            },
                            {
                                path: RoutePaths.SUBJECT_STUDY_SECTION,
                                element: <Suspense fallback={<TabLoading />} key={"SubjectStudySection"} ><SubjectStudySection /></Suspense>,
                            },
                            {
                                path: RoutePaths.CREATE_REGISTER_PERIOD,
                                element: <Suspense fallback={<TabLoading />} key={"CreateRegisterPeriod"} ><CreateRegisterPeriod /></Suspense>,
                            },
                            {
                                path: RoutePaths.REGISTER_PERIOD_RESULT,
                                element: <Suspense fallback={<TabLoading />} key={"RegisterPeriodResult"} ><RegisterPeriodResult /></Suspense>,
                            },
                            {
                                path: RoutePaths.COURSE_CLASS_SECTION_CONFIG,
                                element: <Suspense fallback={<TabLoading />} key={"Course_class_section_config"} ><Course_class_section_config /></Suspense>,
                            },
                            {
                                path: RoutePaths.COURSE_CLASS_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"Course_class_list"} ><Course_class_list /></Suspense>,
                            },
                            {
                                path: RoutePaths.ROOM_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"RoomList"} ><RoomList /></Suspense>,
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
                        path: "",
                        element: <Suspense fallback={<ProgressScreen />} key={"RegisterLayout"} ><RegisterLayout /></Suspense>,
                        children: [
                            
                            {
                                path: RoutePaths.REGISTER_SUBJECT,
                                element: <Suspense fallback={<TabLoading />} key={"RegisterTimeline"} ><RegisterTimeline /></Suspense>,
                            },
                            {
                                path: RoutePaths.COURSE_CLASS_CONFIG,
                                element: <Suspense fallback={<TabLoading />} key={"CourseClassConfig"} ><CourseClassConfig /></Suspense>,
                            },
                            
                            


                        ],
                    },

                    {
                        path: "",
                        element: <Suspense fallback={<ProgressScreen />} key={"TeacherLayout"} ><TeacherLayout /></Suspense>,
                        children: [
                            {
                                path: RoutePaths.TEACHER_SUBJECT_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"TeacherSubjectList"} ><TeacherSubjectList /></Suspense>
                            },
                            {
                                path: RoutePaths.TEACHER_TIMELINE,
                                element: <Suspense fallback={<TabLoading />} key={"TeacherTimeline"} ><TeacherTimeline /></Suspense>
                            },
                            {
                                path: RoutePaths.DEPARTMENT_LIST,
                                element: <Suspense fallback={<TabLoading />} key={"DepartmentList"} ><DepartmentList /></Suspense>
                            },
                            
                            
                        ],
                    }
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
