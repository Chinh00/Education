import {Box, IconButton} from "@mui/material";
import {Button, Modal, Tabs, TabsProps, Tooltip} from "antd";
import { Edit } from "lucide-react";
import {useState} from "react";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useRemoveStudentFromCourseClass} from "@/app/modules/education/hooks/useRemoveStudentFromCourseClass.ts";
import toast from "react-hot-toast";

export type StudentCourseClassEditProps = {
    courseClassCode?: string;
    studentCode?: string;
    refetch?: () => void
}

const StudentCourseClassEdit = ({courseClassCode, studentCode, refetch}: StudentCourseClassEditProps) => {
    const [openModel, setOpenModel] = useState(false)
    
    
    
    const {mutate, isPending} = useRemoveStudentFromCourseClass()
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Chuyển lớp học phần sinh viên`,
            children: <Button>Chuyển lớp học phần sinh viên</Button>,
        },
        {
            key: '2',
            label: `Hủy đăng ký học phần sinh viên`,
            children: <Box className={"flex flex-col gap-4"}>
                Thông tin học phần đăng ký của sinh viên
                <Button onClick={() => {
                    mutate({
                        courseClassCode: courseClassCode!,
                        studentCode: studentCode!
                    }, {
                        onSuccess: () => { 
                            toast.success("Hủy đăng ký học phần thành công")
                            setOpenModel(false)
                            refetch?.()
                        }
                    })
                }} loading={isPending} >Hủy đăng ký</Button>
            </Box>,
        }
    ]
    
    return (
        <>
            <Tooltip title={"Chỉnh sửa"}>
                <IconButton onClick={() => setOpenModel(true)} color={"primary"}>
                    <Edit size={18} />
                </IconButton>
            </Tooltip>
            <Modal onCancel={() => setOpenModel(false)} open={openModel} onClose={() => setOpenModel(false)}>
                <Tabs items={items} defaultActiveKey={"2"}  />
            </Modal>
        </>
    )
}
export default StudentCourseClassEdit