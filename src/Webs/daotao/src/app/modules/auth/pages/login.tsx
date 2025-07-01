import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { motion } from "framer-motion";
import Background from "@/asssets/images/image-476.jpeg";
import LoginForm from "../components/login_form";
import { msalInstance } from "@/core/msalConfig.ts";
import toast from "react-hot-toast";
import { useLoginMicrosoft } from "@/app/modules/auth/hooks/useLogin.ts";
import { useAppDispatch } from "@/app/stores/hook.ts";
import { setAuthenticate } from "@/app/stores/common_slice.ts";
import { useNavigate } from "react-router";
import { Loader } from "lucide-react";
import MicrosoftIcon from "@/asssets/icons/icons8-microsoft-48.png";

const Login = () => {
    const { mutate: loginMicrosoft, isPending: loginMicrosoftLoading } = useLoginMicrosoft();
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const handleLogin = () => {
        msalInstance
            .loginPopup({
                scopes: ["openid", "profile", "email"],
            })
            .catch((error) => console.error(error))
            .then(async (data) => {
                console.log(data?.idToken);
                loginMicrosoft(data?.idToken!, {
                    onSuccess: (res) => {
                        toast.success("Login successful");
                        dispatch(setAuthenticate(true));
                        nav("/");
                    },
                    onError: (error) => {
                        toast.error("Bạn đã hủy đăng nhập");
                    },
                });
            });
    };

    return (
        <PredataScreen isSuccess={true} isLoading={false}>
            <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src={Background}
                        alt="Trường đại học"
                        className="h-full w-full object-cover opacity-80"
                    />
                </div>

                {/* Hiệu ứng ánh sáng */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                    className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.5, type: "spring" }}
                    className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.4, delay: 0.7, type: "spring" }}
                    className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.6, delay: 0.9, type: "spring" }}
                    className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-[80px]"
                />

                {/* Overlay gradient */}
                {/*<motion.div*/}
                {/*    initial={{ opacity: 0 }}*/}
                {/*    animate={{ opacity: 1 }}*/}
                {/*    transition={{ duration: 1.5, delay: 0.3 }}*/}
                {/*    className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/70"*/}
                {/*/>*/}

                {/* Hiệu ứng particle */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="stars-container">
                        <div className="stars"></div>
                        <div className="stars2"></div>
                        <div className="stars3"></div>
                    </div>
                </motion.div>

                {/* Container chính */}
                <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
                        className="text-center z-50"
                    >
                        <h2 className=" text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-5xl">
                            <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                Chào mừng đến với
                            </span>
                            <span className="mt-2 block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                hệ thống quản lý giáo dục
                            </span>
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                            className="mx-auto mt-6 max-w-2xl text-xl text-white/90 drop-shadow"
                        >
                            Nền tảng giáo dục toàn diện cho thế hệ mới
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6, type: "spring" }}
                        className="mt-12 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 1 }}
                            className="mb-8 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 180, delay: 1.1 }}
                                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/40 to-purple-600/40 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.2, delay: 1.2 }}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                            </motion.div>
                            <p className="mt-2 font-bold text-white/80">Đăng nhập để sử dụng</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            className="mb-4 grid grid-cols-2 gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.08, boxShadow: "0 4px 24px 0 rgba(59,130,246,0.18)" }}
                                whileTap={{ scale: 0.96 }}
                                type="button"
                                className="group flex items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                                <span>Giảng viên</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.08, boxShadow: "0 4px 24px 0 rgba(139,92,246,0.18)" }}
                                whileTap={{ scale: 0.96 }}
                                type="button"
                                className="group flex items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                <span>Quản trị</span>
                            </motion.button>
                        </motion.div>

                        <motion.button
                            whileHover={{
                                scale: 1.06,
                                boxShadow: "0 0 32px 0 rgba(37,99,235,0.16)",
                                background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                                color: "#000000",
                            }}
                            className={"rounded-xs"}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 340, damping: 18 }}
                            disabled={loginMicrosoftLoading}
                            onClick={handleLogin}
                            style={{
                                letterSpacing: 0.4,
                                padding: 10,
                                width: "100%",
                            }}
                        >
                            <span className="flex items-center justify-center">
                                <motion.img
                                    src={MicrosoftIcon}
                                    alt="Microsoft"
                                    className="w-5 h-5 mr-2"
                                    initial={{ rotate: 0, scale: 1 }}
                                    whileHover={{ rotate: 8, scale: 1.15 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                                    style={{ filter: loginMicrosoftLoading ? "grayscale(0.7)" : "" }}
                                />
                                <span className={"text-white"}>
                                    Đăng nhập với Microsoft
                                </span>
                                {loginMicrosoftLoading && (
                                    <span className="ml-2">
                                        <Loader className="animate-spin text-white" size={20} />
                                    </span>
                                )}
                            </span>
                        </motion.button>
                    </motion.div>

                    

                    
                </div>
            </div>
        </PredataScreen>
    );
};

export default Login;