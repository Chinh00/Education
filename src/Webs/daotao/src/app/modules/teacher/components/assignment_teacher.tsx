import {Button, Card, Modal, Input, Typography, Form, Space, Table} from "antd";
import {CourseClass} from "@/domain/course_class.ts";
import {useCallback, useState} from "react";
import {Box, Divider} from "@mui/material";
import { debounce } from "lodash";
import {Query} from "@/infrastructure/query.ts";
import {useGetUserInfo} from "@/app/modules/auth/hooks/useGetUserInfo.ts";
import {ColumnsType, useGetStaffs} from "@/app/modules/common/hook.ts";
import {Staff} from "@/domain/staff.ts";
import {Student} from "@/domain/student.ts";
import {PlusCircle} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {useUpdateCourseClassTeacher} from "@/app/modules/teacher/hooks/useUpdateCourseClassTeacher.ts";
import toast from "react-hot-toast";
import {useEffect} from "react";
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
    })
 

    const [openConfirm, setOpenConfirm] = useState()
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