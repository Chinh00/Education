import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useCreateRegisterRegistrationPeriod} from "@/app/modules/common/hook.ts";
import {Controller, useForm} from "react-hook-form";
import {RegistrationModel} from "@/app/modules/common/service.ts";
import {Button, Card, DatePicker, Form, Typography} from "antd"
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import FormDatePickerAntd, {viLocale} from "@/app/components/inputs/FormDatePickerAntd.tsx";
import {CardHeader} from "@/app/components/ui/card.tsx";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import dayjs from "dayjs";
import {useParams} from "react-router";
import {Box} from "@mui/material";
import RegisterResult from "@/app/modules/register/components/register_result.tsx";
const StudentRegisterConfig = () => {
    const dispatch = useAppDispatch()
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: ``}));
    }, []);
    const {mutate, isPending} = useCreateRegisterRegistrationPeriod()
    const {semester} = useParams()
    const {data: registers} = useGetRegisters({
        Filters: [
            {
                field: "SemesterCode",
                operator: "==",
                value: semester!
            }
        ]
    }, semester !== undefined)
    
    const register = registers?.data?.data?.items[0]
    
    const {control, reset, getValues, setValue} = useForm<RegistrationModel>({
        defaultValues: {
            semesterCode: semester,
        }
    })

    useEffect(() => {
        if (register) {
            reset({
                studentRegistrationStartDate: dayjs(register?.studentRegisterStart).toISOString(),
                studentRegistrationEndDate: register?.studentRegisterEnd,
            })
        }
    }, [register]);

    
    
    
    
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box className={"flex flex-col gap-5"}>
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
                        <Controller
                            name={"studentRegistrationEndDate"}
                            control={control}
                            render={({ field }) => (
                                <Form.Item label={"Thời gian kết thúc đăng ký"} required rules={[
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
                                        ...getValues(),
                                        studentRegistrationStartDate: dayjs(getValues("studentRegistrationStartDate")).toISOString(),
                                        studentRegistrationEndDate: dayjs(getValues("studentRegistrationEndDate")).toISOString(),
                                    })
                                }}
                        >Lưu lại</Button>
                    </Form>
                </Card>
                <Card>
                    <RegisterResult semesterCode={semester}   />
                </Card>
            </Box>
        </PredataScreen>
    )
}
export default StudentRegisterConfig

