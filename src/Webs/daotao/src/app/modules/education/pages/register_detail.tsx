import {Link, useNavigate, useParams} from "react-router";
import {useGetSubjectRegister} from "@/app/modules/education/hooks/useGetSubjectRegister.ts";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import { Box } from "@mui/material";
import {ColumnsType, useGetSubjects} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {Form, Input, Table, Typography} from "antd";
import useGetStudents from "@/app/modules/student/hooks/useGetStudents.ts";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import {Button} from "@/app/components/ui/button.tsx"
import { ArrowLeft, Cake, Mail, MapPinHouse, Phone, Transgender, User } from "lucide-react";
import { Label } from "@/app/components/ui/label";
import {Controller, useForm} from "react-hook-form";
import {Student} from "@/domain/student.ts";
import FormInputText from "@/app/components/inputs/FormInputText.tsx";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import dayjs from "dayjs";
const RegisterDetail = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Chi tiết đăng ký học"}));
    }, []);
    const {id} = useParams()
    const { data, isPending, isSuccess } = useGetSubjectRegister({
        Filters: [
            {
                field: "StudentCode",
                operator: "==",
                value: id!
            }
        ]
    })
    const {setValue, control, reset} = useForm<Student>({
        defaultValues: {
            personalInformation: {
                officeEmail: "",
            }
        }
    })

    const {data: students, isSuccess: studentsSuccess } = useGetStudents({
        Filters: [
            {
                field: "InformationBySchool.StudentCode",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["PersonalInformation", "InformationBySchool"]
    }, true, res => {
    })
    useEffect(() => {
        if (studentsSuccess && students?.data?.data?.items?.length) {
            const student = students.data.data.items[0];
            reset({
                ...student,
                personalInformation: {
                    ...student?.personalInformation,
                    birthDate: dayjs(student?.personalInformation?.birthDate).format("DD-MM-YYYY"),
                }
            });
        }
    }, [studentsSuccess, students, reset]);
    const {data: subjects, isPending: subjectPending, isSuccess: subjectSuccess} = useGetSubjects({
        Filters: [

        ]
    }, isSuccess)

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
            title: 'Tên tiếng anh',
            dataIndex: "subjectNameEng",
        },

        {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: (text, record) => (
                <></>
            ),
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));
    const nav = useNavigate();


    return (
        <PredataScreen isLoading={isPending} isSuccess={isSuccess}>
            <Box>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Thông tin cá nhân</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                        <User className="h-16 w-16 text-gray-400" />,
                                    </div>
                                    <h2 className="text-xl font-bold text-center">{students?.data?.data?.items[0]?.personalInformation?.fullName}</h2>
                                    <p className="text-gray-500 text-center">{students?.data?.data?.items[0]?.informationBySchool?.studentCode}</p>

                                    <div className="mt-2 flex justify-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {"Đang học"}
                </span>
                                    </div>
                                </div>

                                <Form className="space-y-4">
                                    <Controller
                                        name="personalInformation.email"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Item label={<Mail className="text-gray-400 h-4 w-4 flex-shrink-0" />}>
                                                <Input {...field} disabled={true} />
                                            </Form.Item>
                                        )}
                                    />
                                    <Controller
                                        name="personalInformation.phoneNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <Form.Item label={<Phone className="text-gray-400 h-4 w-4 flex-shrink-0" />}>
                                                <Input {...field} disabled={true}   />
                                            </Form.Item>
                                        )}
                                    />


                                    <div className="pt-4 border-t">
                                        <Controller
                                            name="personalInformation.contactAddress"
                                            control={control}
                                            render={({ field }) => (
                                                <Form.Item label={<MapPinHouse className="text-gray-400 h-4 w-4 flex-shrink-0" />}>
                                                    <Input {...field} disabled={true}   />
                                                </Form.Item>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Controller
                                            name="personalInformation.birthDate"
                                            control={control}
                                            render={({ field }) => (
                                                <Form.Item  label={<Cake  className="text-gray-400 h-4 w-4 flex-shrink-0" />}>
                                                    <Input {...field}  disabled={true}  />
                                                </Form.Item>
                                            )}
                                        />
                                        <Controller
                                            name="personalInformation.gender"
                                            control={control}
                                            render={({ field }) => (
                                                <Form.Item  label={<Transgender  className="text-gray-400 h-4 w-4 flex-shrink-0" />}>
                                                    <Input {...field}  disabled={true}  />
                                                </Form.Item>
                                            )}
                                        />
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>

                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Thông tin theo trường</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/*      <Tabs defaultValue="info" className="w-full">*/}
                                {/*          <TabsList className="w-full grid grid-cols-3 mb-6">*/}
                                {/*              <TabsTrigger value="info">Cơ bản</TabsTrigger>*/}
                                {/*              <TabsTrigger value="grades">Điểm số</TabsTrigger>*/}
                                {/*              <TabsTrigger value="notes">Ghi chú</TabsTrigger>*/}
                                {/*          </TabsList>*/}

                                {/*          <TabsContent value="info">*/}
                                {/*              <div className="space-y-4">*/}
                                {/*                  <div className="grid grid-cols-2 gap-4">*/}
                                {/*                      <div>*/}
                                {/*                          <Label className="text-sm font-medium text-gray-500 mb-2 block">Lớp</Label>*/}
                                {/*                          {isEditing ? (*/}
                                {/*                              <Input defaultValue={student.class} />*/}
                                {/*                          ) : (*/}
                                {/*                              <p className="text-sm font-medium">{student.class}</p>*/}
                                {/*                          )}*/}
                                {/*                      </div>*/}

                                {/*                      <div>*/}
                                {/*                          <Label className="text-sm font-medium text-gray-500 mb-2 block">Ngành học</Label>*/}
                                {/*                          {isEditing ? (*/}
                                {/*                              <Input defaultValue={student.major} />*/}
                                {/*                          ) : (*/}
                                {/*                              <p className="text-sm font-medium">{student.major}</p>*/}
                                {/*                          )}*/}
                                {/*                      </div>*/}
                                {/*                  </div>*/}

                                {/*                  <div>*/}
                                {/*                      <Label className="text-sm font-medium text-gray-500 mb-2 block">Điểm trung bình</Label>*/}
                                {/*                      <div className="flex items-center">*/}
                                {/*                          <div className="text-3xl font-bold">{calculateGPA()}</div>*/}
                                {/*                          <div className="ml-2 text-sm text-gray-500">/4.0</div>*/}
                                {/*                      </div>*/}
                                {/*                  </div>*/}

                                {/*                  <div>*/}
                                {/*                      <Label className="text-sm font-medium text-gray-500 mb-2 block">Số tín chỉ đã đạt</Label>*/}
                                {/*                      <p className="text-sm font-medium">*/}
                                {/*                          {student.courses.reduce((sum, course) => sum + course.credits, 0)}*/}
                                {/*                      </p>*/}
                                {/*                  </div>*/}
                                {/*              </div>*/}
                                {/*          </TabsContent>*/}

                                {/*          <TabsContent value="grades">*/}
                                {/*              <div className="rounded-md border">*/}
                                {/*                  <table className="w-full text-sm">*/}
                                {/*                      <thead>*/}
                                {/*                      <tr className="border-b bg-muted/50">*/}
                                {/*                          <th className="h-10 px-4 text-left font-medium">Mã môn</th>*/}
                                {/*                          <th className="h-10 px-4 text-left font-medium">Tên môn học</th>*/}
                                {/*                          <th className="h-10 px-4 text-center font-medium">Tín chỉ</th>*/}
                                {/*                          <th className="h-10 px-4 text-center font-medium">Điểm</th>*/}
                                {/*                      </tr>*/}
                                {/*                      </thead>*/}
                                {/*                      <tbody>*/}
                                {/*                      {student.courses.map((course) => (*/}
                                {/*                          <tr key={course.id} className="border-b hover:bg-muted/50 transition-colors">*/}
                                {/*                              <td className="p-4 align-middle font-medium">{course.id}</td>*/}
                                {/*                              <td className="p-4 align-middle">{course.name}</td>*/}
                                {/*                              <td className="p-4 align-middle text-center">{course.credits}</td>*/}
                                {/*                              <td className="p-4 align-middle">*/}
                                {/*                                  <div className="flex items-center justify-center">*/}
                                {/*<span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${*/}
                                {/*    course.grade.startsWith("A")*/}
                                {/*        ? "bg-green-100 text-green-800"*/}
                                {/*        : course.grade.startsWith("B")*/}
                                {/*            ? "bg-blue-100 text-blue-800"*/}
                                {/*            : course.grade.startsWith("C")*/}
                                {/*                ? "bg-yellow-100 text-yellow-800"*/}
                                {/*                : "bg-red-100 text-red-800"*/}
                                {/*}`}>*/}
                                {/*  {course.grade}*/}
                                {/*</span>*/}
                                {/*                                  </div>*/}
                                {/*                              </td>*/}
                                {/*                          </tr>*/}
                                {/*                      ))}*/}
                                {/*                      </tbody>*/}
                                {/*                  </table>*/}
                                {/*              </div>*/}
                                {/*          </TabsContent>*/}

                                {/*          <TabsContent value="notes">*/}
                                {/*              <div className="space-y-4">*/}
                                {/*                  <Label htmlFor="notes">Ghi chú về sinh viên</Label>*/}
                                {/*                  {isEditing ? (*/}
                                {/*                      <Textarea id="notes" className="min-h-[200px]" defaultValue={student.notes} />*/}
                                {/*                  ) : (*/}
                                {/*                      <div className="p-4 border rounded-md min-h-[200px]">*/}
                                {/*                          {student.notes || "Không có ghi chú"}*/}
                                {/*                      </div>*/}
                                {/*                  )}*/}
                                {/*              </div>*/}
                                {/*          </TabsContent>*/}
                                {/*      </Tabs>*/}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Table<Subject>
                    rowKey={(c) => `${c.id}-${c?.subjectCode}`}
                    loading={subjectPending}
                    style={{
                        height: "500px",
                        marginTop: "10px"
                    }}
                    showHeader={true}
                    title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                        <Typography className={"font-bold text-2xl"}>
                            Môn học đã đăng ký
                        </Typography>
                    </Box>}
                    size={"small"}

                    bordered={true}
                    // pagination={true}
                    columns={tableColumns}
                    dataSource={subjects?.data?.data?.items ?? []}

                />
            </Box>
        </PredataScreen>
    )
}

export default RegisterDetail;