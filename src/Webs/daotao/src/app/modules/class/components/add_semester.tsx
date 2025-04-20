import {useState} from "react";
import {Button} from "@/app/components/ui/button.tsx";
import {Box, Modal } from "@mui/material";
import {useGetSemesters} from "@/app/modules/semester/hooks/useGetSemesters.ts";

export type AddSemesterProps = {

}

const AddSemester = (props: AddSemesterProps) => {
    const [open, setOpen] = useState(false)
    const {data: semesters} = useGetSemesters({

    }, open)


    return (
        <>
            <Button className={"cursor-pointer"} onClick={() => setOpen(true)}>Thêm kì học </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box>
                    Thêm kì học
                </Box>
            </Modal>
        </>
    )
}

export default AddSemester