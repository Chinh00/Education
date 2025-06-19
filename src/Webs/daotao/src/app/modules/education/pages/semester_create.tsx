import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {Divider} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {CommonState, setGroupFuncName} from "@/app/stores/common_slice.ts";
import {useEffect} from "react";
import dayjs from "dayjs";
import {Button, Card, DatePicker, Form, Input, Typography} from "antd";
import {viLocale} from "@/app/components/inputs/FormDatePickerAntd.tsx";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import useCreateSemester from "../hooks/useCreateSemester";


const SemesterCreate = () => {
    const dispatch = useAppDispatch()

    const {groupFuncName} = useAppSelector<CommonState>(c => c.common)
    useEffect(() => {
        dispatch(setGroupFuncName({...groupFuncName, itemName: "Tạo kì học mới"}));
    }, []);
    const [form] = Form.useForm();
    const {mutate, isPending} = useCreateSemester();
    const onFinish = (values: any) => {
        console.log('Received values:', values.studyPhases);
        mutate({
            semesterName: values.semester_name,
            semesterCode: values.semester_code,
            startDate: dayjs(values.startDate).toISOString(),
            endDate: dayjs(values.endDate).toISOString(),
            parentSemesterCode: "",
        });
        values.studyPhases.forEach((p: any, index: number) => mutate({
            semesterName: p.name,
            semesterCode: p.code,
            startDate: dayjs(p.startDate).toISOString(),
            endDate: dayjs(p.endDate).toISOString(),
            parentSemesterCode: values.semester_code,
        }))
        
    }
    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            <Card>
                <Form form={form} name="add_semester" onFinish={onFinish} layout="horizontal">
                    <Form.Item name="semester_name" label="Tên kỳ học" rules={[{ required: true, message: 'Nhập tên kỳ học' }]}>
                        <Input placeholder="VD: 1_2024_2025" />
                    </Form.Item>
                    <Form.Item name="semester_code" label="Mã kỳ học" rules={[{ required: true, message: 'Mã kỳ học' }]}>
                        <Input placeholder="VD: 1_2024_2025" />
                    </Form.Item>
                    
                    <Form.Item name="startDate" label="Thời gian học kỳ bắt đầu" rules={[{ required: true, message: 'Chọn thời gian bắt đầu' }]}>
                        <DatePicker
                            showTime
                            locale={viLocale}
                            style={{
                                width: '100%',
                            }}
                            placement={"bottomLeft"}
                        />
                    </Form.Item>
                    <Form.Item name="endDate" label="Thời gian học kỳ kết thúc" rules={[{ required: true, message: 'Chọn thời gian kết thúc' }]}>
                        <DatePicker
                            showTime
                            locale={viLocale}
                            style={{
                                width: '100%',
                            }}
                            placement={"bottomLeft"}
                        />
                    </Form.Item>
                    <Divider />
                    <Typography.Title level={4} className={"text-center py-4"}>Giai đoạn học</Typography.Title>
                    <Form.List name="studyPhases">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="mb-4 border p-4 rounded-md shadow-sm">
                                        <Typography.Title level={5} className="flex items-center gap-3">
                                            Giai đoạn {name + 1}
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Typography.Title>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            label="Tên kỳ học con"
                                            rules={[{ required: true, message: 'Nhập tên kỳ học con' }]}
                                            className="w-full"
                                        >
                                            <Input placeholder="VD: 1_2024_2025_1" />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'code']}
                                            label="Mã kỳ học con"
                                            rules={[{ required: true, message: 'Nhập mã kỳ học con' }]}
                                            className="w-full"
                                        >
                                            <Input placeholder="VD: 1_2024_2025_1" />
                                        </Form.Item>
                                        
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'startDate']}
                                            label="Thời gian bắt đầu"
                                            rules={[{ required: true, message: 'Chọn thời gian bắt đầu' }]}
                                            className="w-full"
                                        >
                                            <DatePicker
                                                showTime
                                                locale={viLocale}
                                                style={{ width: '100%' }}
                                                placement="bottomLeft"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            name={[name, 'endDate']}
                                            label="Thời gian kết thúc"
                                            rules={[{ required: true, message: 'Chọn thời gian kết thúc' }]}
                                            className="w-full"
                                        >
                                            <DatePicker
                                                showTime
                                                locale={viLocale}
                                                style={{ width: '100%' }}
                                                placement="bottomLeft"
                                            />
                                        </Form.Item>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                        Thêm giai đoạn học
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                </Form.List>


                <Form.Item>
                        <Button loading={isPending} type="primary" htmlType="submit">
                            Lưu kỳ học
                        </Button>
                    </Form.Item>
                </Form>
                
                
            </Card>
        </PredataScreen>
    )
}
export default SemesterCreate;