import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Button, Card, Checkbox, Form, Input, Radio, Select, Space, Typography} from "antd";
import {data, useNavigate, useParams} from "react-router";
import {RoutePaths} from "@/core/route_paths.ts";
import {Controller, useForm} from "react-hook-form";

import {Divider} from "@mui/material"
import toast from "react-hot-toast";
import {useGetConditions} from "@/app/modules/common/hook.ts";
import {Subject} from "@/domain/subject.ts";
import {useGetSubjects, useUpdateSubject} from "../hooks/hook";
import {SubjectUpdateModel} from "@/app/modules/subject/services/subject.service.ts";
import {useMutation} from "@tanstack/react-query";
const SubjectDetail = () => {
    const dispatch = useAppDispatch()
    const {id} = useParams()
    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: `Thời khóa biểu môn học cấu hình: ${id}`}));
    }, []);
    const nav = useNavigate()
    const {data: subjects, isLoading, isSuccess: subjectsSuccess} = useGetSubjects({
        Filters: [
            {
                field: "SubjectCode",
                operator: "==",
                value: id!
            }
        ],
        Includes: ["DepartmentCode", "IsCalculateMark"]
    }, id !== undefined)
    const subject = subjects?.data?.data?.items[0]




    const {control: subjectControl, reset: subjectReset, getValues, setValue} = useForm<SubjectUpdateModel>({
       defaultValues: {
           
       }
    })
    const {mutate, isPending} = useUpdateSubject()
    const form = useForm<Subject>()


    useEffect(() => {
        if (subject) {
            form.reset({
                ...subject
            })
            subjectReset({...subject})
            setValue("lectureRequiredConditions", subject.lectureRequiredConditions ?? [])
            setValue("labRequiredConditions", subject?.labRequiredConditions ?? [])
        }
    }, [subject]);


   


   

    
    const {data: conditions, isLoading: conditionsLoading} = useGetConditions({}, subject !== undefined)
    
    
    return (
        <PredataScreen isLoading={isLoading} isSuccess={subjectsSuccess}>
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
                                    <Form.Item label={<Typography>Mã bộ môn quản lý</Typography>}  className={"col-span-3"}>
                                        <Input disabled {...field}   />
                                    </Form.Item>
                                )}
                            />
                        <Controller
                                name="isCalculateMark"
                                control={form.control}
                                render={({ field }) => (
                                    <Form.Item label={<Typography>Là môn tính điểm</Typography>}  className={"col-span-3"}>
                                        <Checkbox value={true} checked={field.value ?? true}>Đúng</Checkbox>
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
                            name="lectureRequiredConditions"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item
                                    label={<Typography>Điều kiện phòng học lý thuyết</Typography>}
                                    className="col-span-3"
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn điều kiện phòng"
                                        loading={conditionsLoading}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={conditions?.data?.data?.items?.map(e => ({
                                            label: e?.conditionName,
                                            value: e?.conditionCode,
                                        }))}
                                        optionRender={(option) => (
                                            <Space>{option.data.label}</Space>
                                        )}
                                    />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labRequiredConditions"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item
                                    label={<Typography>Điều kiện phòng học thực hành</Typography>}
                                    className="col-span-3"
                                >
                                    <Select
                                        mode="multiple"
                                        style={{ width: '100%' }}
                                        placeholder="Chọn điều kiện phòng"
                                        loading={conditionsLoading}
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={conditions?.data?.data?.items?.map(e => ({
                                            label: e?.conditionName,
                                            value: e?.conditionCode,
                                        }))}
                                        optionRender={(option) => (
                                            <Space>{option.data.label}</Space>
                                        )}
                                    />
                                </Form.Item>
                            )}
                        />
                        

                        
                        
                        
                        
                        <Button loading={isPending} type={"primary"} onClick={() => {
                            mutate({
                                ...getValues(),
                                subjectCode: id!,
                                lectureRequiredConditions: getValues("lectureRequiredConditions") ?? [],
                                labRequiredConditions: getValues("labRequiredConditions") ?? []
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
export default SubjectDetail;