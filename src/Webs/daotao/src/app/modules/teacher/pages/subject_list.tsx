import { useAppDispatch, useAppSelector } from "@/app/stores/hook.ts";
import { CommonState, setGroupFuncName } from "@/app/stores/common_slice.ts";
import { useEffect, useState } from "react";
import { ColumnsType, useGetSpecialityDepartments, useGetSubjects } from "@/app/modules/common/hook.ts";
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box, IconButton } from "@mui/material";
import { Subject } from "@/domain/subject.ts";
import {Button, Table, Tooltip, Typography} from "antd";
import {Eye, History, RotateCcw} from "lucide-react";
import { Query } from "@/infrastructure/query.ts";
import { useGetCourseClasses } from "../../education/hooks/useGetCourseClasses";
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {CourseClass} from "@/domain/course_class.ts";
import CourseClassModel from "@/app/modules/teacher/components/course_class_model.tsx";
import { Badge } from "@/app/components/ui/badge";
import {useGetRegisters} from "@/app/modules/education/hooks/useGetRegisters.ts";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";

const SubjectList = () => {
  const dispatch = useAppDispatch();
  const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
  useEffect(() => {
    dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Danh sách lớp học mở" }));
  }, []);
  const { userInfo } = useAppSelector<CommonState>(e => e.common);

  const [query, setQuery] = useState<Query>({
    Filters: [
      {
        field: "DepartmentCode",
        operator: "Contains",
        value: userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]!
      }
    ],
    Includes: ["DepartmentCode", "NumberOfCredits",]
  })

  const {data: semesters} = useGetSemesters({
    Filters: [
      {
        field: "SemesterStatus",
        operator: "==",
        value: "1"
      }
    ]
  })
  const semester = semesters?.data?.data?.items?.[0]
  const { data: subjects, isLoading, isSuccess } = useGetSubjects(query, userInfo !== undefined)
  // const {data: subjectRegister, isPending: subjectLoading, isSuccess: subjectSuccess} = useGetSubjectRegister({
  //   Filters: [
  //     {
  //       field: "CorrelationId",
  //       operator: "==",
  //       value: RegisterState?.data?.data?.items[0]?.correlationId!
  //     }
  //   ]
  // }, RegisterState !== undefined && RegisterState?.data?.data?.items?.length > 0)
  const columns: ColumnsType<Subject> = [

    {
      title: 'Mã môn học',
      dataIndex: "subjectCode",
    },
    {
      title: 'Tên môn học',
      dataIndex: "subjectName",
    },
    {
      title: 'Số tín chỉ',
      dataIndex: "numberOfCredits",
    },
    {
      title: 'Môn tính điểm',
      dataIndex: "isCalculateMark",
    },
    {
      title: 'Tình trạng',
      render: (text, record) => (
          <>
            <CourseClassModel subjectCode={record?.subjectCode} semesterCode={semesters?.data?.data?.items?.[0]?.semesterCode!} />
          </>
      )
    },
    
    
  ];
  
  
  
  
  const tableColumns = columns.map((item) => ({ ...item }));



  return (
    <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
      <Box>
        <Table<Subject>
            rowKey={(c) => c.id}
            loading={isLoading}
            style={{
              height: "500px",
            }}
            showHeader={true}
            title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
              <Typography.Title level={4} className={"flex justify-center items-center gap-3"}>Kì học đăng ký hiện tại:
                <Badge className={"bg-blue-400 text-xl"} >{semester?.semesterName}</Badge>  
              </Typography.Title>
            </Box>}
            size={"small"}
            bordered={true}
            columns={tableColumns}
            dataSource={subjects?.data?.data?.items ?? []}

        />
      </Box>
    </PredataScreen>
  )
}
export default SubjectList
