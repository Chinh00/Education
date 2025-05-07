import {useEffect, useState} from "react";
import {BadgeCheck, Loader, Plus} from "lucide-react";
import {Box, Typography} from "@mui/material";
import useCreateSemester from "@/app/modules/education/hooks/useCreateSemester.ts";
import {CreateSemesterModel} from "@/app/modules/education/services/semester.service.ts";
import {useForm} from "react-hook-form";
import FormInputText from "@/app/components/inputs/FormInputText.tsx";
import FormDatePicker from "@/app/components/inputs/FormDatePicker.tsx";
import dayjs from "dayjs";
import { sleep } from "@/infrastructure/http.ts";
import {Button} from "@/app/components/ui/button.tsx";
import FormDatePickerAntd from "@/app/components/inputs/FormDatePickerAntd.tsx";
import {Form, Modal } from "antd";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";

export type SemesterModalProps = {
    refetch: any
}

const SemesterModal = (props: SemesterModalProps) => {
    const [open, setOpen] = useState(false)
    const {mutate, isPending, isSuccess, reset} = useCreateSemester()
    const { control, getValues} = useForm<CreateSemesterModel>({
        defaultValues: {
            semesterName: "",
            semesterCode: "",
            startDate: dayjs().toString(),
            endDate: dayjs().toString(),
        }
    });
    useEffect(() => {
        return () => {
            reset()
        }
    }, []);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className={"bg-green-600 cursor-pointer"}
            >
                Thêm mới kì học
            </Button>
            <Modal
                onCancel={() => setOpen(false)}
                confirmLoading={isPending}
                onOk={() => {
                    mutate({
                        ...getValues(),
                        startDate: dayjs(getValues("startDate"))?.toISOString(),
                        endDate: dayjs(getValues("endDate"))?.toISOString(),

                    }, {
                        onSuccess: ({data}) => {
                            setOpen(false)
                            props?.refetch()
                        }
                    })

                }}
                open={open} onClose={() => setOpen(false)} >
                <Form className={""}
                      layout="vertical"
                >
                    <Typography align={"center"}>Thêm mới kì học</Typography>
                    <FormInputAntd name={"semesterName"} control={control} label={"Tên kì học"} />
                    <FormInputAntd name={"semesterCode"} control={control} label={"Mã kì học"} help={<span className={"text-red-500 font-bold"}>VD: 1_2024_2024</span>} />
                    <FormDatePickerAntd control={control} name={"startDate"} label={"Thời gian bắt đầu"} />
                    <FormDatePickerAntd control={control} name={"endDate"} label={"Thời gian kết thúc"}  />
                </Form>

            </Modal>
        </>
    )
}

export default SemesterModal