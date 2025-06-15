import { CardHeader } from "@/app/components/ui/card";
import RegisterResult from "@/app/modules/register/components/register_result.tsx";
import {Button, Card, DatePicker, Form, Typography} from "antd";
import {Controller, useForm} from "react-hook-form";
import {RegistrationModel} from "@/app/modules/common/service.ts";
import FormDatePickerAntd, {viLocale} from "@/app/components/inputs/FormDatePickerAntd.tsx";
import dayjs from "dayjs";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useCreateRegisterRegistrationPeriod} from "@/app/modules/common/hook.ts";
import toast from "react-hot-toast";
import {useEffect} from "react";

const Create_register_period = () => {
    const {data: semesters} = useGetSemesters({
        Filters: [
            {
                field: "SemesterStatus",
                operator: "==",
                value: "1"
            }
        ]
    })
    const getParentSemester = semesters?.data?.data?.items?.find(t =>  t.parentSemesterCode === null)
    const {data: registers} = useGetRegisters({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: getParentSemester?.semesterCode!
            }
        ]
    }, getParentSemester !== undefined)
    
    
    const registerOfSemester = registers?.data?.data?.items?.find(t => t.semesterCode === getParentSemester?.semesterCode);
    const {control, reset, getValues, setValue} = useForm<RegistrationModel>({
        defaultValues: {
            semesterCode: getParentSemester?.semesterCode!,
        }
    })
    const {mutate, isPending} = useCreateRegisterRegistrationPeriod()

    useEffect(() => {
        if (registerOfSemester) 
            reset({
                studentRegistrationStartDate: dayjs(registerOfSemester.studentRegisterStart).toISOString(),
                studentRegistrationEndDate: dayjs(registerOfSemester.studentRegisterEnd).toISOString(),
                semesterCode: getParentSemester?.semesterCode!
            });
    }, [registerOfSemester]);
    console.log(registerOfSemester)

    return (
        <>
            <Card>
                <CardHeader>
                    <Typography.Title level={4} className={"text-center"}>Cấu hình thời gian đăng ký học phần cho sinh viên</Typography.Title>
                </CardHeader>
                <Form>
                    <Controller
                        name={"studentRegistrationStartDate"}
                        control={control}
                        render={({ field }) => (
                            <Form.Item label={"Thời gian bắt đầu đăng ký"} required rules={[
                                {
                                    required: true,
                                    message: "Thời gian bắt đầu đăng ký không được để trống"
                                }
                            ]}
                                initialValue={registerOfSemester?.studentRegisterStart}
                            >
                                <DatePicker
                                    showTime
                                    locale={viLocale}
                                    value={dayjs(field?.value)}
                                    style={{
                                        width: '100%',
                                    }}
                                    placement={"bottomLeft"}
                                    onChange={e => field.onChange(e)}
                                />
                            </Form.Item>
                        )}
                    />
                    <Controller
                        name={"studentRegistrationEndDate"}
                        control={control}
                        render={({ field }) => (
                            <Form.Item 
                                    initialValue={registerOfSemester?.studentRegisterEnd}
                                label={"Thời gian kết thúc đăng ký"} required rules={[
                                {
                                    required: true,
                                    message: "Thời gian kết thúc đăng ký không được để trống"
                                }
                            ]}>
                                <DatePicker
                                    showTime
                                    locale={viLocale}
                                    value={dayjs(field?.value)}
                                    style={{
                                        width: '100%',
                                    }}
                                    placement={"bottomLeft"}
                                    onChange={e => field.onChange(e)}
                                />
                            </Form.Item>
                        )}
                    />
                    <Button type={"primary"} loading={isPending}
                            onClick={() => {
                                mutate({
                                    semesterCode: getParentSemester?.semesterCode!,
                                    studentRegistrationStartDate: dayjs(getValues("studentRegistrationStartDate")).toISOString(),
                                    studentRegistrationEndDate: dayjs(getValues("studentRegistrationEndDate")).toISOString(),
                                }, {
                                    onSuccess: () => {
                                        toast.success("Cập nhật thời gian đăng ký học phần thành công");
                                    }
                                })
                            }}
                    >Lưu lại</Button>
                </Form>
            </Card>
        </>
    )
}
export default Create_register_period;