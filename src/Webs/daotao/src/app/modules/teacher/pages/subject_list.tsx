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
import Assignment_teacher from "@/app/modules/teacher/components/assignment_teacher.tsx";

const SubjectList = () => {
  const dispatch = useAppDispatch();
  const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
  useEffect(() => {
    dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Danh sách lớp học mở" }));
  }, []);
  const { data } = useGetUserInfo()

  const [query, setQuery] = useState<Query>({
    Filters: [
      {
        field: "DepartmentCode",
        operator: "Contains",
        value: data?.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]!
      }
    ],
    Includes: ["DepartmentCode", "NumberOfCredits",]
  })


  const { data: subjects, isLoading, isSuccess } = useGetSubjects(query)
  const {data: semesters} = useGetSemesters({
    Filters: [
      {
        field: "SemesterStatus",
        operator: "==",
        value: "1"
      }
    ]
  })
  const {data: courseClass } = useGetCourseClasses({
    Filters: [
      {
        field: "SubjectCode",
        operator: "In",
        value: subjects?.data?.data?.items?.map(c => c.subjectCode).join(",")!
      },
      {
        field: "SemesterCode",
        operator: "==",
        value: semesters?.data?.data?.items[0]?.semesterCode!
      }
    ]

  }, subjects?.data?.data !== undefined && subjects?.data?.data?.items?.length > 0 && semesters !== undefined && semesters?.data?.data?.items?.length > 0)

  const columns: ColumnsType<CourseClass> = [
   
    {
      title: 'Mã lớp',
      dataIndex: "courseClassCode",
    },
    {
      title: 'Tên lớp',
      dataIndex: "courseClassName",
    },
    {
      title: 'Loại lớp',
      render: (text, record) => (
          <>{record?.courseClassType === 0 ? "Lý thuyết" : "Thực hành"}</>
      )
    },
    {
      title: 'Tình trạng',
      render: (text, record) => (
          <>
            <Assignment_teacher courseClass={record} />
          </>
      )
    },
      
    



  ];
  const tableColumns = columns.map((item) => ({ ...item }));



  return (
    <PredataScreen isLoading={isLoading} isSuccess={isSuccess}>
      <Box>
        <Table<CourseClass>
            rowKey={(c) => c.id}
            loading={isLoading}
            style={{
              height: "500px",
            }}
            showHeader={true}
            title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
            </Box>}
            size={"small"}
            bordered={true}
            pagination={{
              current: query?.Page ?? 1,
              pageSize: query?.PageSize ?? 10,
              total: courseClass?.data?.data?.totalItems ?? 0
            }}
            onChange={(e) => {
              setQuery(prevState => ({
                ...prevState,
                Page: e?.current ?? 1 - 1,
                PageSize: e?.pageSize
              }))
            }}
            columns={tableColumns}
            dataSource={courseClass?.data?.data?.items ?? []}

        />
      </Box>
    </PredataScreen>
  )
}
export default SubjectList
