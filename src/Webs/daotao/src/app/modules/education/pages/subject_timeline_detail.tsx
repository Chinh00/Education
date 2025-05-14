import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Box} from "@mui/material";
import {Button, Card, Form, Input, Typography} from "antd";
import {data, useNavigate} from "react-router";
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
const SubjectTimelineDetail = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Thời khóa biểu môn học cấu hình"}));
    }, []);
    const nav = useNavigate()
    const [subjectCode, setSubjectCode] = useState("")
    const {data, isLoading, isSuccess} = useGetSubjectTimelineConfig(subjectCode, subjectCode !== "")

   const {control: subjectControl, reset: subjectReset, getValues} = useForm<SubjectTimelineConfig>({
       defaultValues: {

       }
   })

    useEffect(() => {
        if (data) {
            subjectReset({
                ...data?.data?.data,
                subjectCode: data?.data?.data?.subjectCode ?? subjectCode
            })
        }
    }, [isLoading, data, subjectReset]);
    const {mutate, isPending} = useUpdateSubjectTimelineConfig()
    useEffect(() => {
        if (data?.data?.data === null) {
            toast.error("Môn học chưa được cấu hình")
        }
    }, [data, isLoading, isSuccess]);

    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Box>
                <Input.Search className={"mb-5"} loading={isLoading} size={"large"} placeholder={"Tìm theo mã môn học"} onSearch={(data) => {
                    setSubjectCode(data)
                }} />
                <Card className={""}>
                    <Form
                        layout={"vertical"}
                        className={"grid grid-cols-6 gap-5 "}
                    >
                        <Typography.Title level={4} className={"col-span-6"}>Thông tin chung</Typography.Title>
                        <Controller
                            name="subjectCode"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Mã môn học</Typography>} className={"col-span-3"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="periodTotal"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Tổng số tiết học</Typography>}  className={"col-span-3"}>
                                    <Input size={"large"} {...field}   />
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
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lecturePeriod"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số buổi lý thuyết trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lectureLesson"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết lý thuyết trong 1 buổi</Typography>}  className={"col-span-2"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="minDaySpaceLecture"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Khoảng cách giữa các buổi học lý thuyết trong 1 tuần</Typography>}  className={"col-span-3"}>
                                    <Input  size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="lectureMinStudent"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số sinh viên tối thiểu trong lớp lý thuyết</Typography>}  className={"col-span-3"}>
                                    <Input size={"large"} {...field}   />
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
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labPeriod"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số buổi thực hành trong 1 tuần</Typography>}  className={"col-span-2"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labLesson"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số tiết thực hành trong 1 buổi</Typography>}  className={"col-span-2"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="minDaySpaceLecture"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Khoảng cách giữa các buổi học thực hành trong 1 tuần</Typography>}  className={"col-span-3"}>
                                    <Input  size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Controller
                            name="labMinStudent"
                            control={subjectControl}
                            render={({ field }) => (
                                <Form.Item  label={<Typography>Số sinh viên tối thiểu trong lớp thực hành</Typography>}  className={"col-span-3"}>
                                    <Input size={"large"} {...field}   />
                                </Form.Item>
                            )}
                        />
                        <Button loading={isPending} type={"primary"} onClick={() => {
                            mutate({
                                ...getValues()
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