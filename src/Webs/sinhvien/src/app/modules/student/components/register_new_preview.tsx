import {Tooltip, Modal} from "antd";
import {IconButton} from "@mui/material";
import {Eye} from "lucide-react";
import {useState} from "react";
import {useGetStudentRegisterCourseClass} from "@/app/modules/student/hooks/useGetStudentRegisterCourseClass.ts";
import SubjectTime from "@/app/modules/student/components/subject_time.tsx";


export type RegisterNewPreviewProps = {
    courseClassCodeSelected: string,
    isRegistered?: boolean
}

const RegisterNewPreview = ({courseClassCodeSelected, isRegistered}: RegisterNewPreviewProps) => {
    const [openModal, setOpenModal] = useState(false)
    const {data: courseClassesRegister, isLoading} = useGetStudentRegisterCourseClass()
    const courseClassCode = courseClassesRegister?.data?.data?.courseClassCode || [];
    return (
        <>
            <Tooltip title={"Xem trước lịch của bạn"}><IconButton
                onClick={() => setOpenModal(true)} 
            ><Eye size={18} /> </IconButton></Tooltip>
            <Modal open={openModal}
                   loading={isLoading} 
                   className={"min-w-[1200px]"}
                   onCancel={() => setOpenModal(false)}
                   onClose={() => setOpenModal(false)}>
                <SubjectTime courseClassCode={
                    isRegistered ?
                        [...courseClassCode, courseClassCodeSelected] : courseClassCode} teacherCourseClassCode={!isRegistered ? [courseClassCodeSelected] : []} />
            </Modal>
        </>
    )
}
export default RegisterNewPreview