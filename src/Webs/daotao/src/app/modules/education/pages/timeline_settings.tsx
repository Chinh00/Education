import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box } from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import { useGetCourseClasses } from "../hooks/useGetCourseClasses";
import _ from 'lodash';
import {ColumnsType} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {CourseClass} from "@/domain/course_class.ts";
import {Button, Table} from "antd";
import {RotateCcw} from "lucide-react";
import {useParams} from "react-router";

const TimelineSettings = () => {


    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Cấu hình thời khóa biểu"}));
    }, []);


    const {data} = useGetCourseClasses({})




    return (
        <PredataScreen isLoading={false} isSuccess={true} >
            <Box>

            </Box>
        </PredataScreen>
    )
}

export default TimelineSettings;