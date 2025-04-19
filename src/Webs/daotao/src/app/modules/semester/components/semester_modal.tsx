import {useState} from "react";
import {Plus} from "lucide-react";
import {Box, Button, Modal} from "@mui/material";

const SemesterModal = () => {
    const [open, setOpen] = useState(false)


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
            <Modal open={open} >
                <Box className={"w-[300px] bg-white mx-auto mt-[100px] p-3 rounded-sm"} >
                    ascas
                </Box>
            </Modal>
        </>
    )
}

export default SemesterModal