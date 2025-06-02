import {Button, Form, Input, Modal, Table, Typography} from "antd";
import {CourseClass} from "@/domain/course_class.ts";
import {useCallback, useEffect, useState} from "react";
import {Box, Divider} from "@mui/material";
import {debounce} from "lodash";
import {Query} from "@/infrastructure/query.ts";
import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import {ColumnsType, useGetStaffs} from "@/app/modules/common/hook.ts";
import {Staff} from "@/domain/staff.ts";
import {PlusCircle} from "lucide-react";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import toast from "react-hot-toast";
import {useGetCourseClasses} from "@/app/modules/education/hooks/useGetCourseClasses.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import _ from "lodash";
export type AssignmentTeacherProps = {
    courseClass: CourseClass
    
}

const AssignmentTeacher = (props: AssignmentTeacherProps) => {

    const {mutate, isPending, isSuccess, reset} = useUpdateCourseClassTeacher()
    const columns: ColumnsType<Staff> = [
        {
            title: 'Chọn',
            key: "action",
            render: (value, record) => (
                <Button
                size="small" className={"border-none"}
                onClick={() => {
                    mutate({
                        id: props?.courseClass?.id,
                        teacherCode: record?.code!
                    }, {
                        onSuccess: () => {
                            toast.success("Xếp giáo viên thành công")
                        }
                    })
                }}
                ><PlusCircle size={15} /></Button>
            ),
            width: 80
        },
        {
            title: 'Họ và tên',
            dataIndex: "fullName",
        },
        {
            title: 'Mã nhân viên',
            dataIndex: "code",
        },
    ];
    const tableColumns = columns.map((item) => ({ ...item }));
    
    
    
    
    const [openModel, setOpenModel] = useState(false)
    const [searchKeyword, setSearchKeyword] = useState("");

    const handleSearch = useCallback(
        debounce((value: string) => {
            console.log("Searching for:", value);
            setSearchKeyword(value);
        }, 500),
        []
    );
    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleSearch(e.target.value);
    };
    const [query, setQuery] = useState<Query>({
        
    })
    const {data} = useGetUserInfo()
    const {data: staffs, isLoading} = useGetStaffs({
        Filters: [
            {
                field: "DepartmentCode",
                operator: "Contains",
                value: data?.data?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]!
            },
        ],
        Includes: ["Code"],
        Page: 1,
        PageSize: 100
    }, openModel)
 

    const {data: courseClasses} = useGetCourseClasses({
        Filters: [
            {
                field: "TeacherCode",
                operator: 'In',
                value: staffs?.data?.data?.items?.map(e => e.code).join(",")!,
            }
        ],
        Page: 1,
        PageSize: 100
    }, staffs !== undefined && staffs?.data?.data?.items?.length > 0)

    const {data: timeline} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "In",
                value: courseClasses?.data?.data?.items?.map(c => c.courseClassCode)?.join(",")!
            }
        ]
    }, courseClasses !== undefined && courseClasses?.data?.data?.items?.length > 0)

    const {data: currentTimeline} = useGetTimeline({
        Filters: [
            {
                field: "CourseClassCode",
                operator: "==",
                value: props?.courseClass?.courseClassCode
            }
        ]
    }, openModel)

    const [teacher, setTeacher] = useState<string>([])
    useEffect(() => {
        if (timeline && currentTimeline) {
            
            
            
            // console.log(
            //     timeline?.data?.data?.items?.filter(e => {
            //         const current = currentTimeline?.data?.data?.items?.[0];
            //         if (!current || e?.dayOfWeek !== current.dayOfWeek) return false;
            //
            //         const start1 = Math.min(...current.slots.map(Number));
            //         const end1 = Math.max(...current.slots.map(Number));
            //         const start2 = Math.min(...e.slots.map(Number));
            //         const end2 = Math.max(...e.slots.map(Number));
            //
            //         return !(end1 < start2 || end2 < start1);
            //     })
            // );
            const current = currentTimeline?.data?.data?.items[0]
            const currentSlots = currentTimeline?.data?.data?.items[0].slots.map(Number)
            const currentStart = Math.min(...currentSlots);
            const currentEnd = Math.max(...currentSlots);
            timeline?.data?.data?.items.filter(e => e.dayOfWeek === current?.dayOfWeek)?.forEach(t => {
                const itemSlots = t?.slots.map(Number);
                const itemStart = Math.min(...t?.slots.map(Number));
                const itemEnd = Math.max(...t?.slots.map(Number));
                console.log(t?.courseClassCode)
                if (!(currentEnd < itemStart || itemEnd < currentStart)) {
                    console.log(courseClasses?.data?.data?.items?.filter(h => h.courseClassCode === t?.courseClassCode))
                    // setTeacher(prevState => [...prevState, ])
                }
            })
            
        }
    }, [timeline, currentTimeline]);
    console.log(teacher)
    useEffect(() => {
        return () => {
            reset()
        }
    }, [])
    
    
    return (
        <>
            <Button size={"small"} type={props?.courseClass?.teacherCode !== null ? "text" : "primary"} 
                    style={{
                        backgroundColor: props?.courseClass?.teacherCode !== null ? "yellow" : ""
                    }}
                    onClick={() => setOpenModel(true)}> {props?.courseClass?.teacherCode !== null ? `Đã phân công cho: ${props?.courseClass?.teacherName}` : "Phân công"} </Button>
            <Modal open={openModel} onCancel={() => setOpenModel(false)} onClose={() => setOpenModel(false)} className={""}>
                <Box className={"min-w-[500px] p-5"}>
                    <Form
                        layout={"vertical"}
                    >
                        <Form.Item label={<Typography>Tìm giáo viên phù hợp</Typography>}>
                            <Input.Search size={"large"} placeholder={"Tìm theo tên giảng viên"} onChange={onSearchChange} />
                        </Form.Item>
                        
                    </Form>
                    <Divider />
                    <Box className={"w-full"}>
                        <div className={"relative w-full min-h-[500px]"}>
                            <Table<Staff>
                                rowKey={(c) => c.id}
                                loading={isLoading}
                                className={"absolute top-0 left-0 w-full"}
                                
                                showHeader={true}
                                title={() => <Box className={"flex flex-row justify-end items-center p-[16px] text-white "}>
                                    <Typography.Title level={4} className={"text-center w-full"} >Các giáo viên phù hợp</Typography.Title>
                                </Box>}
                                size={"small"}

                                pagination={false}
                                virtual
                                scroll={{ x: 300, y: 300 }}
                                bordered={true}
                                columns={tableColumns}
                                dataSource={staffs?.data?.data?.items ?? []}
                            />
                        </div>
                    </Box>
                    
                </Box>
                
            </Modal>
        </>
    )
}
export default AssignmentTeacher;