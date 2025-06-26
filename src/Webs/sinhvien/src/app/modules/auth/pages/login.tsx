import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useLogin, useLoginMicrosoft } from "../hooks/useLogin.ts";
import { Input } from "../../../components/ui/input.tsx";
import { ArrowBigRight, Loader } from "lucide-react"
import Button from '@mui/material/Button';
import { useState } from "react";
import { UserLoginModel } from "../interface.ts";
import { useAppDispatch } from "../../../stores/hook.ts";
import { setAuthenticate } from "../../../stores/common_slice.ts";
import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import Background from "@/assets/images/image-476.jpeg"
import TluIcon from "@/assets/icons/tlu_icon.png"
import { msalInstance } from "@/cores/msalConfig.ts";
import MicrosoftIcon from "@/assets/icons/icons8-microsoft.svg"
import {motion} from "framer-motion";
const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();
  const { mutate: loginMicrosoft, isPending: loginMicrosoftLoading } = useLoginMicrosoft()
  const dispatch = useAppDispatch();
  // const {  } = useMsal();
  const handleLogin = () => {
    msalInstance.loginPopup({
      scopes: ["openid", "profile", "email"],
    }).catch((error) => console.error(error)).then(async (data) => {
      console.log(data?.idToken)
      loginMicrosoft(data?.idToken!, {
        onSuccess: (res) => {
          toast.success("Login successful");
          dispatch(setAuthenticate(true))
          navigate("/");
        },
        onError: (error) => {
          toast.error("Bạn đã hủy đăng nhập");
        }
      })
    });
  };
  const handleLoginStudentCode = () => {

    mutate({
      userLoginModel: {
        username: studentCode,
        password: studentCode
      } as UserLoginModel
    }, {
      onSuccess: async (e) => {
        toast.success("Đăng nhập thành công")
        navigate("/");
        dispatch(setAuthenticate(true))
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })

  }
  const [studentCode, setStudentCode] = useState("")
  const [loginType, setLoginType] = useState(0)

  return <>
    <LayoutFadeIn>
      <div className={`fixed bg-cover bg-center w-full h-screen z-10`} style={{ backgroundImage: `url(${Background})`, backgroundPosition: "center" }}
      >

        <div className={"z-50 absolute md:top-1/5 md:left-3/5 top-1/2 left-1/2 w-11/12 -translate-1/2 md:-translate-0 shadow-xl  md:w-[400px] md:h-[450px] bg-white/65 backdrop-blur-sm rounded-xl p-10 "}>
          <div className={"w-full h-full flex justify-start content-center flex-col gap-10"}>
            <div className={"flex flex-col justify-center content-center"}>
              <img src={TluIcon} alt={"icon-tlu"} />
              <div className={"text-center font-bold text-xl"}>TRUỜNG ĐẠI HỌC THUỶ LỢI</div>
              <div className={"text-center text-gray-500 text-xl"}>Cổng thông tin sinh viên</div>
            </div>

            <div className={"flex flex-col gap-2"}>
              <div className={"text-center"}>Đăng nhập để sử dụng</div>
              <motion.div
                  whileHover={{
                    scale: 1.05, // phóng to nhẹ
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)", // đổ bóng
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                    sx={{ textTransform: "none" }}
                    disabled={isPending}
                    className="w-full text-blue-500 bg-blue-600 py-6 cursor-pointer font-bold"
                    onClick={() => {
                      handleLogin();
                    }}
                >
                  {isPending ? (
                      <Loader className="animate-spin" size={30} />
                  ) : (
                      <img src={MicrosoftIcon} alt="microsoft-icon" className="scale-65" />
                  )}
                  Đăng nhập với microsoft
                </Button>
              </motion.div>
              

              
            </div>
          </div>
        </div>

      </div>
    </LayoutFadeIn>
  </>
}
export default Login
