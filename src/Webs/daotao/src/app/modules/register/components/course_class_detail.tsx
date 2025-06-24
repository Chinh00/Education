import {CourseClass} from "@/domain/course_class.ts";
import {Button, Card, Form, Input, Select, Typography} from "antd";
import {CardContent} from "@/app/components/ui/card.tsx";
import FormInputAntd from "@/app/components/inputs/FormInputAntd.tsx";
import {Controller, useForm} from "react-hook-form";
import FormItem from "antd/es/form/FormItem";
import {getCourseClassType} from "@/app/modules/register/pages/course_class_list.tsx";
import React, {useEffect} from "react";
import {useUpdateCourseClassStatus} from "@/app/modules/education/hooks/useUpdateCourseClassStatus.ts";
import toast from "react-hot-toast";

export type CourseClassDetailProps = {
    courseClass?: CourseClass,
    onCourseClassCancel?: () => void
}

const CourseClassDetail = ({courseClass, onCourseClassCancel}: CourseClassDetailProps) => {
    const { control, reset, getValues } = useForm<CourseClass>()
    

    useEffect(() => {
        if (courseClass) {
            reset({...courseClass});
            
        }
    }, [courseClass]);
    const {mutate, isPending} = useUpdateCourseClassStatus()
    return <Card>
        <Form  disabled={true}>
            <CardContent className={"flex flex-col"} >
                <Controller
                    name="subjectCode"
                    control={control}
                    render={({ field }) => (
                        <Form.Item  label={<Typography>Mã môn học</Typography>}  className={"col-span-2"}>
                            <Input  {...field}   />
                        </Form.Item>
                    )}
                />
                {/*<Controller*/}
                {/*    name="semesterCode"*/}
                {/*    control={control}*/}
                {/*    render={({ field }) => (*/}
                {/*        <Form.Item  label={<Typography>Mã kì học</Typography>}  className={"col-span-2"}>*/}
                {/*            <Input  {...field}   />*/}
                {/*        </Form.Item>*/}
                {/*    )}*/}
                {/*/>*/}
                <Controller
                    name="courseClassCode"
                    control={control}
                    render={({ field }) => (
                        <Form.Item  label={<Typography>Mã lớp học</Typography>}  className={"col-span-2"}>
                            <Input  {...field}   />
                        </Form.Item>
                    )}
                />
                <Controller
                    name="courseClassName"
                    control={control}
                    render={({ field }) => (
                        <Form.Item  label={<Typography>Tên lớp học</Typography>}  className={"col-span-2"}>
                            <Input  {...field}   />
                        </Form.Item>
                    )}
                />
                <Controller
                    name="numberStudentsExpected"
                    control={control}
                    render={({ field }) => (
                        <Form.Item  label={<Typography>Số sinh viên</Typography>}  className={"col-span-2"}>
                            <Input  {...field} type={"number"}  />
                        </Form.Item>
                    )}
                />

                <Controller
                    name="courseClassType"
                    control={control}
                    render={({ field }) => (
                        <FormItem label={"Loại lớp học"}>
                            <Select
                                showSearch
                                className={"w-full"} defaultValue={getValues("courseClassType")}  onChange={(e) => {

                            }} >
                                <Select.Option value={0}>Lý thuyết</Select.Option>
                                <Select.Option value={1}


                                >Thực hành</Select.Option>
                            </Select>
                        </FormItem>

                    )}
                />
                
                

                <FormItem label={"Là lớp thành phần của"}>
                    <Select
                        showSearch
                        className={"w-full"} defaultValue={getValues("parentCourseClassCode")} onChange={(e) => {
                    }} >
                        <Select.Option value={""}>Là lớp chính</Select.Option>
                        {/*<Select.Option key={item.id} value={item.courseClassCode}>*/}
                        {/*    {item.courseClassName} ({getCourseClassType[item.courseClassType]})*/}
                        {/*</Select.Option>*/}
                    </Select>
                </FormItem>
                <FormItem label={"Giai đoạn học"}>
                    <Select
                        showSearch
                        className={"w-full"} defaultValue={getValues("stage")} onChange={(e) => {
                    }} >
                        <Select.Option value={0}>Giai đoạn 1</Select.Option>
                        <Select.Option value={1}>Giai đoạn 2</Select.Option>
                        <Select.Option value={2}>Cả 2 giai đoạn</Select.Option>
                    </Select>
                </FormItem>

                <FormItem label={"Tuần bắt đầu"}>
                    <Select className={"w-full"} defaultValue={getValues("weekStart")} onChange={(e) => {
                    }} >
                        <Select.Option value={0}>1</Select.Option>
                        <Select.Option value={1}>2</Select.Option>
                        <Select.Option value={2}>3</Select.Option>
                        <Select.Option value={3}>4</Select.Option>
                        <Select.Option value={4}>5</Select.Option>
                        <Select.Option value={5}>6</Select.Option>
                        <Select.Option value={6}>7</Select.Option>
                        <Select.Option value={7}>8</Select.Option>
                    </Select>
                </FormItem>

            </CardContent>
        </Form>
        <Button className={"w-full"} size={"large"} color={"danger"} variant="outlined"
            onClick={() => {
                mutate({
                    courseClassCode: courseClass?.courseClassCode!,
                    status: 1
                }, {
                    onSuccess: () => {
                        toast.success("Hủy lớp học phần thành công")
                        onCourseClassCancel?.()
                    }
                })
            }}
        >Hủy lớp học phần</Button>
    </Card>
}
export default CourseClassDetail;