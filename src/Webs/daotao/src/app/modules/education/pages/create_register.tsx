import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Card, CardHeader, CardTitle, CardDescription, CardContent} from "@/app/components/ui/card.tsx";
import {Label} from "@/app/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/components/ui/select.tsx";
import {Input} from "@/app/components/ui/input.tsx";
import {Switch} from "@/app/components/ui/switch.tsx";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import { CreateRegisterStateModel } from "../services/education.service";
import { useForm } from "react-hook-form";
import {Button} from "antd"
import {useCreateRegisterState} from "@/app/modules/education/hooks/useCreateRegisterState.ts";
import toast from "react-hot-toast";
import {sleep} from "@/infrastructure/http.ts";
import {useNavigate} from "react-router";
const CreateRegister = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Cấu hình đăng ký nguyện vọng học"}));
    }, []);
    const {data: semester, isPending, isSuccess} = useGetSemesters({})
    const {mutate, isPending: mutateLoading, reset} = useCreateRegisterState()

    const {control, handleSubmit, setValue} = useForm<CreateRegisterStateModel>({
        defaultValues: {
            startDate: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            minCredit: 10,
            maxCredit: 30,
            semesterName: "",
            semesterCode: ""
        }
    })
    const nav = useNavigate()
    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess}>
            <form onSubmit={handleSubmit(data => {
                mutate({...data}, {
                    onSuccess: async (data) => {
                        toast.success("Tạo mới thành công")
                        await sleep(1000)
                        reset()
                        nav(-1)
                    }
                })
            })} className="space-y-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kỳ đăng ký học hiện tại</CardTitle>
                            <CardDescription>
                                Thiết lập thông tin kỳ đăng ký học
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Học kỳ</Label>
                                    <Select onValueChange={(e) => {
                                        setValue("semesterCode", e)
                                        setValue("semesterName", e)
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn học kỳ" />
                                        </SelectTrigger>
                                        <SelectContent className={""}>
                                            {!!semester && semester?.data?.data?.items?.map(c => {
                                                return (
                                                    <SelectItem
                                                        value={c.semesterCode} key={c.semesterCode}>{c.semesterName}</SelectItem>

                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Trạng thái đăng ký</Label>
                                    <Select defaultValue="active">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="upcoming">Sắp mở</SelectItem>
                                            <SelectItem value="active">Đang mở</SelectItem>
                                            <SelectItem value="closed">Đã đóng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Thời gian bắt đầu</Label>
                                    <FormInputAntd type={"datetime-local"} control={control} name={"startDate"} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Thời gian kết thúc</Label>
                                    <FormInputAntd type={"datetime-local"} control={control} name={"endDate"} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quy định đăng ký</CardTitle>
                            <CardDescription>
                                Thiết lập các quy định cho việc đăng ký học
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Giới hạn số tín chỉ tối đa</Label>
                                    <div className="text-sm text-gray-500">
                                        Số tín chỉ tối đa sinh viên được phép đăng ký
                                    </div>
                                </div>
                                <FormInputAntd className={"w-[100px]"} control={control} name={"minCredit"} type={"number"} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Giới hạn số tín chỉ tối thiểu</Label>
                                    <div className="text-sm text-gray-500">
                                        Số tín chỉ tối thiểu sinh viên phải đăng ký
                                    </div>
                                </div>
                                <FormInputAntd className={"w-[100px]"} control={control} name={"maxCredit"} type={"number"} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Button >Hủy thay đổi</Button>
                        <Button loading={mutateLoading} type={"primary"} className="bg-emerald-500 hover:bg-emerald-600" htmlType={"submit"} >
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </form>
        </PredataScreen>
    )
}

export default CreateRegister