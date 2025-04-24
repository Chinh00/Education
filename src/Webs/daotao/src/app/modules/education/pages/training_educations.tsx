import {useEffect, useMemo, useState} from "react";
import { useGetEducations } from "../hooks/useGetEducations";
import {MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, useMaterialReactTable} from 'material-react-table'
import {Box, IconButton, Tooltip} from "@mui/material";
import { Eye, Settings } from "lucide-react";
import {Education} from "@/domain/education.ts";
import {Query} from "@/infrastructure/query.ts";
import SearchOptions from "@/app/modules/education/components/search_options.tsx";
import CourseSearch from "@/app/components/combobox/course_search.tsx";
import SpecialitySearch from "@/app/modules/education/components/speciality_search.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {EducationState, setQuery} from "@/app/modules/education/stores/education_slice.ts";
import {useNavigate} from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import Header from "@/app/components/header/header.tsx";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import loadable from "@loadable/component";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";

const TrainingEducations = () => {
    const dispatch = useAppDispatch()




    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Danh sách chương trình đào tạo"}));
    }, []);


    return (
        <>
            <PredataScreen isLoading={false} isSuccess={true}>
                <div>Đăng ký học</div>
            </PredataScreen>

            {/*<Box className={"p-5 flex gap-5"}>*/}
            {/*    <CourseSearch  />*/}
            {/*    <SearchOptions />*/}
            {/*    <SpecialitySearch />*/}
            {/*</Box>*/}
            {/*<MaterialReactTable table={table}  />*/}
        </>
    )

}

export default TrainingEducations;