import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useState} from "react";
import {Query} from "@/infrastructure/query.ts";
import {useParams} from "react-router";
import {Button} from "antd";

const Course_class_list = () => {
    const {subjectCode} = useParams();
    const [query, setQuery] = useState<Query>({
        Filters: [
            { field: "SubjectCode", operator: "==", value: subjectCode! },
            { field: "ParentCourseClassCode", operator: "==", value: "" },
        ],
    });
    const { data: courseClassesParent, isLoading } = useGetCourseClasses(
        query,
        subjectCode !== undefined
    );
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <Button>Thêm lớp học phần tự động</Button>
                <Button>Thêm lớp học thủ công</Button>
                
            </Box>
        </PredataScreen>
    )
}

export default Course_class_list