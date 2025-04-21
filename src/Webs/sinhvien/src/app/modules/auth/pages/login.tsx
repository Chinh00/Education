import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {useLogin} from "../hooks/useLogin.ts";
import {Input} from "../../../components/ui/input.tsx";
import {ArrowBigRight} from "lucide-react"
import Button from '@mui/material/Button';
import {useState} from "react";
import {UserLoginModel} from "../interface.ts";
import {useAppDispatch} from "../../../stores/hook.ts";
import {setAuthenticate} from "../../../stores/common_slice.ts";
import LayoutFadeIn from "@/app/components/layouts/layout_fadein.tsx";
import Background from "@/assets/images/image-476.jpeg"
const Login = () => {
  const navigate = useNavigate();
  const {mutate, isPending} = useLogin();
  const dispatch = useAppDispatch();
  // const {  } = useMsal();
  const handleLogin = () => {
    // instance.loginPopup({
    //   scopes: ["openid", "profile", "email"],
    // }).catch((error) => console.error(error)).then( async (data) => {
    //   mutate(data?.idToken!, {
    //     onSuccess: (res) => {
    //       toast.success("Login successful");
    //       navigate("/");
    //     },
    //     onError: (error) => {
    //       toast.error(error.message);
    //     }
    //   })
    // });
    mutate({
      userLoginModel: {
        username: studentCode,
        password: studentCode
      } as UserLoginModel
    } , {
      onSuccess: async (e) => {
        toast.success("Đăng nhập thành công")
        navigate("/");
        dispatch(setAuthenticate(true))
      },
      onError: (err) => {
        toast.error(err.message)
      }
    })
  };
  const [studentCode, setStudentCode] = useState("")
  
  
  return <>
    <LayoutFadeIn>
      <div className={` bg-cover bg-center w-full h-screen z-10`} style={{ backgroundImage: `url(${Background})` }}
      >
        
        <div className={"z-50 absolute md:top-1/5 md:left-3/5 top-1/2 left-1/2 w-11/12 -translate-1/2 md:-translate-0  md:w-[400px] md:h-[450px] bg-white/60 backdrop-blur-sm rounded-xl p-10 "}>
          <div className={"w-full h-full flex justify-start content-center flex-col gap-10"}>
            <div className={"flex flex-col justify-center content-center"}>
              <img src={"icons/tlu_icon.png"} alt={"icon-tlu"}/>
              <div className={"text-center font-bold text-xl"}>TRUỜNG ĐẠI HỌC THUỶ LỢI</div>
              <div className={"text-center text-gray-500 text-xl"}>Cổng thông tin sinh viên</div>
            </div>

            <div className={"flex flex-col gap-2"}>
              <div className={""}>Đăng nhập để sử dụng</div>
              {/*<Button disabled={isPending} className={"w-full bg-blue-600 py-6 cursor-pointer"} onClick={() => {*/}
              {/*  handleLogin()*/}
              {/*}}>*/}
              {/*  {isPending ? <Loader className={"animate-spin"} size={30} /> : <img src={"icons/icons8-microsoft.svg"} alt={"microsoft-icon"} className={"scale-65"} />} */}
              {/*  Đăng nhập với microsoft*/}
              {/*</Button>*/}
              <div className={"flex gap-2"}>
                {!isPending && <Input value={studentCode} onChange={c => setStudentCode(c.target.value)} className={"border-black"} placeholder={"Mã sinh viên"} />}
                <Button fullWidth={isPending} loading={isPending} variant={"contained"} onClick={handleLogin} size={"medium"} className={"cursor-pointer transition-all"}><ArrowBigRight/> </Button>
              </div>
              <div className={" text-red-900 font-bold"}>Quên mật khẩu ?</div>
            </div>
          </div>
        </div>

      </div>
    </LayoutFadeIn>    
  </>
}
export default Login