import {useEffect, useMemo, useState} from "react";

import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
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