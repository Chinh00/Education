import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box } from "@mui/material";
import { useParams } from "react-router";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Query} from "@/infrastructure/query.ts";
import StudentList from "@/app/modules/education/components/student_list.tsx";
import TimelineList from "../components/timeline_list";

const CourseClassDetail = () => {
    const {id} = useParams()
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Chi tiết lớp đăng ký: ${id}`}));
    }, []);

    const {data, isLoading, isSuccess} = useGetCourseClasses({
        Filters: [
            {
                field: "Id",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["StudentIds"]
    }, id !== undefined)

    const [studentQuery, setStudentQuery] = useState<Query>({
        Includes: ["InformationBySchool", "PersonalInformation"]
    })


    useEffect(() => {
        if (!!data ) {
            setStudentQuery(prevState => ({
                ...prevState,
                Filters: [
                    {
                        field: "InformationBySchool.StudentCode",
                        operator: data?.data?.data?.items[0]?.studentIds?.length !== 0 ? "In" : "==",
                        value: data?.data?.data?.items[0]?.studentIds?.join(",")
                    }
                ]
            }))
        }
    }, [data, isLoading, isSuccess]);



    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <TimelineList courseClassCode={data?.data?.data?.items[0]?.courseClassCode ?? ""} />
                <StudentList query={studentQuery} />
            </Box>
        </PredataScreen>
    )
}
export default CourseClassDetail