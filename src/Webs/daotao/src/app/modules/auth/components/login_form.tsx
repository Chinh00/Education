import {useForm} from "react-hook-form";
import {AuthLoginModel} from "@/app/modules/auth/services/auth.service.ts";
import {useLogin} from "@/app/modules/auth/hooks/useLogin.ts";
import {useNavigate} from "react-router";
import {useAppDispatch} from "@/app/stores/hook.ts";
import {useEffect, useState} from "react";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/app/components/ui/form.tsx"
import {Input} from "@/app/components/ui/input"
import {Button} from "@/app/components/ui/button"
import {EyeIcon, EyeOffIcon, Loader2} from "lucide-react";
import {motion} from "framer-motion"
import toast from "react-hot-toast";
import {setAuthenticate} from "@/app/stores/common_slice.ts";
import {RoutePaths} from "@/core/route_paths.ts";
const LoginForm = () => {
    const form = useForm<AuthLoginModel>({
        defaultValues: {
            username: "",
            password: ""
        }
    })
    const {mutate, isPending} = useLogin()
    const [showPassword, setShowPassword] = useState(false)
    const nav = useNavigate()
    const dispatch = useAppDispatch()
    useEffect(() => {
        return () => form.reset()
    }, []);
    return (
        <>
            <Form {...form}>
                <div className="space-y-5">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-white">Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        <Input
                                            placeholder="Nhập tên đăng nhập hoặc mã số"
                                            className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus:border-white/30"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-200" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-white">Mật khẩu</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Nhập mật khẩu"
                                            className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus:border-white/30"
                                            {...field}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 text-white hover:bg-transparent hover:text-white/80"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-xs text-red-200" />
                            </FormItem>
                        )}
                    />
                    <div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                                disabled={isPending}
                                onClick={() => {
                                    mutate({
                                        userLoginModel: form.getValues()
                                    }, {
                                        onSuccess: () => {
                                            toast.success("Đăng nhập thành công")
                                            dispatch(setAuthenticate(true))
                                            nav(RoutePaths.HOME_PATH)
                                        },
                                        onError: () => {
                                            toast.error("Tài khoản hoặc mật khẩu không chính xác")
                                        }
                                    })
                                }}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    "Đăng nhập"
                                )}
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </Form>
        </>
    )
}
export default LoginForm