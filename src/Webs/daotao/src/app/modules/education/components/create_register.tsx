
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription, DialogFooter, DialogClose
} from "@/app/components/ui/dialog.tsx"
import {memo, useState} from "react";
import {Box, IconButton, Modal, Typography} from "@mui/material";

import {useCreateRegisterState} from "../hooks/useCreateRegisterState.ts"
import { DateTimePicker } from "@mui/x-date-pickers";
import FormDatePicker from "@/app/components/inputs/FormDatePicker.tsx";
import {useForm} from "react-hook-form";
import {CreateRegisterStateModel} from "@/app/modules/education/services/education.service.ts";
import FormDateTimePicker from "@/app/components/inputs/FormDateTimePicker.tsx";
import {X} from "lucide-react"
import {Button} from "@/app/components/ui/button.tsx";
import dayjs from "dayjs";
import IconLoading from "@/asssets/icons/Animation - 1745569010328.json";
import IconSuccess from "@/asssets/icons/Animation - 1745568841861.json";
import Lottie from "lottie-react";
import {sleep} from "@/infrastructure/http.ts";

export type CreateRegisterProps = {
    refetch: any
}

const CreateRegister = (props: CreateRegisterProps) => {
    const [open, setOpen] = useState(false)
    const {mutate, isPending, isSuccess, reset} = useCreateRegisterState()
    const {control, handleSubmit} = useForm<CreateRegisterStateModel>({
        defaultValues: {
            startDate: dayjs().toDate(),
            endDate: dayjs().toDate(),
            semesterCode: "",
            wishRegisterCode: "",
            wishRegisterName: ""
        }
    })

    return <>
        <Button onClick={() => setOpen(true)} className={"bg-green-600 cursor-pointer"}>Tạo mới</Button>
        <Modal open={open} className={"flex justify-center items-center"}>
            <form onSubmit={handleSubmit(data => {
                console.log(data)
                mutate({
                    ...data
                }, {
                    onSuccess: async (res) => {
                        await sleep(2800)
                        reset()
                        setOpen(false)
                        props.refetch()
                    }
                })
            })}>
                <Box className={"flex flex-col gap-5 z-50 bg-white p-5 rounded-md inset-3 w-[400px] justify-center items-center"}>
                    {isPending && <Lottie animationData={IconLoading} loop={true} className={"w-[250px]"} />}
                    {isSuccess && <Lottie  animationData={IconSuccess} loop={false} className={"w-[250px]"} />}
                    {!isPending && !isSuccess && <>
                        <div className={"flex flex-row flex-nowrap justify-between items-center w-full"}>
                            <Typography >Cấu hình đăng ký nguyện vọng học </Typography>
                            <IconButton ><X /></IconButton>
                        </div>
                        <FormDateTimePicker ampm={false} control={control} name={"startDate"} label={"Thời gian bắt đầu"} slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true
                            },
                        }}
                        />
                        <FormDateTimePicker ampm={false} control={control} name={"endDate"} label={"Thời gian kết thúc"} slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true
                            },
                        }}
                        />
                        <div className={"gap-5 flex flex-row-reverse"}>
                            <Button className={"bg-blue-500"} type={"submit"}>Tạo mới</Button>
                            <Button className={"bg-gray-500"} onClick={() => setOpen(false)}>Huỷ</Button>
                        </div>
                    </>}
                </Box>
            </form>
        </Modal>
    </>
}

export default CreateRegister;