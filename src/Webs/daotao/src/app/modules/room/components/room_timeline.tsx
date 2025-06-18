import {FieldTimeOutlined} from "@ant-design/icons";
import {Button, Drawer, Tooltip} from "antd";
import {useState} from "react";
import {Room} from "@/domain/room.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";

export type Room_timelineProps = {
    room: Room
}
const Room_timeline = ({room}: Room_timelineProps) => {
    const [open, setOpen] = useState(false)
    const [selectedStage, setSelectedStage] = useState(0)
    
    const {} = useGetTimeline({
        
    })
    
    return (
        <>
            <Tooltip title={"Thời gian sử dụng phòng"}>
                <Button size={"small"} onClick={() => setOpen(true)} icon={<FieldTimeOutlined size={18} />} variant={"link"} color={"blue"} />
            </Tooltip>
            <Drawer open={open} onClose={() => setOpen(false)} title={"Thời gian sử dụng phòng"} width={"100%"} >
                
            </Drawer>
        </>
    )
}

export default Room_timeline