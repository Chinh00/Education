import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {DateClickArg, EventReceiveArg} from '@fullcalendar/interaction';
import { Draggable } from '@fullcalendar/interaction';

import {useEffect, useState} from "react";
import PredataScreen from "@/app/components/screens/predata_screen.tsx";
import {useGetSubjectTimelineConfig} from "@/app/modules/education/hooks/useGetSubjectTimelineConfig.ts";
import { useParams } from 'react-router';
import {ColumnsType, useGetRooms} from '../../common/hook';
import {Room} from "@/domain/room.ts";
import {Semester} from "@/domain/semester.ts";
import {Box, IconButton} from "@mui/material";
import SemesterModal from "@/app/modules/education/components/semester_modal.tsx";
import {Table, Typography} from "antd";
import {Eye} from "lucide-react"
const CourseClassConfig = () => {
    const {subject} = useParams()

    const handleDateSelect = (selectInfo: any) => {
        const title = prompt('Nhập tiêu đề sự kiện');
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            });
        }
    };
    const handleEventReceive = (info: EventReceiveArg) => {
        console.log('Đã kéo vào lịch:', info.event.title);
    };

    useEffect(() => {
        const draggableEl = document.getElementById('external-events');
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: '.fc-event',
                eventData: function (eventEl: HTMLElement) {
                    console.log(eventEl.innerText.trim())
                    return {
                        title: eventEl.innerText.trim(),
                        duration: '00:50:00'
                    };
                }
            });
        }
    }, []);

    const handleDateClick = (arg: DateClickArg) => {
        alert(`Bạn đã click vào ngày ${arg.dateStr} lúc ${arg.date.toLocaleTimeString()}`);
    };
    const {data} = useGetSubjectTimelineConfig(subject!)
    const {data: rooms, isLoading: RoomsLoading} = useGetRooms({
        Page: 1,
        PageSize: 10000
    })
    const [selectedRoom, setSelectedRoom] = useState("")
    const columns: ColumnsType<Room> = [
        {
            title: 'Phòng học',
            dataIndex: "name",
        },
        {
            title: 'Hành động',
            key: "action",
            render: (value, record) => (
                <><IconButton size={"small"} onClick={() => setSelectedRoom(record?.code)}><Eye /></IconButton></>
            )
        },



    ];
    const tableColumns = columns.map((item) => ({ ...item }));


    return (
        <PredataScreen isLoading={false} isSuccess={true}>
            Cấu hình lớp cho môn hoc
            <div className={"grid grid-cols-6 gap-5"}>
                <div id="external-events"  className="p-2 border col-span-2 border-gray-400 rounded">
                    <p className="font-bold">Số buổi trong tuần:</p>
                    {!!data &&  Array.from({ length: data?.data?.data?.lectureLesson }, (_, i) => i).map(c => (
                        <div className="fc-event bg-blue-500 text-white p-1 mb-1 rounded cursor-pointer" key={c}>
                            Buổi {c + 1}
                        </div>
                    )) }
                    <Table<Room>
                        rowKey={(c) => c.id}
                        loading={RoomsLoading}
                        style={{
                            height: "100px",
                        }}
                        showHeader={true}
                        title={() => <Box className={"flex flex-row justify-between items-center p-[16px] text-white "}>
                            <Typography className={"text-gray-700"}>Chọn phòng</Typography>

                        </Box>}
                        size={"small"}
                        bordered={true}
                        pagination={false}
                        virtual
                        scroll={{
                            y: 200,
                            x: 100
                        }}
                        columns={tableColumns}
                        dataSource={rooms?.data?.data?.items ?? []}

                    />


                </div>
                <div className={"col-span-4"}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        selectable={true}
                        editable={true}
                        select={handleDateSelect}
                        droppable={true}
                        nowIndicator={true}
                        height="auto"
                        eventReceive={handleEventReceive}


                        slotDuration="00:55:00"
                        // slotLabelInterval="00:55:00"
                        slotMinTime="07:00:00"
                        slotMaxTime="18:20:00"
                        scrollTime="07:00:00"

                        locale="vi"
                        allDaySlot={false}
                        initialView="timeGridWeek"
                        dateClick={handleDateClick}
                        hiddenDays={[0]}

                    />
                </div>

            </div>
        </PredataScreen>
    )
}
export default CourseClassConfig
