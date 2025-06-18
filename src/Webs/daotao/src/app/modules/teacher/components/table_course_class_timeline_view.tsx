import React, {useEffect, useState} from "react";
import {ScheduleItem} from "@/app/modules/register/pages/course_class_config.tsx";
import {useAppDispatch, useAppSelector} from "@/app/stores/hook.ts";
import {daysOfWeek, timeSlots} from "@/infrastructure/date.ts";
import {SlotTimeline} from "@/domain/slot_timeline.ts";
import {Query} from "@/infrastructure/query.ts";
import {useGetTimeline} from "@/app/modules/education/hooks/useGetTimeline.ts";
import {ColumnsType, useGetRooms, useGetStaffs} from "@/app/modules/common/hook.ts";
import _ from "lodash";
import {Card, CardContent} from "@/app/components/ui/card.tsx";
import {Button, Dropdown, Select, Spin, Tooltip, Typography} from "antd";
import {Box, IconButton} from "@mui/material";
import {Plus, PlusCircle, Trash2} from "lucide-react";
import {
    CourseClassAssignTeacherState,
    setTeacherAssignments, setTeacherSelected, setTimelines
} from "@/app/modules/teacher/stores/course_class_assign_teacher_slice.tsx";
import {Staff} from "@/domain/staff.ts";

const Table_course_class_timeline_view = () => {
    const [courseClassType, setCourseClassType] = useState(0);
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [selectionEnd, setSelectionEnd] = useState<{ dayIndex: number; slotIndex: number } | null>(null);
    const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
    const [dragPreview, setDragPreview] = useState<{ dayIndex: number; startSlot: number; endSlot: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [scheduledItems, setScheduledItems] = useState<ScheduleItem[]>([]);
    const dispatch = useAppDispatch();
    const [count, setCount] = useState(0);
    const [selectedTimeline, setSelectedTimeline] = useState<string[]>([])
    const [teacherCodeCurrentView, setTeacherCodeCurrentView] = useState<string[]>([])

    const { subject, timelines, teacherSelected, courseClasses, teacherAssignments, selectedRowKeysChildren, selectedRowKeysParents } = useAppSelector<CourseClassAssignTeacherState>(c => c.courseClassAssignTeacherSliceReducer);


    const teacherCodesInSchedule = [
        ...new Set(
            scheduledItems
                .map(item => teacherAssignments[item.id])
                .filter(code => !!code)
        )
    ];
    

    useEffect(() => {
        if (!courseClasses || !scheduledItems.length) return;

        const newAssignments: Record<string, string> = { ...teacherAssignments };

        for (const item of scheduledItems) {
            const courseClass = courseClasses[item?.courseClassCode ?? ""];

            const teacherCode = courseClass?.teacherCode 

            if (!newAssignments[item.id] && teacherCode) {
                newAssignments[item.id] = teacherCode;
            }
        }

        if (JSON.stringify(teacherAssignments) !== JSON.stringify(newAssignments)) {
            dispatch(setTeacherAssignments(newAssignments));
        }
    }, [courseClasses, scheduledItems]);


    useEffect(() => {
        const rest = {...teacherAssignments}
        scheduledItems.map(e => {
            const courseClass = Object.values(courseClasses).find(c => c.courseClassCode === e.courseClassCode);
            rest[`${e.id}`] = courseClass?.teacherCode ?? "";
        })
        dispatch(setTeacherAssignments(rest));
    }, [scheduledItems]);
    
    
    
    
    const { data: rooms } = useGetRooms({ Page: 1, PageSize: 1000 });
    const groupRooms = _.groupBy(rooms?.data?.data?.items ?? [], "buildingCode");
    const options = Object.entries(groupRooms)?.map(([e, rooms]) => ({
        label: <span>{e}</span>,
        title: e,
        options: rooms?.map(e => ({ label: <span>{e?.name} ({e?.capacity})</span>, value: e?.code ?? "" })) ?? []
    }));
    const [query, setQuery] = useState<Query>({
        Page: 1,
        PageSize: 1000
    });

    useEffect(() => {
        if (selectedRowKeysParents?.length > 0 || selectedRowKeysChildren?.length > 0) {
            setQuery(prevState => ({
                ...prevState,
                Filters: [
                    ...prevState?.Filters?.filter(c => c.field !== "CourseClassCode") ?? [],
                    {
                        field: "CourseClassCode",
                        operator: "In",
                        value: [...selectedRowKeysChildren, ...selectedRowKeysParents].join(",")
                    }
                ]
            }))
        }
    }, [selectedRowKeysParents, selectedRowKeysChildren]);
    const {data: timelineFromApis, isLoading: timelineLoading} = useGetTimeline(query, subject !== undefined && query?.Filters?.filter(c => c.field !== "CourseClassCode") !== undefined);

    useEffect(() => {
        setScheduledItems(prevState => [
            ...(timelineFromApis?.data?.data?.items?.map((item: SlotTimeline) => ({
                id: `schedule-${item.id}`,
                title: `${Object.values(courseClasses).find(e => e.courseClassCode === item.courseClassCode)?.parentCourseClassCode === null ? "LC" : "LTP"}: ${Object.values(courseClasses).find(e => e.courseClassCode === item.courseClassCode)?.courseClassName} (P.${item.roomCode})`,
                subject: subject?.subjectName,
                color: "bg-blue-100  border-blue-200 text-green-800 border-green-200",
                startSlot: +item?.slots[0],
                endSlot: +item?.slots[item?.slots?.length - 1],
                dayIndex: +item?.dayOfWeek,
                duration: item?.slots?.length,
                courseClassCode: item.courseClassCode ?? 0,
                roomCode: item.roomCode ?? 0,
            } as unknown as ScheduleItem)) ?? []),
        ])
    }, [timelineFromApis]);

    useEffect(() => {
        if (timelineFromApis) {
            dispatch(setTimelines({
                ...timelines,
                ...Object.fromEntries(timelineFromApis?.data?.data?.items?.map((item: SlotTimeline) => [item.id, item]))
            }))
        }
    }, [timelineFromApis]);
    
    
    

    const isInSelection = (dayIndex: number, slotIndex: number) => {
        if (!isSelecting || !selectionStart || !selectionEnd || isDragging) return false;
        if (dayIndex !== selectionStart.dayIndex) return false;
        const startSlot = Math.min(selectionStart.slotIndex, selectionEnd.slotIndex);
        const endSlot = Math.max(selectionStart.slotIndex, selectionEnd.slotIndex);
        return slotIndex >= startSlot && slotIndex <= endSlot;
    };

    const isPreviewSlot = (dayIndex: number, slotIndex: number) => {
        return (
            dragPreview &&
            dragPreview.dayIndex === dayIndex &&
            slotIndex >= dragPreview.startSlot &&
            slotIndex <= dragPreview.endSlot
        );
    };

    const handleMouseDown = (dayIndex: number, slotIndex: number, e: React.MouseEvent) => {
        e.preventDefault();
        setIsSelecting(true);
        setSelectionStart({ dayIndex, slotIndex });
        setSelectionEnd({ dayIndex, slotIndex });
    };

    const handleMouseEnter = (dayIndex: number, slotIndex: number) => {
        if (isSelecting && selectionStart && !isDragging) {
            if (dayIndex === selectionStart.dayIndex) {
                setSelectionEnd({ dayIndex, slotIndex });
            }
        }
    };

    const handleMouseUp = () => {
        if (isSelecting && selectionStart && selectionEnd && !isDragging) {
        }
        setIsSelecting(false);
        setSelectionStart(null);
        setSelectionEnd(null);
    };

    const FIXED_DURATION = 3;
    const createScheduleBlock = () => {
        if (!selectionStart || !selectionEnd) return;
        const start = selectionStart.slotIndex;
        const end = selectionEnd.slotIndex;
        const dayIndex = selectionStart.dayIndex;
        const isForward = end >= start;
        const startSlot = isForward ? start : start - FIXED_DURATION + 1;
        const validStartSlot = Math.max(0, startSlot);
        const validEndSlot = validStartSlot + FIXED_DURATION - 1;
        if (validStartSlot < 0 || validEndSlot >= timeSlots.length) return;
        const selectionLength = Math.abs(end - start) + 1;
        if (selectionLength < FIXED_DURATION) return;
        const textTitle = (count) <= (subject?.lectureLesson ?? 0) - 1 ? "LC" : "LTP";
        const newItem: ScheduleItem = {
            id: `schedule-${Date.now()}-${Math.random()}`,
            title: `${textTitle}`,
            subject: courseClassType === 0 ? "Lý thuyết" : "Thực hành",
            color:
                courseClassType === 0
                    ? `${textTitle == "LC" ? "bg-blue-100" : "bg-green-100"}  text-blue-800 border-blue-200`
                    : "bg-green-100 text-green-800 border-green-200",
            startSlot: validStartSlot,
            endSlot: validEndSlot,
            dayIndex,
            duration: FIXED_DURATION,
        };
        setScheduledItems((prev) => [...prev, newItem]);
        setCount(e => e + 1);
        setIsDragging(false);
    };

    // Drag and drop
    const handleDragStart = (e: React.DragEvent, item: ScheduleItem) => {
        setDraggedItem(item);
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", item.id);
        // Custom drag image
        const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
        dragImage.style.transform = "rotate(5deg)";
        dragImage.style.opacity = "0.8";
        e.dataTransfer.setDragImage(dragImage, 50, 25);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragPreview(null);
        setIsDragging(false);
    };

    const handleCellDragOver = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;
        const endSlot = Math.min(slotIndex + draggedItem.duration - 1, timeSlots.length - 1);
        setDragPreview({
            dayIndex,
            startSlot: slotIndex,
            endSlot,
        });
    };

    const handleDragLeave = () => {
        setTimeout(() => {
            if (!isDragging) {
                setDragPreview(null);
            }
        }, 50);
    };

    const handleDrop = (e: React.DragEvent, dayIndex: number, slotIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;
        const duration = draggedItem.duration;
        const endSlot = slotIndex + duration - 1;
        if (endSlot >= timeSlots.length) {
            setDragPreview(null);
            setDraggedItem(null);
            setIsDragging(false);
            return;
        }
        setScheduledItems((prev) =>
            prev.map((item) =>
                item.id === draggedItem.id ? { ...item, dayIndex, startSlot: slotIndex, endSlot } : item
            )
        );
        setDragPreview(null);
        setDraggedItem(null);
        setIsDragging(false);
    };

    const handleClickScheduleItem = (item: ScheduleItem) => {
        let parentCode: string;
        if (item?.courseClassCode?.includes("Parent")) {
            parentCode = item.courseClassCode;
        } else {
            parentCode = Object.values(courseClasses)?.find(t => t?.courseClassCode === item?.courseClassCode)?.parentCourseClassCode || "";
        }
        const relatedCodes = [
            parentCode,
            ...Object.values(courseClasses)
                .filter(e => e.parentCourseClassCode === parentCode)
                .map(e => e.courseClassCode),
        ].filter(Boolean);
        const relatedItemIds = scheduledItems
            .filter(e => relatedCodes.includes(e?.courseClassCode!))
            .map(e => e.id);
        const isSelected = relatedItemIds.some(id => selectedTimeline.includes(id));
        if (isSelected) {
            setSelectedTimeline(prev => prev.filter(id => !relatedItemIds.includes(id)));
        } else {
            setSelectedTimeline(prev => [...prev, ...relatedItemIds.filter(id => !prev.includes(id))]);
        }
    };
    useEffect(() => {
        const selectedCodes = [...selectedRowKeysChildren, ...selectedRowKeysParents];
        setScheduledItems(prev =>
            prev.filter(item => selectedCodes.includes(item?.courseClassCode!))
        );
    }, [selectedRowKeysChildren, selectedRowKeysParents]);

    // Lấy danh sách giáo viên
    const {data: staffs, isLoading: isLoadingStaffs} = useGetStaffs({});


    const staffsInSchedule = (staffs?.data?.data?.items ?? []).filter(staff =>
        teacherCodesInSchedule.includes(staff.code)
    );
    const handleSelectTeacher = (itemId: string, teacherCode: string) => {
        const courseClassCode = timelineFromApis?.data?.data?.items?.find(e => e.id?.includes(itemId.split('-')[1]))?.courseClassCode;
        if (courseClassCode?.includes("Parent")) {
            const courseClassParent = Object.values(courseClasses)?.find(e => e.courseClassCode === courseClassCode)
            const courseClassChildren = Object.values(courseClasses)?.filter(e => e.parentCourseClassCode === courseClassCode);

            const timelineIds = timelineFromApis?.data?.data?.items?.filter(e => [courseClassParent?.courseClassCode, ...courseClassChildren.map(c => c.courseClassCode)]?.includes(e?.courseClassCode!))?.map(e => e.id) || [];
            dispatch(setTeacherAssignments({
                ...teacherAssignments,
                ...Object.fromEntries(timelineIds.map(id => [`schedule-${id}`, teacherCode]))
            }));
        } else {
            dispatch(setTeacherAssignments({
                ...teacherAssignments,
                [itemId]: teacherCode
            }));
        }
        if (staffs?.data?.data?.items?.find((s: Staff) => s.code === teacherCode) !== undefined) {
            dispatch(setTeacherSelected({
                ...teacherSelected,
                [itemId]: staffs?.data?.data?.items?.find((s: Staff) => s.code === teacherCode)!
            }))
        }
        
        
        
    };

    const roomCodesInSchedule = [
        ...new Set(
            scheduledItems
                .map(item => item.roomCode)
                .filter(code => !!code)
        )
    ];
    console.log(scheduledItems)

    const roomsInSchedule = (rooms?.data?.data?.items ?? []).filter(room =>
        roomCodesInSchedule.includes(room.code)
    );
    

    const columns: ColumnsType<Staff> = [
        {
            title: 'Họ và tên',
            dataIndex: "fullName",
        },
        {
            title: 'Mã nhân viên',
            dataIndex: "code",
        },
    ];
    
    return (
        <div className={"space-y-5"}>
            <div>
                <div>
                    <span className="text-[12px]">Hiển thị lịch của phòng: </span>
                    <div className="flex flex-row gap-2 justify-start items-center">
                        <Button variant={'filled'} type={"primary"} size={'small'}

                        >Tất cả</Button>
                        {roomsInSchedule.map(room => (
                            <Button size="small" color="primary" key={room.code}>
                                {room.name} ({room.code})
                            </Button>
                        ))}
                        <Button variant={'filled'} color={"geekblue"} size={'small'}
                        >Bỏ chọn</Button>
                    </div>
                   
                </div>
                <div>
                    <span className={"text-[12px]"}>Hiển thị lịch của giáo viên: </span>
                    
                    <div className={"flex flex-row gap-2 justify-start items-center"}>
                        <Button variant={'filled'} type={"primary"} size={'small'}

                        >Tất cả</Button>
                        { staffsInSchedule.map(e => (
                            <Button size={"small"} color={"primary"} key={e.id}>{e.fullName}</Button>
                        ))}
                        <Button variant={'filled'} color={"geekblue"} size={'small'}
                        >Bỏ chọn</Button>
                    </div>
                    
                </div>
                
            </div>
            <Card className={"h-fit"}>

                <CardContent className="grid grid-cols-8 p-0">
                    <div className={"absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"}>
                        <Spin spinning={timelineLoading} size={"large"} />
                    </div>

                    <div
                        className="grid grid-cols-8 gap-0 select-none col-span-8"
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        {/* Header */}
                        <div className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[13px]">Tiết học</div>
                        {daysOfWeek.map((day) => (
                            <div key={day} className="bg-gray-50 p-3 border-b border-r font-medium text-center text-[12px]">
                                {day}
                            </div>
                        ))}

                        {/* Time slots */}
                        {timeSlots.map((slot, slotIndex) => (
                            <div key={slot.id} className="contents">
                                <div className="border-b border-r bg-gray-50">
                                    <div className="p-[15px] text-[13px] font-medium">{slot.period}</div>
                                </div>
                                {daysOfWeek.map((day, dayIndex) => {
                                    const inSelection = isInSelection(dayIndex, slotIndex);
                                    const isPreview = isPreviewSlot(dayIndex, slotIndex);
                                    const items = scheduledItems.filter(
                                        item => item.dayIndex === dayIndex && item.startSlot === slotIndex
                                    );
                                    const itemsOfDay = scheduledItems.filter(i => i.dayIndex === dayIndex);

                                    return (
                                        <div
                                            key={`${dayIndex}-${slotIndex}`}
                                            className={`
                      p-1 border-b border-r relative min-h-[48px]
                      transition-all duration-200
                      ${inSelection ? "bg-blue-200 border-blue-400" : ""}
                      ${isPreview ? "bg-green-200 border-green-400 border-2 border-dashed" : ""}
                      ${!inSelection && !isPreview ? "hover:bg-gray-50 cursor-pointer" : ""}
                    `}
                                            style={{ position: "relative" }}
                                            onMouseDown={(e) => handleMouseDown(dayIndex, slotIndex, e)}
                                            onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                            onDragOver={(e) => handleCellDragOver(e, dayIndex, slotIndex)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, dayIndex, slotIndex)}
                                        >
                                            {items.map((item) => {
                                                const overlaps = itemsOfDay.filter(
                                                    i => !(i.endSlot < item.startSlot || i.startSlot > item.endSlot)
                                                ).sort((a, b) => a.startSlot - b.startSlot || a.id.localeCompare(b.id));
                                                const overlapIndex = overlaps.findIndex(i => i.id === item.id);
                                                const overlapOffset = 20;
                                                const width = `calc(100% - ${overlapOffset * (overlaps.length - 1)}px)`;
                                                const left = `${overlapIndex * overlapOffset}px`;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        draggable={false}
                                                        onClick={() => handleClickScheduleItem(item)}
                                                        onDragStart={(e) => handleDragStart(e, item)}
                                                        onDragEnd={handleDragEnd}
                                                        onMouseDown={e => e.stopPropagation()}
                                                        style={{
                                                            height: `${(item.endSlot - item.startSlot + 1) * 48}px`,
                                                            width,
                                                            left,
                                                            zIndex:  (selectedTimeline?.includes(item?.id) ? 50 : 10) + overlapIndex,
                                                            top: 0,
                                                            pointerEvents: isDragging && draggedItem?.id !== item.id ? 'none' : 'auto',
                                                            position: 'absolute',
                                                            border: selectedTimeline?.includes(item?.id) ? "2px solid #B22222" : 'none',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
                                                            background: '#4B99D2',
                                                            color: '#222',
                                                            borderRadius: 8,
                                                            padding: 8,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 4,
                                                            transition: 'all 0.2s',
                                                            transform: selectedTimeline?.includes(item?.id) ? "scale(1.05)" : "scale(1)",
                                                        }}
                                                    >
                                                        <div style={{ fontSize: 10 }}>{item.title}</div>
                                                        <div style={{ fontSize: 10 }}>{item.subject}</div>
                                                        <Dropdown
                                                            disabled={!item?.id?.startsWith("schedule")}
                                                            placement={"bottomRight"}
                                                            className={"z-50 absolute top-0 right-0 w-full h-full "}
                                                            trigger={["click"]}
                                                            dropdownRender={() => (
                                                                <Box
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className={"p-5 rounded-md shadow-xl bg-white min-w-[220px]"}>
                                                                    <div style={{marginBottom: 8, fontWeight: 500}}>Chọn giáo viên</div>
                                                                    <Select
                                                                        loading={isLoadingStaffs}
                                                                        showSearch
                                                                        style={{ width: "100%" }}
                                                                        value={teacherAssignments[item.id] || undefined}
                                                                        placeholder="Chọn giáo viên"
                                                                        optionFilterProp="children"
                                                                        onChange={value => handleSelectTeacher(item.id, value)}
                                                                        filterOption={(input, option) =>
                                                                            (option?.label as string ?? "").toLowerCase().includes(input.toLowerCase())
                                                                        }
                                                                        options={
                                                                            (staffs?.data?.data?.items ?? []).map((staff: Staff) => ({
                                                                                value: staff.code,
                                                                                label: staff.fullName + (staff.code ? ` (${staff.code})` : "")
                                                                            }))
                                                                        }
                                                                    />
                                                                </Box>
                                                            )}
                                                        />
                                                        
                                                        {/* Giáo viên hiện tại */}
                                                        {(teacherAssignments[item.id] ) &&
                                                            <span style={{
                                                                opacity: 0.85,
                                                                color: '#006000',
                                                                fontWeight: 500,
                                                                fontSize: 10,
                                                                marginTop: 3
                                                            }}>
                                                            GV: {(staffs?.data?.data?.items ?? []).find((s: Staff) => s.code === teacherAssignments[item.id])?.fullName}
                                                        </span>
                                                        }
                                                    </div>
                                                );
                                            })}
                                            {/* Drag preview */}
                                            {isPreview && (
                                                <div className="absolute inset-1 bg-green-300 border-2 border-dashed border-green-500 rounded flex items-center justify-center z-5">
                                                <span className="text-green-700 text-xs font-medium">
                                                    {dragPreview && dragPreview.endSlot - dragPreview.startSlot + 1} tiết
                                                </span>
                                                </div>
                                            )}
                                            {!inSelection && !isPreview && items.length === 0 && (
                                                <div className="absolute inset-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
export default Table_course_class_timeline_view