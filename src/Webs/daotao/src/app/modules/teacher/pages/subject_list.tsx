import { useAppDispatch, useAppSelector } from "@/app/stores/hook.ts";
import { CommonState, setGroupFuncName } from "@/app/stores/common_slice.ts";
import {useCallback, useEffect, useState} from "react";
import { ColumnsType } from "@/app/modules/common/hook.ts";
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box, IconButton } from "@mui/material";
import { Subject } from "@/domain/subject.ts";
import {Button, Table, Tooltip, Typography} from "antd";
import { Query } from "@/infrastructure/query.ts";
import {debounce} from 'lodash';
import {useGetSemesters} from "@/app/modules/education/hooks/useGetSemesters.ts";
import {CourseClass} from "@/domain/course_class.ts";
import CourseClassModel from "@/app/modules/teacher/components/course_class_model.tsx";
import { Badge } from "@/app/components/ui/badge";
import { useGetSubjects } from "../../subject/hooks/hook";
import { Input } from "antd"
import CourseClassAssignTeacherModal from "@/app/modules/teacher/components/course_class_assign_teacher_modal.tsx";
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
        operator: userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! !== "admin" ? "Contains" : "!=",
        value: userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! !== "admin" ? userInfo?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]! : ""
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
      },
      {
        field: "ParentSemesterCode",
        operator: "In",
        value: ","
      }
    ]
    
  })
  const semester = semesters?.data?.data?.items?.[0]
  const { data: subjects, isLoading, isSuccess } = useGetSubjects(query, userInfo !== undefined)
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
            <CourseClassAssignTeacherModal subjectCode={record.subjectCode} />
          </>
      )
    },
  ];
  
  
  
  
  const tableColumns = columns.map((item) => ({ ...item }));
  const [searchKeyword, setSearchKeyword] = useState("")
  const searchTeacher = useCallback(
      debounce((keyword) => {
        setQuery({
          ...query,
          Filters: [
              ...query?.Filters?.filter(e => e.field !== "SubjectName") ?? [],
            {
              field: "SubjectName",
              operator: keyword !== "" ? "Contains" : "!=",
              value: keyword !== "" ? keyword : "-1"
            },
          ]
        });
      }, 1200), 
      [query]
  );

  return (
    <PredataScreen isLoading={false} isSuccess={true}>
      <Box className={"flex flex-col gap-5"}>
        <Input.Search value={searchKeyword} size={"large"} placeholder={"Tìm theo tên môn học"}
                      onChange={e => {
                        setSearchKeyword(e.target.value);
                        searchTeacher(e.target.value);
                      }}
        />
        <Table<Subject>
            rowKey={(c) => c.id}
            loading={isLoading}
            style={{
              height: "500px",
            }}
            size={"small"}
            bordered={true}
            pagination={{
              current: query?.Page ?? 1,
              pageSize: query?.PageSize ?? 10,
              total: subjects?.data?.data?.totalItems ?? 0
            }}
            onChange={(e) => {
              setQuery(prevState => ({
                ...prevState,
                Page: e?.current ?? 1 - 1,
                PageSize: e?.pageSize
              }))
            }}
            columns={tableColumns}
            dataSource={subjects?.data?.data?.items ?? []}

        />
      </Box>
    </PredataScreen>
  )
}
export default SubjectList
