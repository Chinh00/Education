import {BrowserRouter, Route, Routes} from "react-router";
import {lazy, Suspense} from "react";
import IndexLayout from "../components/layouts/index_layout.tsx";
import MainLayout from "../components/layouts/main_layout.tsx";
import { RoutePaths } from "../../core/route_paths.ts";
import LoadingScreen from "../components/screens/loading_screen.tsx";
const RegisterConfig = lazy(() => import("../modules/register/pages/register_config.tsx"));
const TimelineConfig = lazy(() => import("../modules/register/pages/timeline_config.tsx"));
const Login = lazy(() => import("../modules/auth/pages/login.tsx"));
const Home = lazy(() => import("../modules/home/pages/home.tsx"));
const Education = lazy(() => import("../modules/education/pages/education_list.tsx"));
const CLASS = lazy(() => import("../modules/class/pages/class_list.tsx"));
const WISH_CONFIG = lazy(() => import("../modules/register/pages/wish_config.tsx"));




export const RoutersProvider = () => {
    return <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                <Route element={<IndexLayout />}>
                    <Route path={"/"} element={<MainLayout />}>
                        <Route path={RoutePaths.HOME_PATH} element={<Home />} />
                        <Route path={RoutePaths.REGISTER_CONFIG_PATH} element={<RegisterConfig />} />
                        <Route path={RoutePaths.REGISTER_TIMELINE_PATH} element={<TimelineConfig />} />
                        <Route path={RoutePaths.EDUCATION_LIST} element={<Education />} />
                        <Route path={RoutePaths.CLASS_LIST} element={<CLASS />} />
                        <Route path={RoutePaths.WISH_CONFIG} element={<WISH_CONFIG />} />
                    </Route>
                    <Route path="/login" element={<Login />} />
                </Route>
            </Routes>
        </Suspense>
    </BrowserRouter>
}