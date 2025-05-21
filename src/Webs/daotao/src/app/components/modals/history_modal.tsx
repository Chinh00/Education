import {Button, Modal, Pagination, Tooltip, Typography} from "antd";
import {useState} from "react";
import {useGetEventsStore} from "@/app/modules/common/hook.ts";
import {motion} from "framer-motion"
import {HistoryItem} from "@/app/components/modals/history_item.tsx";
import {IconButton} from "@mui/material";
import {Eye} from "lucide-react";
import {Query} from "@/infrastructure/query.ts";
export type HistoryModalProps = {
    aggregationId: string;
    aggregateType: string,
}
const HistoryModal = (props: HistoryModalProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState<Query>({
        Filters: [
            {
                field: "AggregateId",
                operator: "==",
                value: props.aggregationId
            },
            {
                field: "AggregateType",
                operator: "==",
                value: props.aggregateType
            },

        ],
        Sorts: ["CreatedAtDesc"],
        Page: 1,
        PageSize: 5
    })
    const {data, isLoading, isSuccess} = useGetEventsStore(query, open && props.aggregationId !== "" && props.aggregateType !== "")
    const getEventColor = (eventName: string) => {
        if (eventName.includes("Tạo mới")) {
            return "bg-emerald-500"
        } else if (eventName.includes("Thay đổi")) {
            return "bg-violet-500"
        } else {
            return "bg-amber-500"
        }
    }
    const toggleExpand = (index: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }



    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
    return (
        <>
            <Tooltip title="Lịch sử">
                <IconButton onClick={() => setOpen(true)}><Eye /></IconButton>
            </Tooltip>
            <Modal title={<div className={"p-5 space-x-5"}>
                <Button size={"small"} type={query?.Sorts?.filter((item) => item === "CreatedAt").length !== 0 ? "primary": "default" }
                        onClick={() => setQuery(prevState => ({...prevState, Sorts: [
                                ...prevState?.Sorts?.filter(c => c !== "CreatedAtDesc") ?? [],
                                "CreatedAt"
                            ]}))}
                >Cũ nhất</Button>
                <Button size={"small"} type={query?.Sorts?.filter((item) => item === "CreatedAtDesc").length !== 0 ? "primary": "default" }
                    onClick={() => setQuery(prevState => ({...prevState, Sorts: [
                            ...prevState?.Sorts?.filter(c => c !== "CreatedAt") ?? [],
                            "CreatedAtDesc"
                        ]}))}

                >Mới nhất</Button>

            </div>} footer={() => (
                <div className={"flex justify-center items-center"}>
                    <Pagination total={data?.data?.data?.totalItems ?? 0} onChange={(value) => {
                        console.log(value)
                    }} />
                    <Typography>Tổng số sự kiện: {data?.data?.data?.totalItems}</Typography>
                </div>
            )} width={900} className={"p-5"} loading={isLoading}  open={open} onClose={() => setOpen(false)} onCancel={() => setOpen(false)} onOk={() => setOpen(true)}>
                <div className="space-y-6 mx-auto pl-5">
                            {!!data && data?.data?.data?.items.length === 0 ? (
                                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                    <p className="text-gray-500 dark:text-gray-400">Không tìm thấy hoạt động nào</p>
                                </div>
                            ) : (
                                data?.data?.data?.items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                    >
                                        <HistoryItem
                                            item={item}
                                            index={index}
                                            getEventColor={getEventColor}
                                            isExpanded={!!expandedItems[index]}
                                            toggleExpand={() => toggleExpand(index)}
                                        />
                                    </motion.div>
                                ))
                            )}
                        </div>

            </Modal>
        </>
    )
}

export { HistoryModal }