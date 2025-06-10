import {Modal} from "antd";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {SubjectStudySectionState} from "@/app/modules/education/stores/subject_study_section.ts";

export type SelectedClassModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
}

const SelectedClassModal = ({open, setOpen}: SelectedClassModalProps) => {
    const {courseClassesNew} = useAppSelector<SubjectStudySectionState>(c => c.subjectStudySectionReducer);
    const dispatch = useAppDispatch()
    return (
        <Modal open={open} onCancel={() => setOpen(false)}>
            {courseClassesNew?.length}
        </Modal>
    )
}
export default SelectedClassModal