import { useAppDispatch, useAppSelector } from "@/app/stores/hook.ts";
import { CommonState, setGroupFuncName } from "@/app/stores/common_slice.ts";
import { useEffect, useState } from "react";
import { ColumnsType, useGetSpecialityDepartments, useGetSubjects } from "@/app/modules/common/hook.ts";
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box, IconButton } from "@mui/material";
import { Subject } from "@/domain/subject.ts";
import { Button, Table, Tooltip } from "antd";
import { Eye, RotateCcw } from "lucide-react";
import { Query } from "@/infrastructure/query.ts";
import { useGetCourseClasses } from "../../education/hooks/useGetCourseClasses";

const SubjectList = () => {
  const dispatch = useAppDispatch();
  const { groupFuncName } = useAppSelector<CommonState>(c => c.common)
  useEffect(() => {
    dispatch(setGroupFuncName({ ...groupFuncName, itemName: "Danh sách môn học" }));
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
  const { } = useGetCourseClasses({
    Filters: [
      {
        field: "subjectCode",
        operator: "In",
        value: subjects?.data?.data?.items?.map(c => c.subjectCode).join(",")!
      }
    ]

  }, subjects?.data?.data !== undefined && subjects?.data?.data?.items?.length > 0)
  const columns: ColumnsType<Subject> = [
    {
      title: 'Tên môn học',
      dataIndex: "subjectName",
    },
    {
      title: 'Mã môn học',
      dataIndex: "subjectCode",
    },
    {
      title: 'Tên tiếng anh',
      dataIndex: "subjectNameEng",
    },
    {
      title: 'Số tín chỉ',
      dataIndex: "numberOfCredits",
    },
    {
      title: 'Mã khoa quản lý',
      dataIndex: "departmentCode",
    },
    {
      title: 'Là môn tính điểm',
      dataIndex: "isCalculateMark",
    },
    {
      title: 'Trạng thái',
      dataIndex: "status",
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
          title={() => <Box className={"flex flex-row justify-end items-center p-[16px] text-white "}>
          </Box>}
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
