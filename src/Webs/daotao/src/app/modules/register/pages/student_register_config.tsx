import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useCreateRegisterRegistrationPeriod} from "@/app/modules/common/hook.ts";
import {useForm} from "react-hook-form";
import {RegistrationModel} from "@/app/modules/common/service.ts";
import {Button, Card, Form, Typography} from "antd"
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import FormDatePickerAntd from "@/app/components/inputs/FormDatePickerAntd.tsx";
import {CardHeader} from "@/app/components/ui/card.tsx";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import dayjs from "dayjs";
import {useParams} from "react-router";
const StudentRegisterConfig = () => {
    const dispatch = useAppDispatch()
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: ``}));
    }, []);
    const {mutate, isPending} = useCreateRegisterRegistrationPeriod()
    const {semester} = useParams()
    
    const {control, reset, getValues, setValue} = useForm<RegistrationModel>({
        defaultValues: {
            semesterCode: semester,
            studentRegistrationStartDate: (new Date()).toISOString(),
            studentRegistrationEndDate: new Date().toString(),
        }
    })

    
    
    
    
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Card>
                <CardHeader>
                    <Typography.Title level={4} className={"text-center"}>Cấu hình thời gian đăng ký học phần cho sinh viên</Typography.Title>
                </CardHeader>
                <Form>
                    <FormDatePickerAntd control={control} name={"studentRegistrationStartDate"} label={"Thời gian bắt đầu đăng ký"} />
                    <FormDatePickerAntd control={control} name={"studentRegistrationEndDate"} label={"Thời gian bắt đầu đăng ký"} />
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
        </PredataScreen>
    )
}
export default StudentRegisterConfig

