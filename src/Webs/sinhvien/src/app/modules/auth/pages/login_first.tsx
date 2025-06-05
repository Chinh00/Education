import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,

} from "@/app/components/ui/card"
import { Alert, AlertDescription, AlertTitle, } from "@/app/components/ui/alert"
import { School, AlertCircle, Database, LogOut } from "lucide-react";
import { Tooltip, Button, Spin } from "antd";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setAuthenticate} from "@/app/stores/common_slice.ts";
import { useSyncDataFromDataProvider } from "@/app/modules/student/hooks/useSyncDataFromDataProvider.ts";
import toast from "react-hot-toast";
import useGetStudentInformation from "../../student/hooks/useGetStudentInformation";
import {useEffect, useReducer, useRef} from "react";
import {data, Navigate, useNavigate} from "react-router";
import { RoutePaths } from "@/cores/route_paths";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { useLogin } from "../hooks/useLogin";
import {UserLoginModel} from "@/app/modules/auth/interface.ts";

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const LoginFirst = () => {
  const dispatch = useAppDispatch();
  const { mutate, isPending } = useSyncDataFromDataProvider()
  const { data: userInfo } = useGetUserInfo()
  const { mutate: reLogin, isPending: reLoginPending, isSuccess: reLoginSuccess } = useLogin();
  const nav = useNavigate()
  useEffect(() => {
    if (reLoginSuccess) {
      const doRedirect = async () => {
        await delay(3000);
        nav(RoutePaths.HOME);
      };

      doRedirect();
    }
  }, [reLoginSuccess]);

  
  return (
    <div className={"w-full h-full flex justify-center items-center pt-16"}>
      
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <div className={"flex justify-between items-center"}>
            <div className="flex items-center gap-2">
              <School className="h-6 w-6 text-blue-600" />
              <CardTitle className="text-2xl">Chuyển dữ liệu hệ thống</CardTitle>
            </div>
            <Tooltip title={"Đăng xuất"} className={"cursor-pointer"}>
              <Button onClick={() => dispatch(setAuthenticate(false))}  ><LogOut size={18} /></Button>
            </Tooltip>
          </div>
          <CardDescription>Xác nhận chuyển dữ liệu từ hệ thống cũ sang hệ thống mới</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Lưu ý quan trọng</AlertTitle>
            <AlertDescription className="text-amber-700">
              Bằng việc nhấn xác nhận chuyển dữ liệu, bạn đã đồng ý chuyển dữ liệu cũ của bạn sang hệ thống của chúng tôi.
            </AlertDescription>
          </Alert>

          <div className="rounded-md border p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dữ liệu sẽ được chuyển
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-700 text-xs">1</span>
                </div>
                <div>
                  <span className="font-medium">Thông tin cá nhân</span>
                  <p className="text-muted-foreground">Họ tên, ngày sinh, địa chỉ, số điện thoại</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-700 text-xs">2</span>
                </div>
                <div>
                  <span className="font-medium">Dữ liệu học tập</span>
                  <p className="text-muted-foreground">Điểm số, kết quả học tập, thành tích</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-700 text-xs">3</span>
                </div>
                <div>
                  <span className="font-medium">Hoạt động ngoại khóa</span>
                  <p className="text-muted-foreground">Các hoạt động, câu lạc bộ, sự kiện đã tham gia</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full h-5 w-5 bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-blue-700 text-xs">4</span>
                </div>
                <div>
                  <span className="font-medium">Tài liệu và bài tập</span>
                  <p className="text-muted-foreground">Tài liệu học tập, bài tập đã nộp</p>
                </div>
              </li>
            </ul>
          </div>

        </CardContent>

        <CardFooter>
          {/*{!isConfirmed ? (*/}
          {/*    */}
          {/*) : (*/}
          {/*    <Button className="w-full" onClick={() => (window.location.href = "/dashboard")}>*/}
          {/*        Đi đến trang chủ*/}
          {/*    </Button>*/}
          {/*)}*/}
          <Button type="primary" loading={isPending} className="w-full" onClick={() => {
            mutate(undefined, {
              onSuccess: () => {
                reLogin({
                  userLoginModel: {
                    username: userInfo?.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    password: userInfo?.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
                  } as UserLoginModel
                }, {
                  onSuccess: async (e) => {
                    toast.success("Dữ liệu đã được đồng bộ thành công ")
                    
                  },
                  onError: (err) => {
                    toast.error(err.message)
                  }
                })
              }
            })
          }}>
            Xác nhận chuyển dữ liệu
          </Button>
        </CardFooter>
      </Card>

    </div>
  )
}

export default LoginFirst;
