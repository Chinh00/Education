import useGetStudentInformation from "@/app/modules/student/hooks/useGetStudentInformation.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { useGetEducations, useGetSubjects } from "@/app/modules/common/hook.ts";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select.tsx";
import { Subject } from "@/domain/subject.ts";
import { Checkbox, GetProp, Progress, Table, TableProps } from "antd";
import { Box, Typography } from "@mui/material";
import { Badge } from "@/app/components/ui/badge";
import { BookOpen, Calendar, Clock, GraduationCap, MapPin } from "lucide-react";
import { useGetUserInfo } from "@/app/modules/auth/hooks/useGetUserInfo.ts";

export type ColumnsType<T extends object> = GetProp<TableProps<T>, 'columns'>;


const StudentEducation = () => {
  const { data, isPending, isSuccess } = useGetStudentInformation()
  const { data: educations, isLoading: educationsLoading } = useGetEducations({
    Filters: [
      {
        field: "Code",
        operator: "In",
        value: data?.data?.data?.educationPrograms?.map(c => c.code).join(",")!
      }
    ],
    Includes: ["EducationSubjects"]
  }, isSuccess)



  const { data: subjects, isLoading: subjectsLoading } = useGetSubjects({
    Filters: [
      {
        field: "SubjectCode",
        operator: "In",
        value: educations?.data?.data?.items?.[0]?.educationSubjects?.map(c => c.subjectCode)?.join(",")!
      }
    ],
    Includes: ["IsCalculateMark"],
    Page: 1,
    PageSize: 1000
  }, educations?.data?.data?.items?.[0] !== undefined)




  const [selectedEducation, setSelectedEducation] = useState<string>()

  useEffect(() => {
    if (data) {
      setSelectedEducation(data?.data?.data?.educationPrograms[0]?.code)
    }
  }, [data]);
  const { data: userInfo } = useGetStudentInformation()
  const columns: ColumnsType<Subject> = [
    {
      title: 'Mã môn học',
      dataIndex: "subjectCode",
      width: 50,
    },
    {
      title: 'Tên môn học',
      dataIndex: "subjectName",
      width: 150,

    },
    {
      title: 'Là môn tính điểm',
      render: (value, record) => {
        return <Checkbox defaultChecked={record?.isCalculateMark} disabled={true} />
      },
      width: 50,
    },


    {
      title: 'Số tín chỉ',
      dataIndex: "numberOfCredits",
      width: 50,

    },
  ];




  return (
    <PredataScreen isLoading={isPending} isSuccess={isSuccess} >
      <div className="w-full">
        <div className="flex items-center py-4">
          <Select value={selectedEducation} onValueChange={(value) => {
            const edu = data?.data?.data?.educationPrograms?.find(e => e.code === value);
            if (edu) setSelectedEducation(edu?.code);
          }}>
            <SelectTrigger className={"w-full mb-5"} >
              <SelectValue placeholder="Chương trình đào tạo" />
            </SelectTrigger>
            <SelectContent>
              {!!data && data?.data?.data?.educationPrograms?.map((item, index) => (
                <SelectItem value={item?.code} key={item?.code}>{item?.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative rounded-md min-h-[500px]">
          <Table<Subject>
            className={"absolute top-0"}
            rowKey={(c) => c.id}
            loading={subjectsLoading || educationsLoading}

            showHeader={true}
            title={() => <Box className={"flex flex-col w-full justify-between p-[16px] text-white gap-5"}>
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="bg-white">
                      {educations?.data?.data?.items?.[0]?.code}
                    </Badge>
                    <Badge className="bg-blue-500 text-white">Đang học</Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {educations?.data?.data?.items?.[0]?.specialityCode}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{educations?.data?.data?.items?.[0]?.name}</h1>
                  <div className="flex items-center text-slate-600 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{userInfo?.data?.data?.educationPrograms?.filter(c => c.code === educations?.data?.data?.items?.[0]?.code)[0]?.specialityName}</span>
                  </div>
                  <p className="text-slate-500">Trường Đại học Thủy Lợi</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">-1</div>
                    <div className="text-sm text-slate-600">GPA hiện tại</div>
                  </div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-slate-600">Tiến độ học tập</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{90}%</div>
                  <Progress className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">
                    Học kỳ 5/8
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-slate-600">Thời gian đào tạo</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{educations?.data?.data?.items?.[0]?.trainingTime}</div>
                  <p className="text-xs text-slate-500">năm</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-slate-600">Môn học</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {10}/{educations?.data?.data?.items?.[0]?.educationSubjects.length}
                  </div>
                  <p className="text-xs text-slate-500">hoàn thành</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm text-slate-600">Tín chỉ</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {100}/{140}
                  </div>
                  <p className="text-xs text-slate-500">tín chỉ</p>
                </div>
              </div>
              <Typography className={"w-full text-gray-700"} align={"center"} fontWeight={"bold"} >Danh sách môn học</Typography>
            </Box>}
            size={"small"}
            bordered={true}

            columns={columns}
            pagination={false}
            virtual
            dataSource={subjects?.data?.data?.items ?? []}
            scroll={{ x: 2000, y: 700 }}

          />
        </div>
      </div>

    </PredataScreen>
  )
}

export default StudentEducation
