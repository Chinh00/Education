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
import {Button, Form} from "antd"
import {useCreateRegisterState} from "@/app/modules/education/hooks/useCreateRegisterState.ts";
import toast from "react-hot-toast";
import {sleep} from "@/infrastructure/http.ts";
import {useNavigate} from "react-router";
import FormDatePickerAntd from "@/app/components/inputs/FormDatePickerAntd.tsx";
import dayjs from "dayjs";
const CreateRegister = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Cấu hình đăng ký nguyện vọng học"}));
    }, []);

    const {data: semester, isPending, isSuccess} = useGetSemesters({
        Filters: [
            {
                field: "ParentSemesterCode",
                operator: "==",
                value: ""
            },
            {
                field: "SemesterStatus",
                operator: "==",
                value: "0"
            },
            
        ],
        Sorts: ["IdDesc"]
    })
    const {mutate, isPending: mutateLoading, reset} = useCreateRegisterState()

    const {control, handleSubmit, setValue, getValues} = useForm<CreateRegisterStateModel>({
        defaultValues: {
            wishStartDate: new Date().toISOString().slice(0, 16),
            wishEndDate: new Date().toISOString().slice(0, 16),
            minCredit: 10,
            maxCredit: 30,
            semesterCode: ""
        }
    })
    const nav = useNavigate()
    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess}>
            <Form onFinish={() => {
                mutate({...getValues(),
                    wishStartDate: dayjs(getValues("wishStartDate")).toISOString(),
                    wishEndDate: dayjs(getValues("wishEndDate")).toISOString(),
                }, {
                    onSuccess: async (data) => {
                        toast.success("Tạo mới thành công")
                        reset()
                    }
                })
            }} className="space-y-6">
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
                                <div className="space-y-2 flex justify-center items-center gap-3">
                                    <Label className={"whitespace-nowrap"}>Học kỳ</Label>
                                    <Select onValueChange={(e) => {
                                        setValue("semesterCode", e)
                                    }}
                                    >
                                        <SelectTrigger className={"w-full"}>
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

                                
                                <div></div>

                                <FormDatePickerAntd  control={control} name={"wishStartDate"} label={"Thời gian bắt đầu đăng ký nguyện vọng"} />
                                <FormDatePickerAntd  control={control} name={"wishEndDate"} label={"Thời gian kết thúc đăng ký nguyện vọng"}  />

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
                                <FormInputAntd initialValue={10} className={"w-[100px]"} control={control} name={"minCredit"} type={"number"} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Giới hạn số tín chỉ tối thiểu</Label>
                                    <div className="text-sm text-gray-500">
                                        Số tín chỉ tối thiểu sinh viên phải đăng ký
                                    </div>
                                </div>
                                <FormInputAntd className={"w-[100px]"} initialValue={30} control={control} name={"maxCredit"} type={"number"} />
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
            </Form>
        </PredataScreen>
    )
}

export default CreateRegister