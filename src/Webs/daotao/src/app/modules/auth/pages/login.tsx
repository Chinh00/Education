import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useForm} from "react-hook-form";
import {AuthLoginModel} from "@/app/modules/auth/services/auth.service.ts";
import {useEffect} from "react";
import {Button, Form} from "antd";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import { useLogin } from "../hooks/useLogin";
import toast from "react-hot-toast";
import {useNavigate} from "react-router";
import {useAppDispatch} from "@/app/stores/hook.ts";
import {setAuthenticate} from "@/app/stores/common_slice.ts";
import {motion} from "framer-motion"
import Background from "@/asssets/images/image-476.jpeg"
import LoginForm from "../components/login_form";

const Login = () => {

  return <PredataScreen isSuccess={true} isLoading={false}>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
              <img
                  src={Background}
                  alt="Trường đại học"
                  className="h-full w-full object-cover opacity-80"
              />
          </div>

          {/* Hiệu ứng ánh sáng */}
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px]" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-[80px]" />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-purple-900/70" />

          {/* Hiệu ứng particle */}
          <div className="absolute inset-0 z-0 opacity-30">
              <div className="stars-container">
                  <div className="stars"></div>
                  <div className="stars2"></div>
                  <div className="stars3"></div>
              </div>
          </div>


          {/* Container chính */}
          <div className="relative z-10 flex w-full max-w-6xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
              <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
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
                  <p className="mx-auto mt-6 max-w-2xl text-xl text-white/90 drop-shadow">
                      Nền tảng giáo dục toàn diện cho thế hệ mới
                  </p>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-12 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                  <div className="mb-8 text-center">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/40 to-purple-600/40 p-4 backdrop-blur-md shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-10 w-10 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                          </svg>
                      </div>
                      {/*<h3 className="mt-6  text-3xl font-bold text-white">Đăng nhập</h3>*/}
                      <p className="mt-2 font-bold text-white/80">Đăng nhập để sử dụng</p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                      {/*<motion.button*/}
                      {/*    whileHover={{ scale: 1.05 }}*/}
                      {/*    whileTap={{ scale: 0.95 }}*/}
                      {/*    type="button"*/}
                      {/*    className="group flex items-center justify-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-sm font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"*/}
                      {/*>*/}
                      {/*    <svg*/}
                      {/*        xmlns="http://www.w3.org/2000/svg"*/}
                      {/*        className="h-5 w-5 text-white"*/}
                      {/*        fill="none"*/}
                      {/*        viewBox="0 0 24 24"*/}
                      {/*        stroke="currentColor"*/}
                      {/*    >*/}
                      {/*        <path*/}
                      {/*            strokeLinecap="round"*/}
                      {/*            strokeLinejoin="round"*/}
                      {/*            strokeWidth={2}*/}
                      {/*            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"*/}
                      {/*        />*/}
                      {/*    </svg>*/}
                      {/*    <span>Học sinh</span>*/}
                      {/*</motion.button>*/}
                      <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
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
                          <span>Giáo viên</span>
                      </motion.button>
                      <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
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
                  </div>

                  <LoginForm />

                  {/*<div className="mt-3 text-center text-sm text-white/80">*/}
                  {/*    <p>*/}
                  {/*        Bằng việc đăng nhập, bạn đồng ý với{" "}*/}
                  {/*        <a href="#" className="font-medium text-blue-300 hover:text-blue-200">*/}
                  {/*            Điều khoản sử dụng*/}
                  {/*        </a>{" "}*/}
                  {/*        và{" "}*/}
                  {/*        <a href="#" className="font-medium text-blue-300 hover:text-blue-200">*/}
                  {/*            Chính sách bảo mật*/}
                  {/*        </a>*/}
                  {/*    </p>*/}
                  {/*</div>*/}
              </motion.div>

              {/* Tính năng */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4"
              >
                  <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10">
                      <div className="rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-500/30 p-3 shadow-lg transition-all group-hover:shadow-blue-500/20">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
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
                      </div>
                      <h3 className="text-center text-lg font-medium text-white">Học tập an toàn</h3>
                      <p className="text-center text-sm text-white/70">Bảo vệ dữ liệu và quyền riêng tư của học sinh</p>
                  </div>

                  <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10">
                      <div className="rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 p-3 shadow-lg transition-all group-hover:shadow-purple-500/20">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                              />
                          </svg>
                      </div>
                      <h3 className="text-center text-lg font-medium text-white">Học tập cá nhân hóa</h3>
                      <p className="text-center text-sm text-white/70">Trải nghiệm học tập phù hợp với từng học sinh</p>
                  </div>

                  <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10">
                      <div className="rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 p-3 shadow-lg transition-all group-hover:shadow-cyan-500/20">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                          </svg>
                      </div>
                      <h3 className="text-center text-lg font-medium text-white">Quản lý hiệu quả</h3>
                      <p className="text-center text-sm text-white/70">Theo dõi và đánh giá tiến độ học tập dễ dàng</p>
                  </div>

                  <div className="group flex flex-col items-center space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-all hover:bg-white/10">
                      <div className="rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/30 p-3 shadow-lg transition-all group-hover:shadow-amber-500/20">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                              />
                          </svg>
                      </div>
                      <h3 className="text-center text-lg font-medium text-white">Kết nối cộng đồng</h3>
                      <p className="text-center text-sm text-white/70">Tạo môi trường giao tiếp giữa giáo viên và học sinh</p>
                  </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-16 text-center text-sm text-white/60"
              >
                  <p>&copy; {new Date().getFullYear()} Học Vấn Tương Lai. Tất cả các quyền được bảo lưu.</p>
              </motion.div>
          </div>
      </div>

  </PredataScreen>
}

export default Login