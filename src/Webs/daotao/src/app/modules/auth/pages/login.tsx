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

const Login = () => {
  const {control, reset, getValues} = useForm<AuthLoginModel>({
    defaultValues: {
      username: "",
      password: ""
    }
  })
  const {mutate, isPending} = useLogin()

  const nav = useNavigate()

  useEffect(() => {
    return () => reset()
  }, []);
  return <PredataScreen isSuccess={true} isLoading={false}>
      <Box className={"flex justify-center items-center w-full h-screen"}>
          <Form layout={"vertical"} className={"w-[350px] border-2 rounded-md p-5"} style={{padding: "20px"}}>
              <FormInputAntd control={control} name={"username"} initialValue={""} label={"Tên đăng nhập"} />
              <FormInputAntd control={control} name={"password"} initialValue={""} label={"Mật khẩu"}/>
              <Button type={"primary"} className={"w-full"} onClick={() => {
                mutate({
                  userLoginModel: getValues()
                }, {
                  onSuccess: () => {
                    toast.success("Đăng nhập thành công")
                    nav("/")
                  }
                })
              }} loading={isPending}>Đăng nhập</Button>
          </Form>
      </Box>
  </PredataScreen>
}

export default Login