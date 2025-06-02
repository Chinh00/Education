import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Button, Card, Checkbox, Form, Input, Radio, Select, Space, Typography} from "antd";
import {data, useNavigate, useParams} from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import {Controller, useForm} from "react-hook-form";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import { Query } from "@/infrastructure/query";
import {useGetSubjectTimelineConfig} from "@/app/modules/education/hooks/useGetSubjectTimelineConfig.ts";
import {SubjectTimelineConfigModel} from "@/app/modules/education/services/education.service.ts";
import {SubjectTimelineConfig} from "@/domain/subject_timeline_config.ts";
import {Divider} from "@mui/material"
import {useUpdateSubjectTimelineConfig} from "@/app/modules/education/hooks/useUpdateSubjectTimelineConfig.ts";
import toast from "react-hot-toast";
import {useGetConditions, useGetSubjects} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
const SubjectTimelineDetail = () => {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Thời khóa biểu môn học cấu hình: ${id}`}));
    }, []);
    const nav = useNavigate()
    const {data, isLoading, isSuccess} = useGetSubjectTimelineConfig(id!, id !== undefined)
    const {data: subjects, isLoading: subjectLoading, isSuccess: subjectsSuccess} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["DepartmentCode", "IsCalculateMark"]
    }, id !== undefined)





    const {control: subjectControl, reset: subjectReset, getValues, setValue} = useForm<SubjectTimelineConfig>({
       defaultValues: {

       }
    })
    const form = useForm<Subject>()


    useEffect(() => {
        if (subjects) {
            form.reset({
                ...subjects?.data?.data?.items[0]
            })
        }
    }, [subjects, subjectLoading, subjectsSuccess]);


    useEffect(() => {
        if (data) {
            subjectReset({
                ...data?.data?.data,
                subjectCode: data?.data?.data?.subjectCode ?? id
            })
        }
    }, [isLoading, data, subjectReset]);



    const {mutate, isPending} = useUpdateSubjectTimelineConfig()

    useEffect(() => {
        if (data?.data?.data === null) {
            toast.error("Môn học chưa được cấu hình")
        }
    }, [data, isLoading, isSuccess]);

   

    
    const {data: conditions, isLoading: conditionsLoading} = useGetConditions({})
    
    
    return (
        <PredataScreen isLoading={subjectLoading} isSuccess={subjectsSuccess}>
            <Box className={"flex flex-col gap-5"}>
                <Card className={""}>
                    <Form layout={"vertical"}>
                        <Typography.Title level={4} className={"col-span-6"}>Thông tin môn học</Typography.Title>
                        <Controller
                                name="subjectName"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Tên môn học</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />
                        <Controller
                                name="subjectNameEng"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Tên tiếng anh</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />
                        <Controller
                                name="subjectCode"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Mã môn học</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />

                        <Controller
                                name="subjectDescription"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Mô tả</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />
                        <Controller
                                name="departmentCode"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Mã ngành quản lý</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />
                        <Controller
                                name="isCalculateMark"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Là môn tính điểm</Typography>}  className={"col-span-3"}>
                                        <Checkbox value={true} checked={field.value}>Đúng</Checkbox>
                                        <Checkbox value={false} checked={!field.value} >Sai</Checkbox>
                                    </Form.Item>
                                )}
                            />



                    </Form>
                </Card>
                <Card>
                    <Form
                        layout={"vertical"}
                        className={"grid grid-cols-6 gap-5 "}
                    >
                        <Typography.Title level={4} className={"col-span-6"}>Thông tin cấu hình thời khóa biểu</Typography.Title>
                        <Controller
                            name="periodTotal"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Tổng số tiết học</Typography>}  className={"col-span-6"}>
                                    <Input type={"number"}  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Divider className={"col-span-6"} />
                        <Typography.Title level={4} className={"col-span-6"}>Cấu hình tiết học lý thuyết</Typography.Title>
                        <Controller
                            name="lectureTotal"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết lý thuyết</Typography>} className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lectureLesson"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số buổi lý thuyết trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lecturePeriod"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết lý thuyết trong 1 buổi</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="minDaySpaceLecture"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Khoảng cách giữa các buổi học lý thuyết trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input   {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lectureMinStudent"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số sinh viên tối thiểu trong lớp lý thuyết</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lectureStartWeek"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Tuần bắt đầu học lớp lý thuyết</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />

                        <Divider className={"col-span-6"} />
                        <Typography.Title level={4} className={"col-span-6"}>Cấu hình tiết học thực hành</Typography.Title>
                        <Controller
                            name="labTotal"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết thực hành</Typography>} className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labLesson"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số buổi thực hành trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labPeriod"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết thực hành trong 1 buổi</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="minDaySpaceLab"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Khoảng cách giữa các buổi học thực hành trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input   {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labMinStudent"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số sinh viên tối thiểu trong lớp thực hành</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labStartWeek"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Tuần bắt đầu học lớp thực hành</Typography>}  className={"col-span-2"}>
                                    <Input  {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Divider className={"col-span-6"} />
                        <Typography.Title level={4} className={"col-span-6"}>Cấu hình khác</Typography.Title>
                        <Controller
                            name="stage"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Giai đoạn học</Typography>}  className={"col-span-3"}>
                                    <Radio.Group
                                        value={field?.value ?? 0}
                                        options={[
                                            { value: 0, label: '1' },
                                            { value: 1, label: '2' },
                                            { value: 2, label: 'Cả 2' },
                                        ]}
                                        onChange={e => field.onChange(e.target.value)}
                                    />
                                </Form.Item>
                            )}
                        />
                        
                        <Form.Item  label={<Typography>Điều kiện phòng học</Typography>}  className={"col-span-3"}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%'}}
                                className={"col-span-3"}
                                placeholder="Chọn điều kiện phòng"
                                loading={conditionsLoading}
                                defaultValue={getValues("lectureRequiredConditions")}
                                onChange={(e, res) => {
                                    // @ts-ignore
                                    setValue("lectureRequiredConditions", [...(res?.map(c => c.value))])
                                }}
                                options={conditions?.data?.data?.items?.map(e => {
                                    return {
                                        label: e?.conditionName,
                                        value: e?.conditionCode,
                                    }
                                })}
                                optionRender={(option) => (
                                    <Space>

                                        {option.data.label}
                                    </Space>
                                )}
                            />
                        </Form.Item>
                        <Form.Item  label={<Typography>Điều kiện phòng học</Typography>}  className={"col-span-3"}>
                            <Select
                                mode="multiple"
                                style={{ width: '100%'}}
                                className={"col-span-3"}
                                placeholder="Chọn điều kiện phòng"
                                loading={conditionsLoading}
                                defaultValue={getValues("labRequiredConditions")}
                                onChange={(e, res) => {
                                    // @ts-ignore
                                    setValue("labRequiredConditions", [...(res?.map(c => c.value))])
                                }}
                                options={conditions?.data?.data?.items?.map(e => {
                                    return {
                                        label: e?.conditionName,
                                        value: e?.conditionCode,
                                    }
                                })}
                                optionRender={(option) => (
                                    <Space>

                                        {option.data.label}
                                    </Space>
                                )}
                            />
                        </Form.Item>
                        
                        
                        <div className={"col-span-3"}></div>
                        <Button loading={isPending} type={"primary"} onClick={() => {
                            mutate({
                                ...getValues(),
                                subjectCode: id!
                            }, {
                                onSuccess: () => {
                                    toast.success("Cập nhật thành công")
                                }
                            })
                        }} >Cập nhật</Button>

                    </Form>
                </Card>
            </Box>
        </PredataScreen>
    )
}
export default SubjectTimelineDetail;