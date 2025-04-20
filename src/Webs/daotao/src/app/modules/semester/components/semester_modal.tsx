import {useState} from "react";
import {BadgeCheck, Loader, Plus} from "lucide-react";
import {Box, Button, Modal, Typography} from "@mui/material";
import useCreateSemester from "@/app/modules/semester/hooks/useCreateSemester.ts";
import {CreateSemesterModel} from "@/app/modules/semester/services/semester.service.ts";
import {useForm} from "react-hook-form";
import FormInputText from "@/app/components/inputs/FormInputText.tsx";
import FormDatePicker from "@/app/components/inputs/FormDatePicker";
import dayjs from "dayjs";
import { sleep } from "@/infrastructure/http";

export type SemesterModalProps = {
    refetch: any
}

const SemesterModal = (props: SemesterModalProps) => {
    const [open, setOpen] = useState(false)
    const {mutate, isPending, isSuccess} = useCreateSemester()
    const { handleSubmit, control } = useForm<CreateSemesterModel>({
        defaultValues: {
            semesterName: "",
            semesterCode: "",
            startDate: dayjs().toString(),
            endDate: dayjs().toString(),
        }
    });

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<Plus />}
                size={"small"}
                variant={"contained"}
                sx={{textTransform: "none"}}
            >
                Thêm mới kì học
            </Button>
            <Modal open={open} onClose={() => setOpen(false)} >
                <Box className={"w-[300px] bg-white mx-auto mt-[100px] p-3 rounded-sm"}>
                    <form className={"flex flex-col gap-5"} onSubmit={handleSubmit(data => {
                        console.log(data)
                        mutate({
                            ...data,
                            startDate: dayjs(data?.startDate).toISOString(),
                            endDate: dayjs(data?.endDate).toISOString(),
                        }, {
                            onSuccess: async () => {
                                await sleep(1000);
                                setOpen(false);
                                props.refetch();
                            }
                        })
                    })}>
                        {!isPending && !isSuccess && (
                            <>
                                <Typography>Thêm mới kì học</Typography>
                                <FormInputText name={"semesterName"} control={control} label={"Tên kì học"} />
                                <FormInputText name={"semesterCode"} control={control} label={"Mã kì học"} />
                                <FormDatePicker control={control} name={"startDate"} label={"Thời gian bắt đầu"} />
                                <FormDatePicker control={control} name={"endDate"} label={"Thời gian kết thúc"} />
                            </>
                        )}



                        {isPending && (<Loader className={"animate-spin mx-auto my-14"} size={"50"} />)}
                        {isSuccess && (<BadgeCheck size={"50"} fill={"green"} className={"my-14 mx-auto"} color={"white"} />)}
                        {!isPending && !isSuccess && (
                            <Button size={"small"} type={"submit"} variant={"contained"} >Tạo mới</Button>
                        )}
                    </form>
                </Box>
            </Modal>
        </>
    )
}

export default SemesterModal